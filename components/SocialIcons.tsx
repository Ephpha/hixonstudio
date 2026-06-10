"use client";

type IconKey = "github" | "x" | "substack" | "hackernoon" | "email";

type SocialLink = {
  key: IconKey;
  label: string;
  href: string;
};

const links: SocialLink[] = [
  { key: "github", label: "GitHub", href: "https://github.com/Hixly" },
  { key: "x", label: "X", href: "https://x.com/HixonStudio" },
  { key: "substack", label: "Substack", href: "https://substack.com/@hunchohix" },
  { key: "hackernoon", label: "HackerNoon", href: "https://hackernoon.com/u/hixon" },
  { key: "email", label: "Email", href: "mailto:matthix96@gmail.com" },
];

function Icon({ k, size = 16 }: { k: IconKey; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
    style: { display: "block" },
  } as const;

  if (k === "github") {
    return (
      <svg {...common}>
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.35.78 1.04.78 2.1v3.11c0 .31.21.67.8.56C20.21 21.38 23.5 17.08 23.5 12c0-6.35-5.15-11.5-11.5-11.5z" />
      </svg>
    );
  }
  if (k === "x") {
    return (
      <svg {...common}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (k === "substack") {
    return (
      <svg {...common}>
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
      </svg>
    );
  }
  if (k === "hackernoon") {
    return (
      <svg {...common}>
        <path d="M4.5 3.2h2.7v7.5c.7-1.2 2-1.9 3.6-1.9 2.7 0 4.5 1.7 4.5 4.4V20.8h-2.7v-6.4c0-1.6-.9-2.6-2.4-2.6-1.6 0-3 1.1-3 3v6h-2.7V3.2z" />
      </svg>
    );
  }
  // email
  return (
    <svg {...common}>
      <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
    </svg>
  );
}

export default function SocialIcons({ size = 16 }: { size?: number }) {
  return (
    <div
      className="inline-flex items-center gap-3 sm:gap-4 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full"
      style={{
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {links.map((link) => (
        <a
          key={link.key}
          href={link.href}
          target={link.key === "email" ? undefined : "_blank"}
          rel={link.key === "email" ? undefined : "noopener noreferrer"}
          aria-label={link.label}
          title={link.label}
          className="transition-colors"
          style={{ color: "rgba(255,255,255,0.55)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
          }
        >
          <Icon k={link.key} size={size} />
        </a>
      ))}
    </div>
  );
}
