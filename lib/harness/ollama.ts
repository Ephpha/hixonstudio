import {
  AGENTS,
  explainOllamaError,
  normalizeOllamaHost,
  resolveInstalledModel,
  siblingAgent,
  type AgentId,
  type AgentProfile,
} from "@/lib/harness/agents";

const FETCH_MS = 2500;

export type HarnessStatus = {
  online: boolean;
  host: string;
  version: string | null;
  error: string | null;
  note: string;
  agents: Record<
    AgentId,
    {
      id: AgentId;
      label: string;
      model: string;
      installed: boolean;
      loaded: boolean;
      resolved: string | null;
      pull: string;
    }
  >;
};

function host() {
  return normalizeOllamaHost(process.env.OLLAMA_HOST);
}

async function ollama(
  path: string,
  init?: RequestInit,
  timeoutMs = FETCH_MS
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(`${host()}${path}`, {
      ...init,
      signal: ctrl.signal,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

function readNames(payload: unknown): string[] {
  if (typeof payload !== "object" || payload === null) return [];
  const rows = (payload as Record<string, unknown>).models;
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row) => {
      if (typeof row !== "object" || row === null) return "";
      const name = (row as Record<string, unknown>).name;
      return typeof name === "string" ? name : "";
    })
    .filter(Boolean);
}

export async function getHarnessStatus(): Promise<HarnessStatus> {
  const note =
    "RTX 4060 laptop VRAM is tight. Keep one model loaded. The harness unloads the other agent before a run.";

  try {
    const [versionRes, tagsRes, psRes] = await Promise.all([
      ollama("/api/version"),
      ollama("/api/tags"),
      ollama("/api/ps"),
    ]);

    if (!versionRes.ok) {
      throw new Error(`Ollama returned ${versionRes.status}.`);
    }

    const versionJson = (await versionRes.json()) as { version?: string };
    const installed = tagsRes.ok ? readNames(await tagsRes.json()) : [];
    const loaded = psRes.ok ? readNames(await psRes.json()) : [];

    const agentStatus = (agent: AgentProfile) => {
      const resolved = resolveInstalledModel(agent.aliases, installed);
      const loadedName = resolved
        ? resolveInstalledModel(agent.aliases, loaded)
        : null;
      return {
        id: agent.id,
        label: agent.label,
        model: agent.model,
        installed: Boolean(resolved),
        loaded: Boolean(loadedName),
        resolved,
        pull: agent.pull,
      };
    };

    return {
      online: true,
      host: host(),
      version: versionJson.version ?? null,
      error: null,
      note,
      agents: {
        coder: agentStatus(AGENTS.coder),
        language: agentStatus(AGENTS.language),
      },
    };
  } catch (err) {
    const message = explainOllamaError(err);

    return {
      online: false,
      host: host(),
      version: null,
      error: message,
      note,
      agents: {
        coder: {
          id: "coder",
          label: AGENTS.coder.label,
          model: AGENTS.coder.model,
          installed: false,
          loaded: false,
          resolved: null,
          pull: AGENTS.coder.pull,
        },
        language: {
          id: "language",
          label: AGENTS.language.label,
          model: AGENTS.language.model,
          installed: false,
          loaded: false,
          resolved: null,
          pull: AGENTS.language.pull,
        },
      },
    };
  }
}

export async function unloadAgent(agent: AgentProfile, model?: string) {
  const name = model ?? agent.model;
  try {
    await ollama(
      "/api/generate",
      {
        method: "POST",
        body: JSON.stringify({ model: name, keep_alive: 0 }),
      },
      8000
    );
  } catch {
    // Unload is best-effort. Chat can still run if VRAM is free enough.
  }
}

export async function unloadSibling(agentId: AgentId) {
  const other = siblingAgent(agentId);
  const status = await getHarnessStatus();
  const loaded = status.agents[other.id];
  if (loaded.loaded && loaded.resolved) {
    await unloadAgent(other, loaded.resolved);
  }
}

export function ollamaChatUrl() {
  return `${host()}/api/chat`;
}
