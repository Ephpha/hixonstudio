import type { Metadata } from "next";
import BlogClient from "@/components/BlogClient";

const title = "Writing";
const description =
  "Longer pieces and process notes on what I'm building, what I'm learning, and the rabbit holes I keep falling into.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `${title} — Hixon.Studio`,
    description,
    url: "/blog",
    type: "website",
  },
  twitter: { title: `${title} — Hixon.Studio`, description },
};

export default function BlogPage() {
  return <BlogClient />;
}
