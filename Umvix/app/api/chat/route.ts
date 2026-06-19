import { NextRequest } from "next/server";
import { getAnthropicClient, CLAUDE_MODEL, UMVIX_CONTEXT } from "@/lib/anthropic";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `${UMVIX_CONTEXT}

You are a friendly, concise virtual assistant on the Umvix website. Answer questions about our services, pricing approach, and process. Keep responses short (2-4 sentences) and conversational. Encourage users to reach out via the contact page for a detailed quote. Never invent specific prices beyond the general ranges provided.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = getAnthropicClient();

    const stream = await client.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (err) {
          controller.enqueue(
            encoder.encode("\n\n[Connection interrupted. Please try again.]")
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    const isMissingKey =
      error instanceof Error && error.name === "MissingApiKeyError";
    return new Response(
      JSON.stringify({
        error: isMissingKey
          ? "The AI assistant is not configured yet."
          : "Something went wrong contacting the assistant.",
      }),
      {
        status: isMissingKey ? 503 : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
