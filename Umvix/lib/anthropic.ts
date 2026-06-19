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
- Track record: 150+ projects delivered, 80+ happy clients, 8+ years of experience, 25+ AI models integrated.
- Process: Discovery & strategy, design & prototyping, agile development, QA, launch, and ongoing support.
- Pricing approach: Project-based pricing scoped to complexity. Typical engagements range from $1,000 to $50,000+. We provide free initial consultations and detailed quotes after understanding requirements.
- Contact: hello@umvix.com, +1 (555) 123-4567.`;
