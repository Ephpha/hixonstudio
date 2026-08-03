import type { Metadata } from "next";
import AboutClient from "@/components/AboutClient";

const title = "About";
const description =
  "I'm Hix. I build under Hixon.Studio — a place to test ideas, ship them publicly, and figure things out in the open. How I got from curiosity about AI to shipping software.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${title} — Hixon.Studio`,
    description,
    url: "/about",
    type: "profile",
  },
  twitter: { title: `${title} — Hixon.Studio`, description },
};

export default function AboutPage() {
  return <AboutClient />;
}
