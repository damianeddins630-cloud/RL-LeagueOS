-- CreateTable
CREATE TABLE "League" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "totalWeeks" INTEGER NOT NULL DEFAULT 10,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Franchise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "conference" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    CONSTRAINT "Franchise_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gamertag" TEXT NOT NULL,
    "tier" INTEGER NOT NULL DEFAULT 1,
    "franchiseId" TEXT NOT NULL,
    CONSTRAINT "Member_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "Franchise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "week" INTEGER NOT NULL,
    "scheduledAt" DATETIME NOT NULL,
    "leagueId" TEXT NOT NULL,
    "homeFranchiseId" TEXT NOT NULL,
    "awayFranchiseId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    CONSTRAINT "Match_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_homeFranchiseId_fkey" FOREIGN KEY ("homeFranchiseId") REFERENCES "Franchise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_awayFranchiseId_fkey" FOREIGN KEY ("awayFranchiseId") REFERENCES "Franchise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameNumber" INTEGER NOT NULL,
    "matchId" TEXT NOT NULL,
    "homeGoals" INTEGER NOT NULL DEFAULT 0,
    "awayGoals" INTEGER NOT NULL DEFAULT 0,
    "replayFile" TEXT,
    CONSTRAINT "Series_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayerGameStat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seriesId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "saves" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "shots" INTEGER NOT NULL DEFAULT 0,
    "demos" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "PlayerGameStat_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlayerGameStat_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Franchise_leagueId_idx" ON "Franchise"("leagueId");

-- CreateIndex
CREATE INDEX "Member_franchiseId_idx" ON "Member"("franchiseId");

-- CreateIndex
CREATE INDEX "Match_leagueId_week_idx" ON "Match"("leagueId", "week");

-- CreateIndex
CREATE INDEX "Series_matchId_idx" ON "Series"("matchId");

-- CreateIndex
CREATE INDEX "PlayerGameStat_seriesId_idx" ON "PlayerGameStat"("seriesId");

-- CreateIndex
CREATE INDEX "PlayerGameStat_memberId_idx" ON "PlayerGameStat"("memberId");
