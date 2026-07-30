import { DataTable } from "@/components/league/DataTable";
import { getAllMembers } from "@/lib/league";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const members = await getAllMembers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">All Members</h2>
        <p className="mt-1 text-white/50">{members.length} registered league members</p>
      </div>

      <DataTable
        columns={[
          { key: "gamertag", label: "Gamertag" },
          { key: "name", label: "Name" },
          { key: "franchise", label: "Franchise" },
          { key: "tier", label: "Tier" },
          { key: "conference", label: "Conference" },
        ]}
        rows={members.map((member) => ({
          gamertag: <span className="font-medium text-white">{member.gamertag}</span>,
          name: member.name,
          franchise: member.franchise.name,
          tier: `Tier ${member.tier}`,
          conference:
            member.franchise.conference === "ATLANTIC" ? "Atlantic" : "Pacific",
        }))}
      />
    </div>
  );
}
