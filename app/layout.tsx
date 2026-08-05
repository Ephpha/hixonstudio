import type { Metadata } from "next";
import { IBM_Plex_Mono, Source_Sans_3, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://demobro.video"),
  title: {
    default: "DemoBro",
    template: "%s — DemoBro",
  },
  description:
    "Turn a raw screen recording into a polished 60-second demo. Drop an MP4, paste a GitHub repo, generate.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DemoBro",
    description:
      "Turn a raw screen recording into a polished 60-second demo. Drop an MP4, paste a GitHub repo, generate.",
    url: "https://demobro.video",
    siteName: "DemoBro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DemoBro",
    description:
      "Turn a raw screen recording into a polished 60-second demo.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${sourceSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
