"use client";

import { useState } from "react";
import { Check, Link2, Linkedin, Twitter } from "lucide-react";

/** Share links for a post, plus a copy-to-clipboard button. */
export default function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied permission) — the share
      // links still work, so there is nothing to recover from.
    }
  };

  const encoded = encodeURIComponent(url);
  const links = [
    {
      label: "Share on X",
      href: `https://x.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(title)}`,
      Icon: Twitter,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      Icon: Linkedin,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-[11px] uppercase tracking-wider text-brand-gray-muted">
        Share
      </span>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          data-cursor="hover"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-brand-gray transition-colors hover:border-brand-red/50 hover:bg-brand-red/10 hover:text-brand-white"
        >
          <Icon size={14} />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Link copied" : "Copy link"}
        data-cursor="hover"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-brand-gray transition-colors hover:border-brand-red/50 hover:bg-brand-red/10 hover:text-brand-white"
      >
        {copied ? <Check size={14} className="text-brand-red" /> : <Link2 size={14} />}
      </button>
    </div>
  );
}
