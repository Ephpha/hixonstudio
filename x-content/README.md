# X Content Studio

Your personal X (Twitter) content creator for [@HixonStudio](https://x.com/HixonStudio),
built to run inside Cursor — including **Cursor Mobile**. Ask the agent for posts,
it pulls what's trending today, writes them in your voice, and hands you
copy‑paste‑ready drafts. Set it on a schedule and it does this for you several
times a day.

## TL;DR — how to use it

On your phone (or anywhere in Cursor), open an agent and type:

```
/x-posts
```

You'll get ~6 ready-to-post drafts about today's trends, each in its own code
block so you can copy it in one tap and paste straight into X. Want a focus?

```
/x-posts angle for Ephpha this week
```

That's it. Read them, copy the good ones, post.

## What's in here

| File | What it does |
| --- | --- |
| `.cursor/commands/x-posts.md` | The `/x-posts` command — the main generator. |
| `.cursor/commands/x-voice.md` | The `/x-voice` command — teach/refine your tone. |
| `.cursor/commands/x-learn.md` | The `/x-learn` command — refresh voice from your real X posts (needs X MCP). |
| `.cursor/rules/x-content-studio.mdc` | Makes any agent aware of the system. |
| `.cursor/mcp.json.example` | Template for connecting X API MCP (copy → `.cursor/mcp.json`, don't commit). |
| `x-content/voice-profile.md` | **Your tone & rules.** The most important file — edit it. |
| `x-content/topic-sources.md` | Where to find trends and how to find your angle. |
| `x-content/x-mcp-setup.md` | How to connect X API MCP (recommended). |
| `x-content/automation-prompt.md` | Copy-paste prompt + settings for the scheduled Automation. |
| `x-content/posts/` | Archive of past batches (used in interactive runs). |

## How it works

1. `/x-posts` reads your **voice profile** and **topic sources**.
2. It pulls trends via **X API MCP first** (if connected), otherwise web search
   (+ Exa if available) for what's trending today in your lanes.
3. It drafts 6 posts across your real formats in your actual voice — casual, warm,
   short, emoji-light — and never invents facts about your projects or states model
   rumors as confirmed.
4. It outputs them mobile-friendly — each post in a copy-ready code block, with a
   char count and sources so you can fact-check before posting.
5. It logs the batch (interactive runs) or saves a Memory (scheduled runs) so the
   next run won't repeat.

## Optional: X API MCP (recommended)

Connect the official X MCP for real trends, X search in your lanes, and
auto-learning your voice from recent posts. See **[`x-mcp-setup.md`](./x-mcp-setup.md)**.

- **Add it:** yes — big upgrade for trend quality
- **Skip Docs MCP:** it only searches API docs, not live X
- **Keep posting manual:** read-only Bearer token is enough; no auto-posting unless you ask later

## Run it automatically — multiple times per day

Cursor **Automations** run an agent on a schedule as a cloud agent, so it works
even when your phone is closed. This is the one part you set up on the web (once);
after that everything happens on mobile.

1. Go to **[cursor.com/automations](https://cursor.com/automations)** → **New**
   (or use the `/automate` skill from an agent session).
2. Trigger: **Scheduled**. Pick a cron that fires a few times a day, e.g.
   `0 9,13,18 * * *` (9am / 1pm / 6pm). Set your timezone.
3. Repository: attach **this repo** (required — it reads your voice profile + command).
4. Prompt: copy the ready-made block from **[`automation-prompt.md`](./automation-prompt.md)**.
5. Tools (optional): add **Memories** (keeps the no-repeat memory across runs) and
   **Send to Slack** if you want the batch pushed to Slack too.
6. Save and activate. Repeat for more slots if you prefer separate automations.

**You read the posts right in the agent run on mobile** — the 6 drafts print in
the chat, each in its own copy-friendly code block. You get a push notification
when the run finishes. No PRs, no repo noise.

> Notes
> - Automations run as cloud agents in Max Mode and use cloud-agent usage.
> - Automation/secrets/Slack config is managed on the web, not in the mobile app —
>   but once set up, runs and results show up on mobile.
> - A scheduled run "may run with a delay but will not start before the indicated
>   time," so treat slots as "around 9am," not to-the-second.

### Two ways to receive each batch

- **Read in the run (default, cleanest):** open the finished automation run on
  mobile and copy posts straight from the chat. Nothing to clean up.
- **Slack:** add the Slack tool to the automation and the batch arrives as a
  message you can copy from anywhere.

## Make it sound more like you (do this once, early)

The drafts are only as good as the voice profile. To sharpen it fast:

```
/x-voice
```

…then paste 5–10 of your real tweets (or tweets you wish you'd written). It will
extract your patterns and update `x-content/voice-profile.md`. You can also just
edit that file by hand any time — it's plain Markdown.

After a batch, tell it what missed:

```
/x-voice that last batch was too formal, more build-log energy, shorter sentences
```

## Good habits

- **Edit `voice-profile.md` whenever a post lands well or flops.** That's the loop
  that makes this genuinely yours.
- **Always skim the "Sources" the agent lists** before posting a trend reaction —
  it shouldn't, but never let it post a claim you haven't verified.
- **Keep the archive.** It's what stops repetition and tracks what worked.
