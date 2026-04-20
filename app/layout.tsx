import type { Metadata } from "next";
// Monowire loaded via @font-face in globals.css
import "@fontsource/fraunces/300.css";
import "@fontsource/fraunces/300-italic.css";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/400-italic.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/fraunces/700-italic.css";
import "./globals.css";
import StarCanvas from "@/components/StarCanvas";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

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
        <Footer />
      </body>
    </html>
  );
}
