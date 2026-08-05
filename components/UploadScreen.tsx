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

function isMp4(file: File): boolean {
  const byType = file.type === "video/mp4" || file.type === "video/quicktime";
  const byName = file.name.toLowerCase().endsWith(".mp4");
  // Accept MP4 primarily; some browsers leave type empty on drop.
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [video, setVideo] = useState<VideoState>({ status: "empty" });
  const [repoUrl, setRepoUrl] = useState("");
  const [repoTouched, setRepoTouched] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [generateNote, setGenerateNote] = useState<string | null>(null);

  const parsedRepo = parseGithubRepoUrl(repoUrl);
  const repoError =
    repoTouched && repoUrl.trim().length > 0 && !parsedRepo
      ? "Use a public GitHub URL like https://github.com/owner/repo"
      : null;

  const canGenerate =
    video.status === "ready" && parsedRepo !== null && !generateNote;

  const applyFile = useCallback(async (file: File | undefined | null) => {
    setGenerateNote(null);
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

  const onGenerate = () => {
    if (!canGenerate || video.status !== "ready" || !parsedRepo) return;
    // Checkpoint 1: UI + client validation only. Upload pipeline comes next.
    setGenerateNote(
      `Ready: ${video.file.name} (${formatDuration(video.durationSeconds)}) → ${githubRepoDisplay(parsedRepo.owner, parsedRepo.repo)}. Upload + job pipeline lands after this checkpoint.`,
    );
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
                setGenerateNote(null);
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
            Generate
          </button>

          {generateNote && (
            <p
              className="mt-4 text-sm leading-relaxed text-[var(--color-ink-muted)]"
              role="status"
            >
              {generateNote}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
