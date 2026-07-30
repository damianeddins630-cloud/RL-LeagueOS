import { DataTable } from "@/components/league/DataTable";
import { getLeagueOverview } from "@/lib/league";
import { sortPlayersByCategory, type PlayerAggregate } from "@/lib/stats";

export const dynamic = "force-dynamic";

const categories = [
  { key: "overall" as const, label: "Overall" },
  { key: "goals" as const, label: "Goals" },
  { key: "saves" as const, label: "Saves" },
  { key: "assists" as const, label: "Assists" },
  { key: "shots" as const, label: "Shots" },
  { key: "demos" as const, label: "Demos" },
];

type CategoryKey = (typeof categories)[number]["key"];

function playerRows(players: PlayerAggregate[], category: CategoryKey) {
  const sorted = sortPlayersByCategory(players, category);

  return sorted.map((player, index) => ({
    rank: index + 1,
    player: (
      <div>
        <p className="font-medium text-white">{player.gamertag}</p>
        <p className="text-xs text-white/40">{player.franchiseName}</p>
      </div>
    ),
    games: player.games,
    value: player[category],
    goals: player.goals,
    saves: player.saves,
    assists: player.assists,
    shots: player.shots,
    demos: player.demos,
    overall: player.overall,
  }));
}

export default async function PlayersPage() {
  const data = await getLeagueOverview();

  if (!data) {
    return <p className="text-white/60">No league data available.</p>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-white">Player Rankings</h2>
        <p className="mt-1 text-white/50">
          {data.players.length} players ranked by category. Overall rating weighs goals,
          assists, saves, shots, and demos per game.
        </p>
      </div>

      {categories.map((category) => (
        <section key={category.key}>
          <h3 className="mb-3 text-lg font-semibold text-[#0088FF]">{category.label}</h3>
          <DataTable
            columns={[
              { key: "rank", label: "#", className: "w-12" },
              { key: "player", label: "Player" },
              { key: "games", label: "GP" },
              { key: "value", label: category.label },
              { key: "goals", label: "G" },
              { key: "assists", label: "A" },
              { key: "saves", label: "SV" },
              { key: "shots", label: "SH" },
              { key: "demos", label: "DM" },
            ]}
            rows={playerRows(data.players, category.key)}
            emptyMessage="No player stats yet. Upload replays in Admin."
          />
        </section>
      ))}
    </div>
  );
}
