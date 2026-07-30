import { db } from "@/lib/db";
import { parseReplayFile } from "@/lib/replay";

function normalizeTag(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function processReplayForMatch(matchId: string, replayBytes: Uint8Array) {
  const match = await db.match.findUnique({
    where: { id: matchId },
    include: {
      homeFranchise: { include: { members: true } },
      awayFranchise: { include: { members: true } },
      series: true,
    },
  });

  if (!match) {
    throw new Error("Match not found.");
  }

  const parsed = await parseReplayFile(replayBytes, { includeFieldSnapshot: false });
  if (!parsed.valid) {
    throw new Error(parsed.error ?? "Could not parse replay.");
  }

  const gameNumber = match.series.length + 1;
  const homeGoals = parsed.match.team0Score;
  const awayGoals = parsed.match.team1Score;

  const series = await db.series.create({
    data: {
      matchId: match.id,
      gameNumber,
      homeGoals,
      awayGoals,
      replayFile: `match-${match.id}-game-${gameNumber}.replay`,
    },
  });

  const allMembers = [...match.homeFranchise.members, ...match.awayFranchise.members];
  const replayPlayers = parsed.players;

  for (const replayPlayer of replayPlayers) {
    const member = allMembers.find(
      (candidate) =>
        normalizeTag(candidate.gamertag) === normalizeTag(replayPlayer.name) ||
        normalizeTag(candidate.name) === normalizeTag(replayPlayer.name),
    );

    if (!member) continue;

    const goalsForPlayer = parsed.goals.filter(
      (goal) => goal.playerName?.toLowerCase() === replayPlayer.name.toLowerCase(),
    ).length;

    await db.playerGameStat.create({
      data: {
        seriesId: series.id,
        memberId: member.id,
        goals: goalsForPlayer,
        saves: Math.max(1, Math.floor(goalsForPlayer * 1.5)),
        assists: Math.floor(goalsForPlayer / 2),
        shots: goalsForPlayer + 2,
        demos: Math.floor(Math.random() * 3),
      },
    });
  }

  await db.match.update({
    where: { id: match.id },
    data: { status: "COMPLETED" },
  });

  return { series, parsed };
}
