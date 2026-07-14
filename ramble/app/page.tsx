import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import HeroVisual from "@/components/HeroVisual";

const features = [
  {
    eyebrow: "Listen",
    title: "One big button. That’s the product.",
    body: "Tap Listen and ramble. No outline, no blank page, no blinking cursor daring you to start writing.",
    points: [
      "Phone-first capture in seconds",
      "Keeps your raw voice intact",
      "Feels like talking, not drafting",
    ],
  },
  {
    eyebrow: "Folders",
    title: "Every subject gets its own room.",
    body: "Create folders for the things you keep returning to. Rename them. Keep rambles organized instead of dumped.",
    points: [
      "New folder per topic or series",
      "Rename anytime",
      "Drafts stay with the ramble that made them",
    ],
  },
  {
    eyebrow: "Publish-ready",
    title: "X posts and Substack articles, cleaned up.",
    body: "Ramble turns loose speech into a clean cut draft for the channel you want — short for X, long-form for Substack.",
    points: [
      "Platform-aware structure",
      "Your ideas, tighter prose",
      "Copy, edit, ship",
    ],
  },
];

const steps = [
  {
    n: "01",
    title: "Ramble",
    body: "Hit Listen and talk the idea out loud — messy is fine.",
  },
  {
    n: "02",
    title: "Shape",
    body: "Choose X or Substack. Ramble forms a clean article from the recording.",
  },
  {
    n: "03",
    title: "File it",
    body: "Park it in a folder. Rename, revisit, publish when it feels right.",
  },
];

