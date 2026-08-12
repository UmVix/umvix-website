import { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/metadata";

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
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority,
  }));
}
