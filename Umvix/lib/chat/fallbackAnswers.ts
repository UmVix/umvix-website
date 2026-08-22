/**
 * Pre-written answers for the chat widget.
 *
 * These are used whenever the live AI providers are unavailable — no API key
 * configured, provider outage, rate limit, or a network failure in the browser.
 * The widget then still answers the common questions instead of showing a
 * "not configured" error.
 *
 * Keep the facts here in sync with `UMVIX_CONTEXT` in `lib/anthropic.ts`.
 */

/**
 * Minimal post shape the chat needs. Deliberately not imported from
 * `lib/blog.ts`: that module reads the filesystem, and this one is bundled
 * into the client widget.
 */
export type PostLink = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
};

type FallbackAnswer = {
  /**
   * Lowercase keywords, matched as word prefixes — "specialis" matches
   * "specialise"/"specializing", while "ai" does not match "email".
   */
  keywords: string[];
  answer: string;
};

const CONTACT_LINE = "For a detailed quote, reach us at info@umvix.com or via the contact page.";

const ANSWERS: FallbackAnswer[] = [
  {
    keywords: ["service", "offer", "what do you do", "what can you", "specialis", "specializ", "expertise"],
    answer:
      "We build web platforms (Next.js/React), mobile apps (iOS, Android, React Native, Flutter), AI chatbots and LLM integrations, AI automation workflows, and custom dashboards or SaaS products. " +
      CONTACT_LINE,
  },
  {
    keywords: ["process", "how do you work", "how does it work", "workflow", "steps", "methodology"],
    answer:
      "Our process runs in six steps: discovery & strategy, design & prototyping, agile development, QA, launch, and ongoing support. You get regular demos throughout, so there are no surprises at the end.",
  },
  {
    keywords: ["pricing", "price", "cost", "budget", "how much", "rate", "quote", "charge"],
    answer:
      "Pricing is project-based and scoped to complexity — typical engagements run from $1,000 to $50,000+. The initial consultation is free and we send a detailed quote once we understand your requirements. " +
      CONTACT_LINE,
  },
  {
    keywords: ["timeline", "how long", "duration", "deadline", "delivery time", "when can"],
    answer:
      "Timelines depend on scope: a focused website or MVP usually takes a few weeks, while larger platforms and SaaS products run over several months. Share your requirements at info@umvix.com and we'll map out a realistic schedule.",
  },
  {
    keywords: ["contact", "email", "phone", "call", "reach", "get in touch", "talk to"],
    answer:
      "You can reach us at info@umvix.com or +92-316 5310133, or use the contact form on this site. We typically reply within one business day.",
  },
  {
    keywords: ["office", "location", "where are you", "based", "address", "country", "germany", "pakistan"],
    answer:
      "We have two offices: Morgenbreede 29, Bielefeld 33615, Germany, and Blue Area, Islamabad, Pakistan. We work with clients across the US, Europe, and the Middle East.",
  },
  {
    keywords: ["experience", "portfolio", "clients", "projects", "track record", "case stud", "work you"],
    answer:
      "We've delivered 30+ projects for 17+ clients across 9+ countries, with 8+ years of experience and 25+ AI models integrated. The portfolio page walks through some of that work in detail.",
  },
  {
    keywords: ["ai", "chatbot", "automation", "llm", "gpt", "machine learning", "agent"],
    answer:
      "AI is a core part of what we do — chatbots and LLM/GPT integrations, plus automation workflows built on Zapier, Make.com, or custom Python. We've integrated 25+ AI models into client products so far.",
  },
  {
    keywords: ["mobile", "app store", "ios", "android", "react native", "flutter"],
    answer:
      "We build mobile apps for iOS and Android, using React Native or Flutter for cross-platform work and native code where it matters. " +
      CONTACT_LINE,
  },
  {
    keywords: ["web", "website", "next.js", "nextjs", "react", "frontend", "landing page"],
    answer:
      "We build web platforms with Next.js and React — marketing sites, custom dashboards, and full SaaS products, all built for speed and SEO. " +
      CONTACT_LINE,
  },
  {
    keywords: ["support", "maintenance", "after launch", "ongoing"],
    answer:
      "Yes — we offer ongoing support and maintenance after launch, covering updates, monitoring, and new feature work. We can scope it as a retainer or on demand.",
  },
  {
    keywords: ["hello", "hi", "hey", "salam", "good morning", "good evening"],
    answer:
      "Hello! I'm Umvix's assistant. Ask me about our services, process, pricing, or how we can help with your project.",
  },
];

const DEFAULT_ANSWER =
  "I can help with questions about Umvix — our services, process, pricing, and past work. " +
  "For anything specific to your project, email info@umvix.com or use the contact page and the team will get back to you within a business day.";

/** True when `keyword` appears in `text` at the start of a word. */
function matches(text: string, keyword: string): boolean {
  let from = 0;
  for (;;) {
    const at = text.indexOf(keyword, from);
    if (at === -1) return false;
    if (at === 0 || !/[a-z0-9]/.test(text[at - 1])) return true;
    from = at + 1;
  }
}

/**
 * The blog post most relevant to a question, scored on tag and title-word
 * overlap. Returns null when nothing is a decent match — a loosely related
 * article is worse than no suggestion.
 */
export function findRelatedPost(question: string, posts: PostLink[]): PostLink | null {
  const text = question.toLowerCase();

  let best: { post: PostLink; score: number } | null = null;
  for (const post of posts) {
    let score = 0;
    // Tags are curated, so they are the strongest signal. A multi-word tag
    // ("Mobile Apps") also counts when only part of it is mentioned, since
    // visitors write "mobile app", not the exact tag.
    for (const tag of post.tags) {
      const lower = tag.toLowerCase();
      if (matches(text, lower)) {
        score += 3;
      } else if (
        lower.split(/\s+/).some((word) => word.length > 2 && matches(text, word))
      ) {
        score += 2;
      }
    }
    // Then meaningful words from the title.
    for (const word of post.title.toLowerCase().split(/[^a-z0-9]+/)) {
      if (word.length > 3 && !STOP_WORDS.has(word) && matches(text, word)) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) best = { post, score };
  }

  return best && best.score >= 2 ? best.post : null;
}

/** Common words that would match almost any question if left in. */
const STOP_WORDS = new Set([
  "does", "your", "with", "what", "when", "much", "cost", "from", "that",
  "this", "have", "into", "will", " they", "them", "than", "then", "site",
  "build", "2026", "2025",
]);

/**
 * Returns the best pre-written answer for a user question, optionally with a
 * relevant blog post appended as a markdown link the widget renders.
 */
export function getFallbackAnswer(question: string, posts: PostLink[] = []): string {
  const text = question.toLowerCase();

  let best: { answer: string; score: number } | null = null;
  for (const entry of ANSWERS) {
    const score = entry.keywords.filter((keyword) => matches(text, keyword)).length;
    if (score > 0 && (!best || score > best.score)) {
      best = { answer: entry.answer, score };
    }
  }

  const answer = best?.answer ?? DEFAULT_ANSWER;
  const related = findRelatedPost(question, posts);

  return related
    ? `${answer}\n\nWe wrote about this: [${related.title}](/blog/${related.slug})`
    : answer;
}

/** Streams a pre-written answer word by word so it matches the live AI feel. */
export function streamFallbackAnswer(question: string, posts: PostLink[] = []): ReadableStream {
  const words = getFallbackAnswer(question, posts).split(" ");
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        controller.enqueue(encoder.encode(i === 0 ? words[i] : ` ${words[i]}`));
        await new Promise((resolve) => setTimeout(resolve, 18));
      }
      controller.close();
    },
  });
}
