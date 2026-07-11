"use client";

/**
 * Order-alert automation — a fan-out design (distinct from the linear
 * recipe flow): one trigger (new order) branches into two live outputs,
 * a Slack notification and a Google-Sheets row. Same scene language.
 */

type Props = {
  accent: string;
  title: string;
};

export default function OrderAlertVisual({ accent, title }: Props) {
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
          <p className="text-[6px] font-extrabold leading-tight">Order → Team Alert</p>
          <p className="mb-1 text-[4px] text-white/40">One new order · notifies two channels automatically</p>

          <div className="flex min-h-0 flex-1 items-stretch gap-1">
            {/* trigger: new order */}
            <div
              className="flex w-[38%] flex-col rounded-md border p-1.5"
              style={{ borderColor: `${accent}66`, background: `${accent}12` }}
            >
              <div className="flex items-center gap-1">
                <span
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-md text-[6px]"
                  style={{ background: accent, color: "#0b0b0e" }}
                >
                  🛍
                </span>
                <span className="text-[4px] font-bold uppercase tracking-wider" style={{ color: accent }}>
                  Trigger · Shopify
                </span>
              </div>
              <p className="mt-1 text-[5px] font-bold">New order #1042</p>
              <div className="mt-1 flex flex-col gap-[2px] rounded bg-black/30 p-1">
                <div className="flex justify-between text-[3.8px] text-white/70">
                  <span>3 items</span>
                  <span>Sarah K.</span>
                </div>
                <div className="flex justify-between text-[4.5px] font-extrabold">
                  <span className="text-white/50">Total</span>
                  <span style={{ color: accent }}>$128.00</span>
                </div>
              </div>
              <span className="mt-auto flex items-center gap-1 text-[3.5px] text-white/45">
                <span className="h-1 w-1 rounded-full" style={{ background: accent, animation: "soft-pulse 1.4s ease-in-out infinite" }} />
                triggered just now
              </span>
            </div>

            {/* fan-out connector */}
            <div className="w-[8%] shrink-0">
              <svg viewBox="0 0 40 100" preserveAspectRatio="none" className="h-full w-full">
                {["M0 50 C18 50 18 22 40 22", "M0 50 C18 50 18 78 40 78"].map((d, i) => (
                  <g key={i}>
                    <path d={d} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.4" />
                    <path d={d} fill="none" stroke={accent} strokeWidth="1.4" strokeDasharray="6 40" strokeLinecap="round">
                      <animate attributeName="stroke-dashoffset" values="46;0" dur="1.8s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
                    </path>
                  </g>
                ))}
                <circle cx="2" cy="50" r="2.4" fill={accent} />
              </svg>
            </div>

            {/* two outputs */}
            <div className="flex flex-1 flex-col gap-1">
              {/* Slack notification */}
              <div className="flex flex-1 flex-col overflow-hidden rounded-md border border-white/[0.08] bg-[#17191d]">
                <div className="flex items-center gap-1 border-b border-white/[0.06] px-1.5 py-[3px]">
                  <span className="text-[4px] font-bold text-white/80"># sales</span>
                  <span className="rounded-[2px] bg-white/[0.08] px-1 text-[3px] font-bold uppercase tracking-wider text-white/50">
                    Slack
                  </span>
                </div>
                <div className="flex gap-1 p-1.5">
                  <span
                    className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] text-[4px] font-extrabold text-white"
                    style={{ background: accent }}
                  >
                    OB
                  </span>
                  <div className="min-w-0">
                    <p className="text-[4px] font-bold">
                      Order Bot <span className="rounded-[2px] bg-white/10 px-0.5 text-[3px] font-medium text-white/50">APP</span>
                    </p>
                    <p className="text-[4.5px] leading-snug text-white/85">🛒 New order #1042 received</p>
                    <div
                      className="mt-1 rounded-[3px] border-l-2 bg-white/[0.04] px-1 py-[2px] text-[3.8px] text-white/70"
                      style={{ borderColor: accent }}
                    >
                      $128.00 · 3 items · Sarah K. (Lahore)
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Sheets row appended */}
              <div className="flex flex-1 flex-col overflow-hidden rounded-md border border-white/[0.08] bg-white text-[#22263a]">
                <div className="flex items-center gap-1 border-b border-black/[0.06] px-1.5 py-[3px]">
                  <span className="h-1.5 w-1.5 rounded-[2px] bg-[#0f9d58]" />
                  <span className="text-[4px] font-bold">Orders</span>
                  <span className="text-[3px] font-semibold uppercase tracking-wider text-[#9aa0ae]">
                    Google Sheets
                  </span>
                  <span className="ml-auto text-[3.5px] font-bold" style={{ color: "#0f9d58" }}>
                    + row added
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="grid grid-cols-3 gap-1 px-1.5 py-[2px] text-[3.5px] font-bold text-[#8a90a0]">
                    <span>Order</span>
                    <span className="text-right">Amount</span>
                    <span className="text-right">Status</span>
                  </div>
                  {[
                    { o: "#1040", a: "$86.00", s: "Shipped", hot: false },
                    { o: "#1041", a: "$54.00", s: "Paid", hot: false },
                    { o: "#1042", a: "$128.00", s: "New", hot: true },
                  ].map((r) => (
                    <div
                      key={r.o}
                      className="grid grid-cols-3 gap-1 px-1.5 py-[2px] text-[3.8px]"
                      style={r.hot ? { background: `${accent}22`, fontWeight: 700 } : undefined}
                    >
                      <span>{r.o}</span>
                      <span className="text-right">{r.a}</span>
                      <span className="text-right" style={{ color: r.hot ? "#c07a2d" : "#8a90a0" }}>
                        {r.s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* footer stats */}
          <div className="mt-1 flex items-center gap-1">
            <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-[3px] text-[4px] text-white/60">
              Runs today <span className="font-extrabold" style={{ color: accent }}>142</span>
            </span>
            <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-[3px] text-[4px] text-white/60">
              Saved <span className="font-extrabold" style={{ color: accent }}>3 hrs / wk</span>
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
