"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import {
  formatBytes,
  formatDuration,
  MAX_DURATION_SECONDS,
  MAX_UPLOAD_BYTES,
  MIN_DURATION_SECONDS,
} from "@/lib/constraints";
import type { RepoIngestResult, RepoIngestSuccess } from "@/lib/github-ingest";
import {
  githubRepoDisplay,
  parseGithubRepoUrl,
} from "@/lib/github-url";
import { readVideoDuration } from "@/lib/video-meta";

type VideoState =
  | { status: "empty" }
  | { status: "reading"; file: File }
  | {
      status: "ready";
      file: File;
      durationSeconds: number;
    }
  | { status: "error"; message: string };

type IngestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: RepoIngestSuccess }
  | {
      status: "fallback";
      message: string;
      manualTitle: string;
    };

function isMp4(file: File): boolean {
  const byType = file.type === "video/mp4" || file.type === "video/quicktime";
  const byName = file.name.toLowerCase().endsWith(".mp4");
  return byType || byName;
}

async function validateVideoFile(file: File): Promise<VideoState> {
  if (!isMp4(file)) {
    return {
      status: "error",
      message: "Only MP4 screen recordings are accepted.",
    };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      status: "error",
      message: `File is ${formatBytes(file.size)}. Max upload is ${formatBytes(MAX_UPLOAD_BYTES)}.`,
    };
  }

  try {
    const durationSeconds = await readVideoDuration(file);
    if (durationSeconds > MAX_DURATION_SECONDS) {
      return {
        status: "error",
        message: `Recording is ${formatDuration(durationSeconds)}. Max length is 15 minutes.`,
      };
    }
    if (durationSeconds < MIN_DURATION_SECONDS) {
      return {
        status: "error",
        message: "Recording is too short — need at least a few seconds of footage.",
      };
    }
    return { status: "ready", file, durationSeconds };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error ? err.message : "Couldn't read that video file.",
    };
  }
}