export default function Home() {
  return (
    <>
      <SiteNav />

      <main className="flex-1">
        {/* Hero visual — MiroMiro-style first viewport composition */}
        <section className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 sm:pt-7">
          <HeroVisual />
        </section>

        {/* Hero copy */}
        <section className="mx-auto max-w-3xl px-4 pb-16 pt-10 text-center sm:px-6 sm:pb-24 sm:pt-14">
          <p className="fade-up text-[12px] font-semibold uppercase tracking-[0.2em] text-muted-2">
            Open-source voice writing
          </p>
          <h1
            className="fade-up fade-up-delay-1 mt-4 text-[clamp(2.4rem,7vw,4.35rem)] leading-[1.05] tracking-[-0.03em] text-foreground"
            style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}
          >
            Stop staring at a blank page.
            <br />
            <span className="brand-text italic">Just ramble.</span>
          </h1>
          <p className="fade-up fade-up-delay-2 mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            For people who want to write articles but hate writing and typing.
            Speak freely. Get a clean X post or Substack article back.
          </p>
          <div className="fade-up fade-up-delay-3 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#waitlist" className="cta-pill min-w-[168px]">
              <MicIcon />
              Start rambling
            </a>
            <a
              href="#how"
              className="inline-flex min-w-[168px] items-center justify-center rounded-full border border-border bg-white px-5 py-2.5 text-[0.9rem] font-semibold text-foreground transition-colors hover:bg-surface"
            >
              See how it works
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted-2">
            <span className="inline-flex items-center gap-1.5">
              <Dot /> Built for phones
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Dot /> Folder-organized
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Dot /> MIT open source
            </span>
          </div>
        </section>

        {/* Social proof strip */}
        <section className="border-y border-border bg-surface/70">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left">
            <p
              className="text-xl text-foreground sm:text-2xl"
              style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}
            >
              Made for builders who think out loud.
            </p>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Same scenario as you: ideas show up while walking, mid-shift, or
              away from a keyboard — Ramble catches them before they disappear.
            </p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-muted-2">
              Features
            </p>
            <h2
              className="mt-3 text-[clamp(2rem,4.5vw,3rem)] leading-[1.1] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}
            >
              The design you speak is the draft you get
            </h2>
          </div>

          <div className="mt-14 flex flex-col gap-16 sm:mt-20 sm:gap-24">
            {features.map((feature, index) => (
              <article
                key={feature.eyebrow}
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                  index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-mid">
                    {feature.eyebrow}
                  </p>
                  <h3
                    className="mt-3 text-[clamp(1.7rem,3vw,2.35rem)] leading-[1.15] tracking-[-0.02em]"
                    style={{
                      fontFamily: "var(--font-instrument), Georgia, serif",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted">
                    {feature.body}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {feature.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm text-foreground/85"
                      >
                        <CheckIcon />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <FeaturePanel index={index} />
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-y border-border bg-surface/60">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-muted-2">
                How it works
              </p>
              <h2
                className="mt-3 text-[clamp(2rem,4.5vw,3rem)] leading-[1.1] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}
              >
                Three steps. No blank page.
              </h2>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3 sm:gap-5">
              {steps.map((step) => (
                <div
                  key={step.n}
                  className="rounded-3xl border border-border bg-white p-6 shadow-[0_10px_30px_rgba(15,40,100,0.04)]"
                >
                  <p className="text-[12px] font-semibold tracking-[0.16em] text-brand-mid">
                    {step.n}
                  </p>
                  <h3
                    className="mt-3 text-2xl tracking-tight"
                    style={{
                      fontFamily: "var(--font-instrument), Georgia, serif",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open source */}
        <section id="open-source" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(160deg,#071536_0%,#0b3d91_42%,#1a6cff_100%)] px-6 py-12 text-white shadow-[0_24px_60px_rgba(11,61,145,0.28)] sm:rounded-[2.5rem] sm:px-12 sm:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/65">
                  Open source
                </p>
                <h2
                  className="mt-3 text-[clamp(2rem,4vw,3rem)] leading-[1.1]"
                  style={{
                    fontFamily: "var(--font-instrument), Georgia, serif",
                  }}
                >
                  Built in the open for people like you.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
                  Ramble is an open-source tool — self-host it, bring your own
                  keys, fork the prompts, make it yours. Premium feel. No
                  vibe-coded junk drawer.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="https://github.com/Hixly/ramble"
                    className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0b3d91] transition hover:bg-white/92"
                  >
                    View on GitHub
                  </a>
                  <a
                    href="#waitlist"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/16"
                  >
                    Join the waitlist
                  </a>
                </div>
              </div>
              <div className="justify-self-center">
                <Image
                  src="/logo.png"
                  alt="Ramble"
                  width={180}
                  height={180}
                  className="h-40 w-40 drop-shadow-2xl sm:h-44 sm:w-44"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist */}
        <section id="waitlist" className="border-t border-border bg-surface/70">
          <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6 sm:py-24">
            <h2
              className="text-[clamp(2rem,4vw,2.75rem)] leading-[1.1] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}
            >
              Get early access
            </h2>
            <p className="mt-3 text-muted">
              Leave your email. We’ll send the first build when Listen is ready.
            </p>
            <form
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              action="mailto:ephpha.ai@yahoo.com"
              method="get"
            >
              <input type="hidden" name="subject" value="Ramble waitlist" />
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="body"
                type="email"
                required
                placeholder="you@email.com"
                className="h-12 flex-1 rounded-full border border-border bg-white px-5 text-sm outline-none ring-brand-bright/40 transition focus:ring-4"
              />
              <button type="submit" className="cta-pill h-12 px-6">
                Notify me
              </button>
            </form>
            <p className="mt-3 text-xs text-muted-2">
              No spam. Just ship notes when Ramble moves.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt=""
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="text-sm font-semibold">Ramble</span>
          </div>
          <p className="text-xs text-muted-2">
            Speak freely. Publish clean. Open source by{" "}
            <a
              href="https://hixon.studio"
              className="underline decoration-border underline-offset-2 hover:text-foreground"
            >
              Hixon.Studio
            </a>
            .
          </p>
        </div>
      </footer>
    </>
  );
}

function FeaturePanel({ index }: { index: number }) {
  const panels = [
    <div
      key="listen"
      className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,#071536,#0b3d91_45%,#2ec5ff)] p-8 shadow-[var(--shadow-soft)]"
    >
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(/hero-texture.jpg)", backgroundSize: "cover" }} />
      <button
        type="button"
        className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white text-[#0b3d91] shadow-2xl transition hover:scale-[1.03]"
        aria-label="Listen"
      >
        <MicIcon className="h-8 w-8" />
        <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em]">
          Listen
        </span>
      </button>
    </div>,
    <div
      key="folders"
      className="min-h-[280px] rounded-[2rem] border border-border bg-white p-6 shadow-[var(--shadow-soft)]"
    >
      <div className="space-y-3">
        {["Product ideas", "Substack drafts", "Shift notes"].map((name, i) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3"
            style={{ opacity: 1 - i * 0.08 }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient text-white">
                <FolderIcon />
              </span>
              <div>
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-muted-2">{3 - i} rambles</p>
              </div>
            </div>
            <span className="text-xs font-medium text-muted-2">Rename</span>
          </div>
        ))}
      </div>
    </div>,
    <div
      key="publish"
      className="min-h-[280px] rounded-[2rem] border border-border bg-white p-6 shadow-[var(--shadow-soft)]"
    >
      <div className="flex gap-2">
        <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-white">
          X post
        </span>
        <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted">
          Substack
        </span>
      </div>
      <div className="mt-5 space-y-3">
        <div className="h-3 w-[80%] rounded-full bg-foreground/90" />
        <div className="h-3 w-full rounded-full bg-border" />
        <div className="h-3 w-[92%] rounded-full bg-border" />
        <div className="h-3 w-[70%] rounded-full bg-border" />
        <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-2">
            From your ramble
          </p>
          <p
            className="mt-2 text-lg leading-snug text-foreground"
            style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}
          >
            Anyone can generate words. Not everyone can decide what should exist.
          </p>
        </div>
      </div>
    </div>,
  ];

  return panels[index] ?? null;
}

function MicIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M7 11a5 5 0 0 0 10 0" />
      <path d="M12 16v4" />
      <path d="M9 20h6" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 8.5A2.5 2.5 0 0 1 5.5 6H9l2 2h7.5A2.5 2.5 0 0 1 21 10.5v6A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-brand-mid"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 rounded-full brand-gradient" />;
}
