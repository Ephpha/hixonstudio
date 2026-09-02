import type { Metadata } from "next";
import HarnessClient from "@/components/HarnessClient";
import { getHarnessStatus } from "@/lib/harness/ollama";

export const dynamic = "force-dynamic";

const title = "Harness";
const description =
  "Local coding and language agents for Hixon.Studio. Runs on this machine through Ollama.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  alternates: { canonical: "/harness" },
  openGraph: {
    title: `${title} — Hixon.Studio`,
    description,
    url: "/harness",
    type: "website",
  },
  twitter: { title: `${title} — Hixon.Studio`, description },
};

export default async function HarnessPage() {
  const initialStatus = await getHarnessStatus();
  return <HarnessClient initialStatus={initialStatus} />;
}
