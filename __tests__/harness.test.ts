import {
  AGENTS,
  HARNESS,
  buildChatPayload,
  getAgent,
  modelMatches,
  normalizeOllamaHost,
  parseChatRequest,
  parseOllamaChatLine,
  resolveInstalledModel,
  siblingAgent,
} from "@/lib/harness/agents";

describe("normalizeOllamaHost", () => {
  it("falls back to the local default", () => {
    expect(normalizeOllamaHost(undefined)).toBe(HARNESS.defaultHost);
    expect(normalizeOllamaHost("  ")).toBe(HARNESS.defaultHost);
  });

  it("adds http when the scheme is missing", () => {
    expect(normalizeOllamaHost("127.0.0.1:11434")).toBe("http://127.0.0.1:11434");
  });

  it("strips a trailing slash", () => {
    expect(normalizeOllamaHost("http://localhost:11434/")).toBe(
      "http://localhost:11434"
    );
  });
});

describe("model matching", () => {
  it("accepts an exact name or a quant suffix", () => {
    expect(modelMatches("qwen2.5-coder:7b-instruct", "qwen2.5-coder:7b-instruct")).toBe(
      true
    );
    expect(
      modelMatches("qwen2.5-coder:7b-instruct-q4_K_M", "qwen2.5-coder:7b-instruct")
    ).toBe(true);
  });

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

  it("returns null when the 7B coder is missing", () => {
    expect(resolveInstalledModel(AGENTS.coder.aliases, ["qwen2.5-coder:32b"])).toBe(
      null
    );
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
  const good = {
    agent: "coder",
    messages: [{ role: "user", content: "fix this function" }],
  };

  it("accepts a valid coder turn", () => {
    const parsed = parseChatRequest(good);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.agent.id).toBe("coder");
      expect(parsed.messages).toHaveLength(1);
    }
  });

  it("rejects an unknown agent", () => {
    expect(parseChatRequest({ ...good, agent: "gpt" })).toEqual({
      ok: false,
      error: "Unknown agent.",
    });
  });

  it("rejects a thread that does not end on the user", () => {
    expect(
      parseChatRequest({
        agent: "language",
        messages: [{ role: "assistant", content: "hello" }],
      })
    ).toEqual({ ok: false, error: "Last message must come from you." });
  });

  it("rejects oversized messages", () => {
    const parsed = parseChatRequest({
      agent: "coder",
      messages: [{ role: "user", content: "x".repeat(HARNESS.maxMessageChars + 1) }],
    });
    expect(parsed.ok).toBe(false);
  });
});

describe("buildChatPayload", () => {
  it("pins the system prompt and local runtime options", () => {
    const payload = buildChatPayload(AGENTS.coder, [
      { role: "user", content: "hello" },
    ]);
    expect(payload.model).toBe(AGENTS.coder.model);
    expect(payload.stream).toBe(true);
    expect(payload.options.temperature).toBe(0.2);
    expect(payload.options.num_ctx).toBe(8192);
    expect(payload.messages[0]).toEqual({
      role: "system",
      content: AGENTS.coder.system,
    });
  });
});

describe("parseOllamaChatLine", () => {
  it("reads a token delta", () => {
    expect(
      parseOllamaChatLine('{"message":{"content":"const"},"done":false}')
    ).toEqual({ type: "delta", text: "const" });
  });

  it("reads done and error rows", () => {
    expect(parseOllamaChatLine('{"done":true}')).toEqual({ type: "done" });
    expect(parseOllamaChatLine('{"error":"model not found"}')).toEqual({
      type: "error",
      error: "model not found",
    });
  });

  it("ignores blank lines", () => {
    expect(parseOllamaChatLine("  ")).toBeNull();
  });
});
