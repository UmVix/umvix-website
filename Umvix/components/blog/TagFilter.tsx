import Link from "next/link";

/**
 * Tag pills for the listing page. Filtering is a plain `?tag=` link rather
 * than client state, so every filtered view is its own crawlable URL.
 */
export default function TagFilter({
  tags,
  active,
}: {
  tags: { tag: string; count: number }[];
  active?: string;
}) {
  if (tags.length === 0) return null;

  const pill = (isActive: boolean) =>
    `rounded-full border px-3 py-1 text-xs transition-colors ${
      isActive
        ? "border-brand-red bg-brand-red/15 text-brand-white"
        : "border-white/10 bg-white/[0.03] text-brand-gray hover:border-brand-red/40 hover:text-brand-white"
    }`;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Link href="/blog" data-cursor="hover" className={pill(!active)}>
        All
      </Link>
      {tags.map(({ tag, count }) => (
        <Link
          key={tag}
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          data-cursor="hover"
          className={pill(active === tag)}
        >
          {tag}
          <span className="ml-1.5 text-brand-gray-muted">{count}</span>
        </Link>
      ))}
    </div>
  );
}
