import type { Conference } from "@/lib/types";

export type FranchiseStanding = {
  franchiseId: string;
  name: string;
  abbreviation: string;
  conference: Conference;
  wins: number;
  losses: number;
  points: number;
  plusMinus: number;
  seriesWins: number;
  seriesLosses: number;
  gamesPlayed: number;
  goalsFor: number;
  goalsAgainst: number;
};

export type PlayerAggregate = {
  memberId: string;
  name: string;
  gamertag: string;
  franchiseName: string;
  franchiseId: string;
  tier: number;
  games: number;
  goals: number;
  saves: number;
  assists: number;
  shots: number;
  demos: number;
  overall: number;
};

type MatchWithSeries = {
  id: string;
  homeFranchiseId: string;
  awayFranchiseId: string;
  status: string;
  homeFranchise: { id: string; name: string; abbreviation: string; conference: string };
  awayFranchise: { id: string; name: string; abbreviation: string; conference: string };
  series: Array<{
    homeGoals: number;
    awayGoals: number;
    playerStats: Array<{
      memberId: string;
      goals: number;
      saves: number;
      assists: number;
      shots: number;
      demos: number;
      member: {
        id: string;
        name: string;
        gamertag: string;
        tier: number;
        franchise: { id: string; name: string };
      };
    }>;
  }>;
};

export function computeFranchiseStandings(
  franchises: Array<{
    id: string;
    name: string;
    abbreviation: string;
    conference: Conference;
  }>,
  matches: MatchWithSeries[],
): FranchiseStanding[] {
  const map = new Map<string, FranchiseStanding>();

  for (const franchise of franchises) {
    map.set(franchise.id, {
      franchiseId: franchise.id,
      name: franchise.name,
      abbreviation: franchise.abbreviation,
      conference: franchise.conference,
      wins: 0,
      losses: 0,
      points: 0,
      plusMinus: 0,
      seriesWins: 0,
      seriesLosses: 0,
      gamesPlayed: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    });
  }

  for (const match of matches) {
    if (match.status !== "COMPLETED") continue;

    const home = map.get(match.homeFranchiseId);
    const away = map.get(match.awayFranchiseId);
    if (!home || !away) continue;

    let homeSeriesWins = 0;
    let awaySeriesWins = 0;

    for (const game of match.series) {
      home.goalsFor += game.homeGoals;
      home.goalsAgainst += game.awayGoals;
      away.goalsFor += game.awayGoals;
      away.goalsAgainst += game.homeGoals;
      home.gamesPlayed += 1;
      away.gamesPlayed += 1;

      if (game.homeGoals > game.awayGoals) {
        homeSeriesWins += 1;
        home.seriesWins += 1;
        away.seriesLosses += 1;
      } else if (game.awayGoals > game.homeGoals) {
        awaySeriesWins += 1;
        away.seriesWins += 1;
        home.seriesLosses += 1;
      }
    }

    home.plusMinus += match.series.reduce((s, g) => s + (g.homeGoals - g.awayGoals), 0);
    away.plusMinus += match.series.reduce((s, g) => s + (g.awayGoals - g.homeGoals), 0);

    if (homeSeriesWins > awaySeriesWins) {
      home.wins += 1;
      home.points += 3;
      away.losses += 1;
    } else if (awaySeriesWins > homeSeriesWins) {
      away.wins += 1;
      away.points += 3;
      home.losses += 1;
    }
  }

  return [...map.values()].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.plusMinus !== a.plusMinus) return b.plusMinus - a.plusMinus;
    return b.goalsFor - a.goalsFor;
  });
}

export function computePlayerAggregates(matches: MatchWithSeries[]): PlayerAggregate[] {
  const map = new Map<string, PlayerAggregate>();

  for (const match of matches) {
    if (match.status !== "COMPLETED") continue;

    for (const game of match.series) {
      for (const stat of game.playerStats) {
        const existing = map.get(stat.memberId) ?? {
          memberId: stat.memberId,
          name: stat.member.name,
          gamertag: stat.member.gamertag,
          franchiseName: stat.member.franchise.name,
          franchiseId: stat.member.franchise.id,
          tier: stat.member.tier,
          games: 0,
          goals: 0,
          saves: 0,
          assists: 0,
          shots: 0,
          demos: 0,
          overall: 0,
        };

        existing.games += 1;
        existing.goals += stat.goals;
        existing.saves += stat.saves;
        existing.assists += stat.assists;
        existing.shots += stat.shots;
        existing.demos += stat.demos;
        map.set(stat.memberId, existing);
      }
    }
  }

  const players = [...map.values()];
  for (const player of players) {
    player.overall = computeOverallRating(player);
  }

  return players.sort((a, b) => b.overall - a.overall);
}

export function computeOverallRating(player: Omit<PlayerAggregate, "overall">): number {
  if (player.games === 0) return 0;

  const perGame =
    (player.goals * 3 +
      player.assists * 2 +
      player.saves * 1 +
      player.shots * 0.15 +
      player.demos * 1.25) /
    player.games;

  return Number(perGame.toFixed(2));
}

export function sortPlayersByCategory(
  players: PlayerAggregate[],
  category: keyof Pick<
    PlayerAggregate,
    "overall" | "goals" | "saves" | "assists" | "shots" | "demos"
  >,
): PlayerAggregate[] {
  return [...players].sort((a, b) => b[category] - a[category]);
}
