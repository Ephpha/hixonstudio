import {
  buildChatPayload,
  parseChatRequest,
  parseOllamaChatLine,
} from "@/lib/harness/agents";
import { ollamaChatUrl, unloadSibling } from "@/lib/harness/ollama";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseChatRequest(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  await unloadSibling(parsed.agent.id);

  const payload = buildChatPayload(parsed.agent, parsed.messages);
  let upstream: Response;
  try {
    upstream = await fetch(ollamaChatUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: req.signal,
    });
  } catch {
    return Response.json(
      { error: "Ollama is offline. Start it on this machine, then try again." },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    let detail = `Ollama returned ${upstream.status}.`;
    try {
      const errBody = (await upstream.json()) as { error?: string };
      if (errBody.error) detail = errBody.error;
    } catch {
      // keep the status text
    }
    return Response.json({ error: detail }, { status: 502 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";

      const send = (event: { type: string; text?: string; error?: string }) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const event = parseOllamaChatLine(line);
            if (!event) continue;
            if (event.type === "error") {
              send(event);
              controller.close();
              return;
            }
            send(event);
          }
        }

        const last = parseOllamaChatLine(buffer);
        if (last) send(last);
        send({ type: "done" });
        controller.close();
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          controller.close();
          return;
        }
        send({ type: "error", error: "Stream dropped." });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
