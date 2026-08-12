import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Umvix",
  robots: { index: false, follow: true },
  // Without this the root layout's canonical leaks onto 404s, which reads to
  // Google as "this missing URL is a duplicate of the homepage".
  alternates: { canonical: null },
};

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <div className="site-container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red">
        404
      </p>
      <h1 className="mt-4 font-headline text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight tracking-[-0.03em] text-brand-white">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-4 max-w-lg text-brand-gray">
        The link may be outdated or mistyped. Here&apos;s everything else on the
        Umvix site.
      </p>

      <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {links.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="text-sm font-semibold uppercase tracking-widest text-brand-white transition-colors hover:text-brand-red"
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
