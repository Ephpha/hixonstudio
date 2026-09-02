import { getHarnessStatus } from "@/lib/harness/ollama";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await getHarnessStatus();
  return Response.json(status, {
    headers: { "Cache-Control": "no-store" },
  });
}
