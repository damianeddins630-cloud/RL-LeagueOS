import type {
  FieldEntity,
  FieldSnapshot,
  ReplayGoal,
  ReplayHeaderEntry,
  ReplayMatchSummary,
  ReplayParseOptions,
  ReplayParseResult,
  ReplayPlayer,
  Vector3,
} from "./types";
import { ensureReplayWasmInitialized } from "./wasm";

type SubtrActorModule = typeof import("@rlrml/subtr-actor");

interface RawReplayMeta {
  replay_meta?: {
    team_zero?: RawPlayer[];
    team_one?: RawPlayer[];
    game_type?: { game_type?: string; header_match_type?: string };
    all_headers?: ReplayHeaderEntry[];
  };
}

interface RawPlayer {
  name?: string;
  remote_id?: Record<string, string>;
  stats?: Record<string, unknown>;
}

interface RawFramesData {
  frame_data?: {
    ball_data?: { frames?: RawBallFrame[] };
    player_data?: Array<{
      name?: string;
      team?: number;
      frames?: RawPlayerFrame[];
    }>;
  };
  goal_events?: Array<{ frame?: number; player_name?: string; team?: number }>;
  touch_events?: unknown[];
  demolish_infos?: unknown[];
  boost_pad_events?: unknown[];
  meta?: RawReplayMeta;
}

interface RawBallFrame {
  Data?: {
    rigid_body?: {
      location?: Vector3;
      linear_velocity?: Vector3;
    };
  };
}

interface RawPlayerFrame {
  Data?: {
    rigid_body?: {
      location?: Vector3;
      linear_velocity?: Vector3;
    };
    boost?: number;
  };
}

function headerMap(headers: ReplayHeaderEntry[] = []): Map<string, unknown> {
  return new Map(headers);
}

function headerString(
  headers: Map<string, unknown>,
  key: string,
): string | undefined {
  const value = headers.get(key);
  return typeof value === "string" ? value : undefined;
}

function headerNumber(
  headers: Map<string, unknown>,
  key: string,
): number | undefined {
  const value = headers.get(key);
  return typeof value === "number" ? value : undefined;
}

function parsePlatformId(
  remoteId?: Record<string, string>,
): { platform?: string; platformId?: string } {
  if (!remoteId) {
    return {};
  }

  const [platform, platformId] = Object.entries(remoteId)[0] ?? [];
  return { platform, platformId };
}

function mapPlayers(
  teamZero: RawPlayer[] = [],
  teamOne: RawPlayer[] = [],
): ReplayPlayer[] {
  const mapTeam = (players: RawPlayer[], team: 0 | 1): ReplayPlayer[] =>
    players.map((player) => {
      const { platform, platformId } = parsePlatformId(player.remote_id);
      return {
        name: player.name ?? "Unknown",
        team,
        platform,
        platformId,
        stats: player.stats,
      };
    });

  return [...mapTeam(teamZero, 0), ...mapTeam(teamOne, 1)];
}

function buildMatchSummary(meta: RawReplayMeta): ReplayMatchSummary {
  const headers = headerMap(meta.replay_meta?.all_headers);
  const numFrames = headerNumber(headers, "NumFrames");
  const recordFps = headerNumber(headers, "RecordFPS") ?? 30;

  return {
    replayId: headerString(headers, "Id"),
    replayName: headerString(headers, "ReplayName"),
    mapName: headerString(headers, "MapName"),
    date: headerString(headers, "Date"),
    gameType: meta.replay_meta?.game_type?.game_type,
    matchType:
      meta.replay_meta?.game_type?.header_match_type ??
      headerString(headers, "MatchType"),
    teamSize: headerNumber(headers, "TeamSize"),
    team0Score: headerNumber(headers, "Team0Score") ?? 0,
    team1Score: headerNumber(headers, "Team1Score") ?? 0,
    numFrames,
    recordFps,
    buildVersion: headerString(headers, "BuildVersion"),
    durationSeconds:
      numFrames && recordFps ? Number((numFrames / recordFps).toFixed(2)) : undefined,
  };
}

