"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders an assistant reply as text with clickable links. The assistant is
 * prompted to link blog posts as markdown (`[title](/blog/slug)`), so only that
 * one inline construct is parsed — this is not a general markdown renderer.
 */
const MARKDOWN_LINK = /\[([^\]]+)\]\((\/[^)\s]*|https?:\/\/[^)\s]+)\)/g;

export default function MessageText({
  text,
  onNavigate,
}: {
  text: string;
  onNavigate?: () => void;
}) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  // `matchAll` needs downlevelIteration under this tsconfig target, so the
  // regex is stepped manually instead.
  MARKDOWN_LINK.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = MARKDOWN_LINK.exec(text)) !== null) {
    const [full, label, href] = match;
    const start = match.index;

    if (start > lastIndex) nodes.push(text.slice(lastIndex, start));

    nodes.push(
      href.startsWith("/") ? (
        <Link
          key={start}
          href={href}
          onClick={onNavigate}
          data-cursor="hover"
          className="font-medium text-brand-red underline decoration-brand-red/40 underline-offset-2 hover:decoration-brand-red"
        >
          {label}
        </Link>
      ) : (
        <a
          key={start}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          className="font-medium text-brand-red underline decoration-brand-red/40 underline-offset-2 hover:decoration-brand-red"
        >
          {label}
        </a>
      )
    );

    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));

  return <span className="whitespace-pre-wrap">{nodes}</span>;
}
