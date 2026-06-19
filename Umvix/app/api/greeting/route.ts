import { NextRequest } from "next/server";
import { getAnthropicClient, CLAUDE_MODEL, UMVIX_CONTEXT } from "@/lib/anthropic";

export const runtime = "nodejs";

const FALLBACKS: Record<string, string[]> = {
  morning: [
    "Good morning — let's build something the internet hasn't seen yet.",
    "Rise and architect. Your next big idea starts here.",
  ],
  afternoon: [
    "Good afternoon — perfect time to turn ambition into shipping code.",
    "Midday momentum: let's engineer your edge.",
  ],
  evening: [
    "Good evening — the best ideas happen after hours. Let's build.",
    "Evening innovator, welcome. Let's make something brilliant.",
  ],
  night: [
    "Burning the midnight oil? So do great products. Let's create.",
    "Late-night builders welcome — let's ship something bold.",
  ],
};

function partOfDay(hour: number): keyof typeof FALLBACKS {
  if (hour < 6) return "night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const hour = typeof body?.hour === "number" ? body.hour : new Date().getHours();
  const period = partOfDay(hour);

  try {
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 80,
      system: `${UMVIX_CONTEXT}\n\nYou write a single witty, premium one-line greeting for the Umvix homepage hero. It should feel fresh and confident, subtly reference the time of day, and be under 12 words. Return ONLY the greeting text — no quotes, no preamble.`,
      messages: [
        {
          role: "user",
          content: `It is currently the ${period}. Write one fresh hero greeting.`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const greeting =
      textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";

    if (!greeting) throw new Error("Empty greeting");

    return Response.json({ greeting, source: "ai" });
  } catch {
    const pool = FALLBACKS[period];
    const greeting = pool[Math.floor(Math.random() * pool.length)];
    return Response.json({ greeting, source: "fallback" });
  }
}
