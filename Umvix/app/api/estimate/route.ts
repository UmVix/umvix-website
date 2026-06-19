import { NextRequest } from "next/server";
import { getAnthropicClient, CLAUDE_MODEL, UMVIX_CONTEXT } from "@/lib/anthropic";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `${UMVIX_CONTEXT}

You are an expert technical project estimator for Umvix. The user will describe a project idea. Analyze it and respond with ONLY a valid JSON object (no markdown, no code fences, no extra prose) with exactly these fields:
{
  "project_type": string,            // e.g. "Web Application", "Mobile App", "AI Chatbot"
  "estimated_timeline": string,      // e.g. "6-8 weeks"
  "complexity_level": string,        // one of: "Low", "Medium", "High", "Enterprise"
  "recommended_tech_stack": string[],// 3-6 technologies
  "key_considerations": string[]     // 3-5 short bullet points
}
Return strictly valid JSON and nothing else.`;

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found in response.");
  return JSON.parse(candidate.slice(start, end + 1));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const description: string = typeof body?.description === "string" ? body.description.trim() : "";

    if (description.length < 10) {
      return Response.json(
        { error: "Please describe your project in a little more detail." },
        { status: 400 }
      );
    }

    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: description }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const raw = textBlock && textBlock.type === "text" ? textBlock.text : "";
    const data = extractJson(raw);

    return Response.json({ estimate: data });
  } catch (error) {
    const isMissingKey =
      error instanceof Error && error.name === "MissingApiKeyError";
    return Response.json(
      {
        error: isMissingKey
          ? "The AI estimator is not configured yet."
          : "We couldn't generate an estimate right now. Please try again.",
      },
      { status: isMissingKey ? 503 : 500 }
    );
  }
}
