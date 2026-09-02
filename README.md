# hixon.studio

> Personal site, projects, and notes.

**Live:** [hixon.studio](https://hixon.studio)

![hixon.studio landing](.github/screenshot.png)

The home for everything I build. Portfolio, project log, blog, and the place I send people when they ask "what are you working on?"

## Pages

- `/` — landing
- `/projects` — everything I've shipped, with write-ups
- `/blog` — notes and essays, written in MDX
- `/about` — who I am
- `/contact` — form that actually reaches me (Resend)

## Built with

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4**
- **GSAP** for scroll + entrance animation
- **MDX** (`next-mdx-remote` + `gray-matter`) for blog content
- **Resend** for contact form email
- Custom typography: Fraunces, EB Garamond, Orbitron, Syncopate
- Deployed on **Vercel**

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
```

```bash
npm run build   # production build
npm test        # Jest + Testing Library
```

Local laptop agents live in [`harness/`](./harness). They are not part of the public site.
