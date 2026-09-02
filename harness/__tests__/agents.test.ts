import {
  AGENTS,
  HARNESS,
  buildChatPayload,
  explainOllamaError,
  getAgent,
  modelMatches,
  normalizeOllamaHost,
  parseChatRequest,
  parseOllamaChatLine,
  resolveInstalledModel,
  siblingAgent,
} from "@/lib/agents";

describe("explainOllamaError", () => {
  it("rewrites a raw fetch failure", () => {
    expect(explainOllamaError(new Error("fetch failed"))).toBe(
      "Ollama is offline. Start it on this machine, then refresh."
    );
  });
});

describe("normalizeOllamaHost", () => {
  it("falls back to the local default", () => {
    expect(normalizeOllamaHost(undefined)).toBe(HARNESS.defaultHost);
  });

  it("adds http when the scheme is missing", () => {
    expect(normalizeOllamaHost("127.0.0.1:11434")).toBe("http://127.0.0.1:11434");
  });
});

describe("model matching", () => {
  it("does not treat 32b as 7b", () => {
    expect(modelMatches("qwen2.5-coder:32b", "qwen2.5-coder:7b")).toBe(false);
  });

  it("resolves the first matching alias", () => {
    expect(
      resolveInstalledModel(AGENTS.coder.aliases, [
        "qwen2.5-coder:32b",
        "qwen2.5-coder:7b-instruct-q4_K_M",
      ])
    ).toBe("qwen2.5-coder:7b-instruct-q4_K_M");
  });
});

describe("agents", () => {
  it("keeps the recommended local pair", () => {
    expect(AGENTS.coder.model).toBe("qwen2.5-coder:7b-instruct");
    expect(AGENTS.language.model).toBe("qwen3.5:9b");
    expect(siblingAgent("coder").id).toBe("language");
    expect(getAgent("nope")).toBeNull();
  });
});

describe("parseChatRequest", () => {
  it("accepts a valid coder turn", () => {
    const parsed = parseChatRequest({
      agent: "coder",
      messages: [{ role: "user", content: "fix this function" }],
    });
    expect(parsed.ok).toBe(true);
  });

  it("rejects an unknown agent", () => {
    expect(
      parseChatRequest({
        agent: "gpt",
        messages: [{ role: "user", content: "hi" }],
      })
    ).toEqual({ ok: false, error: "Unknown agent." });
  });
});

describe("buildChatPayload", () => {
  it("pins the system prompt and local runtime options", () => {
    const payload = buildChatPayload(AGENTS.coder, [
      { role: "user", content: "hello" },
    ]);
    expect(payload.model).toBe(AGENTS.coder.model);
    expect(payload.options.num_ctx).toBe(8192);
    expect(payload.messages[0]?.role).toBe("system");
  });
});

describe("parseOllamaChatLine", () => {
  it("reads a token delta", () => {
    expect(
      parseOllamaChatLine('{"message":{"content":"const"},"done":false}')
    ).toEqual({ type: "delta", text: "const" });
  });
});
