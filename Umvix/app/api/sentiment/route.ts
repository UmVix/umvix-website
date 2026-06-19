import { NextRequest } from "next/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";

export const runtime = "nodejs";

const VALID = ["excited", "unsure", "urgent", "calm", "neutral"] as const;
type Mood = (typeof VALID)[number];

/** Lightweight keyword fallback so the easter egg still works without the API. */
function keywordMood(text: string): Mood {
  const t = text.toLowerCase();
  if (/(excit|pumped|stoked|can't wait|amazing|love|thrilled)/.test(t)) return "excited";
  if (/(urgent|asap|deadline|now|rush|quick|immediately)/.test(t)) return "urgent";
  if (/(unsure|not sure|maybe|confus|worried|nervous|hesitant|doubt)/.test(t)) return "unsure";
  if (/(calm|relax|no rush|whenever|chill|easy)/.test(t)) return "calm";
  return "neutral";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const text: string = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return Response.json({ error: "Tell us how you're feeling." }, { status: 400 });
  }

  try {
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 16,
      system: `Classify the user's feeling about their project into exactly one word from this list: excited, unsure, urgent, calm, neutral. Respond with ONLY that single word, lowercase.`,
      messages: [{ role: "user", content: text }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const raw =
      textBlock && textBlock.type === "text"
        ? textBlock.text.trim().toLowerCase()
        : "";
    const mood = (VALID as readonly string[]).includes(raw)
      ? (raw as Mood)
      : keywordMood(text);

    return Response.json({ mood, source: "ai" });
  } catch {
    return Response.json({ mood: keywordMood(text), source: "fallback" });
  }
}
