"use client";

/**
 * Procedural, high-fidelity project preview: renders a device mockup
 * (browser / phone / AI console) with a miniature UI inside, ambient
 * scene lighting, floor glow, and a glass shine. Pure CSS/JSX — no
 * flat placeholder images. `variant` picks one of 4 screen layouts
 * per kind; `accent` tints the whole scene per project.
 */

export type VisualKind = "web" | "ai" | "mobile";

type Props = {
  kind: VisualKind;
  variant: number;
  accent: string;
  title: string;
};

/* ---------------------------------- tiny building blocks ---------------------------------- */

function Line({ w, className = "" }: { w: string; className?: string }) {
  return <div className={`h-1 rounded-full bg-white/15 ${className}`} style={{ width: w }} />;
}

function AnimBar({
  h,
  accent,
  delay,
  dim = false,
}: {
  h: string;
  accent: string;
  delay: number;
  dim?: boolean;
}) {
  return (
    <div
      className="w-full origin-bottom rounded-t-[2px]"
      style={{
        height: h,
        background: dim
          ? "rgba(255,255,255,0.14)"
          : `linear-gradient(180deg, ${accent}, ${accent}55)`,
        animation: "rise-bar 2.6s ease-in-out infinite",
        animationDelay: `${delay}s`,
      }}
    />
  );
}

/* ---------------------------------- web screens (light, realistic) ---------------------------------- */

