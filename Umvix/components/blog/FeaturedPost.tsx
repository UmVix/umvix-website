import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { formatPostDate, type PostMeta } from "@/lib/blog";

/** The lead article on the listing page — wide, image-forward, one per view. */
export default function FeaturedPost({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-cursor="hover"
      className="group relative grid overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] transition-colors hover:border-brand-red/40 lg:grid-cols-2"
    >
      <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
        {post.cover ? (
          <Image
            src={post.cover}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-gradient opacity-20" />
        )}
        {/* Blend the image into the panel on wide screens. */}
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-gradient-to-r from-transparent via-transparent to-brand-black/80 lg:block"
        />
      </div>

      <div className="flex flex-col justify-center p-7 sm:p-10">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px]">
          <span className="rounded-full bg-brand-red/15 px-2.5 py-1 font-semibold uppercase tracking-wider text-brand-red">
            Latest
          </span>
          <span className="text-brand-gray-muted">{post.category}</span>
          <span aria-hidden className="text-brand-gray-muted">·</span>
          <span className="inline-flex items-center gap-1 text-brand-gray-muted">
            <Clock size={11} /> {post.readingTime} min
          </span>
        </div>

        <h2 className="font-headline text-2xl leading-tight text-brand-white transition-colors group-hover:text-brand-red sm:text-3xl">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-3 leading-relaxed text-brand-gray">
          {post.description}
        </p>

        <div className="mt-7 flex items-center gap-2 text-sm font-medium text-brand-white">
          Read article
          <ArrowRight
            size={16}
            className="text-brand-red transition-transform group-hover:translate-x-1"
          />
          <time className="ml-auto text-xs text-brand-gray-muted" dateTime={post.date}>
            {formatPostDate(post.date)}
          </time>
        </div>
      </div>
    </Link>
  );
}
