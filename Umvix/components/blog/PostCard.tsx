import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { formatPostDate, type PostMeta } from "@/lib/blog";

/** Listing tile for a single post. Used on /blog and in "related posts". */
export default function PostCard({
  post,
  priority = false,
}: {
  post: PostMeta;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-cursor="hover"
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40 hover:bg-white/[0.04] hover:shadow-[0_18px_40px_-24px_var(--brand-red)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-brand-black-soft">
        {post.cover ? (
          <Image
            src={post.cover}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-gradient opacity-[0.18]" />
        )}

        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-brand-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-white backdrop-blur-sm">
          {post.category}
        </span>
        {post.draft && (
          <span className="absolute right-3 top-3 rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Draft
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-brand-gray-muted">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={11} /> {post.readingTime} min read
          </span>
        </div>

        <h3 className="font-headline text-lg leading-snug text-brand-white transition-colors group-hover:text-brand-red">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-gray">
          {post.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-brand-gray-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          <ArrowUpRight
            size={16}
            className="shrink-0 text-brand-gray-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-red"
          />
        </div>
      </div>
    </Link>
  );
}
