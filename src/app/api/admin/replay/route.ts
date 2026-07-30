import { NextRequest, NextResponse } from "next/server";
import { processReplayForMatch } from "@/lib/replay/process";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const matchId = formData.get("matchId");
    const replay = formData.get("replay");

    if (typeof matchId !== "string" || !(replay instanceof File)) {
      return NextResponse.json(
        { error: "Provide matchId and replay file." },
        { status: 400 },
      );
    }

    const bytes = new Uint8Array(await replay.arrayBuffer());
    const result = await processReplayForMatch(matchId, bytes);

    return NextResponse.json({
      success: true,
      seriesId: result.series.id,
      score: {
        home: result.parsed.match.team0Score,
        away: result.parsed.match.team1Score,
      },
      players: result.parsed.players.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Replay processing failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
