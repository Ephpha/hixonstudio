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
| `.cursor/rules/x-content-studio.mdc` | Makes any agent aware of the system. |
| `x-content/voice-profile.md` | **Your tone & rules.** The most important file — edit it. |
| `x-content/topic-sources.md` | Where to find trends and how to find your angle. |
| `x-content/posts/` | Archive of past batches, so it never repeats itself. |

## How it works

1. `/x-posts` reads your **voice profile** and **topic sources**.
2. It searches the web for what's trending **today** in your lanes (AI, indie
   building, dev tools, design/taste, your projects). Exa MCP is used if available.
3. It drafts 6 posts across your real formats (audience question, X/growth take,
   AI tool reaction, build-in-public/promo, motivational, curiosity) in your
   actual voice — casual, warm, short, emoji-light — and never invents facts about
   your projects or states model rumors as confirmed.
4. It outputs them mobile-friendly — each post in a copy-ready code block, with a
   char count and the sources it used so you can fact-check before posting.
5. It logs the batch to `x-content/posts/YYYY-MM-DD.md` so the next run won't repeat.

## Run it automatically — multiple times per day

Cursor **Automations** can run an agent on a schedule (this is a cloud agent, so
it runs even when your phone is closed). Set up one automation per posting slot,
or one with a cron that fires several times a day.

1. Go to **[cursor.com/automations](https://cursor.com/automations)** → **New**
   (or use the `/automate` skill from an agent session).
2. Trigger: **Scheduled**. Pick preset times or a custom cron. For three slots a
   day, e.g. `0 9,13,18 * * *` (9am, 1pm, 6pm) — set your timezone.
3. Repository: attach **this repo** so it can read your voice profile, commands,
   and post archive.
4. Prompt: paste this —

   ```
   Run /x-posts. Deliver today's batch of copy-paste-ready X posts for
   @HixonStudio following the command's workflow exactly. Then commit the
   archive file you create under x-content/posts/.
   ```

5. (Optional) Add the **Send to Slack** tool, or have it open a tiny PR, so the
   drafts land somewhere you'll see them.
6. Save and activate.

> Notes
> - Automations run as cloud agents in Max Mode and use cloud-agent usage.
> - Automation config (and rules/skills/secrets) is managed on the web, not in the
>   mobile app — but once set up, runs and results show up on mobile.
> - A scheduled run "may run with a delay but will not start before the indicated
>   time," so treat slots as "around 9am," not to-the-second.

### Want the drafts pushed to you?

Two easy patterns:

- **Slack/notification:** add the Slack tool to the automation; you get the batch
  as a message and copy from there.
- **Commit to the repo:** have the automation save each batch to
  `x-content/posts/` (the prompt above does this). Open the repo on mobile, read
  the latest file, copy what you like. This also feeds the no-repeat memory.

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
