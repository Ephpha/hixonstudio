"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SparkleSymbol from "@/components/SparkleSymbol";
import {
  AGENTS,
  HARNESS,
  type AgentId,
  type ChatMessage,
} from "@/lib/harness/agents";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import type { HarnessStatus } from "@/lib/harness/ollama";

type StreamEvent =
  | { type: "delta"; text: string }
  | { type: "done" }
  | { type: "error"; error: string };

const SUBHEAD =
  "Two local agents. One GPU. Coder writes. Language thinks. Neither leaves this machine.";

function statusColor(ok: boolean, warn = false) {
  if (ok) return "rgba(120,255,160,0.85)";
  if (warn) return "rgba(255,200,80,0.75)";
  return "rgba(255,255,255,0.22)";
}

export default function HarnessClient() {
  const [agentId, setAgentId] = useState<AgentId>("coder");
  const [threads, setThreads] = useState<Record<AgentId, ChatMessage[]>>({
    coder: [],
    language: [],
  });
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<HarnessStatus | null>(null);
  const [typed, setTyped] = useState("");

  const abortRef = useRef<AbortController | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);

  const agent = AGENTS[agentId];
  const messages = threads[agentId];
  const agentState = status?.agents[agentId];

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/harness/status", { cache: "no-store" });
      if (!res.ok) throw new Error("Status failed.");
      setStatus((await res.json()) as HarnessStatus);
    } catch {
      setStatus(null);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
    const id = window.setInterval(() => void loadStatus(), 12_000);
    return () => window.clearInterval(id);
  }, [loadStatus]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setTyped(SUBHEAD);
      gsap.set([heroRef.current, deskRef.current], { opacity: 1, y: 0 });
      return;
    }

    const counter = { i: 0 };
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.08 }
      );
      gsap.fromTo(
        deskRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.75, ease: "power2.out", delay: 0.28 }
      );
      gsap.to(counter, {
        i: SUBHEAD.length,
        duration: SUBHEAD.length * 0.018,
        delay: 0.35,
        ease: "none",
        onUpdate: () => setTyped(SUBHEAD.slice(0, Math.floor(counter.i))),
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  const stop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  };

  const clearThread = () => {
    stop();
    setError("");
    setThreads((prev) => ({ ...prev, [agentId]: [] }));
  };

  const send = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || streaming) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setThreads((prev) => ({ ...prev, [agentId]: nextMessages }));
    setDraft("");
    setError("");
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("/api/harness/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: agentId, messages: nextMessages }),
        signal: ctrl.signal,
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "The harness could not start.");
      }

      if (!res.body) throw new Error("Empty stream.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistant = "";

      const commit = (content: string) => {
        setThreads((prev) => ({
          ...prev,
          [agentId]: [...nextMessages, { role: "assistant", content }],
        }));
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const eventRow = JSON.parse(line) as StreamEvent;
          if (eventRow.type === "delta") {
            assistant += eventRow.text;
            commit(assistant);
          } else if (eventRow.type === "error") {
            throw new Error(eventRow.error);
          }
        }
      }

      if (!assistant) {
        setError("The model returned nothing. Check Ollama, then try again.");
      }
      void loadStatus();
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Something broke.");
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const online = Boolean(status?.online);
  const ready = Boolean(agentState?.installed && online);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
      <div ref={heroRef} className="mb-12 sm:mb-16" style={{ opacity: 0 }}>
        <SparkleSymbol size="sm" className="mb-8 opacity-25" />
        <p
          className="text-xs tracking-widest uppercase mb-4"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          Local studio desk
        </p>
        <div
          className="w-8 h-px mb-8"
          style={{ background: "rgba(255,255,255,0.18)" }}
        />
        <h1
          className="mb-6"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(2.25rem, 8vw, 3.5rem)",
            color: "#fff",
            lineHeight: 1.05,
          }}
        >
          Harness.
        </h1>
        <p
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)",
            color: "rgba(255,255,255,0.58)",
            lineHeight: 1.7,
            maxWidth: "36rem",
            minHeight: "4.2em",
          }}
        >
          {typed}
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "0.45em",
              marginLeft: "0.05em",
              color: "rgba(255,255,255,0.7)",
              animation: "hixonCursor 1s steps(1) infinite",
            }}
          >
            ▌
          </span>
        </p>
      </div>

      <div
        ref={deskRef}
        className="grid gap-8 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-12"
        style={{ opacity: 0 }}
      >
        <aside className="flex flex-col gap-8">
          <section>
            <p
              className="text-xs tracking-widest uppercase mb-4"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              Agents
            </p>
            <div className="flex flex-col gap-3">
              {(Object.keys(AGENTS) as AgentId[]).map((id) => {
                const item = AGENTS[id];
                const active = id === agentId;
                const state = status?.agents[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      stop();
                      setError("");
                      setAgentId(id);
                    }}
                    className="text-left rounded-2xl px-4 py-4 transition-opacity hover:opacity-100"
                    style={{
                      background: active
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(255,255,255,0.02)",
                      border: active
                        ? "1px solid rgba(255,255,255,0.16)"
                        : "1px solid rgba(255,255,255,0.07)",
                      opacity: active ? 1 : 0.72,
                    }}
                  >
                    <span
                      className="block text-xs tracking-widest uppercase mb-2"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {item.eyebrow}
                    </span>
                    <span
                      className="block mb-1"
                      style={{
                        fontFamily: "Fraunces, Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "1.35rem",
                        color: "#fff",
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="block text-xs mb-3"
                      style={{ color: "rgba(255,255,255,0.38)", lineHeight: 1.5 }}
                    >
                      {item.model}
                    </span>
                    <span className="flex items-center gap-2 text-xs tracking-widest uppercase">
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: statusColor(
                            Boolean(state?.installed && status?.online),
                            Boolean(status?.online && !state?.installed)
                          ),
                          boxShadow: state?.loaded
                            ? "0 0 8px rgba(120,255,160,0.6)"
                            : "none",
                          display: "inline-block",
                          animation: state?.loaded
                            ? "hixonPulse 2.4s ease-in-out infinite"
                            : "none",
                        }}
                      />
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>
                        {!status
                          ? "Checking"
                          : !status.online
                            ? "Offline"
                            : state?.loaded
                              ? "Loaded"
                              : state?.installed
                                ? "Ready"
                                : "Missing"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <p
              className="text-xs tracking-widest uppercase mb-4"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              Machine
            </p>
            <div
              className="rounded-2xl px-4 py-5"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                className="text-xs tracking-widest uppercase mb-3"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {HARNESS.hardware.machine}
              </p>
              <p
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.78)",
                  lineHeight: 1.7,
                  fontSize: "1.05rem",
                }}
              >
                {HARNESS.hardware.cpu}
                <br />
                {HARNESS.hardware.gpu}
                <br />
                {HARNESS.hardware.display} · {HARNESS.hardware.vram}
              </p>
              <div
                className="h-px my-4"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />
              <p
                className="text-xs leading-relaxed"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                {agent.quant} · {agent.vram} · {agent.speed} · {agent.numCtx} ctx.
                One model at a time.
              </p>
            </div>
          </section>

          <section>
            <p
              className="text-xs tracking-widest uppercase mb-4"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              Ollama
            </p>
            <p
              className="text-xs tracking-widest uppercase flex items-center gap-2 mb-3"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: statusColor(online),
                  boxShadow: online ? "0 0 8px rgba(120,255,160,0.6)" : "none",
                  display: "inline-block",
                  animation: online
                    ? "hixonPulse 2.4s ease-in-out infinite"
                    : "none",
                }}
              />
              {online
                ? `Live${status?.version ? ` · ${status.version}` : ""}`
                : "Offline"}
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {status?.error ?? status?.note ?? "Checking the local runtime."}
            </p>
            {(!online || !agentState?.installed) && (
              <pre
                className="mt-4 text-xs overflow-x-auto"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  padding: "1rem",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "Courier New, monospace",
                }}
              >
                {`# Ollama 0.30+ for Qwen 3.5\n${AGENTS.coder.pull}\n${AGENTS.language.pull}`}
              </pre>
            )}
          </section>
        </aside>

        <section
          className="rounded-2xl flex flex-col min-h-[34rem]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-1"
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                {agent.eyebrow}
              </p>
              <p
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "1.35rem",
                }}
              >
                {agent.label}
              </p>
            </div>
            <button
              type="button"
              onClick={clearThread}
              className="text-xs tracking-widest uppercase transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.32)" }}
            >
              Clear
            </button>
          </div>

          <div
            ref={scrollerRef}
            className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 space-y-6"
          >
            {messages.length === 0 && (
              <p
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.42)",
                  lineHeight: 1.7,
                  fontSize: "1.1rem",
                }}
              >
                {agent.summary}
              </p>
            )}

            {messages.map((message, index) => (
              <article key={`${message.role}-${index}`}>
                <p
                  className="text-xs tracking-widest uppercase mb-2"
                  style={{ color: "rgba(255,255,255,0.28)" }}
                >
                  {message.role === "user" ? "You" : agent.label}
                </p>
                <p
                  className="whitespace-pre-wrap"
                  style={{
                    fontFamily:
                      message.role === "assistant"
                        ? "Fraunces, Georgia, serif"
                        : "inherit",
                    fontStyle: message.role === "assistant" ? "italic" : "normal",
                    color:
                      message.role === "assistant"
                        ? "rgba(255,255,255,0.82)"
                        : "rgba(255,255,255,0.7)",
                    lineHeight: 1.75,
                    fontSize: message.role === "assistant" ? "1.05rem" : "0.95rem",
                  }}
                >
                  {message.content}
                  {streaming &&
                    index === messages.length - 1 &&
                    message.role === "assistant" && (
                      <span
                        aria-hidden="true"
                        style={{
                          display: "inline-block",
                          width: "0.45em",
                          marginLeft: "0.05em",
                          animation: "hixonCursor 1s steps(1) infinite",
                        }}
                      >
                        ▌
                      </span>
                    )}
                </p>
              </article>
            ))}
          </div>

          <form
            onSubmit={send}
            className="px-5 sm:px-6 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {error && (
              <p
                className="text-sm mb-3"
                style={{ color: "rgba(255,180,160,0.85)" }}
              >
                {error}
              </p>
            )}
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              rows={3}
              placeholder={
                agentId === "coder"
                  ? "Paste code, ask for a fix, or describe the file."
                  : "Ask for a rewrite, a plan, or a sharper sentence."
              }
              className="w-full px-4 py-3 rounded-lg outline-none text-base resize-none"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "#fff",
                fontFamily: "Fraunces, Georgia, serif",
                lineHeight: 1.6,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 4px rgba(255,255,255,0.03)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <div className="flex items-center justify-between gap-4 mt-4">
              <p
                className="text-xs tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.22)" }}
              >
                {ready ? "Enter to send" : "Local runtime needed"}
              </p>
              <div className="flex items-center gap-4">
                {streaming && (
                  <button
                    type="button"
                    onClick={stop}
                    className="text-xs tracking-widest uppercase transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    Stop
                  </button>
                )}
                <button
                  type="submit"
                  disabled={streaming || !draft.trim()}
                  className="text-sm px-6 py-3 rounded-full transition-opacity disabled:opacity-35 hover:opacity-75"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "#fff",
                  }}
                >
                  {streaming ? "Running" : "Send"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
