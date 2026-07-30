import { DataTable } from "@/components/league/DataTable";
import { getLeagueOverview } from "@/lib/league";
import type { FranchiseStanding } from "@/lib/stats";

export const dynamic = "force-dynamic";

function standingRows(teams: FranchiseStanding[], startRank = 1) {
  return teams.map((team, index) => ({
    rank: startRank + index,
    team: team.name,
    conference: team.conference === "ATLANTIC" ? "Atlantic" : "Pacific",
    record: `${team.wins}-${team.losses}`,
    pts: team.points,
    plusMinus: team.plusMinus > 0 ? `+${team.plusMinus}` : String(team.plusMinus),
    series: `${team.seriesWins}-${team.seriesLosses}`,
    games: team.gamesPlayed,
    goals: `${team.goalsFor}-${team.goalsAgainst}`,
  }));
}

export default async function StandingsPage() {
  const data = await getLeagueOverview();

  if (!data) {
    return <p className="text-white/60">No league data available.</p>;
  }

  const atlantic = data.standings.filter((team) => team.conference === "ATLANTIC");
  const pacific = data.standings.filter((team) => team.conference === "PACIFIC");

  const columns = [
    { key: "rank", label: "#", className: "w-12" },
    { key: "team", label: "Franchise" },
    { key: "record", label: "Record" },
    { key: "pts", label: "PTS" },
    { key: "plusMinus", label: "+/-" },
    { key: "series", label: "Series" },
    { key: "games", label: "Games" },
    { key: "goals", label: "Goals" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-white">Standings</h2>
        <p className="mt-1 text-white/50">Conference tables and overall league rankings</p>
      </div>

      <section>
        <h3 className="mb-3 text-lg font-semibold text-[#0088FF]">Atlantic Conference</h3>
        <DataTable columns={columns} rows={standingRows(atlantic)} />
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold text-[#0088FF]">Pacific Conference</h3>
        <DataTable columns={columns} rows={standingRows(pacific)} />
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold text-white">Overall Rankings</h3>
        <DataTable
          columns={[
            { key: "rank", label: "#", className: "w-12" },
            { key: "team", label: "Franchise" },
            { key: "conference", label: "Conference" },
            { key: "record", label: "Record" },
            { key: "pts", label: "PTS" },
            { key: "plusMinus", label: "+/-" },
            { key: "series", label: "Series" },
            { key: "games", label: "Games" },
            { key: "goals", label: "Goals" },
          ]}
          rows={standingRows(data.standings)}
        />
      </section>
    </div>
  );
}
