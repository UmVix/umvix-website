"use client";

import Image from "next/image";

/**
 * Sapore Ristorante — the real website design screenshot presented inside
 * the shared floating browser window. The page is a long scroll, so the
 * frame anchors to the top of the page (header + hero + story) and the
 * rest stays below the fold, like a live site.
 */

type Props = {
  title: string;
  url: string;
};

const GOLD = "#c8a24e";

export default function SaporeRestaurantVisual({ title, url }: Props) {
  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#0b0705]">
      {/* ambient accent lighting */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 85% 60% at 22% 8%, ${GOLD}30, transparent 58%), radial-gradient(ellipse 70% 55% at 88% 95%, ${GOLD}1c, transparent 55%)`,
        }}
      />
      {/* perspective grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 95% 85% at 50% 35%, black 25%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 95% 85% at 50% 35%, black 25%, transparent 78%)",
        }}
      />
      {/* floor glow */}
      <div
        aria-hidden
        className="absolute bottom-[-12%] left-1/2 h-[38%] w-[75%] -translate-x-1/2 rounded-[100%] blur-2xl"
        style={{ background: `radial-gradient(ellipse, ${GOLD}38, transparent 70%)` }}
      />

      {/* browser frame */}
      <div
        className="absolute inset-x-[7%] top-[11%] h-full overflow-hidden rounded-lg border border-white/12 bg-[#0b0b0e] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.02]"
        style={{
          boxShadow: `0 30px 60px -18px rgba(0,0,0,0.9), 0 0 50px -12px ${GOLD}40, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        <div className="flex h-5 items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.04] px-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 flex flex-1 items-center gap-1 rounded-full bg-black/40 px-2 py-[2px] text-[6px] text-white/45">
            <svg width="5" height="6" viewBox="0 0 8 10" fill="currentColor" style={{ color: GOLD }}>
              <path d="M1 4V3a3 3 0 0 1 6 0v1h.5v6h-7V4H1zm1.5 0h3V3a1.5 1.5 0 0 0-3 0v1z" />
            </svg>
            {url}
          </span>
        </div>
        <div className="relative h-[calc(100%-1.25rem)]">
          <Image
            src="/images/portfolio/sapore/sapore-site.png"
            alt={`${title} website screenshot`}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover object-top"
          />
        </div>
      </div>

      {/* glass shine sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.09] to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
      <span className="sr-only">{title} website preview</span>
    </div>
  );
}
