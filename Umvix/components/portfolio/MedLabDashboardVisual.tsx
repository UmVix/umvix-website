"use client";

/**
 * Recreation of the MedLab Pro lab-management dashboard as a miniature
 * live UI (same scene language as ProjectVisual) — warm clinic theme,
 * sidebar modules, stat cards, patients queue, and quick entry panel.
 */

type Props = {
  accent: string;
  title: string;
};

const NAV = [
  { l: "Dashboard", badge: "" },
  { l: "Patients", badge: "248" },
  { l: "New Test Order", badge: "" },
  { l: "Results", badge: "5" },
  { l: "Ultrasound", badge: "" },
  { l: "X-Ray Reports", badge: "" },
  { l: "Analytics", badge: "" },
  { l: "Billing", badge: "" },
  { l: "Inventory", badge: "" },
  { l: "Staff", badge: "" },
];

const STATS = [
  { l: "Today's Patients", v: "34", d: "↑ 8 vs yesterday", bar: "#c1794a" },
  { l: "Results Ready", v: "21", d: "62% completion", bar: "#3d9960" },
  { l: "Pending Tests", v: "9", d: "3 awaiting samples", bar: "#d9a53a" },
  { l: "Critical", v: "4", d: "Needs review", bar: "#d5484a" },
];

const PATIENTS = [
  { id: "ML-034", n: "Muhammad Tariq", t: "CBC + LFT + RFT", s: "Ready", c: "#3d9960" },
  { id: "ML-033", n: "Ayesha Bibi", t: "Thyroid Profile", s: "Urgent", c: "#d5484a" },
  { id: "ML-032", n: "Zubair Hassan", t: "Blood Sugar", s: "Processing", c: "#4a7dd0" },
  { id: "ML-031", n: "Nazia Khatoon", t: "Urine R/E", s: "Ready", c: "#3d9960" },
];

