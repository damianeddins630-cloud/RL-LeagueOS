import { DataTable } from "@/components/league/DataTable";
import { getLeagueOverview } from "@/lib/league";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const data = await getLeagueOverview();

  if (!data) {
    return <p className="text-white/60">No league data available.</p>;
  }

  const weeks = Array.from({ length: data.league.totalWeeks }, (_, i) => i + 1);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Schedule</h2>
        <p className="mt-1 text-white/50">10-week regular season — all matchups</p>
      </div>

      {weeks.map((week) => {
        const weekMatches = data.league.matches.filter((match) => match.week === week);

        return (
          <section key={week}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#0088FF]">
              Week {week}
            </h3>
            <DataTable
              columns={[
                { key: "date", label: "Date" },
                { key: "matchup", label: "Matchup" },
                { key: "series", label: "Series" },
                { key: "status", label: "Status" },
              ]}
              rows={weekMatches.map((match) => {
                const homeWins = match.series.filter((g) => g.homeGoals > g.awayGoals).length;
                const awayWins = match.series.filter((g) => g.awayGoals > g.homeGoals).length;

                return {
                  date: new Date(match.scheduledAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }),
                  matchup: (
                    <span className="font-medium text-white">
                      {match.homeFranchise.abbreviation} vs {match.awayFranchise.abbreviation}
                    </span>
                  ),
                  series:
                    match.series.length > 0
                      ? `${homeWins}-${awayWins} (${match.series.length} games)`
                      : "—",
                  status: (
                    <span
                      className={
                        match.status === "COMPLETED"
                          ? "text-[#0088FF]"
                          : "text-white/40"
                      }
                    >
                      {match.status === "COMPLETED" ? "Final" : "Scheduled"}
                    </span>
                  ),
                };
              })}
              emptyMessage={`No matches scheduled for week ${week}.`}
            />
          </section>
        );
      })}
    </div>
  );
}
