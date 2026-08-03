import type { Metadata } from "next";
import ContactClient from "@/components/ContactClient";

const title = "Contact";
const description =
  "Get in touch with Hix — about a project, an idea, collaborating, or just to say hello.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `${title} — Hixon.Studio`,
    description,
    url: "/contact",
    type: "website",
  },
  twitter: { title: `${title} — Hixon.Studio`, description },
};

export default function ContactPage() {
  return <ContactClient />;
}
