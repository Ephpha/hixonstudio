export type AgentId = "coder" | "language";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type AgentProfile = {
  id: AgentId;
  label: string;
  eyebrow: string;
  summary: string;
  model: string;
  aliases: string[];
  pull: string;
  quant: string;
  vram: string;
  speed: string;
  temperature: number;
  numCtx: number;
  keepAlive: string;
  system: string;
};

export const HARNESS = {
  defaultHost: "http://127.0.0.1:11434",
  hardware: {
    machine: "HP Victus",
    cpu: "AMD Ryzen 7",
    gpu: "NVIDIA GeForce RTX 4060",
    display: "144 Hz",
    vram: "8 GB typical",
  },
  maxMessages: 40,
  maxMessageChars: 12_000,
} as const;

export const AGENTS: Record<AgentId, AgentProfile> = {
  coder: {
    id: "coder",
    label: "Coder",
    eyebrow: "Local coding agent",
    summary: "Writes, reads, and repairs code. Tight diffs. No invented APIs.",
    model: "qwen2.5-coder:7b-instruct",
    aliases: [
      "qwen2.5-coder:7b-instruct",
      "qwen2.5-coder:7b-instruct-q4_K_M",
      "qwen2.5-coder:7b",
    ],
    pull: "ollama pull qwen2.5-coder:7b-instruct",
    quant: "Q4_K_M",
    vram: "~5 GB",
    speed: "~28–50 tok/s",
    temperature: 0.2,
    numCtx: 8192,
    keepAlive: "5m",
    system:
      "You are the Hixon.Studio coding agent. You run locally on this machine.\n\nWrite clear, working code. Prefer small diffs and complete files over vague advice.\nCall out risks, missing context, and what you would test.\nIf the user pastes code, reason about that code first.\nDo not invent APIs. If you are unsure, say so.\nKeep answers tight unless the user asks for more.",
  },
  language: {
    id: "language",
    label: "Language",
    eyebrow: "Local language agent",
    summary: "Writing, planning, and thinking out loud. Direct studio partner.",
    model: "qwen3.5:9b",
    aliases: ["qwen3.5:9b", "qwen3.5:9b-q4_K_M", "qwen3.5:9b-instruct"],
    pull: "ollama pull qwen3.5:9b",
    quant: "Q4_K_M",
    vram: "~7 GB",
    speed: "~22–32 tok/s",
    temperature: 0.7,
    numCtx: 8192,
    keepAlive: "5m",
    system:
      "You are the Hixon.Studio language agent. You run locally on this machine.\n\nHelp with writing, thinking, planning, and conversation.\nBe direct. Sound like a sharp studio partner, not a corporate assistant.\nNo filler. No hype. Ask one good follow-up when it actually helps.",
  },
};

export function getAgent(id: string): AgentProfile | null {
  if (id === "coder" || id === "language") return AGENTS[id];
  return null;
}

export function siblingAgent(id: AgentId): AgentProfile {
  return id === "coder" ? AGENTS.language : AGENTS.coder;
}

export function modelMatches(installed: string, wanted: string): boolean {
  return installed === wanted || installed.startsWith(`${wanted}-`);
}

export function resolveInstalledModel(
  aliases: string[],
  installed: string[]
): string | null {
  for (const alias of aliases) {
    const hit = installed.find((name) => modelMatches(name, alias));
    if (hit) return hit;
  }
  return null;
}

export function normalizeOllamaHost(raw: string | undefined): string {
  const fallback = HARNESS.defaultHost;
  if (!raw || !raw.trim()) return fallback;
  let value = raw.trim().replace(/\/$/, "");
  if (!/^https?:\/\//i.test(value)) {
    value = `http://${value}`;
  }
  return value;
}

export function parseChatRequest(body: unknown):
  | { ok: true; agent: AgentProfile; messages: ChatMessage[] }
  | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request." };
  }

  const data = body as Record<string, unknown>;
  const agent = getAgent(String(data.agent ?? ""));
  if (!agent) {
    return { ok: false, error: "Unknown agent." };
  }

  if (!Array.isArray(data.messages)) {
    return { ok: false, error: "Messages are required." };
  }

  if (data.messages.length === 0) {
    return { ok: false, error: "Send at least one message." };
  }

  if (data.messages.length > HARNESS.maxMessages) {
    return { ok: false, error: `Too many messages (max ${HARNESS.maxMessages}).` };
  }

  const messages: ChatMessage[] = [];
  for (const item of data.messages) {
    if (typeof item !== "object" || item === null) {
      return { ok: false, error: "Invalid message." };
    }
    const row = item as Record<string, unknown>;
    const role = row.role;
    const content = typeof row.content === "string" ? row.content.trim() : "";
    if (role !== "user" && role !== "assistant") {
      return { ok: false, error: "Invalid message role." };
    }
    if (!content) {
      return { ok: false, error: "Empty message." };
    }
    if (content.length > HARNESS.maxMessageChars) {
      return {
        ok: false,
        error: `Message is too long (max ${HARNESS.maxMessageChars} characters).`,
      };
    }
    messages.push({ role, content });
  }

  if (messages[messages.length - 1]?.role !== "user") {
    return { ok: false, error: "Last message must come from you." };
  }

  return { ok: true, agent, messages };
}

export function buildChatPayload(
  agent: AgentProfile,
  messages: ChatMessage[],
  model = agent.model
) {
  return {
    model,
    stream: true,
    keep_alive: agent.keepAlive,
    options: {
      temperature: agent.temperature,
      num_ctx: agent.numCtx,
    },
    messages: [
      { role: "system" as const, content: agent.system },
      ...messages,
    ],
  };
}

export type OllamaStreamEvent =
  | { type: "delta"; text: string }
  | { type: "done" }
  | { type: "error"; error: string };

export function parseOllamaChatLine(line: string): OllamaStreamEvent | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { type: "error", error: "Bad stream from Ollama." };
  }

  if (typeof parsed !== "object" || parsed === null) {
    return { type: "error", error: "Bad stream from Ollama." };
  }

  const data = parsed as Record<string, unknown>;
  if (typeof data.error === "string" && data.error) {
    return { type: "error", error: data.error };
  }

  const message = data.message;
  if (message && typeof message === "object") {
    const content = (message as Record<string, unknown>).content;
    if (typeof content === "string" && content) {
      return { type: "delta", text: content };
    }
  }

  if (data.done === true) {
    return { type: "done" };
  }

  return null;
}
