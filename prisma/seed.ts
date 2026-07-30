import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ATLANTIC = [
  { name: "Velocity FC", abbreviation: "VEL" },
  { name: "Neon Surge", abbreviation: "NEO" },
  { name: "Apex Aerials", abbreviation: "APX" },
  { name: "Iron Boost", abbreviation: "IRN" },
  { name: "Crimson Comets", abbreviation: "CRM" },
  { name: "Metro Mechanics", abbreviation: "MTR" },
] as const;

const PACIFIC = [
  { name: "Solar Flare", abbreviation: "SLR" },
  { name: "Phantom Strike", abbreviation: "PHN" },
  { name: "Turbo Titans", abbreviation: "TBT" },
  { name: "Zenith Zeros", abbreviation: "ZEN" },
  { name: "Pulse Pioneers", abbreviation: "PLS" },
  { name: "Nova Knights", abbreviation: "NVA" },
] as const;

const TIER_ROSTER = [
  { tier: 1, count: 2 },
  { tier: 2, count: 2 },
  { tier: 3, count: 2 },
];

async function main() {
  await prisma.playerGameStat.deleteMany();
  await prisma.series.deleteMany();
  await prisma.match.deleteMany();
  await prisma.member.deleteMany();
  await prisma.franchise.deleteMany();
  await prisma.league.deleteMany();

  const league = await prisma.league.create({
    data: {
      name: "Rocket League Elite Series",
      season: "Season 1",
      totalWeeks: 10,
    },
  });

  const franchises = [];

  for (const team of ATLANTIC) {
    franchises.push(
      await prisma.franchise.create({
        data: {
          name: team.name,
          abbreviation: team.abbreviation,
          conference: "ATLANTIC",
          leagueId: league.id,
        },
      }),
    );
  }

  for (const team of PACIFIC) {
    franchises.push(
      await prisma.franchise.create({
        data: {
          name: team.name,
          abbreviation: team.abbreviation,
          conference: "PACIFIC",
          leagueId: league.id,
        },
      }),
    );
  }

  for (const franchise of franchises) {
    let memberIndex = 1;
    for (const slot of TIER_ROSTER) {
      for (let i = 0; i < slot.count; i++) {
        await prisma.member.create({
          data: {
            name: `${franchise.name} Player ${memberIndex}`,
            gamertag: `${franchise.abbreviation}_${memberIndex}`,
            tier: slot.tier,
            franchiseId: franchise.id,
          },
        });
        memberIndex += 1;
      }
    }
  }

  const startDate = new Date("2026-08-01T19:00:00Z");

  for (let week = 1; week <= 10; week++) {
    for (let i = 0; i < 6; i++) {
      const home = franchises[i % franchises.length];
      const away = franchises[(i + 6) % franchises.length];
      const scheduledAt = new Date(startDate);
      scheduledAt.setDate(startDate.getDate() + (week - 1) * 7 + i);

      await prisma.match.create({
        data: {
          week,
          scheduledAt,
          leagueId: league.id,
          homeFranchiseId: home.id,
          awayFranchiseId: away.id,
          status: week === 1 && i < 2 ? "COMPLETED" : "SCHEDULED",
          series:
            week === 1 && i < 2
              ? {
                  create: [
                    { gameNumber: 1, homeGoals: 3, awayGoals: 2 },
                    { gameNumber: 2, homeGoals: 1, awayGoals: 4 },
                    { gameNumber: 3, homeGoals: 2, awayGoals: 1 },
                  ],
                }
              : undefined,
        },
      });
    }
  }

  const completedMatches = await prisma.match.findMany({
    where: { status: "COMPLETED" },
    include: {
      homeFranchise: { include: { members: true } },
      awayFranchise: { include: { members: true } },
      series: true,
    },
  });

  for (const match of completedMatches) {
    for (const game of match.series) {
      const homePlayers = match.homeFranchise.members.slice(0, 2);
      const awayPlayers = match.awayFranchise.members.slice(0, 2);

      for (const [index, member] of [...homePlayers, ...awayPlayers].entries()) {
        await prisma.playerGameStat.create({
          data: {
            seriesId: game.id,
            memberId: member.id,
            goals: index % 3,
            saves: 2 + index,
            assists: index % 2,
            shots: 3 + index,
            demos: index % 2,
          },
        });
      }
    }
  }

  console.log("Seeded Rocket League Elite Series with 12 franchises.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
