"use client";

/**
 * Lead-router automation — an AI scoring design (distinct from the linear
 * recipe, the fan-out, and the email preview): a new lead is scored by AI
 * on a gauge, then routed to the right rep with a Slack alert.
 */

type Props = {
  accent: string;
  title: string;
};

const SCORE = 87;

export default function LeadRouterVisual({ accent, title }: Props) {
  // gauge geometry (r = 15, circumference ≈ 94.25)
  const circ = 2 * Math.PI * 15;
  const dash = (SCORE / 100) * circ;

  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#050507]">
      {/* ambient accent lighting */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 85% 60% at 22% 8%, ${accent}30, transparent 58%), radial-gradient(ellipse 70% 55% at 88% 95%, ${accent}1c, transparent 55%)`,
        }}
      />
      {/* perspective grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
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
        style={{ background: `radial-gradient(ellipse, ${accent}38, transparent 70%)` }}
      />

      {/* console frame */}
      <div
        className="absolute inset-x-[9%] top-[13%] h-full overflow-hidden rounded-xl border border-white/12 bg-[#0b0b0e] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.02]"
        style={{
          boxShadow: `0 30px 60px -18px rgba(0,0,0,0.9), 0 0 50px -12px ${accent}45, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        {/* title bar */}
        <div className="flex h-5 items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.04] px-2">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: accent, boxShadow: `0 0 6px ${accent}`, animation: "soft-pulse 2s ease-in-out infinite" }}
          />
          <span className="text-[6px] font-semibold uppercase tracking-widest text-white/55">
            Automation
          </span>
          <span className="ml-auto flex items-center gap-1">
            <span className="text-[4.5px] font-bold" style={{ color: accent }}>
              Active
            </span>
            <span className="flex h-2 w-3.5 items-center rounded-full px-[1px]" style={{ background: accent }}>
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </span>
        </div>

        <div className="flex h-[calc(100%-1.25rem)] flex-col p-2 text-white">
          <p className="text-[6px] font-extrabold leading-tight">Lead Router</p>
          <p className="mb-1 text-[4px] text-white/40">New lead · AI-scored and routed to the right rep</p>

          <div className="flex min-h-0 flex-1 items-stretch gap-1.5">
            {/* trigger: incoming lead */}
            <div
              className="flex w-[32%] flex-col rounded-md border p-1.5"
              style={{ borderColor: `${accent}66`, background: `${accent}12` }}
            >
              <div className="flex items-center gap-1">
                <span
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-md text-[6px]"
                  style={{ background: accent, color: "#0b0b0e" }}
                >
                  ⚡
                </span>
                <span className="text-[4px] font-bold uppercase tracking-wider" style={{ color: accent }}>
                  Trigger · Webhook
                </span>
              </div>
              <p className="mt-1 text-[5px] font-bold">Acme Corp</p>
              <p className="text-[3.8px] text-white/60">Daniel Reeves · VP Ops</p>
              <div className="mt-1 flex flex-col gap-[2px]">
                {[
                  ["Company", "500+ staff"],
                  ["Budget", "$50k+"],
                  ["Source", "Pricing page"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[3.5px]">
                    <span className="text-white/40">{k}</span>
                    <span className="text-white/75">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI score gauge */}
            <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.02] p-1">
              <span
                className="mb-0.5 rounded-full px-1.5 py-[1px] text-[3.5px] font-bold uppercase tracking-wider"
                style={{ background: `${accent}1f`, color: accent }}
              >
                ✦ Claude scored
              </span>
              <div className="relative h-11 w-11">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke={accent}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circ}`}
                    style={{ filter: `drop-shadow(0 0 3px ${accent})` }}
                  />
                </svg>
                <span className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[8px] font-extrabold leading-none">{SCORE}</span>
                  <span className="text-[3px] uppercase tracking-wider text-white/45">score</span>
                </span>
              </div>
              <span
                className="mt-0.5 rounded-full px-1.5 py-[1px] text-[4px] font-extrabold"
                style={{ background: accent, color: "#0b0b0e" }}
              >
                🔥 Hot Lead
              </span>
              {/* factor bars */}
              <div className="mt-1 flex w-full flex-col gap-[2px]">
                {[
                  { l: "Fit", w: 92 },
                  { l: "Intent", w: 84 },
                  { l: "Budget", w: 78 },
                ].map((f) => (
                  <div key={f.l} className="flex items-center gap-1">
                    <span className="w-5 shrink-0 text-[3.2px] text-white/45">{f.l}</span>
                    <div className="h-[2.5px] flex-1 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${f.w}%`, background: accent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* routing decision */}
            <div className="flex w-[33%] flex-col gap-1">
              <div className="flex-1 rounded-md border border-white/[0.08] bg-white/[0.03] p-1.5">
                <span className="text-[4px] font-bold uppercase tracking-wider text-white/40">
                  Routed to
                </span>
                <div className="mt-1 flex items-center gap-1">
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[4.5px] font-extrabold text-white"
                    style={{ background: accent }}
                  >
                    SA
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[4.5px] font-bold">Sara Ahmed</p>
                    <p className="text-[3.5px] text-white/45">Enterprise AE</p>
                  </div>
                </div>
                <span className="mt-1 flex items-center gap-1 text-[3.5px] text-white/45">
                  <span className="h-1 w-1 rounded-full" style={{ background: accent }} />
                  matched by territory + score
                </span>
              </div>
              {/* slack alert */}
              <div className="overflow-hidden rounded-md border border-white/[0.08] bg-[#17191d] p-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-[3.8px] font-bold text-white/80"># leads</span>
                  <span className="rounded-[2px] bg-white/[0.08] px-1 text-[3px] font-bold uppercase text-white/50">
                    Slack
                  </span>
                </div>
                <p className="mt-0.5 text-[4px] leading-snug text-white/85">
                  🔥 Hot lead <span style={{ color: accent }}>@sara</span> — Acme Corp (87)
                </p>
              </div>
            </div>
          </div>

          {/* footer stats */}
          <div className="mt-1 flex items-center gap-1">
            <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-[3px] text-[4px] text-white/60">
              Runs today <span className="font-extrabold" style={{ color: accent }}>63</span>
            </span>
            <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-[3px] text-[4px] text-white/60">
              Saved <span className="font-extrabold" style={{ color: accent }}>6 hrs / wk</span>
            </span>
          </div>
        </div>
      </div>

      {/* glass shine sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.09] to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
      <span className="sr-only">{title} automation preview</span>
    </div>
  );
}