export function UploadScreen() {
  const inputId = useId();
  const repoId = useId();
  const manualTitleId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [video, setVideo] = useState<VideoState>({ status: "empty" });
  const [repoUrl, setRepoUrl] = useState("");
  const [repoTouched, setRepoTouched] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [ingest, setIngest] = useState<IngestState>({ status: "idle" });

  const parsedRepo = parseGithubRepoUrl(repoUrl);
  const repoError =
    repoTouched && repoUrl.trim().length > 0 && !parsedRepo
      ? "Use a public GitHub URL like https://github.com/owner/repo"
      : null;

  const canGenerate =
    video.status === "ready" &&
    parsedRepo !== null &&
    ingest.status !== "loading";

  const applyFile = useCallback(async (file: File | undefined | null) => {
    setIngest({ status: "idle" });
    if (!file) return;
    setVideo({ status: "reading", file });
    const next = await validateVideoFile(file);
    setVideo(next);
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragging(false);
      const file = event.dataTransfer.files?.[0];
      void applyFile(file);
    },
    [applyFile],
  );

  const runIngest = async () => {
    if (!parsedRepo) return;
    setIngest({ status: "loading" });
    try {
      const res = await fetch("/api/repo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: repoUrl.trim() }),
      });
      const data = (await res.json()) as RepoIngestResult;
      if (data.ok) {
        setIngest({ status: "ready", data });
        return;
      }
      setIngest({
        status: "fallback",
        message: data.message,
        manualTitle: "",
      });
    } catch {
      setIngest({
        status: "fallback",
        message: "Couldn't reach the repo ingest service. Enter a title to continue.",
        manualTitle: "",
      });
    }
  };

  const onGenerate = () => {
    if (!canGenerate || video.status !== "ready" || !parsedRepo) return;
    void runIngest();
  };

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-12 sm:px-6">
      <div className="w-full max-w-[28rem]">
        <header className="mb-10 text-center">
          <h1 className="text-[2.125rem] leading-none sm:text-[2.5rem]">
            <Wordmark />
          </h1>
          <p className="mt-4 text-pretty text-[1.05rem] leading-relaxed text-[var(--color-ink-muted)]">
            Drop a screen recording. Paste the repo. Get a polished demo.
          </p>
        </header>

        <section
          aria-label="Create a demo"
          className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-6 shadow-[0_1px_0_rgba(20,20,20,0.04)] sm:px-6 sm:py-7"
        >
          <div
            role="button"
            tabIndex={0}
            aria-controls={inputId}
            aria-label="Upload MP4 screen recording"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              if (e.currentTarget.contains(e.relatedTarget as Node)) return;
              setDragging(false);
            }}
            onDrop={onDrop}
            className={[
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-10 text-center transition-colors",
              dragging
                ? "border-[var(--color-accent)] bg-[color-mix(in_srgb,var(--color-accent)_8%,transparent)]"
                : "border-[var(--color-line)] bg-[var(--color-canvas)] hover:border-[color-mix(in_srgb,var(--color-ink)_28%,transparent)]",
            ].join(" ")}
          >
            <input
              ref={fileInputRef}
              id={inputId}
              type="file"
              accept="video/mp4,.mp4"
              className="sr-only"
              onChange={(e) => {
                void applyFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />

            {video.status === "empty" && (
              <>
                <p className="font-heading text-base font-medium text-[var(--color-ink)]">
                  Drop your MP4 here
                </p>
                <p className="mt-1.5 text-sm text-[var(--color-ink-faint)]">
                  or click to browse · max 500&nbsp;MB · 15&nbsp;min
                </p>
              </>
            )}

            {video.status === "reading" && (
              <p className="text-sm text-[var(--color-ink-muted)]">
                Reading {video.file.name}…
              </p>
            )}

            {video.status === "ready" && (
              <>
                <p className="font-heading text-base font-medium text-[var(--color-ink)]">
                  {video.file.name}
                </p>
                <p className="mt-1.5 font-mono text-sm text-[var(--color-ink-muted)]">
                  {formatBytes(video.file.size)} ·{" "}
                  {formatDuration(video.durationSeconds)}
                </p>
                <p className="mt-3 text-sm text-[var(--color-accent)]">
                  Replace file
                </p>
              </>
            )}

            {video.status === "error" && (
              <>
                <p className="text-sm font-medium text-[var(--color-danger)]">
                  {video.message}
                </p>
                <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
                  Choose a different MP4
                </p>
              </>
            )}
          </div>

          <div className="mt-5">
            <label
              htmlFor={repoId}
              className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]"
            >
              GitHub repo
            </label>
            <input
              id={repoId}
              type="url"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              placeholder="https://github.com/owner/repo"
              value={repoUrl}
              onChange={(e) => {
                setRepoUrl(e.target.value);
                setIngest({ status: "idle" });
              }}
              onBlur={() => setRepoTouched(true)}
              className={[
                "w-full rounded-xl border bg-[var(--color-canvas)] px-3.5 py-3 font-mono text-sm text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-faint)]",
                repoError
                  ? "border-[var(--color-danger)] focus:border-[var(--color-danger)]"
                  : "border-[var(--color-line)] focus:border-[var(--color-accent)]",
              ].join(" ")}
            />
            {repoError ? (
              <p className="mt-1.5 text-sm text-[var(--color-danger)]" role="alert">
                {repoError}
              </p>
            ) : parsedRepo ? (
              <p className="mt-1.5 font-mono text-sm text-[var(--color-ink-muted)]">
                {githubRepoDisplay(parsedRepo.owner, parsedRepo.repo)}
              </p>
            ) : (
              <p className="mt-1.5 text-sm text-[var(--color-ink-faint)]">
                Public repos only — we pull title, README, and stack from it.
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={!canGenerate}
            onClick={onGenerate}
            className="mt-6 w-full rounded-xl bg-[var(--color-accent)] px-4 py-3.5 font-heading text-base font-semibold text-white transition-colors enabled:hover:bg-[var(--color-accent-hover)] enabled:active:translate-y-px disabled:cursor-not-allowed disabled:bg-[color-mix(in_srgb,var(--color-ink)_18%,transparent)] disabled:text-white/80"
          >
            {ingest.status === "loading" ? "Reading repo…" : "Generate"}
          </button>

          {ingest.status === "ready" && <RepoPreview data={ingest.data} />}

          {ingest.status === "fallback" && (
            <div className="mt-5 border-t border-[var(--color-line)] pt-5">
              <p className="text-sm text-[var(--color-danger)]" role="alert">
                {ingest.message}
              </p>
              <label
                htmlFor={manualTitleId}
                className="mb-1.5 mt-4 block text-sm font-medium text-[var(--color-ink)]"
              >
                Project title
              </label>
              <input
                id={manualTitleId}
                type="text"
                value={ingest.manualTitle}
                onChange={(e) =>
                  setIngest({
                    ...ingest,
                    manualTitle: e.target.value,
                  })
                }
                placeholder="What should we call this demo?"
                className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3.5 py-3 font-heading text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function RepoPreview({ data }: { data: RepoIngestSuccess }) {
  return (
    <div
      className="mt-5 border-t border-[var(--color-line)] pt-5"
      role="status"
      aria-live="polite"
    >
      <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-ink-faint)]">
        From {data.owner}/{data.repo}
      </p>
      <h2 className="mt-2 font-heading text-xl font-semibold text-[var(--color-ink)]">
        {data.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
        {data.description}
      </p>
      {data.badges.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {data.badges.map((badge) => (
            <li
              key={badge}
              className="rounded-md border border-[var(--color-line)] bg-[var(--color-canvas)] px-2.5 py-1 font-mono text-xs text-[var(--color-ink)]"
            >
              {badge}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
