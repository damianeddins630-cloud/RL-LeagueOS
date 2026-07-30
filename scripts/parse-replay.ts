import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseReplayFile } from "@/lib/replay";

async function main() {
  const replayPath =
    process.argv[2] ??
    join(process.cwd(), "tests/fixtures/soccar-lan.replay");

  const bytes = new Uint8Array(readFileSync(replayPath));
  const result = await parseReplayFile(bytes, { includeFieldSnapshot: true });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
