"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 sm:px-8 py-4"
      style={{
        background: "rgba(6,6,8,0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Link
        href="/"
        className="mr-auto transition-opacity hover:opacity-60"
        style={{
          fontFamily: "Monowire, sans-serif",
          fontStyle: "normal",
          fontSize: "clamp(0.65rem, 2.5vw, 0.85rem)",
          color: "#fff",
          letterSpacing: "0.12em",
        }}
      >
        Hixon.Studio
      </Link>

      <div className="flex items-center gap-4 sm:gap-8">
        {links.map(({ href, label }) => {
          const active =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="relative text-xs tracking-widest uppercase transition-colors"
              style={{
                color: active ? "#fff" : "rgba(255,255,255,0.35)",
              }}
            >
              {label}
              {active && (
                <span
                  className="absolute left-0 right-0"
                  style={{
                    bottom: "-2px",
                    height: "1px",
                    background: "#fff",
                    display: "block",
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
