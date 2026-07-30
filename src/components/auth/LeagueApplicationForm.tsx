"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type LeagueApplicationFormProps = {
  defaultDiscordName?: string | null;
};

export function LeagueApplicationForm({ defaultDiscordName }: LeagueApplicationFormProps) {
  const [username, setUsername] = useState("");
  const [discordName, setDiscordName] = useState(defaultDiscordName ?? "");
  const [age, setAge] = useState("");
  const [whyJoining, setWhyJoining] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, discordName, age, whyJoining }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "Failed to submit application.");
      return;
    }

    setMessage("Application submitted! We'll review it soon.");
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm text-white/60">
        Username
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Your in-game or preferred username"
          className="mt-1 w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2.5 text-white placeholder:text-white/30 focus:border-[#0088FF] focus:outline-none"
        />
      </label>

      <label className="block text-sm text-white/60">
        Discord Name
        <input
          type="text"
          value={discordName}
          onChange={(e) => setDiscordName(e.target.value)}
          required
          placeholder="Your Discord username"
          className="mt-1 w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2.5 text-white placeholder:text-white/30 focus:border-[#0088FF] focus:outline-none"
        />
      </label>

      <label className="block text-sm text-white/60">
        Age
        <input
          type="number"
          min={13}
          max={99}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          placeholder="18"
          className="mt-1 w-full rounded-md border border-[#0066FF]/30 bg-black px-3 py-2.5 text-white placeholder:text-white/30 focus:border-[#0088FF] focus:outline-none"
        />
      </label>

      <label className="block text-sm text-white/60">
        Why are you joining?
        <textarea
          value={whyJoining}
          onChange={(e) => setWhyJoining(e.target.value)}
          required
          rows={4}
          placeholder="Tell us why you want to play in RLES 2v2..."
          className="mt-1 w-full resize-none rounded-md border border-[#0066FF]/30 bg-black px-3 py-2.5 text-white placeholder:text-white/30 focus:border-[#0088FF] focus:outline-none"
        />
      </label>

      {message && (
        <p className="text-sm text-[#0088FF]">{message}</p>
      )}

      <Button type="submit" variant="primary" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
