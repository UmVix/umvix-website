"use client";

/**
 * Tahana Wellness — a polished spa/wellness marketing website mockup:
 * elegant serif header, a full hero (headline + CTAs + trust + imagery),
 * and a service strip. Warm cream (#F2EDE0) + brass (#A7834E) theme.
 * Presented inside the shared floating browser window.
 */

type Props = {
  title: string;
  url: string;
};

const CREAM = "#F2EDE0";
const BRASS = "#A7834E";
const INK = "#3a3025";
const MUTED = "#8a7d6a";

export default function TahanaWellnessVisual({ title, url }: Props) {
  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#08050e]">
      {/* ambient accent lighting */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 85% 60% at 22% 8%, ${BRASS}30, transparent 58%), radial-gradient(ellipse 70% 55% at 88% 95%, ${BRASS}1c, transparent 55%)`,
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
        style={{ background: `radial-gradient(ellipse, ${BRASS}38, transparent 70%)` }}
      />

      {/* browser frame */}
      <div
        className="absolute inset-x-[7%] top-[11%] h-full overflow-hidden rounded-lg border border-white/12 bg-[#0b0b0e] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.02]"
        style={{
          boxShadow: `0 30px 60px -18px rgba(0,0,0,0.9), 0 0 50px -12px ${BRASS}40, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        <div className="flex h-5 items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.04] px-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 flex flex-1 items-center gap-1 rounded-full bg-black/40 px-2 py-[2px] text-[6px] text-white/45">
            <svg width="5" height="6" viewBox="0 0 8 10" fill="currentColor" style={{ color: BRASS }}>
              <path d="M1 4V3a3 3 0 0 1 6 0v1h.5v6h-7V4H1zm1.5 0h3V3a1.5 1.5 0 0 0-3 0v1z" />
            </svg>
            {url}
          </span>
        </div>

        {/* website body */}
        <div className="flex h-[calc(100%-1.25rem)] flex-col" style={{ background: CREAM, color: INK }}>
          {/* header */}
          <div className="flex items-center justify-between px-3 py-1.5">
            <div className="flex items-center gap-1">
              <span
                className="flex h-3 w-3 items-center justify-center rounded-full text-[5px] text-white"
                style={{ background: BRASS }}
              >
                ❧
              </span>
              <span className="font-serif text-[7px] font-bold tracking-tight" style={{ fontStyle: "italic" }}>
                Tahana
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[4.5px] font-medium" style={{ color: MUTED }}>
              <span style={{ color: INK }}>Treatments</span>
              <span>Retreats</span>
              <span>About</span>
              <span>Journal</span>
            </div>
            <span
              className="rounded-full px-2 py-[3px] text-[4.5px] font-bold text-white"
              style={{ background: BRASS, boxShadow: `0 2px 8px ${BRASS}55` }}
            >
              Book Now
            </span>
          </div>

          {/* hero */}
          <div className="flex flex-1 items-stretch gap-2 px-3 pb-1">
            {/* copy */}
            <div className="flex w-[54%] flex-col justify-center gap-1">
              <span
                className="text-[4px] font-bold uppercase tracking-[0.25em]"
                style={{ color: BRASS }}
              >
                ✦ Holistic Wellness Studio
              </span>
              <p className="font-serif text-[13px] font-bold leading-[1.08]" style={{ fontStyle: "italic" }}>
                Restore your
                <br />
                natural <span style={{ color: BRASS }}>balance</span>
              </p>
              <p className="max-w-[92%] text-[4.5px] leading-relaxed" style={{ color: MUTED }}>
                Massage, breathwork, and mindful therapies designed to calm the mind and renew the body.
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span
                  className="rounded-full px-2.5 py-[4px] text-[4.5px] font-bold text-white"
                  style={{ background: BRASS, boxShadow: `0 2px 8px ${BRASS}55` }}
                >
                  Book a Session
                </span>
                <span
                  className="rounded-full border px-2.5 py-[4px] text-[4.5px] font-semibold"
                  style={{ borderColor: `${BRASS}66`, color: INK }}
                >
                  Explore Treatments
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="text-[5px]" style={{ color: BRASS }}>
                  ★★★★★
                </span>
                <span className="text-[4px]" style={{ color: MUTED }}>
                  4.9 · 2,400+ members
                </span>
              </div>
            </div>

            {/* imagery */}
            <div className="relative w-[46%]">
              <div
                className="absolute inset-0 overflow-hidden rounded-t-[40px] rounded-b-lg"
                style={{
                  background: `linear-gradient(160deg, ${BRASS}, ${BRASS}88 45%, #6d5a38)`,
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_70%_25%,white,transparent_45%)]"
                />
                <div
                  aria-hidden
                  className="absolute -left-3 -bottom-3 h-12 w-12 rounded-full"
                  style={{ background: `${CREAM}22` }}
                />
              </div>
              {/* floating booking card */}
              <div
                className="absolute bottom-1.5 left-1/2 flex w-[80%] -translate-x-1/2 items-center gap-1 rounded-md px-1.5 py-1 shadow-[0_6px_16px_rgba(0,0,0,0.25)]"
                style={{ background: CREAM }}
              >
                <span
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[5px] text-white"
                  style={{ background: BRASS }}
                >
                  ☾
                </span>
                <div className="min-w-0">
                  <p className="text-[3.8px] font-bold" style={{ color: INK }}>
                    Next session
                  </p>
                  <p className="text-[3.5px]" style={{ color: MUTED }}>
                    Aroma Massage · Today 3:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* service strip */}
          <div className="grid grid-cols-3 gap-1.5 px-3 pb-2 pt-0.5">
            {[
              { i: "☘", n: "Massage Therapy", d: "Deep tissue & aroma" },
              { i: "❋", n: "Yoga & Breathwork", d: "Guided daily flows" },
              { i: "☾", n: "Meditation", d: "Calm, focused mind" },
            ].map((s) => (
              <div
                key={s.n}
                className="flex flex-col gap-0.5 rounded-md border bg-white/50 p-1.5"
                style={{ borderColor: `${BRASS}33` }}
              >
                <span
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-md text-[6px] text-white"
                  style={{ background: BRASS }}
                >
                  {s.i}
                </span>
                <p className="text-[4.5px] font-bold" style={{ color: INK }}>
                  {s.n}
                </p>
                <p className="text-[3.8px]" style={{ color: MUTED }}>
                  {s.d}
                </p>
              </div>
            ))}
          </div>
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
