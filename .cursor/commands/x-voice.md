# /x-voice — Tune my X voice profile

Use this to teach the system how I actually sound, or to course-correct after a
batch missed. The goal is to keep `x-content/voice-profile.md` accurate so
`/x-posts` gets better over time.

Optional argument = what you want to do, e.g. `/x-posts` was too formal, or paste
sample tweets after the command.

## What to do

1. Read the current `x-content/voice-profile.md`.
2. Look at what I gave you:
   - **If I pasted real tweets (mine or ones I admire):** analyze them. Pull out
     concrete patterns — sentence length, rhythm, vocabulary, capitalization,
     how I open and close, what I never do. Quote 2-3 as new examples.
   - **If I gave feedback** (e.g. "too formal", "stop using em-dashes", "more
     build logs"): translate it into specific edits to the rules/tone sections.
   - **If I gave nothing:** ask me to paste 5-10 tweets that sound like me, then stop.
3. Propose precise edits to `voice-profile.md` (tone, hard rules, examples,
   anti-examples, topics). Show the diff in plain terms.
4. On my OK, write the changes to `x-content/voice-profile.md`.

## Rules

- Only change what the evidence/feedback supports. Don't rewrite my voice from scratch.
- Keep the "hard rules" list short and enforceable.
- Prefer adding real examples over abstract description — examples train better.
- Never delete my do-not-post / topics-to-avoid lists without me saying so.
