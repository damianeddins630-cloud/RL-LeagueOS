/**
 * Rocket League replay domain types for RL LeagueOS.
 */

export type ReplayHeaderEntry = [string, unknown];

export interface ReplayPlayer {
  name: string;
  team: 0 | 1;
  platformId?: string;
  platform?: string;
  stats?: Record<string, unknown>;
}

export interface ReplayGoal {
  frame: number;
  playerName?: string;
  playerTeam?: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface FieldEntity {
  position: Vector3;
  velocity?: Vector3;
  boost?: number;
}

export interface FieldSnapshot {
  frame: number;
  timeSeconds?: number;
  ball: FieldEntity | null;
  players: Array<
    FieldEntity & {
      name: string;
      team: 0 | 1;
    }
  >;
}

export interface ReplayMatchSummary {
  replayId?: string;
  replayName?: string;
  mapName?: string;
  date?: string;
  gameType?: string;
  matchType?: string;
  teamSize?: number;
  team0Score: number;
  team1Score: number;
  numFrames?: number;
  recordFps?: number;
  buildVersion?: string;
  durationSeconds?: number;
}

export interface ReplayParseResult {
  valid: boolean;
  error?: string;
  match: ReplayMatchSummary;
  players: ReplayPlayer[];
  goals: ReplayGoal[];
  events: {
    goalCount: number;
    touchCount: number;
    demolishCount: number;
    boostPadPickupCount: number;
  };
  fieldSnapshot?: FieldSnapshot;
}

export interface ReplayParseOptions {
  /** Frame index for on-field snapshot (defaults to last frame). */
  snapshotFrame?: number;
  /** Include per-frame field snapshot in the response. */
  includeFieldSnapshot?: boolean;
}
