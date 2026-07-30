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
};

export function LeagueAdminPanel() {
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
    if (!response.ok) return;
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

    setMessage(`Match added: ${data.homeFranchise.abbreviation} vs ${data.awayFranchise.abbreviation}`);
    await loadData();
  }

  async function uploadReplay(event: React.FormEvent) {
    event.preventDefault();
    if (!matchId || !replayFile) return;

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("matchId", matchId);
    formData.append("replay", replayFile);

    const response = await fetch("/api/admin/replay", { method: "POST", body: formData });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "Replay upload failed.");
      return;
    }

    setMessage(`Replay saved. Score ${data.score.home}-${data.score.away}.`);
    setReplayFile(null);
    await loadData();
  }

  return (
    <div className="space-y-6 rounded-lg border border-[#0066FF]/30 bg-[#0066FF]/5 p-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-[#0088FF]">League OP</p>
        <h3 className="text-lg font-semibold text-white">Manage Schedule & Replays</h3>
      </div>

      {message && (
        <p className="text-sm text-[#0088FF]">{message}</p>
      )}

      <form onSubmit={createMatch} className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-white/60">
          Week
          <input type="number" min={1} max={10} value={week} onChange={(e) => setWeek(e.target.value)}
            className="mt-1 w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2 text-white" />
        </label>
        <label className="text-sm text-white/60">
          Date & Time
          <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} required
            className="mt-1 w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2 text-white" />
        </label>
        <label className="text-sm text-white/60">
          Home Team
          <select value={homeId} onChange={(e) => setHomeId(e.target.value)} required
            className="mt-1 w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2 text-white">
            <option value="">Select</option>
            {franchises.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </label>
        <label className="text-sm text-white/60">
          Away Team
          <select value={awayId} onChange={(e) => setAwayId(e.target.value)} required
            className="mt-1 w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2 text-white">
            <option value="">Select</option>
            {franchises.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" variant="primary" disabled={loading}>Add Match</Button>
        </div>
      </form>

      <form onSubmit={uploadReplay} className="grid gap-3 border-t border-[#0066FF]/20 pt-6">
        <label className="text-sm text-white/60">
          Upload Replay
          <select value={matchId} onChange={(e) => setMatchId(e.target.value)} required
            className="mt-1 w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2 text-white">
            <option value="">Select match</option>
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                Wk {m.week}: {m.homeFranchise.abbreviation} vs {m.awayFranchise.abbreviation}
              </option>
            ))}
          </select>
        </label>
        <input type="file" accept=".replay" onChange={(e) => setReplayFile(e.target.files?.[0] ?? null)} required
          className="w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2 text-sm text-white" />
        <Button type="submit" variant="secondary" disabled={loading}>Upload Replay</Button>
      </form>
    </div>
  );
}
