import { DataTable } from "@/components/league/DataTable";
import Link from "next/link";
import { getFranchiseById } from "@/lib/league";

export const dynamic = "force-dynamic";

export default async function FranchiseRosterPage({
  params,
}: {
  params: Promise<{ franchiseId: string }>;
}) {
  const { franchiseId } = await params;
  const franchise = await getFranchiseById(franchiseId);

  if (!franchise) {
    return <p className="text-white/60">Franchise not found.</p>;
  }

  const tiers = [1, 2, 3];

  return (
    <div className="space-y-8">
      <div>
        <Link href="/league/rosters" className="text-sm text-[#0088FF] hover:underline">
          ← All Franchises
        </Link>
        <h2 className="mt-2 text-2xl font-bold text-white">{franchise.name}</h2>
        <p className="text-white/50">
          {franchise.conference === "ATLANTIC" ? "Atlantic" : "Pacific"} Conference ·{" "}
          {franchise.abbreviation}
        </p>
      </div>

      {tiers.map((tier) => {
        const members = franchise.members.filter((member) => member.tier === tier);

        return (
          <section key={tier}>
            <h3 className="mb-3 text-lg font-semibold text-[#0088FF]">Tier {tier}</h3>
            <DataTable
              columns={[
                { key: "gamertag", label: "Gamertag" },
                { key: "name", label: "Name" },
                { key: "tier", label: "Tier" },
              ]}
              rows={members.map((member) => ({
                gamertag: member.gamertag,
                name: member.name,
                tier: member.tier,
              }))}
              emptyMessage={`No Tier ${tier} players assigned.`}
            />
          </section>
        );
      })}
    </div>
  );
}
