import Link from "next/link";

/**
 * Category navigation for the listing page. Each category is a plain link to
 * `?category=<slug>`, so every filtered view is its own crawlable URL rather
 * than client-side state.
 */
export default function CategoryNav({
  categories,
  active,
  total,
}: {
  categories: { name: string; slug: string; blurb: string; count: number }[];
  active?: string;
  total: number;
}) {
  return (
    <nav aria-label="Post categories" className="flex flex-wrap justify-center gap-2">
      <Pill href="/blog" label="All" count={total} isActive={!active} />
      {categories.map((c) => (
        <Pill
          key={c.slug}
          href={`/blog?category=${c.slug}`}
          label={c.name}
          count={c.count}
          isActive={active === c.slug}
        />
      ))}
    </nav>
  );
}

function Pill({
  href,
  label,
  count,
  isActive,
}: {
  href: string;
  label: string;
  count: number;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      data-cursor="hover"
      aria-current={isActive ? "page" : undefined}
      className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] transition-all ${
        isActive
          ? "border-brand-red/60 bg-brand-red/12 text-brand-white shadow-[0_0_24px_-8px_var(--brand-red)]"
          : "border-white/[0.08] bg-white/[0.02] text-brand-gray hover:border-brand-red/40 hover:bg-white/[0.05] hover:text-brand-white"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
          isActive ? "bg-brand-red/25 text-brand-white" : "bg-white/[0.06] text-brand-gray-muted"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}
