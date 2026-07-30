import { readFileSync } from "node:fs";
import { join } from "node:path";

let initialized = false;

/**
 * Lazily initialize the subtr-actor WebAssembly module (Node.js / Vercel).
 * Uses sync init so it works in serverless without fetch-to-file:// issues.
 */
export async function ensureReplayWasmInitialized(): Promise<void> {
  if (initialized) {
    return;
  }

  const { initSync } = await import("@rlrml/subtr-actor");

  const wasmPath = join(
    process.cwd(),
    "node_modules/@rlrml/subtr-actor/rl_replay_subtr_actor_bg.wasm",
  );

  initSync({ module: readFileSync(wasmPath) });
  initialized = true;
}

export function resetReplayWasmForTests(): void {
  initialized = false;
}
