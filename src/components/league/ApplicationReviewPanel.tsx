"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type PendingApplication = {
  id: string;
  username: string;
  discordName: string;
  age: number;
  whyJoining: string;
  status: string;
  createdAt: Date | string;
};

export function ApplicationReviewPanel({
  applications,
}: {
  applications: PendingApplication[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function updateStatus(applicationId: string, status: "APPROVED" | "REJECTED") {
    const response = await fetch("/api/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, status }),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Failed to update application.");
      return;
    }

    setMessage(`Application ${status.toLowerCase()}.`);
    router.refresh();
  }

  if (applications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-lg border border-[#0066FF]/30 bg-[#0066FF]/5 p-6">
      <h3 className="text-lg font-semibold text-white">Pending Applications</h3>
      {message && <p className="text-sm text-[#0088FF]">{message}</p>}
      {applications.map((app) => (
        <div key={app.id} className="rounded-md border border-white/10 bg-black/40 p-4 text-sm text-white/70">
          <p className="font-medium text-white">{app.username}</p>
          <p>Discord: {app.discordName} · Age: {app.age}</p>
          <p className="mt-2">{app.whyJoining}</p>
          <div className="mt-3 flex gap-2">
            <Button type="button" variant="primary" className="px-4 py-2 text-xs"
              onClick={() => updateStatus(app.id, "APPROVED")}>Approve</Button>
            <Button type="button" variant="secondary" className="px-4 py-2 text-xs"
              onClick={() => updateStatus(app.id, "REJECTED")}>Reject</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
