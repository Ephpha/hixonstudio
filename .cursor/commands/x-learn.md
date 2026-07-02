# /x-learn — Refresh voice profile from my real X posts

Use the **X API MCP** (if connected) to pull my recent `@HixonStudio` posts and
update `x-content/voice-profile.md` so `/x-posts` sounds more like me.

Optional argument = how many posts to analyze (default 20).

## Before you start

1. Check whether the **xapi** MCP server is available (Settings → MCP, green dot).
2. If MCP is **not** available, stop and tell me to set it up using
   `x-content/x-mcp-setup.md`. Do not guess my voice from memory.

## What to do

1. Read the current `x-content/voice-profile.md`.
2. Via X MCP, fetch my **recent posts** as `@HixonStudio` (user timeline / my posts).
   Pull the last 15–30 originals if possible; skip pure retweets when you can tell.
3. Analyze patterns:
   - sentence length, rhythm, how I open posts
   - emoji habits (which ones, how often)
   - `&`, ALL-CAPS emphasis, loose punctuation
   - question vs statement ratio
   - topics I actually post about
4. Propose **precise edits** to `voice-profile.md`:
   - update Tone & style + Mechanics if patterns shifted
   - replace or add **Examples** with 5–8 real posts (verbatim)
   - update **Topics I'm credible on** if needed
   - keep hard guardrails (no invented metrics, no mean dunking, frame rumors as questions)
5. Show me a short summary of what changed and why.
6. Write the updated `x-content/voice-profile.md`.

## Rules

- Use **verbatim post text** in examples — don't paraphrase my best posts.
- Don't delete my project list or do-not-post list without a good reason.
- If I have fewer than 10 recent originals, say so and work with what you have.
