import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { absoluteUrl, createMetadata } from "@/lib/metadata";
import { blogPostingGraph } from "@/lib/structuredData";
import {
  formatPostDate,
  getAllPosts,
  getHeadings,
  getPost,
  getRelatedPosts,
} from "@/lib/blog";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/Button";
import PostBody from "@/components/blog/PostBody";
import PostCard from "@/components/blog/PostCard";
import ShareBar from "@/components/blog/ShareBar";
import TableOfContents from "@/components/blog/TableOfContents";

type Params = { params: { slug: string } };

/** Every published post is statically rendered at build time. */
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const post = getPost(params.slug);
  if (!post) return createMetadata({ title: "Post not found", path: "/blog" });

  const base = createMetadata({
    fullTitle: `${post.title} | Umvix`,
    description: post.description,
    path: `/blog/${post.slug}`,
  });

  // Articles get `og:type=article` plus publish/update timestamps on top of the
  // shared site metadata.
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
      ...(post.cover
        ? { images: [{ url: absoluteUrl(post.cover), width: 1200, height: 630, alt: post.title }] }
        : {}),
    },
  };
}

export default function BlogPostPage({ params }: Params) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const headings = getHeadings(post.content);
  const related = getRelatedPosts(post);
  const url = absoluteUrl(`/blog/${post.slug}`);

  return (
    <article className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <JsonLd data={blogPostingGraph(post)} />

      <Link
        href="/blog"
        data-cursor="hover"
        className="inline-flex items-center gap-1.5 text-sm text-brand-gray transition-colors hover:text-brand-red"
      >
        <ArrowLeft size={14} /> All posts
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <header className="mb-10">
            <div className="mb-4 flex flex-wrap items-center gap-1.5">
              <Link
                href={`/blog?category=${post.categorySlug}`}
                data-cursor="hover"
                className="rounded-full bg-brand-red/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-red transition-colors hover:bg-brand-red/25"
              >
                {post.category}
              </Link>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  data-cursor="hover"
                  className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-brand-gray-muted transition-colors hover:border-brand-red/50 hover:text-brand-white"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <h1 className="font-headline text-3xl leading-tight text-brand-white sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-brand-gray">
              {post.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/[0.08] pt-5 text-xs text-brand-gray-muted">
              <span className="text-brand-gray">{post.author}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              {post.updated && (
                <>
                  <span aria-hidden>·</span>
                  <span>Updated {formatPostDate(post.updated)}</span>
                </>
              )}
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={12} /> {post.readingTime} min read
              </span>
              <div className="ml-auto">
                <ShareBar url={url} title={post.title} />
              </div>
            </div>
          </header>

          {post.cover && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl border border-white/[0.08]">
              <Image
                src={post.cover}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
            </div>
          )}

          <PostBody source={post.content} />

          {/* End-of-post conversion CTA */}
          <aside className="glass mt-14 rounded-2xl border border-white/[0.08] p-7 text-center">
            <h2 className="font-headline text-xl text-brand-white">
              Have a project like this in mind?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-brand-gray">
              We scope, design, and ship web platforms, mobile apps, and AI systems.
              The first consultation is free.
            </p>
            <div className="mt-5 flex justify-center">
              <Button href="/contact">Start a conversation</Button>
            </div>
          </aside>
        </div>

        <aside className="order-first lg:order-none">
          <TableOfContents headings={headings} />
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-24 border-t border-white/[0.08] pt-12">
          <h2 className="mb-8 font-headline text-2xl text-brand-white">Keep reading</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((post, i) => (
              <Reveal key={post.slug} y={20} delay={i * 0.05}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
