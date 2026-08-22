"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: 2 | 3 };

/**
 * Sticky in-post navigation. Highlights the heading currently in view via an
 * IntersectionObserver rather than scroll math, so it stays cheap.
 */
export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      // Bias the "active" band towards the top of the viewport, under the navbar.
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );

    for (const { id } of headings) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="sticky top-28 hidden lg:block">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gray-muted">
        On this page
      </p>
      <ul className="space-y-1.5 border-l border-white/[0.08]">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              data-cursor="hover"
              className={`-ml-px block border-l-2 py-1 text-[13px] leading-snug transition-colors ${
                level === 3 ? "pl-6" : "pl-4"
              } ${
                activeId === id
                  ? "border-brand-red text-brand-white"
                  : "border-transparent text-brand-gray-muted hover:text-brand-gray"
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
