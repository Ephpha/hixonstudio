# POPLINE — Product Design Spec

**Status:** Draft for review. Do not implement until this spec is approved.  
**Date:** 2026-08-27  
**Product:** A timed popping game built only for people who have an X account.  
**Recommended name:** POPLINE  
**One-liner:** Pop today's timeline sheet. Don't hit the ratios. Post the rank.

---

## 1. What this is (and is not)

This is a **new product** with its own domain, not a page on hixon.studio. Hixon.Studio stays the studio site. POPLINE ships as a standalone Next.js app, then gets listed on `/projects` once it is live.

It is **not** "virtual bubble wrap with a Twitter login bolted on." That product already exists in many forms. The original loop (timed pops → count → speed → global rank → share to X) is the right *distribution instinct* and the wrong *game*. This spec keeps the instinct and replaces the game with something X-native, shareable, and harder to clone.

Legal line we will not cross: **do not name the product "Bubble Wrap."** BUBBLE WRAP® is a Sealed Air trademark. Sealed Air has shipped official games under that name. Copy in the product says "sheet," "bubbles," "pops," "wrap" — never the two-word trademark as a brand.

X line we will not cross: this is not an official X product. No X logo in the wordmark. "Sign in with X" is the only official mark we use, as X documents it.

---

## 2. Research: the category is full, the viral loop is not

### 2.1 The popping game already exists

Browser and app stores are saturated with the exact toy described in the original idea:

