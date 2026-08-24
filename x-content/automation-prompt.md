# Automation prompt (copy this)

Paste the block below into the **Prompt** field when you create the scheduled
Automation at [cursor.com/automations](https://cursor.com/automations). Attach
**this repo** so it can read your voice profile and command.

---

```
Run the /x-posts command from this repo to create today's batch of X posts for @HixonStudio.

Follow the command exactly: read x-content/voice-profile.md and x-content/topic-sources.md, check your recent memories to avoid repeating angles, then pull what's actually trending today — use X API MCP (xapi) if available (trends, search, my recent posts), otherwise web search. Write 6 copy-paste-ready posts in my real voice: casual, warm, short, emoji-light. Never invent project metrics/launches, and frame any unreleased-model talk as a question or opinion, not fact.

Deliver the 6 posts directly in your response, each in its own code block with a character count, then a one-line "best bet" and the source links you used. Keep it clean for mobile copy/paste.

To avoid repeats across runs, save a brief memory of today's date, topics, and angles. Do not open a pull request and do not modify any app code.
```

---

## Trigger settings

- **Trigger:** Scheduled
- **Schedule:** a cron that fires a few times a day, e.g. `0 9,13,18 * * *`
  (9am / 1pm / 6pm). Set your timezone. (Runs may start a little after the time,
  never before.)
- **Repository:** attach this repo (required so it can read the command + profile).
- **Tools (optional):** add **Memories** (no-repeat across runs) and **Send to Slack**
  if you want the batch pushed there. For best trend data, connect **X API MCP**
  (see `x-content/x-mcp-setup.md`) and store your Bearer token in Cursor Secrets.

## Where the posts show up

You read them right in the agent run on **Cursor Mobile** — the 6 posts print in
the chat, each in a copy-friendly code block. You'll get a push notification when
the run finishes. (Add Slack above if you want them pushed there too.)
