# Topic Sources

Where `/x-posts` should look to figure out what's trending **today**, and how to
filter it down to things I can post about credibly. Edit the lists as your
interests shift.

---

## How to find "trending today"

The agent should pull *fresh* signals at run time (not from memory). In order of
preference:

1. **Web search** for the current date — e.g. "AI news today", "Hacker News top
   today", "trending in tech <today's date>", "<my niche> news".
2. **Exa MCP** (`web_search_exa`) if available, for recency-ranked results.
3. **Context7** for library/framework release notes when a post is about a tool.

Always confirm a topic is *actually from the last ~24–48h* before treating it as
trending. If you can't verify recency, label it as "evergreen" instead of
"trending" and pick from the evergreen angles below.

## My lanes (only post in these)

- AI products & agents (capabilities, launches, real-world use)
- Indie hacking / solo founders / building in public
- Developer tools & DX (editors, frameworks, CLIs)
- Design & taste in software
- Next.js / React / TypeScript / Vercel ecosystem
- Vision & camera tools (relevant to WhatColor)
- AI writing / email (relevant to Ephpha)
- Local-first / desktop AI (relevant to Duxy)
- Knowledge tools / note-taking / concept graphs (relevant to JotLabs)

## Accounts & sources worth scanning (signal, not gospel)

- Hacker News front page (news.ycombinator.com)
- Product Hunt daily (producthunt.com)
- Major AI labs' announcements (OpenAI, Anthropic, Google DeepMind, etc.)
- Vercel / Next.js release notes and changelogs
- Indie hacker / build-in-public conversation on X

> Treat these as inputs. Never quote or attribute claims you didn't verify.

## Trend → angle mapping

When a trend shows up, find *my* angle instead of just reporting it:

| If the trend is… | My angle is… |
| --- | --- |
| A new AI model / capability | What it actually changes for people building products |
| A big product launch | The taste/UX decision that made (or broke) it |
| A dev tool release | Whether it removes real friction or just adds surface area |
| AI hype / doom discourse | The calm builder's take: leverage, taste, shipping |
| Something in my exact lane (vision, AI email, notes) | Tie it to what I've learned building WhatColor / Ephpha / JotLabs |

## Recurring evergreen angles (fallback when nothing's trending)

- A concrete lesson from shipping one of my projects this week
- The gap between an AI demo and an AI product
- Why taste is the moat now that code is cheap
- A small DX/design detail that quietly matters
- An honest build-in-public update

## Do-not-post list

- Politics, culture-war bait, dunking on individuals
- Unverified rumors or leaked specs
- Anything that reads as engagement farming
- Crypto/token promotion
- Reposting someone else's insight as my own
