# DemoBro

> [demobro.video](https://demobro.video) — turn a raw screen recording into a polished 60-second demo.

Two inputs, no forms: an MP4 and a GitHub repo URL. Built for developers who just finished a hackathon project and have 90 minutes before the deadline.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind
- **Supabase** — Postgres job queue + Storage
- **Railway** — `web` + `worker` (ffmpeg) + hourly cleanup cron

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
```

## Design tokens

- Background: `#FAF9F6`
- Text: `#141414`
- Accent: `#289ffa`
- Headings / wordmark: Space Grotesk