function mapGoals(framesData: RawFramesData): ReplayGoal[] {
  return (framesData.goal_events ?? []).map((goal) => ({
    frame: goal.frame ?? 0,
    playerName: goal.player_name,
    playerTeam: goal.team,
  }));
}

function toFieldEntity(
  frame?: RawBallFrame | RawPlayerFrame,
): FieldEntity | null {
  const body = frame?.Data?.rigid_body;
  if (!body?.location) {
    return null;
  }

  return {
    position: body.location,
    velocity: body.linear_velocity,
    boost:
      "boost" in (frame?.Data ?? {})
        ? (frame as RawPlayerFrame).Data?.boost
        : undefined,
  };
}

function buildFieldSnapshot(
  framesData: RawFramesData,
  frameIndex: number,
  recordFps = 30,
): FieldSnapshot | undefined {
  const ballFrames = framesData.frame_data?.ball_data?.frames ?? [];
  const playerEntries = framesData.frame_data?.player_data ?? [];

  if (ballFrames.length === 0 && playerEntries.length === 0) {
    return undefined;
  }

  const clampedFrame = Math.max(
    0,
    Math.min(
      frameIndex,
      Math.max(
        ballFrames.length - 1,
        ...playerEntries.map((p) => (p.frames?.length ?? 1) - 1),
      ),
    ),
  );

  const ball = toFieldEntity(ballFrames[clampedFrame]);

  const players = playerEntries.flatMap((playerEntry) => {
    const frame = playerEntry.frames?.[clampedFrame];
    const entity = toFieldEntity(frame);
    if (!entity || !playerEntry.name) {
      return [];
    }

    return [
      {
        ...entity,
        name: playerEntry.name,
        team: (playerEntry.team ?? 0) as 0 | 1,
      },
    ];
  });

  return {
    frame: clampedFrame,
    timeSeconds: Number((clampedFrame / recordFps).toFixed(2)),
    ball,
    players,
  };
}

/**
 * Parse a Rocket League `.replay` file and return match summary, players,
 * goals, event counts, and optional on-field snapshot.
 */
export async function parseReplayFile(
  replayBytes: Uint8Array,
  options: ReplayParseOptions = {},
): Promise<ReplayParseResult> {
  await ensureReplayWasmInitialized();

  const { validate_replay, get_replay_meta, get_replay_frames_data } =
    (await import("@rlrml/subtr-actor")) as SubtrActorModule;

  const validation = validate_replay(replayBytes) as {
    valid?: boolean;
    error?: string;
  };

  if (validation.valid === false) {
    return {
      valid: false,
      error: validation.error ?? "Invalid Rocket League replay file.",
      match: { team0Score: 0, team1Score: 0 },
      players: [],
      goals: [],
      events: {
        goalCount: 0,
        touchCount: 0,
        demolishCount: 0,
        boostPadPickupCount: 0,
      },
    };
  }

  const meta = get_replay_meta(replayBytes) as RawReplayMeta;
  const framesData = get_replay_frames_data(replayBytes) as RawFramesData;

  const match = buildMatchSummary(meta);
  const players = mapPlayers(
    meta.replay_meta?.team_zero,
    meta.replay_meta?.team_one,
  );
  const goals = mapGoals(framesData);

  const includeSnapshot = options.includeFieldSnapshot ?? true;
  const snapshotFrame =
    options.snapshotFrame ??
    (match.numFrames ? match.numFrames - 1 : undefined) ??
    0;

  const fieldSnapshot = includeSnapshot
    ? buildFieldSnapshot(framesData, snapshotFrame, match.recordFps)
    : undefined;

  return {
    valid: true,
    match,
    players,
    goals,
    events: {
      goalCount: goals.length,
      touchCount: framesData.touch_events?.length ?? 0,
      demolishCount: framesData.demolish_infos?.length ?? 0,
      boostPadPickupCount: framesData.boost_pad_events?.length ?? 0,
    },
    fieldSnapshot,
  };
}
