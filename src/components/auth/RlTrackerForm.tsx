"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type RlTrackerFormProps = {
  initialUrl?: string | null;
};

export function RlTrackerForm({ initialUrl }: RlTrackerFormProps) {
  const [rlTrackerUrl, setRlTrackerUrl] = useState(initialUrl ?? "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/profile/tracker", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rlTrackerUrl }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "Failed to save RL Tracker link.");
      return;
    }

    setMessage("RL Tracker link saved.");
    setRlTrackerUrl(data.rlTrackerUrl);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-white/50">
        Link your Rocket League Tracker profile. This is the only profile field you can edit.
      </p>

      <label className="block text-sm text-white/60">
        RL Tracker URL
        <input
          type="url"
          value={rlTrackerUrl}
          onChange={(e) => setRlTrackerUrl(e.target.value)}
          required
          placeholder="https://rocketleague.tracker.network/..."
          className="mt-1 w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2.5 text-white placeholder:text-white/30 focus:border-[#0088FF] focus:outline-none"
        />
      </label>

      {message && <p className="text-sm text-[#0088FF]">{message}</p>}

      <Button type="submit" variant="secondary" disabled={loading}>
        {loading ? "Saving..." : "Save RL Tracker"}
      </Button>
    </form>
  );
}
