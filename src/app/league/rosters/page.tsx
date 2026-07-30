import Link from "next/link";
import { getLeagueOverview } from "@/lib/league";

export const dynamic = "force-dynamic";

export default async function RostersPage() {
  const data = await getLeagueOverview();

  if (!data) {
    return <p className="text-white/60">No league data available.</p>;
  }

  const atlantic = data.league.franchises.filter((f) => f.conference === "ATLANTIC");
  const pacific = data.league.franchises.filter((f) => f.conference === "PACIFIC");

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-white">Franchise Rosters</h2>
        <p className="mt-1 text-white/50">
          Select a franchise to view tiers and roster members
        </p>
      </div>

      <FranchiseGrid title="Atlantic Conference" franchises={atlantic} />
      <FranchiseGrid title="Pacific Conference" franchises={pacific} />
    </div>
  );
}

function FranchiseGrid({
  title,
  franchises,
}: {
  title: string;
  franchises: Array<{
    id: string;
    name: string;
    abbreviation: string;
    members: unknown[];
  }>;
}) {
  return (
    <section>
      <h3 className="mb-4 text-lg font-semibold text-[#0088FF]">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {franchises.map((franchise) => (
          <Link
            key={franchise.id}
            href={`/league/rosters/${franchise.id}`}
            className="group rounded-lg border border-[#0066FF]/20 bg-[#0a0a0a] p-5 transition-colors hover:border-[#0088FF]/50 hover:bg-[#0066FF]/5"
          >
            <p className="text-xs uppercase tracking-wider text-[#0088FF]">
              {franchise.abbreviation}
            </p>
            <p className="mt-1 text-lg font-semibold text-white group-hover:text-[#0088FF]">
              {franchise.name}
            </p>
            <p className="mt-2 text-sm text-white/40">
              {franchise.members.length} members · View tiers →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
