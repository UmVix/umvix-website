import { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/metadata";
import { CATEGORIES, getAllPosts } from "@/lib/blog";

/**
 * Bump this when page content meaningfully changes. It is deliberately a fixed
 * date rather than `new Date()`: a lastmod that changes on every deploy tells
 * Google every page changed every deploy, and it stops trusting the signal.
 */
const LAST_MODIFIED = new Date("2026-08-12");

const routes: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/portfolio", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = routes.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority,
  }));

  // Posts carry their own lastmod from frontmatter, so an edit is a real signal
  // rather than a deploy-time one.
  const postRoutes: MetadataRoute.Sitemap = getAllPosts()
    .filter((post) => !post.draft)
    .map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(`${post.updated ?? post.date}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));

  // Category views are real, crawlable landing pages for each content pillar.
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${absoluteUrl("/blog")}?category=${category.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}
