import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { PostLink } from "@/lib/chat/fallbackAnswers";

/**
 * File-based blog. Every post is one `.mdx` file in `content/blog/`; the file
 * name (without extension) becomes the URL slug. Publishing a post means
 * adding a file and deploying — there is no CMS or database.
 *
 * Frontmatter contract (see `content/blog/_TEMPLATE.mdx`):
 *   title, description, date (YYYY-MM-DD) are required;
 *   updated, author, tags, cover, draft are optional.
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * The five content pillars, mirroring the services on /services. Every post
 * belongs to exactly one; `tags` stay free-form for finer topics.
 *
 * Order here is the order they render in navigation.
 */
export const CATEGORIES = [
  {
    name: "Web Development",
    slug: "web-development",
    blurb: "Next.js, performance, CMS choices, and what a site should cost.",
  },
  {
    name: "Mobile Apps",
    slug: "mobile-apps",
    blurb: "React Native, Flutter, store launches, and life after release.",
  },
  {
    name: "AI & Chatbots",
    slug: "ai-chatbots",
    blurb: "Assistants that stay accurate, what they cost, and how to measure them.",
  },
  {
    name: "Automation",
    slug: "automation",
    blurb: "Workflows worth automating, and building ones that keep running.",
  },
  {
    name: "SaaS & Dashboards",
    slug: "saas-dashboards",
    blurb: "Multi-tenancy, billing, stacks, and turning tools into products.",
  },
] as const;

export type CategoryName = (typeof CATEGORIES)[number]["name"];

const CATEGORY_NAMES = CATEGORIES.map((c) => c.name) as readonly string[];

/** Category definition for a slug, or null when the slug is unknown. */
export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  /** ISO date string, used for sorting, display, and `datePublished`. */
  date: string;
  /** ISO date string; set when a post is materially revised. */
  updated?: string;
  /** One of `CATEGORIES` — the post's content pillar. */
  category: CategoryName;
  /** URL slug of `category`, precomputed for links. */
  categorySlug: string;
  author: string;
  tags: string[];
  /** Public path to the cover image, e.g. `/blog/my-post.jpg`. */
  cover?: string;
  /** Drafts are excluded from listings, sitemap, and RSS in production. */
  draft: boolean;
  /** Estimated minutes to read, derived from word count. */
  readingTime: number;
};

export type Post = PostMeta & { content: string };

const WORDS_PER_MINUTE = 220;

function readingTimeOf(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function toIsoDate(value: unknown, slug: string, field: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && !Number.isNaN(Date.parse(value))) {
    return new Date(value).toISOString().slice(0, 10);
  }
  throw new Error(`content/blog/${slug}.mdx: "${field}" must be a YYYY-MM-DD date.`);
}

function parseFile(slug: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);

  if (!data.title) throw new Error(`content/blog/${slug}.mdx: "title" is required.`);
  if (!data.description) {
    throw new Error(`content/blog/${slug}.mdx: "description" is required.`);
  }
  if (!CATEGORY_NAMES.includes(String(data.category))) {
    throw new Error(
      `content/blog/${slug}.mdx: "category" must be one of ${CATEGORY_NAMES.join(", ")}.`
    );
  }

  const category = String(data.category) as CategoryName;

  return {
    slug,
    title: String(data.title),
    description: String(data.description),
    date: toIsoDate(data.date, slug, "date"),
    updated: data.updated ? toIsoDate(data.updated, slug, "updated") : undefined,
    category,
    categorySlug: CATEGORIES.find((c) => c.name === category)!.slug,
    author: data.author ? String(data.author) : "Umvix Team",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: data.cover ? String(data.cover) : undefined,
    draft: data.draft === true,
    readingTime: readingTimeOf(content),
    content,
  };
}

/** Slugs of every `.mdx` file in the content directory. Files prefixed with `_` are ignored. */
function listSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/** Drafts are visible in `next dev` so they can be previewed, hidden in production. */
const includeDrafts = process.env.NODE_ENV === "development";

/** All published posts, newest first. */
export function getAllPosts(): Post[] {
  return listSlugs()
    .map(parseFile)
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** One post by slug, or `null` when it does not exist or is an unpublished draft. */
export function getPost(slug: string): Post | null {
  if (!listSlugs().includes(slug)) return null;
  const post = parseFile(slug);
  if (post.draft && !includeDrafts) return null;
  return post;
}

/** Every tag in use, with its post count, most-used first. */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Posts most similar to `post`, ranked by shared tags then recency. Falls back
 * to the newest other posts so the section is never empty on a tagless post.
 */
export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  return others
    .map((p) => ({
      p,
      // Same category counts for more than any single shared tag.
      score:
        (p.category === post.category ? 3 : 0) +
        p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || b.p.date.localeCompare(a.p.date))
    .slice(0, limit)
    .map((entry) => entry.p);
}

/** "20 August 2026" — the display format used across the blog. */
export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Headings (`##` / `###`) for the table of contents, with slugified ids that
 * match the ones `rehype`-free MDX gives us via the custom heading components.
 */
export function getHeadings(content: string): { id: string; text: string; level: 2 | 3 }[] {
  const headings: { id: string; text: string; level: 2 | 3 }[] = [];
  // Skip fenced code blocks so `## comments` inside them are not picked up.
  const body = content.replace(/```[\s\S]*?```/g, "");

  for (const line of body.split("\n")) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const text = match[2].replace(/[*_`]/g, "");
    headings.push({ id: slugifyHeading(text), text, level: match[1].length as 2 | 3 });
  }
  return headings;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Every category with its published post count, in `CATEGORIES` order. */
export function getCategoryCounts(): { name: string; slug: string; blurb: string; count: number }[] {
  const posts = getAllPosts();
  return CATEGORIES.map((c) => ({
    ...c,
    count: posts.filter((p) => p.category === c.name).length,
  }));
}

/**
 * Lightweight post list for the chat assistant — small enough to inline in a
 * system prompt and to ship to the client widget as props.
 */
export function getPostLinks(): PostLink[] {
  return getAllPosts()
    .filter((post) => !post.draft)
    .map(({ slug, title, description, tags }) => ({ slug, title, description, tags }));
}
