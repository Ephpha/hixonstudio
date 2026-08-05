/**
 * DemoBro worker — Checkpoint 2 stub.
 * Confirms ffmpeg is present and keeps a tiny HTTP wake endpoint so Railway
 * can sleep the service when idle. Job claiming / render lands in later checkpoints.
 */
import http from "node:http";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const PORT = Number(process.env.PORT || 8080);
const POLL_MS = Number(process.env.WORKER_POLL_MS || 15_000);

async function ffmpegVersion() {
  try {
    const { stdout } = await execFileAsync("ffmpeg", ["-version"]);
    return stdout.split("\n")[0] ?? "ffmpeg present";
  } catch (err) {
    return `ffmpeg missing: ${err instanceof Error ? err.message : String(err)}`;
  }
}

const ffmpegInfo = await ffmpegVersion();
console.log(`[worker] starting — ${ffmpegInfo}`);

let lastPollAt = null;
let polls = 0;

async function pollOnce() {
  polls += 1;
  lastPollAt = new Date().toISOString();
  // Checkpoint 2: no jobs table yet — just heartbeat.
  console.log(`[worker] poll #${polls} at ${lastPollAt} (queue wiring comes next)`);
}

const server = http.createServer((req, res) => {
  if (req.url === "/health" || req.url === "/") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        ok: true,
        service: "demobro-worker",
        ffmpeg: ffmpegInfo,
        polls,
        lastPollAt,
      }),
    );
    return;
  }
  res.writeHead(404).end("not found");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[worker] listening on :${PORT}`);
});

await pollOnce();
setInterval(() => {
  void pollOnce();
}, POLL_MS);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    console.log(`[worker] ${signal} — shutting down`);
    server.close(() => process.exit(0));
  });
}
