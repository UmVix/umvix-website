import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { pageGraph } from "@/lib/structuredData";
import { getAllPosts, getCategory, getCategoryCounts } from "@/lib/blog";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/Button";
import PostCard from "@/components/blog/PostCard";
import FeaturedPost from "@/components/blog/FeaturedPost";
import CategoryNav from "@/components/blog/CategoryNav";

const description =
  "Practical writing from the Umvix team on web development, mobile apps, AI chatbots, automation, and SaaS — what we build, how we build it, and what it costs.";

export const metadata = createMetadata({
  title: "Blog",
  description,
  path: "/blog",
});

export default function BlogPage({
  searchParams,
}: {
  searchParams?: { category?: string; tag?: string };
}) {
  const all = getAllPosts();
  const categories = getCategoryCounts();

  const activeCategory = searchParams?.category
    ? getCategory(searchParams.category)
    : null;
  const activeTag = searchParams?.tag;

  const posts = all.filter(
    (post) =>
      (!activeCategory || post.category === activeCategory.name) &&
      (!activeTag || post.tags.includes(activeTag))
  );

  // The lead article is only meaningful on the unfiltered view, where it is the
  // newest post overall.
  const isFiltered = Boolean(activeCategory || activeTag);
  const featured = !isFiltered ? posts[0] : undefined;
  const rest = featured ? posts.slice(1) : posts;

  return (
    <div className="relative">
      <JsonLd
        data={pageGraph({
          path: "/blog",
          name: "Blog | Umvix",
          description,
          type: "CollectionPage",
          breadcrumb: [{ name: "Blog", path: "/blog" }],
        })}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(ellipse_at_center,var(--brand-red)_0%,transparent_70%)] opacity-[0.13] blur-2xl"
        />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <Reveal y={20}>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-red">
              Insights
            </p>
            <h1 className="mx-auto mt-5 max-w-3xl font-headline text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-brand-white">
              What we&apos;ve learned building{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                software that ships
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-brand-gray">{description}</p>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-brand-gray-muted">
              {all.length} article{all.length === 1 ? "" : "s"} · {categories.length} topics
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Reveal y={16}>
          <CategoryNav
            categories={categories}
            active={activeCategory?.slug}
            total={all.length}
          />
        </Reveal>

        {/* Active filter context */}
        {activeCategory && (
          <Reveal y={12} delay={0.05}>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-brand-gray">
              {activeCategory.blurb}
            </p>
          </Reveal>
        )}
        {activeTag && (
          <div className="mt-8 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-red/40 bg-brand-red/10 px-3 py-1 text-xs text-brand-white">
              Tagged “{activeTag}”
              <Link
                href="/blog"
                data-cursor="hover"
                className="text-brand-gray-muted transition-colors hover:text-brand-white"
                aria-label="Clear tag filter"
              >
                ✕
              </Link>
            </span>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-brand-gray">Nothing here yet.</p>
            <Link
              href="/blog"
              data-cursor="hover"
              className="mt-3 inline-block text-sm text-brand-red hover:underline"
            >
              View all articles
            </Link>
          </div>
        ) : (
          <>
            {featured && (
              <Reveal y={24} delay={0.08}>
                <div className="mt-12">
                  <FeaturedPost post={featured} />
                </div>
              </Reveal>
            )}

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => (
                <Reveal key={post.slug} y={24} delay={Math.min(i, 5) * 0.05}>
                  <PostCard post={post} priority={!featured && i < 3} />
                </Reveal>
              ))}
            </div>
          </>
        )}

        {/* Closing CTA */}
        <Reveal y={20}>
          <aside className="glass mt-20 rounded-3xl border border-white/[0.08] p-10 text-center">
            <h2 className="font-headline text-2xl text-brand-white">
              Working on something we write about?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-brand-gray">
              We scope, design, and ship web platforms, mobile apps, AI assistants, and
              automation. The first consultation is free.
            </p>
            <div className="mt-6 flex justify-center">
              <Button href="/contact">Start a conversation</Button>
            </div>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
