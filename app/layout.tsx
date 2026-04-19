import type { Metadata } from "next";
import "@fontsource/eb-garamond/400.css";
import "@fontsource/eb-garamond/400-italic.css";
import "@fontsource/eb-garamond/700.css";
import "./globals.css";
import StarCanvas from "@/components/StarCanvas";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Hixon.Studio",
  description: "AI developer. Builder. Making things worth using.",
  openGraph: {
    title: "Hixon.Studio",
    description: "AI developer. Builder. Making things worth using.",
    url: "https://hixon.studio",
    siteName: "Hixon.Studio",
  },
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
        <Nav />
        <main className="relative pt-20" style={{ zIndex: 10 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
