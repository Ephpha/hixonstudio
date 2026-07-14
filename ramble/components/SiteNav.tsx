import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#open-source", label: "Open source" },
];

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.04] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 sm:gap-3"
          aria-label="Ramble home"
        >
          <span className="relative inline-flex h-9 w-9 shrink-0 sm:h-[38px] sm:w-[38px]">
            <Image
              src="/app-icon.png"
              alt=""
              width={76}
              height={76}
              className="h-full w-full object-contain drop-shadow-[0_1px_1px_rgba(11,61,145,0.12),0_6px_16px_rgba(26,108,255,0.28)] transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              priority
              unoptimized
            />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-foreground sm:text-[16px]">
            Ramble
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13.5px] font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="https://github.com/Hixly/ramble"
            className="hidden text-[13.5px] font-medium text-muted transition-colors hover:text-foreground sm:inline"
          >
            GitHub
          </a>
          <a
            href="#waitlist"
            className="cta-pill !px-4 !py-2 text-[13px] sm:!px-5"
          >
            Start free
          </a>
        </div>
      </div>
    </header>
  );
}
