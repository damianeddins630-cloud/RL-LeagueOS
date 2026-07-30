import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }
  const franchises = await db.franchise.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, abbreviation: true, conference: true },
  });

  const matches = await db.match.findMany({
    include: {
      homeFranchise: true,
      awayFranchise: true,
      series: true,
    },
    orderBy: [{ week: "asc" }, { scheduledAt: "asc" }],
  });

  return NextResponse.json({ franchises, matches });
}

export async function POST(request: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { week, scheduledAt, homeFranchiseId, awayFranchiseId } = body;

    if (!week || !scheduledAt || !homeFranchiseId || !awayFranchiseId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const league = await db.league.findFirst();
    if (!league) {
      return NextResponse.json({ error: "League not found." }, { status: 404 });
    }

    const match = await db.match.create({
      data: {
        week: Number(week),
        scheduledAt: new Date(scheduledAt),
        homeFranchiseId,
        awayFranchiseId,
        leagueId: league.id,
      },
      include: {
        homeFranchise: true,
        awayFranchise: true,
      },
    });

    return NextResponse.json(match);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create match.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