| Product | What it already does |
| --- | --- |
| [Snap Bubbles](https://snapbubbles.com/) | Zen / speed / survival / **daily seeded challenge** (same bubbles for everyone at midnight UTC). No signup. Local best times. |
| [Vibe Arcade — Bubble Wrap Challenge](https://vibearcade.com/games/bubblewrapchallenge) | Timed classic mode, **BPM leaderboard**, combo window (800 ms), drag-to-pop, synthesized audio. |
| [Tembrica Bubble Wrap](https://tembrica.com/en/bubble-wrap) | Endless refill, calm mode, haptics, themes, lifetime counter. Published May 2026. |
| [Akousa Bubble Wrap](https://akousa.net/games/bubble-wrap) | Pop-all, personal stats, no real multiplayer. |
| [Bubble Wrap - Pop It (Play Store)](https://play.google.com/store/apps/details?id=cz.komurka.bubblewrap) | Timed challenge, scores, "compare with players around the world." |
| Steam *Bubble Wrap* (Donutask, 2024) and *Bubble POP IT ASMR* | Fidget / ASMR, not social. |

A timed pop-count + pop-speed + global rank game with no cultural hook is a clone of Vibe Arcade + Snap Bubbles. X login does not make that unique. It just adds a username to a commodity.

### 2.2 What actually went viral, and why

**Wordle** is the template to steal, not Cookie Clicker.

- Josh Wardle added a share button in mid-December 2021 *after* watching players type emoji grids by hand. The share is a **spoiler-free picture of the run**, not a brag about raw skill. ([Business Insider](https://www.businessinsider.com/wordle-game-viral-experts-psychology-sharing-twitter-2022-1))
- People post the grid because it is a **low-effort presence signal** ("I did today's thing"), not because 3/6 is impressive. A loss posts as readily as a win. ([DontSnooze](https://dontsnooze.io/blog/why-everyone-posts-wordle-score/))
- The squares are **instantly recognizable in a timeline** whether or not the viewer has played. That is the whole ad.

**Popcat.click** is the other lesson, and it is a warning:

- One click, one sound, a **tribal** leaderboard (country vs country), not "you vs 40,000 strangers." National pride, protests, and school bans drove it — not the clicker itself. ([Wikipedia: Popcat](https://en.wikipedia.org/wiki/Popcat), [Know Your Meme](https://knowyourmeme.com/memes/sites/popcatclick))
- It was also a **bot magnet**. Backend work batched clicks and rate-limited submissions. A global "most pops" board for individuals dies the first weekend someone writes an auto-clicker.

**Leaderboards and sharing, psychologically:**

- Leaderboards trigger automatic social comparison. High placement boosts competence; a giant global board full of gods **reduces** motivation for everyone else. ([Velez, 2018](https://gwern.net/doc/psychology/2018-velez.pdf))
- Sharing a result and getting a constructive reply raises self-esteem; getting dunked on does the opposite and correlates with worse outcomes. ([Nature Scientific Reports, 2025](https://www.nature.com/articles/s41598-025-17968-1)) Design the share so a mid run still looks like a joke worth posting, not a humiliation.

### 2.3 X in 2026 is a hostile, expensive API and a generous share button

This changes the original "post their score to X for them" plan.

**Pay-per-use (Feb 2026).** New developers buy credits. There is no free tier. Third-party rate cards verified against X docs in August 2026 ([bundle.social](https://bundle.social/blog/x-api-pricing-2026-costs-limits), [Blotato](https://www.blotato.com/blog/twitter-api-pricing)):

| Action | Approx. cost |
| --- | --- |
| Create a text post | **$0.015** |
| Create a post **that contains a URL** | **$0.200** (13×) |
| Read a user record | **$0.010** |
| Read a post | **$0.005** |

A viral loop that auto-posts "I scored 847, play here → link" on behalf of every player is a **$0.20-per-share** product. 10,000 shares in a good week is **$2,000 in API spend**, before retries. Quote-post and like/follow writes were also removed from self-serve tiers in April 2026 ([Blotato](https://www.blotato.com/blog/twitter-api-pricing)).

**Do not buy `tweet.write`.** Share with a Web Intent so the *user* posts:

```
https://x.com/intent/post?text=...
```

Legacy `https://twitter.com/intent/tweet` still works. Intents need no OAuth, no credits, and the player can edit the copy. That is also more authentic: Wordle never tweeted *for* you.

**Do buy Sign in with X.** Auth.js ships a Twitter/X provider using OAuth 2.0 + PKCE. Default scopes: `users.read tweet.read offline.access`. Email is not available. Userinfo hits `https://api.x.com/2/users/me`. ([Auth.js Twitter provider](https://authjs.dev/getting-started/providers/twitter), [provider source](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/twitter.ts))

Sign-in will still cost a user-read (~$0.01) per profile fetch. That is acceptable. Storing handle, user id, and avatar after first login avoids repeat reads.

**X ranking, for the share card.** xAI open-sourced the For You ranker. Copy-link / share and quote/reply outweigh likes by a wide margin. Media that people dwell on and copy beats a naked number. ([xai-org/x-algorithm](https://github.com/xai-org/x-algorithm), [Foreground on weights](https://foreground.agency/blog/x-algorithm-ranking-weights)) So the share artifact must be a **recognizable image**, not a sentence of stats.

### 2.4 Cheating will happen on day one

Any client-submitted pop count is a lie waiting to happen. Public write-ups of web leaderboard games all converge on the same stack: HMAC session tokens, server wall-clock, one-time submit, reject impossible rates, treat the client score as a hint. ([DEV: CSS game anti-cheat](https://dev.to/raxxostudios/how-i-built-an-anti-cheat-system-for-a-css-game-3hm1), [authoritative servers](https://www.abratabia.com/multiplayer-web-games/authoritative-servers.php))

X login does **not** stop auto-clickers. It only names them.

---

## 3. Honest critique of the original idea

### Keep

- **Timed round.** Short sessions are how this spreads on a phone between posts.
- **X as the only identity.** Handle + avatar on the board is the whole social object. No email, no guest names, no Discord.
- **A rank people want to wear.** Titles beat raw numbers in screenshots.
- **Post-run share as the growth loop.** Correct instinct. Wordle proved it. The *artifact* is what we have to invent.

### Subtract (or the game stays generic)

| Original piece | Why it dies |
| --- | --- |
| Product named / described as "bubble wrap game" | Trademark risk + identical Google results. |
| Hero stats: pops **and** speed **and** rank as three equals | Wordle won with **one** readable artifact. Three numbers is a dashboard. |
| Infinite retries into a global "best ever" board | Auto-clicker high score. Also Snap Bubbles / Vibe Arcade. |
| App posts to X via the API | $0.20 per linked post; needs `tweet.write`; feels spammy; April 2026 write restrictions. |
| Sign-in wall before the player has felt a pop | Conversion killer. Let them feel the sheet, then lock **scoring**. |
| "X users only" as a hard club | Anyone can make an X account. The exclusivity is **identity + distribution**, not a bouncer. Don't fake scarcity. |
| Country / worldwide power ranking as the main board | Popcat already did tribes-by-country. X users compare **handles**, not flags. A global board of 50,000 names is where motivation goes to die. |
| Joke-inside-a-bubble / zen refill / pop-all | Already shipped by Vibe Arcade and Tembrica. |

### Add (this is the actual product)

1. **A daily sheet, same for everyone.** Midnight UTC seed, Wordle-style. Sharing is comparable.
2. **Ratio bubbles you must not pop.** Turns a clicker into a glance-and-go skill game. Auto-clickers that sweep the grid eat the penalty. The miss/hit pattern becomes the share grid.
3. **One hero outcome: Popper Rank (a title), backed by a single score.** Pops and rate are flavor on the recap, not the thing you post.
4. **Three boards, not one:** Today (global, resets), Your mutuals (the one that actually hurts), All-time titles (cosmetic, not a number race).
5. **Three runs a day, best counts.** Makes a bad first run postable. Limits farming.
6. **Web Intent share + generated card image.** Player posts. We never tweet.write.
7. **Server-authored sessions.** Client never submits a raw score we trust.
8. **Sound as a first-class feature.** If the pop isn't disgusting in a good way, nothing else matters.

---

## 4. Three approaches

### A — Original: timed fidget + X login + global power ranking

Ship a sheet, a timer, BPM, Sign in with X, a hall of fame.

- **Pros:** Fastest. Easy to explain.
- **Cons:** Indistinguishable from existing sites. Botted in a week. Share copy is "I clicked 400 times." Nobody quote-posts that.

### B — Daily Sheet (Wordle of the timeline) — **recommended**

One sheet per UTC day. Mix of live bubbles and ratio bubbles. Three attempts. Title + pattern card. Mutuals board. Intent share.

- **Pros:** Comparable runs, recognizable posts, anti-clicker baked into rules, titles people want, X-native without pretending to be X.
- **Cons:** Needs a daily seed pipeline, recap image generation, and honest anti-cheat. Slightly more design work than A.

### C — Tribal war (Popcat for X)

Pops go to a side: Followers vs following, or lists, or "lurkers vs reply guys." Real-time heat map.

- **Pros:** Spectacle. Memes. Screenshot of the war.
- **Cons:** Bot apocalypse. Mean. Hard to make a single run feel complete. Worse fit for a studio experiment that should feel sharp, not chaotic.

**Recommendation: B**, with one thin slice of C: the **mutuals board** is the tribal layer. You are not fighting Thailand. You are fighting the five people you actually know.

---

## 5. Name, theme, voice

### Name

**Primary: POPLINE**  
Pop + timeline. A verb and a place. Share line writes itself: "Just ran POPLINE."

| Candidate | Why it lost |
| --- | --- |
| POP'D / POPD | Skittles POP'd and M&M's POP'd own the search results. |
| WRAP / FEEDWRAP | Fine as a subtitle, mushy as a brand. |
| THE SHEET | Good ritual name, weak brand. Keep as in-game term. |
| AIRTIME | Clever (air in a bubble, airtime on X). Too many existing products. |
| Anything with "Bubble Wrap" | Trademark. |

**Alts if POPLINE is taken on the domain you want:** `SHEET` (thesheet.game), `FEEDWRAP`, `AIRTIME`.

**Handle / domain targets (check before build):** `@popline` · `popline.game` · `popline.app` · `getpopline.com`

**Tagline options (pick one at implementation):**

- "Pop today's timeline."
- "Don't hit the ratios."
- "The sheet is live."

### Theme

You are not popping packaging. You are **clearing today's For You sheet**.

Each bubble is a compressed post: a tiny avatar smear, a handle fragment, a like-count ghost. Most are noise (pop them). A few are **ratios** — bait, quote-dunks, community-note energy — marked so a human can see them and a sweeper-bot cannot be sure. Popping a ratio **hurts** the run. Leaving live posts unpopped also hurts. The skill is speed *with* discrimination.

Ranks are X vernacular, not military or esports:

| Title | Rough placement (today) |
| --- | --- |
| Lurker | Bottom half |
| Reply Guy | 50–25% |
| Quote Artist | 25–10% |
| Timeline Regular | 10–5% |
| Main Character | 5–1% |
| For You Phantom | Top 1% |
| Algorithm | #1 on today's sheet |

Titles can be retuned after the first week of real data. The list is the personality; the cutoffs are not sacred.

**Voice:** dry, short, a little mean, never corporate. Recap copy examples:

- "Main Character. You popped 312 and only ate two ratios. Disgusting."
- "Reply Guy. Fast hands, no taste."
- "Lurker. The sheet is still there. It knows."

No exclamation points in UI chrome. No "Congratulations!!"

---

## 6. Visual scheme

Built to screenshot well **inside a dark X timeline**. Hixon.Studio's serif luxury look does **not** carry over. This is a toy, not a studio.

### Color

| Token | Hex | Use |
| --- | --- | --- |
| Void | `#07070A` | Page, card, recap |
| Sheet | `#101014` | Playfield |
| Membrane | `#F4F1EA` | Unpopped bubble fill (warm white, not Twitter white) |
| Membrane-edge | `#D9D4C8` | Specular rim |
| Pop-flash | `#C8FF3A` | Acid lime. The one loud color. Pop burst, combo, rank badge |
| Ratio | `#FF3B5C` | Ratio bubbles, penalties, "don't" |
| Ghost | `#8A8A93` | Secondary type, unpopped remainder |
| Ink | `#F4F1EA` | Primary type |

Do **not** use Twitter/X blue (`#1D9BF0` / `#1DA1F2`) anywhere. It reads as official.

### Type

- **UI / rank / timer:** a condensed grotesque (e.g. *Druk*, *Impact*-adjacent, or *Syncopate* already on the studio site). All-caps ranks.
- **Body / recap insults:** a sharp sans (Inter or similar). Never Fraunces on this product.
- Timer is huge. Rank title is bigger than the numeric score.

### Playfield

- 8×10 sheet (80 cells) on mobile; 10×12 on desktop. Daily seed places 8–12 ratio cells.
- Bubbles are **slightly irregular circles** with a cheap plastic highlight, packed on a tight grid, rounded-rect sheet with a perforated edge (packaging, not a tweet client).
- Ratio bubbles: same membrane, but a thin **ratio** ring and a tiny "R" watermark. Readable in 200ms. Not a different color fill (that would make them trivial).
- Pop: 40–60ms scale-down, lime flash, pitch-varied pop. Ratio pop: same plus a red afterimage and a duller thud.
- Missed live bubbles at the buzzer stay unpopped (empty circles). Eaten ratios stay as red scars. That **pattern is the share grid**.

### Recap / share card (the actual growth asset)

Fixed 1:1 image, ~1200×1200, generated server-side as an OG image so X unfurls it.

```
POPLINE · 08.27
████████████  ← 8×10 cell grid, lime = popped, void = left,
████R███████     red R = eaten ratio, dim R = correctly skipped
...
MAIN CHARACTER
312 pops  ·  4.1/s  ·  2 ratios eaten
@handle
```

The grid must be readable at 120px wide in a timeline. If it isn't, the share failed.

### Motion

Fast and physical. No page-load hero animation. Respect `prefers-reduced-motion`: instant pops, no flash, still playable.

---

## 7. Game loop (v1)

```text
Land → 3-second feel-it sheet (unscored)
     → Sign in with X (required to start a counted run)
     → Today's sheet (same seed for all)
     → 30.00s clock, server-started
     → Recap: title + score + pattern
     → [Post to X] [Run again n/3] [Mutuals] [Today]
```

### Rules

- **Duration:** 30.00 seconds, started by the server when the run token is issued.
- **Live bubble:** pop = +1. Unpopped at buzzer = 0 (they just sit in the pattern).
- **Ratio bubble:** skip = safe (shown as a dim R in the recap). Pop = **−5** and a scar.
- **Score:** `(pops × 10) − (ratios_eaten × 50) + floor(pops_per_second × 20)`  
  Exact weights can be tuned in staging. The point: a clean slower run can beat a filthy sweep.
- **Attempts:** 3 per UTC day. Best score is the one that ranks and the one that shares by default.
- **Drag-to-pop:** allowed. It is how phones actually play. Ratios still count if the drag hits them — that's the skill.
- **No zen / endless / joke mode in v1.** One loop. Fidget is a competitor's product.

### Sign-in policy

- Feel-it sheet is anonymous and does not persist.
- Counted runs require a valid X session. Handle is the display name, avatar is the avatar, user id is the primary key.
- If they unlink X, scores stay but stop appearing on public boards until they reconnect (handle is the point).

### Boards

1. **Today** — best score on today's seed. Resets 00:00 UTC. Default public view: top 25 + your row.
2. **Mutuals** — people you follow who have played today. **v1.1**, not launch-blocking: needs `follows.read` and costs user/following reads. Launch can ship with an **opt-in handle search** ("add a rival") if follows.read is too expensive or too creepy on the consent screen.
3. **Titles** — highest title earned this week, shown as a badge on the profile chip. Not a numeric hall of fame.

A 10,000-row global all-time speed board is explicitly **out**.

---

## 8. Share loop (the viral machine)

After a counted run:

1. Render the recap card (OG image).
2. Primary button: **Post to X**. Opens

   `https://x.com/intent/post?text={copy}`

   Copy is short, spoiler-safe, and includes the title + date + site (the URL can live in the card image to dodge the "$0.20 if the tweet contains a URL" trap if we ever *did* API-post; with intents the player pays nothing, but keeping the tweet text URL-light still looks better).

   Example:

   ```
   POPLINE 08.27
   MAIN CHARACTER
   312  ·  2 ratios
   ```

3. Secondary: copy image / copy text.
4. We never post on their behalf. We never request `tweet.write`.

Unfurls: `popline.game/r/{runId}` with the OG image. That page is a silent recap plus **Play today's sheet**.

---

## 9. Anti-cheat (launch bar)

The client sends **inputs**, not a score.

- `POST /api/run/start` → HMAC-signed run token, server timestamp, seed id.
- Client streams pop events `{cellId, t}` in small batches (Popcat lesson: do not POST per pop).
- `POST /api/run/finish` once. Token is one-time. Server:
  - verifies signature and expiry (30s + 2s skew),
  - rejects duplicate cell pops,
  - rejects pop rates above a human ceiling (tune; start around 16 pops/s sustained),
  - rejects finishes faster than 30s wall-clock,
  - computes score from the event log + seed map,
  - stores the pattern for the card.
- Impossible runs are dropped silently (don't teach cheaters with error text).
- v1 does not need a full authoritative sim. It needs **unforgeable time + seed + one-shot token**.

---

## 10. Architecture (when we build)

Stay consistent with the studio stack: **Next.js App Router, TypeScript, Vercel**. Game state and scores in **Supabase** (already used on Hackyard / Pluit). Auth via **Auth.js Twitter/X provider**.

| Unit | Does | Depends on |
| --- | --- | --- |
| `auth` | Sign in with X, session, handle/avatar cache | Auth.js, X OAuth, `users.read` only |
| `seed` | Deterministic daily sheet (cell types from UTC date) | No I/O |
| `run` | Start/finish, HMAC token, event validate, score | `seed`, clock, secret |
| `board` | Today top N + your row | `run` rows |
| `card` | OG image for `/r/[id]` | `run` pattern |
| `share` | Intent URL builder | `card` public URL |
| `playfield` | Client sheet, audio, input, reduced motion | `run` token |

Do not put this inside the hixon.studio app router. New repo or `apps/popline` later. This spec lives here so the idea is versioned with the studio.

X API budget for v1: **sign-in user reads only**. No tweet writes, no timeline reads, no webhook.

---

## 11. v1 scope vs later

**v1 (this spec):** daily sheet, ratio cells, 3 runs, titles, today board, recap card, intent share, Sign in with X, anti-cheat, sound, mobile-first playfield.

**Explicitly later:** mutuals via `follows.read`, seasons, cosmetics, audio packs, challenge-a-handle links, week-long "Algorithm" crown, anything with `tweet.write`.

**Explicitly never in this product:** guest names, email magic links, Google login, zen mode as the homepage, "Bubble Wrap" in the brand, auto-posted tweets, all-time global pop count.

---

## 12. Success criteria

The idea is working if, two weeks after launch:

1. People post the **card**, not a screenshot of the HUD.
2. A mid-rank title still gets posted (Reply Guy energy is the Wordle 5/6).
3. The today board is not owned by identical 16 pops/s robots.
4. A stranger can understand the grid without loading the site.
5. X login is the only identity and nobody asks for a guest mode.

If those fail, do not add more modes. Fix the card, the titles, or the ratio readability.

---

## 13. Open decisions (locked unless you override)

These are chosen so implementation is not blocked:

- Name: **POPLINE**
- Approach: **B — Daily Sheet**
- Duration: **30s**, **3** attempts
- Identity: **Sign in with X only** for counted runs
- Share: **Web Intent**, never `tweet.write`
- Trademark: never "Bubble Wrap" as the product name
- Home of the code: **new app**, spec only in this repo for now

If you want a different name, more attempts, or mutuals at launch, say so before the implementation plan.

---

## Sources

- [Snap Bubbles](https://snapbubbles.com/)
- [Vibe Arcade Bubble Wrap Challenge](https://vibearcade.com/games/bubblewrapchallenge)
- [Tembrica Virtual Bubble Wrap](https://tembrica.com/en/bubble-wrap) (May–Jun 2026)
- [Akousa Bubble Wrap](https://akousa.net/games/bubble-wrap)
- [Bubble Wrap - Pop It (Google Play)](https://play.google.com/store/apps/details?id=cz.komurka.bubblewrap)
- [Sealed Air BUBBLE WRAP® brand](https://www.sealedair.com/products/brand/bubble-wrap)
- [Wikipedia: Bubble Wrap (brand)](https://en.wikipedia.org/wiki/Bubble_Wrap_(brand))
- [CIPO trademarks guide (bubble wrap as example of protected mark)](https://ised-isde.canada.ca/site/canadian-intellectual-property-office/en/trademarks/trademarks-guide)
- [Wordle virality, Business Insider](https://www.businessinsider.com/wordle-game-viral-experts-psychology-sharing-twitter-2022-1)
- [Why people post Wordle grids, DontSnooze](https://dontsnooze.io/blog/why-everyone-posts-wordle-score/)
- [Popcat, Wikipedia](https://en.wikipedia.org/wiki/Popcat)
- [Popcat.click, Know Your Meme](https://knowyourmeme.com/memes/sites/popcatclick)
- [Velez, Social Comparisons and Leaderboards (2018)](https://gwern.net/doc/psychology/2018-velez.pdf)
- [Sharing gaming accomplishments, Sci Rep 2025](https://www.nature.com/articles/s41598-025-17968-1)
- [X API pricing 2026, bundle.social](https://bundle.social/blog/x-api-pricing-2026-costs-limits)
- [X API pricing 2026, Blotato](https://www.blotato.com/blog/twitter-api-pricing)
- [Auth.js Twitter/X provider](https://authjs.dev/getting-started/providers/twitter)
- [next-auth Twitter provider source](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/twitter.ts)
- [X Web Intents / intent/post](https://neophyte.home.blog/2026/07/25/share-buttons-are-intent-urls/)
- [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm)
- [Foreground, X ranking weights](https://foreground.agency/blog/x-algorithm-ranking-weights)
- [DEV: anti-cheat for a CSS game](https://dev.to/raxxostudios/how-i-built-an-anti-cheat-system-for-a-css-game-3hm1)
- [Authoritative servers and anti-cheat](https://www.abratabia.com/multiplayer-web-games/authoritative-servers.php)
