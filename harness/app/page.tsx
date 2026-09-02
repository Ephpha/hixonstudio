import HarnessClient from "@/components/HarnessClient";
import { getHarnessStatus } from "@/lib/ollama";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialStatus = await getHarnessStatus();
  return <HarnessClient initialStatus={initialStatus} />;
}