export default function MedLabDashboardVisual({ accent, title }: Props) {
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

      {/* browser frame */}
      <div
        className="absolute inset-x-[7%] top-[11%] h-full overflow-hidden rounded-lg border border-white/12 bg-[#0b0b0e] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.02]"
        style={{
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
            app.medlabpro.com
          </span>
        </div>

        {/* dashboard UI */}
        <div className="flex h-[calc(100%-1.25rem)] flex-col bg-[#faf6f1] text-[#33261d]">
          {/* top brand bar */}
          <div
            className="flex items-center justify-between px-1.5 py-[3px] text-white"
            style={{ background: `linear-gradient(90deg, ${accent}, ${accent}dd)` }}
          >
            <span className="text-[5.5px] font-extrabold tracking-wide">MedLab Pro</span>
            <span className="flex items-center gap-1 text-[4px] text-white/80">
              Al-Shifa Diagnostic Centre
              <span className="flex h-2.5 items-center rounded-full bg-white/20 px-1 text-[3.5px] font-bold">
                Super Admin
              </span>
            </span>
          </div>

          <div className="flex min-h-0 flex-1">
            {/* sidebar */}
            <div className="flex w-[21%] flex-col gap-[2.5px] border-r border-black/[0.06] bg-white p-1">
              {NAV.map((item, i) => (
                <div
                  key={item.l}
                  className="flex items-center gap-1 rounded-[3px] px-1 py-[2px]"
                  style={i === 0 ? { background: accent } : undefined}
                >
                  <span
                    className="h-[3px] w-[3px] rounded-[1px]"
                    style={{ background: i === 0 ? "white" : "#d3c4b8" }}
                  />
                  <span
                    className="truncate text-[4px] font-semibold"
                    style={{ color: i === 0 ? "white" : "#8a7466" }}
                  >
                    {item.l}
                  </span>
                  {item.badge && (
                    <span
                      className="ml-auto rounded-full px-[3px] text-[3px] font-bold"
                      style={{ background: `${accent}1a`, color: accent }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* main */}
            <div className="flex min-w-0 flex-1 flex-col gap-1 p-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[6px] font-extrabold leading-tight">Dashboard</p>
                  <p className="text-[3.5px] text-[#a08b7c]">Wednesday, 4 March 2026</p>
                </div>
                <span
                  className="rounded-full px-1.5 py-[2px] text-[4px] font-bold text-white"
                  style={{ background: accent }}
                >
                  + New Patient
                </span>
              </div>

              {/* stat cards with colored top borders */}
              <div className="grid grid-cols-4 gap-1">
                {STATS.map((s) => (
                  <div
                    key={s.l}
                    className="overflow-hidden rounded-md bg-white shadow-[0_1px_4px_rgba(60,40,20,0.06)]"
                  >
                    <div className="h-[2.5px]" style={{ background: s.bar }} />
                    <div className="p-1">
                      <p className="truncate text-[3.5px] uppercase tracking-wide text-[#a08b7c]">
                        {s.l}
                      </p>
                      <p className="text-[7px] font-extrabold leading-tight">{s.v}</p>
                      <p className="truncate text-[3.5px] text-[#8a7466]">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* bottom: patients queue + right rail */}
              <div className="grid min-h-0 flex-1 grid-cols-[1.7fr_1fr] gap-1">
                {/* patients table */}
                <div className="flex flex-col overflow-hidden rounded-md bg-white shadow-[0_1px_4px_rgba(60,40,20,0.06)]">
                  <div className="flex items-center justify-between px-1.5 py-[3px]">
                    <span className="text-[4.5px] font-extrabold">Today&apos;s Patients</span>
                    <span className="rounded-full border border-black/10 px-1 py-[1px] text-[3.5px] text-[#8a7466]">
                      Filter
                    </span>
                  </div>
                  <div
                    className="grid grid-cols-[0.8fr_1.4fr_1.5fr_0.8fr] gap-1 px-1.5 py-[2.5px] text-[3.5px] font-bold uppercase tracking-wide"
                    style={{ background: `${accent}12`, color: accent }}
                  >
                    <span>ID</span>
                    <span>Name</span>
                    <span>Test</span>
                    <span className="text-right">Status</span>
                  </div>
                  {PATIENTS.map((p) => (
                    <div
                      key={p.id}
                      className="grid grid-cols-[0.8fr_1.4fr_1.5fr_0.8fr] items-center gap-1 border-b border-black/[0.04] px-1.5 py-[2.5px]"
                    >
                      <span className="text-[3.8px] text-[#a08b7c]">{p.id}</span>
                      <span className="truncate text-[4.2px] font-bold">{p.n}</span>
                      <span className="truncate text-[3.8px] text-[#8a7466]">{p.t}</span>
                      <span className="flex justify-end">
                        <span
                          className="rounded-full px-1 py-[1px] text-[3.2px] font-bold"
                          style={{ background: `${p.c}18`, color: p.c }}
                        >
                          {p.s}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>

                {/* right rail: revenue + tests mix */}
                <div className="flex flex-col gap-1">
                  <div className="rounded-md bg-white p-1 shadow-[0_1px_4px_rgba(60,40,20,0.06)]">
                    <p className="text-[3.5px] uppercase tracking-wide text-[#a08b7c]">
                      Revenue Today
                    </p>
                    <p className="text-[6.5px] font-extrabold leading-tight">$2,840</p>
                    <p className="text-[3.5px] font-bold" style={{ color: "#3d9960" }}>
                      ▲ 14% vs yesterday
                    </p>
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col gap-[3px] rounded-md bg-white p-1 shadow-[0_1px_4px_rgba(60,40,20,0.06)]">
                    <span className="text-[4px] font-extrabold">Tests Mix</span>
                    {[
                      { l: "Blood", w: 82 },
                      { l: "Thyroid", w: 58 },
                      { l: "Urine", w: 44 },
                      { l: "X-Ray", w: 30 },
                    ].map((t) => (
                      <div key={t.l} className="flex items-center gap-1">
                        <span className="w-5 shrink-0 text-[3.5px] text-[#8a7466]">{t.l}</span>
                        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-[#f0e7dd]">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${t.w}%`, background: accent }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* glass shine sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.09] to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
      <span className="sr-only">{title} dashboard preview</span>
    </div>
  );
}
