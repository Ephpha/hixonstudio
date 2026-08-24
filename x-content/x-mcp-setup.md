# X MCP setup (optional but recommended)

The X Content Studio works without any MCP (web search only). Adding the **X API
MCP** makes drafts much sharper: real X trends, real search in your lanes, and
your actual recent `@HixonStudio` posts for voice + no-repeat checks.

**Skip Docs MCP** for this workflow — it only searches X API documentation, not
live posts or trends.

---

## What you get

| Capability | Why it helps |
| --- | --- |
| **Trends & news** | What's actually hot on X today, not a Google summary |
| **Post search** | Recent chatter in your lanes (AI, Cursor, Anthropic, build-in-public) |
| **Your recent posts** | Auto no-repeat + `/x-learn` can refresh your voice profile |
| **Post tweets** (optional) | Only if you later want auto-posting — **off by default** |

---

## Pick a setup route

### Route A — Read-only, simplest (recommended to start)

Best for: copy-paste workflow, scheduled cloud agents, no browser login on every run.

1. Create an app at [developer.x.com](https://developer.x.com).
2. Copy the **App-only Bearer token** (Keys and tokens).
3. Copy `.cursor/mcp.json.example` → `.cursor/mcp.json` in this repo (or add the
   same block to `~/.cursor/mcp.json` globally).
4. Replace `YOUR_APP_ONLY_BEARER_TOKEN` with your token.
5. **Do not commit** `.cursor/mcp.json` — it's gitignored. Store the token in
   Cursor Dashboard → **Secrets** if you use cloud/scheduled agents.

**Trade-off:** read-only, no "act as @HixonStudio" user context. Enough for
trends, search, and public post lookup.

### Route B — Full OAuth via `xurl` bridge

Best for: local Cursor on your Mac, reading *your* timeline/bookmarks, or future
write actions.

1. Create an X app with **OAuth 2.0** enabled.
2. Register redirect URI: `http://localhost:8080/callback`
3. Use this config instead of Route A:

```json
{
  "mcpServers": {
    "xapi": {
      "command": "npx",
      "args": ["-y", "@xdevplatform/xurl", "mcp", "https://api.x.com/mcp"],
      "env": {
        "CLIENT_ID": "YOUR_X_APP_CLIENT_ID",
        "CLIENT_SECRET": "YOUR_X_APP_CLIENT_SECRET"
      }
    }
  }
}
```

4. First run opens a browser for one-time login; tokens cache in `~/.xurl`.

**Trade-off:** requires Node + browser locally. **Scheduled cloud agents cannot
run the local `xurl` bridge** — use Route A (Bearer) for automations.

---

## Verify it works

1. Cursor → **Settings → MCP** → confirm `xapi` has a green dot and tools listed.
2. In an agent, run: `/x-posts`
3. Check the **Sources** section — it should cite X MCP results, not only web search.

If MCP isn't connected, `/x-posts` still works via web search (graceful fallback).

---

## Cost & limits

- X API access may require a paid developer tier depending on your app's plan.
- Reads are cheaper than writes; keep posting **manual** (copy-paste) to stay read-only.
- Rate limits apply — the agent is instructed to make a small number of targeted calls.

---

## Security notes

- Never commit tokens or paste them into chat logs.
- Use a dedicated X app with only the scopes you need.
- This is X's official hosted MCP (`api.x.com/mcp`), not a third-party wrapper.
- Posting tools exist but are **not used** unless you explicitly ask later.