function WebScreen({ variant, accent, brand }: { variant: number; accent: string; brand: string }) {
  switch (variant) {
    // 0 — analytics dashboard (light SaaS admin)
    case 0:
      return (
        <div className="flex h-full bg-[#f4f5f9] text-[#22263a]">
          <div className="flex w-[24%] flex-col gap-1 border-r border-black/[0.06] bg-white p-1.5">
            <div className="mb-0.5 flex items-center gap-1">
              <span className="h-2 w-2 shrink-0 rounded-[3px]" style={{ background: accent }} />
              <span className="truncate text-[6px] font-extrabold">{brand}</span>
            </div>
            {["Dashboard", "Analytics", "Reports", "Team", "Settings"].map((l, i) => (
              <div
                key={l}
                className="flex items-center gap-1 rounded-[4px] px-1 py-0.5"
                style={i === 0 ? { background: `${accent}14` } : undefined}
              >
                <span className="h-1 w-1 rounded-full" style={{ background: i === 0 ? accent : "#c3c8d4" }} />
                <span className="text-[5px] font-semibold" style={{ color: i === 0 ? accent : "#8a90a0" }}>
                  {l}
                </span>
              </div>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1 p-1.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[7px] font-extrabold leading-tight">Overview</p>
                <p className="text-[4.5px] text-[#9aa0ae]">Welcome back, Alex</p>
              </div>
              <span className="rounded-full bg-white px-1.5 py-0.5 text-[4.5px] font-semibold text-[#8a90a0] shadow-sm">
                Last 30 days
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { v: "$84.2k", l: "Revenue", d: "+24%" },
                { v: "12,483", l: "Users", d: "+8.1%" },
                { v: "4.9%", l: "Conversion", d: "+1.2%" },
              ].map((s) => (
                <div key={s.l} className="rounded-md bg-white p-1 shadow-[0_1px_4px_rgba(30,33,66,0.06)]">
                  <p className="text-[4.5px] text-[#9aa0ae]">{s.l}</p>
                  <p className="text-[7px] font-extrabold leading-tight">{s.v}</p>
                  <p className="text-[4.5px] font-bold" style={{ color: accent }}>
                    ▲ {s.d}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex min-h-0 flex-1 flex-col rounded-md bg-white p-1 shadow-[0_1px_4px_rgba(30,33,66,0.06)]">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[5px] font-bold">Revenue</span>
                <span className="text-[4.5px] font-bold" style={{ color: accent }}>
                  ▲ 18.2%
                </span>
              </div>
              <div className="flex min-h-0 flex-1 items-end gap-[3px] px-0.5 pt-1">
                {[38, 55, 42, 70, 52, 85, 62, 92, 74, 60, 88, 100].map((h, i) => (
                  <div
                    key={i}
                    className="w-full origin-bottom rounded-t-[2px]"
                    style={{
                      height: `${h}%`,
                      background:
                        i % 3 === 1 ? `${accent}30` : `linear-gradient(180deg, ${accent}, ${accent}88)`,
                      animation: "rise-bar 2.6s ease-in-out infinite",
                      animationDelay: `${i * 0.12}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    // 1 — e-commerce storefront (light)
    case 1:
      return (
        <div className="flex h-full flex-col bg-white text-[#22263a]">
          <div className="flex items-center justify-between border-b border-black/[0.05] px-2 py-1">
            <span className="text-[6.5px] font-extrabold tracking-wide">{brand.toUpperCase()}</span>
            <div className="flex items-center gap-1.5 text-[4.5px] font-semibold text-[#8a90a0]">
              <span style={{ color: accent }}>Shop</span>
              <span>New</span>
              <span>Sale</span>
              <span
                className="flex h-3 w-3 items-center justify-center rounded-full text-[4px] font-bold text-white"
                style={{ background: accent }}
              >
                2
              </span>
            </div>
          </div>
          <div
            className="relative mx-1.5 mt-1 flex h-[32%] shrink-0 items-center overflow-hidden rounded-md p-1.5"
            style={{ background: `linear-gradient(115deg, ${accent} 0%, ${accent}99 60%, ${accent}55)` }}
          >
            <div>
              <p className="text-[7px] font-extrabold leading-tight text-white">New Season Drop</p>
              <p className="text-[4.5px] text-white/80">Up to 40% off this week only</p>
              <span
                className="mt-0.5 inline-block rounded-full bg-white px-1.5 py-0.5 text-[4.5px] font-bold"
                style={{ color: accent }}
              >
                Shop Now
              </span>
            </div>
            <div className="absolute -right-2 -top-2 h-12 w-12 rounded-full bg-white/20 blur-[1px]" />
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-3 gap-1.5 p-1.5">
            {[
              { n: "Aria Sneakers", p: "$89" },
              { n: "Halo Watch", p: "$199" },
              { n: "Flux Backpack", p: "$59" },
            ].map((it, i) => (
              <div
                key={it.n}
                className="flex flex-col overflow-hidden rounded-md border border-black/[0.06] bg-white shadow-[0_1px_4px_rgba(30,33,66,0.05)]"
              >
                <div
                  className="flex-1"
                  style={{ background: `linear-gradient(145deg, ${accent}${i === 1 ? "55" : "2b"}, #f2f3f7)` }}
                />
                <div className="p-1">
                  <p className="truncate text-[5px] font-bold">{it.n}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[4.5px] text-[#9aa0ae]">★ 4.9</span>
                    <span className="text-[5.5px] font-extrabold" style={{ color: accent }}>
                      {it.p}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    // 2 — SaaS landing page (light)
    case 2:
      return (
        <div className="flex h-full flex-col items-center bg-white px-2 pt-2 text-center text-[#22263a]">
          <span
            className="rounded-full px-1.5 py-[1px] text-[4.5px] font-bold"
            style={{ background: `${accent}14`, color: accent }}
          >
            ✦ {brand} 2.0 is live
          </span>
          <p className="mt-1 text-[8px] font-extrabold leading-tight">
            Ship products <span style={{ color: accent }}>10x faster</span>
          </p>
          <p className="mt-0.5 text-[4.5px] text-[#9aa0ae]">The all-in-one platform for modern teams.</p>
          <div className="mt-1 flex gap-1">
            <span
              className="rounded-full px-2 py-0.5 text-[4.5px] font-bold text-white"
              style={{ background: accent, boxShadow: `0 2px 6px ${accent}55` }}
            >
              Start Free
            </span>
            <span className="rounded-full border border-black/10 px-2 py-0.5 text-[4.5px] font-semibold text-[#5c6272]">
              Book Demo
            </span>
          </div>
          <div className="mt-1.5 grid w-full min-h-0 flex-1 grid-cols-3 gap-1.5 pb-1.5">
            {[
              { n: "Analytics", d: "Real-time insights" },
              { n: "Automation", d: "Zero-touch flows" },
              { n: "Security", d: "SOC-2 compliant" },
            ].map((f, i) => (
              <div
                key={f.n}
                className="flex flex-col items-start gap-0.5 rounded-md border border-black/[0.06] bg-[#fafbfd] p-1.5 text-left"
              >
                <span
                  className="flex h-3 w-3 items-center justify-center rounded-[4px]"
                  style={{ background: i === 1 ? accent : `${accent}22` }}
                >
                  <span className="h-1 w-1 rounded-full" style={{ background: i === 1 ? "white" : accent }} />
                </span>
                <p className="text-[5px] font-bold">{f.n}</p>
                <p className="text-[4px] leading-tight text-[#9aa0ae]">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      );
    // 3 — logistics / ops portal (light, live map)
    default:
      return (
        <div className="flex h-full gap-1.5 bg-[#f4f5f9] p-1.5 text-[#22263a]">
          <div className="flex min-w-0 flex-[1.5] flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[6.5px] font-extrabold">Shipments</p>
              <span
                className="rounded-full px-1.5 py-0.5 text-[4.5px] font-bold text-white"
                style={{ background: accent }}
              >
                + New
              </span>
            </div>
            {[
              { id: "#SH-2041", r: "LA → NYC", s: "In Transit", live: true },
              { id: "#SH-2038", r: "BER → DXB", s: "Delivered", live: false },
              { id: "#SH-2033", r: "TYO → SFO", s: "In Transit", live: true },
              { id: "#SH-2029", r: "LDN → DOH", s: "Customs", live: false },
            ].map((row) => (
              <div
                key={row.id}
                className="flex items-center gap-1 rounded-md bg-white px-1.5 py-1 shadow-[0_1px_3px_rgba(30,33,66,0.05)]"
              >
                <span className="text-[5px] font-bold">{row.id}</span>
                <span className="truncate text-[4.5px] text-[#9aa0ae]">{row.r}</span>
                <span
                  className="ml-auto shrink-0 rounded-full px-1 py-[1px] text-[4px] font-bold"
                  style={
                    row.live
                      ? { background: `${accent}18`, color: accent }
                      : { background: "#e8f5ec", color: "#3d9960" }
                  }
                >
                  {row.s}
                </span>
              </div>
            ))}
          </div>
          <div className="relative flex-1 overflow-hidden rounded-md bg-white shadow-[0_1px_3px_rgba(30,33,66,0.05)]">
            <svg viewBox="0 0 60 80" className="h-full w-full">
              {[16, 32, 48, 64].map((y) => (
                <line key={y} x1="0" y1={y} x2="60" y2={y} stroke="#eef1f6" strokeWidth="1" />
              ))}
              {[15, 30, 45].map((x) => (
                <line key={x} x1={x} y1="0" x2={x} y2="80" stroke="#eef1f6" strokeWidth="1" />
              ))}
              <path
                d="M8 62 Q20 40 32 44 T52 18"
                fill="none"
                stroke={accent}
                strokeWidth="1.4"
                strokeDasharray="3 3"
                strokeLinecap="round"
              />
              {[
                [8, 62],
                [32, 44],
                [52, 18],
              ].map(([cx, cy], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="4" fill={accent} opacity="0.15">
                    <animate attributeName="r" values="3;6;3" dur="2.4s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx={cx} cy={cy} r="1.8" fill={accent} />
                </g>
              ))}
            </svg>
            <span
              className="absolute left-1 top-1 rounded-full bg-white px-1 py-[1px] text-[4px] font-bold shadow-sm"
              style={{ color: accent }}
            >
              ● Live Map
            </span>
          </div>
        </div>
      );
  }
}

/* ---------------------------------- AI screens ---------------------------------- */

function AIScreen({ variant, accent }: { variant: number; accent: string }) {
  switch (variant) {
    // 0 — chatbot conversation with typing indicator
    case 0:
      return (
        <div className="flex h-full flex-col gap-1.5 p-2">
          <div className="max-w-[62%] self-start rounded-lg rounded-tl-[3px] border border-white/[0.08] bg-white/[0.06] p-1.5">
            <Line w="60px" />
            <Line w="42px" className="mt-1" />
          </div>
          <div
            className="max-w-[58%] self-end rounded-lg rounded-tr-[3px] p-1.5"
            style={{ background: `linear-gradient(135deg, ${accent}e6, ${accent}99)` }}
          >
            <div className="h-1 w-14 rounded-full bg-white/70" />
            <div className="mt-1 h-1 w-9 rounded-full bg-white/50" />
          </div>
          <div className="max-w-[66%] self-start rounded-lg rounded-tl-[3px] border border-white/[0.08] bg-white/[0.06] p-1.5">
            <Line w="70px" />
            <Line w="52px" className="mt-1" />
            <Line w="30px" className="mt-1" />
          </div>
          <div className="flex items-center gap-1 self-start rounded-full border border-white/[0.08] bg-white/[0.06] px-2 py-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1 w-1 rounded-full"
                style={{
                  background: accent,
                  animation: "thinking-bounce 1.4s ease-in-out infinite",
                  animationDelay: `${i * 0.18}s`,
                }}
              />
            ))}
          </div>
          <div className="mt-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1">
            <Line w="50%" />
            <div className="ml-auto h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
          </div>
        </div>
      );
    // 1 — automation workflow: connected nodes with pulsing signal
    case 1:
      return (
        <div className="relative h-full p-2">
          <svg viewBox="0 0 200 110" className="h-full w-full">
            <defs>
              <linearGradient id={`flow-${accent.slice(1)}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={accent} stopOpacity="0.15" />
                <stop offset="100%" stopColor={accent} stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {[
              "M42 32 C70 32 70 55 96 55",
              "M42 82 C70 82 70 55 96 55",
              "M128 55 L158 55",
            ].map((d, i) => (
              <g key={i}>
                <path d={d} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.6" />
                <path d={d} fill="none" stroke={`url(#flow-${accent.slice(1)})`} strokeWidth="1.6" strokeDasharray="6 60">
                  <animate attributeName="stroke-dashoffset" values="66;0" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                </path>
              </g>
            ))}
            {[
              { x: 12, y: 22, w: 30, active: false },
              { x: 12, y: 72, w: 30, active: false },
              { x: 96, y: 42, w: 32, active: true },
              { x: 158, y: 44, w: 30, active: false },
            ].map((n, i) => (
              <g key={i}>
                <rect
                  x={n.x}
                  y={n.y}
                  width={n.w}
                  height="22"
                  rx="5"
                  fill={n.active ? `${accent}26` : "rgba(255,255,255,0.05)"}
                  stroke={n.active ? accent : "rgba(255,255,255,0.16)"}
                  strokeWidth="1"
                />
                <circle cx={n.x + 8} cy={n.y + 11} r="2.5" fill={n.active ? accent : "rgba(255,255,255,0.35)"} />
                <rect x={n.x + 13} y={n.y + 9.5} width={n.w - 19} height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
              </g>
            ))}
          </svg>
          <span
            className="absolute right-2 top-2 rounded-full px-1.5 py-[2px] text-[5px] font-bold uppercase tracking-widest"
            style={{ background: `${accent}22`, color: accent }}
          >
            Live
          </span>
        </div>
      );
    // 2 — voice assistant: waveform + transcript
    case 2:
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: `${accent}1f`, boxShadow: `0 0 18px ${accent}44` }}
          >
            <div className="h-3.5 w-3.5 rounded-full" style={{ background: accent }} />
          </div>
          <div className="flex h-8 items-center gap-[3px]">
            {[35, 60, 85, 50, 100, 70, 90, 45, 75, 55, 95, 40, 65, 80, 38].map((h, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full"
                style={{
                  height: `${h}%`,
                  background: i % 3 === 0 ? accent : `${accent}77`,
                  animation: "waveform 1.1s ease-in-out infinite",
                  animationDelay: `${i * 0.07}s`,
                }}
              />
            ))}
          </div>
          <div className="flex flex-col items-center gap-1">
            <Line w="90px" className="!bg-white/30" />
            <Line w="60px" />
          </div>
        </div>
      );
    // 3 — document intelligence: scanned doc + extracted entities
    default:
      return (
        <div className="flex h-full gap-2 p-2">
          <div className="relative flex w-[42%] flex-col gap-1 overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.04] p-1.5">
            <Line w="55%" className="!bg-white/30" />
            {["90%", "82%", "70%", "88%", "60%", "78%", "45%"].map((w, i) => (
              <Line key={i} w={w} />
            ))}
            <div
              className="absolute inset-x-0 h-5 animate-scan"
              style={{ background: `linear-gradient(180deg, transparent, ${accent}33, transparent)` }}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="text-[5px] font-semibold uppercase tracking-widest text-white/40">Extracted</span>
            {["Invoice #4821", "Due · Mar 14", "Total · $12,400", "Vendor · Acme"].map((t, i) => (
              <div
                key={t}
                className="flex items-center gap-1.5 rounded-md border px-1.5 py-1"
                style={{ borderColor: i === 0 ? `${accent}66` : "rgba(255,255,255,0.08)", background: i === 0 ? `${accent}14` : "rgba(255,255,255,0.03)" }}
              >
                <span className="h-1 w-1 rounded-full" style={{ background: accent }} />
                <span className="text-[6px] font-medium text-white/70">{t}</span>
              </div>
            ))}
            <div className="mt-auto flex items-center gap-1">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[86%] rounded-full" style={{ background: accent }} />
              </div>
              <span className="text-[6px] font-bold" style={{ color: accent }}>
                98%
              </span>
            </div>
          </div>
        </div>
      );
  }
}

/* ---------------------------------- mobile screens (light, realistic) ---------------------------------- */

function MobileStatusBar() {
  return (
    <div className="flex w-full items-center justify-between px-1 pb-0.5 text-[4.5px] font-bold text-[#22263a]">
      <span>9:41</span>
      <span className="flex items-center gap-0.5">
        <span className="h-[3px] w-[3px] rounded-full bg-[#22263a]/60" />
        <span className="h-[3px] w-[3px] rounded-full bg-[#22263a]/60" />
        <span className="h-1 w-2 rounded-[1px] bg-[#22263a]/70" />
      </span>
    </div>
  );
}

function MobileScreen({ variant, accent }: { variant: number; accent: string }) {
  switch (variant) {
    // 0 — fintech wallet
    case 0:
      return (
        <div className="flex h-full flex-col gap-1 bg-[#f6f7fb] p-1.5 pt-1 text-[#22263a]">
          <MobileStatusBar />
          <div
            className="rounded-lg p-1.5 text-white"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
              boxShadow: `0 3px 8px ${accent}44`,
            }}
          >
            <p className="text-[4.5px] text-white/75">Total Balance</p>
            <p className="text-[9px] font-extrabold leading-tight">$24,580.50</p>
            <p className="mt-0.5 text-[4px] tracking-[0.2em] text-white/60">•••• 4821</p>
          </div>
          <div className="flex justify-between px-0.5">
            {["Send", "Pay", "Top-up", "More"].map((a, i) => (
              <div key={a} className="flex flex-col items-center gap-0.5">
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full"
                  style={{
                    background: i === 0 ? accent : "white",
                    boxShadow: "0 1px 3px rgba(30,33,66,0.1)",
                  }}
                >
                  <span className="h-1 w-1 rounded-full" style={{ background: i === 0 ? "white" : accent }} />
                </span>
                <span className="text-[4px] font-semibold text-[#5c6272]">{a}</span>
              </div>
            ))}
          </div>
          <p className="px-0.5 text-[5px] font-extrabold">Recent</p>
          {[
            { n: "Netflix", t: "Today", a: "-$12.99", neg: true },
            { n: "Salary", t: "Mar 1", a: "+$3,200", neg: false },
            { n: "Spotify", t: "Feb 28", a: "-$9.99", neg: true },
          ].map((tx) => (
            <div key={tx.n} className="flex items-center gap-1 rounded-md bg-white p-1 shadow-[0_1px_3px_rgba(30,33,66,0.05)]">
              <span
                className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full text-[4px] font-bold text-white"
                style={{ background: tx.neg ? "#22263a" : accent }}
              >
                {tx.n[0]}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[5px] font-bold leading-tight">{tx.n}</span>
                <span className="block text-[4px] text-[#9aa0ae]">{tx.t}</span>
              </span>
              <span
                className="ml-auto text-[5px] font-extrabold"
                style={{ color: tx.neg ? "#22263a" : "#3d9960" }}
              >
                {tx.a}
              </span>
            </div>
          ))}
        </div>
      );
    // 1 — health / fitness
    case 1:
      return (
        <div className="flex h-full flex-col items-center gap-1 bg-[#f6f7fb] p-1.5 pt-1 text-[#22263a]">
          <MobileStatusBar />
          <p className="self-start px-0.5 text-[6px] font-extrabold">Today</p>
          <div className="relative h-11 w-11">
            <svg viewBox="0 0 48 48" className="h-full w-full -rotate-90">
              <circle cx="24" cy="24" r="19" fill="none" stroke="#e6e9f0" strokeWidth="5" />
              <circle
                cx="24"
                cy="24"
                r="19"
                fill="none"
                stroke={accent}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="119.4"
                strokeDashoffset="30"
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[7px] font-extrabold leading-none">75%</span>
              <span className="text-[3.5px] text-[#9aa0ae]">goal</span>
            </span>
          </div>
          <div className="grid w-full min-h-0 flex-1 grid-cols-2 gap-1">
            {[
              { l: "Steps", v: "8,240" },
              { l: "Heart", v: "72 bpm" },
              { l: "Sleep", v: "7.5 h" },
              { l: "Energy", v: "540 kcal" },
            ].map((s, i) => (
              <div
                key={s.l}
                className="flex flex-col justify-center gap-0.5 rounded-md bg-white p-1.5 shadow-[0_1px_3px_rgba(30,33,66,0.05)]"
              >
                <span className="text-[4px] uppercase tracking-wider text-[#9aa0ae]">{s.l}</span>
                <span className="text-[6px] font-extrabold" style={{ color: i % 2 === 0 ? accent : "#22263a" }}>
                  {s.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    // 2 — food delivery / booking
    case 2:
      return (
        <div className="flex h-full flex-col gap-1 bg-white p-1.5 pt-1 text-[#22263a]">
          <MobileStatusBar />
          <div className="flex items-center gap-1 rounded-full bg-[#f2f3f7] px-1.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full border border-[#9aa0ae]" />
            <span className="text-[4.5px] text-[#9aa0ae]">Search food...</span>
          </div>
          <div className="flex gap-1">
            {["All", "Pizza", "Sushi"].map((c, i) => (
              <span
                key={c}
                className="rounded-full px-1.5 py-0.5 text-[4.5px] font-bold"
                style={
                  i === 0
                    ? { background: accent, color: "white" }
                    : { background: "#f2f3f7", color: "#5c6272" }
                }
              >
                {c}
              </span>
            ))}
          </div>
          {[
            { n: "Bella Italia", m: "★ 4.9 · 25 min", g: "55" },
            { n: "Sushi Zen", m: "★ 4.8 · 15 min", g: "2b" },
          ].map((r) => (
            <div
              key={r.n}
              className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-black/[0.05] shadow-[0_1px_3px_rgba(30,33,66,0.05)]"
            >
              <div className="flex-1" style={{ background: `linear-gradient(135deg, ${accent}${r.g}, #f2f3f7)` }} />
              <div className="flex items-center justify-between p-1">
                <span className="text-[5px] font-bold">{r.n}</span>
                <span className="text-[4.5px] font-semibold" style={{ color: accent }}>
                  {r.m}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    // 3 — social / messaging
    default:
      return (
        <div className="flex h-full flex-col gap-1 bg-white p-1.5 pt-1 text-[#22263a]">
          <MobileStatusBar />
          <p className="px-0.5 text-[6px] font-extrabold">Messages</p>
          <div className="flex gap-1.5 px-0.5">
            {["You", "Emma", "Alex", "Mia"].map((n, i) => (
              <div key={n} className="flex flex-col items-center gap-0.5">
                <div
                  className="h-4 w-4 rounded-full border-[1.5px] p-[1.5px]"
                  style={{ borderColor: i < 2 ? accent : "#e6e9f0" }}
                >
                  <div
                    className="h-full w-full rounded-full"
                    style={{ background: `linear-gradient(135deg, ${accent}44, #e6e9f0)` }}
                  />
                </div>
                <span className="text-[3.5px] font-semibold text-[#9aa0ae]">{n}</span>
              </div>
            ))}
          </div>
          {[
            { n: "Emma", m: "See you at 5! 🎉", t: "2m", unread: true },
            { n: "Team Sync", m: "Design review moved…", t: "1h", unread: false },
            { n: "Alex Chen", m: "Sent the files ✓", t: "3h", unread: false },
          ].map((c) => (
            <div key={c.n} className="flex items-center gap-1 rounded-md bg-[#f6f7fb] p-1">
              <span
                className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[4px] font-bold text-white"
                style={{ background: c.unread ? accent : "#c3c8d4" }}
              >
                {c.n[0]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[5px] font-bold leading-tight">{c.n}</span>
                <span className="block truncate text-[4px] text-[#9aa0ae]">{c.m}</span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-0.5">
                <span className="text-[3.5px] text-[#9aa0ae]">{c.t}</span>
                {c.unread && (
                  <span
                    className="flex h-2 w-2 items-center justify-center rounded-full text-[3.5px] font-bold text-white"
                    style={{ background: accent }}
                  >
                    2
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      );
  }
}

/* ---------------------------------- device frames ---------------------------------- */

function BrowserFrame({
  children,
  accent,
  url,
}: {
  children: React.ReactNode;
  accent: string;
  url: string;
}) {
  return (
    <div
      className="absolute inset-x-[9%] top-[12%] overflow-hidden rounded-lg border border-white/12 bg-[#0b0b0e] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.02]"
      style={{
        height: "100%",
        boxShadow: `0 30px 60px -18px rgba(0,0,0,0.9), 0 0 50px -12px ${accent}40, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      <div className="flex h-5 items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.04] px-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 flex flex-1 items-center gap-1 rounded-full bg-black/40 px-2 py-[2px] text-[6px] text-white/45">
          <svg width="5" height="6" viewBox="0 0 8 10" fill="currentColor" style={{ color: accent }}>
            <path d="M1 4V3a3 3 0 0 1 6 0v1h.5v6h-7V4H1zm1.5 0h3V3a1.5 1.5 0 0 0-3 0v1z" />
          </svg>
          {url}
        </span>
      </div>
      <div className="h-[calc(100%-1.25rem)]">{children}</div>
    </div>
  );
}

function PhoneFrame({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div
      className="absolute left-1/2 top-[10%] h-full w-[31%] -translate-x-1/2 rotate-[-3deg] overflow-hidden rounded-[1.4rem] border-[3px] border-[#1c1c1f] bg-[#0b0b0e] ring-1 ring-white/15 transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:rotate-[-1deg] group-hover:scale-[1.03]"
      style={{
        boxShadow: `0 30px 60px -18px rgba(0,0,0,0.9), 0 0 50px -10px ${accent}45, inset 0 1px 0 rgba(255,255,255,0.1)`,
      }}
    >
      <div className="absolute left-1/2 top-1 z-10 h-[7px] w-[36%] -translate-x-1/2 rounded-full bg-black ring-1 ring-black/40" />
      <div className="h-full">{children}</div>
    </div>
  );
}

function ConsoleFrame({
  children,
  accent,
  name,
}: {
  children: React.ReactNode;
  accent: string;
  name: string;
}) {
  return (
    <div
      className="absolute inset-x-[11%] top-[13%] overflow-hidden rounded-xl border border-white/12 bg-[#0b0b0e] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.02]"
      style={{
        height: "100%",
        boxShadow: `0 30px 60px -18px rgba(0,0,0,0.9), 0 0 50px -12px ${accent}45, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      <div className="flex h-5 items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.04] px-2">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: accent, boxShadow: `0 0 6px ${accent}`, animation: "soft-pulse 2s ease-in-out infinite" }}
        />
        <span className="text-[6px] font-semibold uppercase tracking-widest text-white/55">{name}</span>
        <span
          className="ml-auto rounded-full px-1.5 py-[1px] text-[5px] font-bold uppercase tracking-wider"
          style={{ background: `${accent}22`, color: accent }}
        >
          AI
        </span>
      </div>
      <div className="h-[calc(100%-1.25rem)]">{children}</div>
    </div>
  );
}

/* ---------------------------------- scene ---------------------------------- */

export default function ProjectVisual({ kind, variant, accent, title }: Props) {
  const v = ((variant % 4) + 4) % 4;

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
      {/* floor glow under the device */}
      <div
        aria-hidden
        className="absolute bottom-[-12%] left-1/2 h-[38%] w-[75%] -translate-x-1/2 rounded-[100%] blur-2xl"
        style={{ background: `radial-gradient(ellipse, ${accent}38, transparent 70%)` }}
      />

      {kind === "web" && (
        <BrowserFrame accent={accent} url={`${title.toLowerCase().split(" ")[0]}.com`}>
          <WebScreen variant={v} accent={accent} brand={title.split(" ")[0]} />
        </BrowserFrame>
      )}
      {kind === "ai" && (
        <ConsoleFrame accent={accent} name={title.split(" ")[0]}>
          <AIScreen variant={v} accent={accent} />
        </ConsoleFrame>
      )}
      {kind === "mobile" && (
        <>
          <PhoneFrame accent={accent}>
            <MobileScreen variant={v} accent={accent} />
          </PhoneFrame>
          {/* companion floating widget to fill the wide frame */}
          <div
            aria-hidden
            className="absolute right-[10%] top-[24%] hidden w-[22%] flex-col gap-1 rounded-lg border border-white/10 bg-[#0b0b0e]/90 p-1.5 backdrop-blur transition-transform duration-500 group-hover:-translate-y-2 sm:flex"
            style={{ boxShadow: `0 16px 40px -12px rgba(0,0,0,0.8), 0 0 24px -8px ${accent}40`, animation: "ambient-drift 7s ease-in-out infinite" }}
          >
            <span className="text-[5px] font-semibold uppercase tracking-widest text-white/40">Rating</span>
            <span className="text-[9px] font-extrabold" style={{ color: accent }}>
              ★ 4.9
            </span>
            <div className="flex gap-[2px]">
              {[60, 90, 45, 100, 70].map((h, i) => (
                <div key={i} className="flex h-4 flex-1 items-end">
                  <AnimBar h={`${h}%`} accent={accent} delay={i * 0.15} dim={i % 2 === 1} />
                </div>
              ))}
            </div>
          </div>
          <div
            aria-hidden
            className="absolute left-[12%] bottom-[16%] hidden items-center gap-1 rounded-full border border-white/10 bg-[#0b0b0e]/90 px-2 py-1 backdrop-blur sm:flex"
            style={{ boxShadow: `0 12px 30px -10px rgba(0,0,0,0.8)`, animation: "ambient-drift-alt 8s ease-in-out infinite" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
            <span className="text-[6px] font-semibold text-white/60">10k+ installs</span>
          </div>
        </>
      )}

      {/* glass shine sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.09] to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
      />
      {/* top glass reflection */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
    </div>
  );
}
