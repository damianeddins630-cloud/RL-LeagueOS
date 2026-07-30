import { NextRequest, NextResponse } from "next/server";
import { parseReplayFile } from "@/lib/replay";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_REPLAY_BYTES = 15 * 1024 * 1024; // 15 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("replay");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing replay file. Upload a .replay file as form field 'replay'." },
        { status: 400 },
      );
    }

    if (!file.name.toLowerCase().endsWith(".replay")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a Rocket League .replay file." },
        { status: 400 },
      );
    }

    if (file.size > MAX_REPLAY_BYTES) {
      return NextResponse.json(
        { error: `Replay file too large. Maximum size is ${MAX_REPLAY_BYTES / (1024 * 1024)} MB.` },
        { status: 413 },
      );
    }

    const snapshotFrameParam = formData.get("snapshotFrame");
    const includeFieldSnapshot = formData.get("includeFieldSnapshot") !== "false";

    const buffer = await file.arrayBuffer();
    const replayBytes = new Uint8Array(buffer);

    const result = await parseReplayFile(replayBytes, {
      includeFieldSnapshot,
      snapshotFrame:
        typeof snapshotFrameParam === "string"
          ? Number.parseInt(snapshotFrameParam, 10)
          : undefined,
    });

    if (!result.valid) {
      return NextResponse.json({ error: result.error ?? "Failed to parse replay." }, { status: 422 });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error while parsing replay.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
