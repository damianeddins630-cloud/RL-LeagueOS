import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { applicationId, status } = body;

    if (!applicationId || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const application = await db.leagueApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update application.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
