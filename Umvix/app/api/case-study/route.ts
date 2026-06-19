import { NextRequest } from "next/server";
import { getAnthropicClient, CLAUDE_MODEL, UMVIX_CONTEXT } from "@/lib/anthropic";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `${UMVIX_CONTEXT}

You are a senior content strategist at Umvix writing polished portfolio case studies. Given a project name, brief description, and tech stack, write a compelling case study. Respond with ONLY a valid JSON object (no markdown, no code fences, no extra prose) with exactly these fields:
{
  "headline": string,        // punchy one-line headline
  "problem": string,         // 2-3 sentences on the client's challenge
  "solution": string,        // 2-4 sentences on what Umvix built and how
  "results": string[],       // 3-4 concrete, results-oriented bullet points (use realistic metrics)
  "tech_stack": string[]     // the technologies used
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
    const name: string = typeof body?.name === "string" ? body.name.trim() : "";
    const description: string = typeof body?.description === "string" ? body.description.trim() : "";
    const techStack: string = typeof body?.techStack === "string" ? body.techStack.trim() : "";

    if (!name || description.length < 10) {
      return Response.json(
        { error: "Please provide a project name and a brief description." },
        { status: 400 }
      );
    }

    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Project name: ${name}\nDescription: ${description}\nTech stack: ${techStack || "(not specified)"}`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const raw = textBlock && textBlock.type === "text" ? textBlock.text : "";
    const data = extractJson(raw);

    return Response.json({ caseStudy: data });
  } catch (error) {
    const isMissingKey =
      error instanceof Error && error.name === "MissingApiKeyError";
    return Response.json(
      {
        error: isMissingKey
          ? "The AI case study generator is not configured yet."
          : "We couldn't generate a case study right now. Please try again.",
      },
      { status: isMissingKey ? 503 : 500 }
    );
  }
}
