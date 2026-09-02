import type { Metadata } from "next";
import "@fontsource/fraunces/300-italic.css";
import "@fontsource/fraunces/400-italic.css";
import "@fontsource/fraunces/700-italic.css";
import "@fontsource/syncopate/400.css";
import "./globals.css";
import StarCanvas from "@/components/StarCanvas";

export const metadata: Metadata = {
  title: "Hixon Harness",
  description: "Local coding and language agents. Runs on this laptop through Ollama.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden">
        <StarCanvas />
        <header
          className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4"
          style={{
            background: "rgba(6,6,8,0.8)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p
            style={{
              fontFamily: "Syncopate, sans-serif",
              fontSize: "clamp(0.65rem, 2.5vw, 0.8rem)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Hixon.Studio · Local
          </p>
        </header>
        <main className="relative pt-20" style={{ zIndex: 10 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
