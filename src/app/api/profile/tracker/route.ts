import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isValidRlTrackerUrl, normalizeRlTrackerUrl } from "@/lib/tracker";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must log in with Discord first." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { rlTrackerUrl } = body;

    if (typeof rlTrackerUrl !== "string" || !rlTrackerUrl.trim()) {
      return NextResponse.json({ error: "RL Tracker URL is required." }, { status: 400 });
    }

    const normalized = normalizeRlTrackerUrl(rlTrackerUrl);
    if (!isValidRlTrackerUrl(normalized)) {
      return NextResponse.json(
        {
          error:
            "Use a valid RL Tracker link (rocketleague.tracker.network or rltracker.pro).",
        },
        { status: 400 },
      );
    }

    const user = await db.user.update({
      where: { id: session.user.id },
      data: { rlTrackerUrl: normalized },
      select: { rlTrackerUrl: true },
    });

    return NextResponse.json({ success: true, rlTrackerUrl: user.rlTrackerUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update tracker.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
