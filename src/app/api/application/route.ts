import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must log in with Discord first." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username, discordName, age, whyJoining } = body;

    if (!username?.trim() || !discordName?.trim() || !whyJoining?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const ageNumber = Number(age);
    if (!Number.isInteger(ageNumber) || ageNumber < 13 || ageNumber > 99) {
      return NextResponse.json({ error: "Enter a valid age (13–99)." }, { status: 400 });
    }

    if (whyJoining.trim().length < 10) {
      return NextResponse.json(
        { error: "Please tell us a bit more about why you want to join." },
        { status: 400 },
      );
    }

    const existing = await db.leagueApplication.findUnique({
      where: { userId: session.user.id },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already submitted an application.", status: existing.status },
        { status: 409 },
      );
    }

    const application = await db.leagueApplication.create({
      data: {
        userId: session.user.id,
        username: username.trim(),
        discordName: discordName.trim(),
        age: ageNumber,
        whyJoining: whyJoining.trim(),
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit application.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
