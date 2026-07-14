import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#open-source", label: "Open source" },
];

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Ramble"
            width={34}
            height={34}
            className="h-[34px] w-[34px] object-contain"
            priority
            unoptimized
          />
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
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
          <a href="#waitlist" className="cta-pill !px-4 !py-2 text-[13px] sm:!px-5">
            Start free
          </a>
        </div>
      </div>
    </header>
  );
}
