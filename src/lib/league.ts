import type { Conference } from "@/lib/types";
import { db } from "@/lib/db";
import {
  computeFranchiseStandings,
  computePlayerAggregates,
} from "@/lib/stats";

const matchInclude = {
  homeFranchise: true,
  awayFranchise: true,
  series: {
    include: {
      playerStats: {
        include: {
          member: {
            include: { franchise: true },
          },
        },
      },
    },
  },
} as const;

export async function getLeague() {
  return db.league.findFirst({
    include: {
      franchises: {
        include: { members: { orderBy: [{ tier: "asc" }, { gamertag: "asc" }] } },
        orderBy: { name: "asc" },
      },
      matches: {
        include: matchInclude,
        orderBy: [{ week: "asc" }, { scheduledAt: "asc" }],
      },
    },
  });
}

export async function getLeagueOverview() {
  const league = await getLeague();
  if (!league) return null;

  const memberCount = league.franchises.reduce(
    (sum, franchise) => sum + franchise.members.length,
    0,
  );

  const standings = computeFranchiseStandings(
    league.franchises.map((f) => ({
      ...f,
      conference: f.conference as Conference,
    })),
    league.matches,
  );
  const players = computePlayerAggregates(league.matches);

  return {
    league,
    memberCount,
    franchiseCount: league.franchises.length,
    standings,
    players,
  };
}

export async function getFranchiseById(franchiseId: string) {
  return db.franchise.findUnique({
    where: { id: franchiseId },
    include: {
      members: { orderBy: [{ tier: "asc" }, { gamertag: "asc" }] },
      league: true,
    },
  });
}

export async function getAllMembers() {
  return db.member.findMany({
    include: { franchise: true },
    orderBy: [{ franchise: { name: "asc" } }, { tier: "asc" }, { gamertag: "asc" }],
  });
}

export { matchInclude };
