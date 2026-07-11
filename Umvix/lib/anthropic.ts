import Anthropic from "@anthropic-ai/sdk";

export const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

let client: Anthropic | null = null;

/**
 * Returns a singleton Anthropic client. Throws a typed error when the API key
 * is not configured so route handlers can surface a friendly fallback state.
 */
export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    const error = new Error("ANTHROPIC_API_KEY is not configured.");
    error.name = "MissingApiKeyError";
    throw error;
  }

  if (!client) {
    client = new Anthropic({ apiKey });
  }

  return client;
}

export const UMVIX_CONTEXT = `You are the AI assistant for Umvix, a premium IT agency.

About Umvix:
- Services: Web Development (Next.js/React), Mobile App Development (iOS, Android, React Native, Flutter), AI Chatbot Development (LLM/GPT integrations), AI Automation & Workflows (Zapier, Make.com, custom Python), and Custom Dashboards/SaaS platforms.
- Track record: 30+ projects delivered, 17+ clients served across 9+ countries, 8+ years of experience, 25+ AI models integrated.
- Process: Discovery & strategy, design & prototyping, agile development, QA, launch, and ongoing support.
- Pricing approach: Project-based pricing scoped to complexity. Typical engagements range from $1,000 to $50,000+. We provide free initial consultations and detailed quotes after understanding requirements.
- Contact: info@umvix.com, +92-316 5310133.
- Offices: Morgenbreede 29, Bielefeld 33615, Germany · Blue Area, Islamabad, Pakistan.`;
