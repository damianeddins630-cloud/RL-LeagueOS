import Link from "next/link";
import { getLeagueOverview } from "@/lib/league";

export const dynamic = "force-dynamic";

export default async function LeagueOverviewPage() {
  const data = await getLeagueOverview();

  if (!data) {
    return (
      <div className="rounded-lg border border-[#0066FF]/20 bg-[#0a0a0a] p-8 text-center text-white/60">
        League not configured yet. Visit{" "}
        <Link href="/admin" className="text-[#0088FF] hover:underline">
          Admin
        </Link>{" "}
        to set up.
      </div>
    );
  }

  const { league, franchiseCount, memberCount, standings } = data;
  const topTeams = standings.slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="League" value={league.name} />
        <StatCard label="Franchises" value={String(franchiseCount)} />
        <StatCard label="Members" value={String(memberCount)} />
      </section>

      <section className="rounded-lg border border-[#0066FF]/20 bg-[#0a0a0a] p-6">
        <h2 className="mb-2 text-lg font-semibold text-white">Season Overview</h2>
        <p className="text-white/60">
          {league.season} · {league.totalWeeks} week regular season · 12 franchises · 2
          conferences (6 teams each)
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Top Standings</h2>
          <Link href="/league/standings" className="text-sm text-[#0088FF] hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto rounded-lg border border-[#0066FF]/20">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#0066FF]/20 bg-black text-xs uppercase text-[#0088FF]">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">W-L</th>
                <th className="px-4 py-3">PTS</th>
                <th className="px-4 py-3">+/-</th>
              </tr>
            </thead>
            <tbody>
              {topTeams.map((team, index) => (
                <tr key={team.franchiseId} className="border-b border-white/5 text-white/80">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-white">{team.name}</td>
                  <td className="px-4 py-3">
                    {team.wins}-{team.losses}
                  </td>
                  <td className="px-4 py-3">{team.points}</td>
                  <td className="px-4 py-3">
                    {team.plusMinus > 0 ? `+${team.plusMinus}` : team.plusMinus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#0066FF]/20 bg-[#0a0a0a] p-5">
      <p className="text-xs uppercase tracking-wider text-[#0088FF]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
