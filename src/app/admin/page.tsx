"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type Franchise = {
  id: string;
  name: string;
  abbreviation: string;
};

type Match = {
  id: string;
  week: number;
  scheduledAt: string;
  status: string;
  homeFranchise: Franchise;
  awayFranchise: Franchise;
  series: Array<{ id: string; gameNumber: number; homeGoals: number; awayGoals: number }>;
};

export default function AdminPage() {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [week, setWeek] = useState("1");
  const [scheduledAt, setScheduledAt] = useState("");
  const [homeId, setHomeId] = useState("");
  const [awayId, setAwayId] = useState("");
  const [matchId, setMatchId] = useState("");
  const [replayFile, setReplayFile] = useState<File | null>(null);

  async function loadData() {
    const response = await fetch("/api/admin/matches");
    const data = await response.json();
    setFranchises(data.franchises ?? []);
    setMatches(data.matches ?? []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createMatch(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        week: Number(week),
        scheduledAt,
        homeFranchiseId: homeId,
        awayFranchiseId: awayId,
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "Failed to create match.");
      return;
    }

    setMessage(`Match created: ${data.homeFranchise.abbreviation} vs ${data.awayFranchise.abbreviation}`);
    await loadData();
  }

  async function uploadReplay(event: React.FormEvent) {
    event.preventDefault();
    if (!matchId || !replayFile) {
      setMessage("Select a match and replay file.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("matchId", matchId);
    formData.append("replay", replayFile);

    const response = await fetch("/api/admin/replay", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "Replay upload failed.");
      return;
    }

    setMessage(
      `Replay processed! Score ${data.score.home}-${data.score.away}. ${data.players} players matched.`,
    );
    setReplayFile(null);
    await loadData();
  }

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl space-y-10">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#0088FF]">League OP</p>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="mt-1 text-white/50">
            Add matches, upload replays, and update series + player stats.
          </p>
        </div>

        {message && (
          <div className="rounded-md border border-[#0066FF]/30 bg-[#0066FF]/10 px-4 py-3 text-sm text-[#0088FF]">
            {message}
          </div>
        )}

        <section className="rounded-lg border border-[#0066FF]/20 bg-[#0a0a0a] p-6">
          <h2 className="mb-4 text-lg font-semibold">Add Match</h2>
          <form onSubmit={createMatch} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-white/60">
              Week (1-10)
              <input
                type="number"
                min={1}
                max={10}
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2 text-white"
              />
            </label>
            <label className="text-sm text-white/60">
              Date & Time
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2 text-white"
                required
              />
            </label>
            <label className="text-sm text-white/60">
              Home Franchise
              <select
                value={homeId}
                onChange={(e) => setHomeId(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2 text-white"
                required
              >
                <option value="">Select team</option>
                {franchises.map((franchise) => (
                  <option key={franchise.id} value={franchise.id}>
                    {franchise.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-white/60">
              Away Franchise
              <select
                value={awayId}
                onChange={(e) => setAwayId(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2 text-white"
                required
              >
                <option value="">Select team</option>
                {franchises.map((franchise) => (
                  <option key={franchise.id} value={franchise.id}>
                    {franchise.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="sm:col-span-2">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Saving..." : "Add Match"}
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-lg border border-[#0066FF]/20 bg-[#0a0a0a] p-6">
          <h2 className="mb-4 text-lg font-semibold">Upload Replay</h2>
          <form onSubmit={uploadReplay} className="grid gap-4">
            <label className="text-sm text-white/60">
              Match
              <select
                value={matchId}
                onChange={(e) => setMatchId(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2 text-white"
                required
              >
                <option value="">Select match</option>
                {matches.map((match) => (
                  <option key={match.id} value={match.id}>
                    Wk {match.week}: {match.homeFranchise.abbreviation} vs{" "}
                    {match.awayFranchise.abbreviation} ({match.status})
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-white/60">
              Replay File (.replay)
              <input
                type="file"
                accept=".replay"
                onChange={(e) => setReplayFile(e.target.files?.[0] ?? null)}
                className="mt-1 w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2 text-white"
                required
              />
            </label>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Processing..." : "Upload & Update Stats"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
