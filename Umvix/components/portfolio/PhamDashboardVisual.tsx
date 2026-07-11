"use client";

/**
 * Recreation of the PhamEnterprises Hub dashboard as a miniature live UI
 * (same scene language as ProjectVisual) — green ERP theme, sidebar
 * modules, USD stat cards, cash-flow chart, purchasers + payroll panels.
 */

type Props = {
  accent: string;
  title: string;
};

const NAV = [
  "Dashboard",
  "Purchasers",
  "Employee Salary",
  "Sub Contracts",
  "Inventory",
  "Invoices",
  "Reports",
  "Profile",
];

const STATS = [
  { l: "Received", v: "$140,000", d: "+12.4%" },
  { l: "Expenses", v: "$40,000", d: "-3.1%" },
  { l: "Balance", v: "$100,000", d: "+8.2%" },
  { l: "Payroll Due", v: "$12,400", d: "6 staff" },
];

const PURCHASERS = [
  { n: "Al-Madina Hardware", e: "$40,000", b: "$18,200", paid: true },
  { n: "Metro Steel Co.", e: "$26,500", b: "$9,400", paid: false },
  { n: "City Cement Depot", e: "$31,750", b: "$4,100", paid: true },
];

export default function PhamDashboardVisual({ accent, title }: Props) {
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
            hub.phamenterprises.com
          </span>
        </div>

        {/* dashboard UI */}
        <div className="flex h-[calc(100%-1.25rem)] bg-[#f2f5f3] text-[#1d2b24]">
          {/* sidebar */}
          <div className="flex w-[23%] flex-col gap-[3px] border-r border-black/[0.06] bg-white p-1.5">
            <div className="mb-1 flex items-center gap-1">
              <span
                className="flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full text-[4px] font-extrabold text-white"
                style={{ background: accent }}
              >
                P
              </span>
              <span className="truncate text-[5.5px] font-extrabold leading-tight">
                Pham Enterprises
              </span>
            </div>
            {NAV.map((l, i) => (
              <div
                key={l}
                className="flex items-center gap-1 rounded-[4px] px-1 py-[2.5px]"
                style={i === 0 ? { background: `${accent}14` } : undefined}
              >
                <span
                  className="h-[3.5px] w-[3.5px] rounded-[1px]"
                  style={{ background: i === 0 ? accent : "#c3cdc7" }}
                />
                <span
                  className="truncate text-[4.5px] font-semibold"
                  style={{ color: i === 0 ? accent : "#7d8a83" }}
                >
                  {l}
                </span>
              </div>
            ))}
            <div className="mt-auto flex items-center gap-1 px-1 opacity-70">
              <span className="h-[3.5px] w-[3.5px] rounded-[1px] bg-[#c3cdc7]" />
              <span className="text-[4.5px] font-semibold text-[#7d8a83]">Logout</span>
            </div>
          </div>

          {/* main */}
          <div className="flex min-w-0 flex-1 flex-col gap-1 p-1.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[6.5px] font-extrabold leading-tight">Overview</p>
                <p className="text-[4px] text-[#8b968f]">Welcome back, Pham Admin</p>
              </div>
              <span className="rounded-full bg-white px-1.5 py-0.5 text-[4px] font-semibold text-[#7d8a83] shadow-sm">
                This Month
              </span>
            </div>

            {/* stat cards */}
            <div className="grid grid-cols-4 gap-1">
              {STATS.map((s) => (
                <div key={s.l} className="rounded-md bg-white p-1 shadow-[0_1px_4px_rgba(20,40,30,0.06)]">
                  <p className="text-[4px] text-[#8b968f]">{s.l}</p>
                  <p className="text-[6px] font-extrabold leading-tight">{s.v}</p>
                  <p className="text-[4px] font-bold" style={{ color: accent }}>
                    {s.d}
                  </p>
                </div>
              ))}
            </div>

            {/* middle row: cash flow chart + payroll list */}
            <div className="grid min-h-0 grid-cols-[1.4fr_1fr] gap-1">
              <div className="flex flex-col rounded-md bg-white p-1 shadow-[0_1px_4px_rgba(20,40,30,0.06)]">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[4.5px] font-bold">Cash Flow</span>
                  <span className="text-[4px] font-bold" style={{ color: accent }}>
                    ▲ 18.2%
                  </span>
                </div>
                <div className="flex h-7 items-end gap-[2.5px] px-0.5 pt-0.5">
                  {[45, 70, 38, 82, 55, 90, 62, 100, 74, 58, 86, 68].map((h, i) => (
                    <div
                      key={i}
                      className="w-full origin-bottom rounded-t-[1.5px]"
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
              <div className="flex flex-col gap-[3px] rounded-md bg-white p-1 shadow-[0_1px_4px_rgba(20,40,30,0.06)]">
                <span className="text-[4.5px] font-bold">Payroll</span>
                {[
                  { n: "Site Crew A", a: "$4,200" },
                  { n: "Office Staff", a: "$5,600" },
                  { n: "Drivers", a: "$2,600" },
                ].map((r) => (
                  <div key={r.n} className="flex items-center justify-between">
                    <span className="truncate text-[4.5px] text-[#5f6b64]">{r.n}</span>
                    <span className="text-[4.5px] font-bold">{r.a}</span>
                  </div>
                ))}
                <div className="mt-auto h-[3px] overflow-hidden rounded-full bg-[#e7ece9]">
                  <div className="h-full w-[72%] rounded-full" style={{ background: accent }} />
                </div>
              </div>
            </div>

            {/* purchasers table */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md bg-white shadow-[0_1px_4px_rgba(20,40,30,0.06)]">
              <div
                className="grid grid-cols-[1.6fr_1fr_1fr_0.7fr] gap-1 px-1.5 py-[3px] text-[4px] font-bold text-white"
                style={{ background: accent }}
              >
                <span>Purchaser</span>
                <span className="text-right">Expense</span>
                <span className="text-right">Balance</span>
                <span className="text-right">Status</span>
              </div>
              {PURCHASERS.map((row) => (
                <div
                  key={row.n}
                  className="grid grid-cols-[1.6fr_1fr_1fr_0.7fr] items-center gap-1 border-b border-black/[0.04] px-1.5 py-[3px]"
                >
                  <span className="truncate text-[4.5px] font-bold">{row.n}</span>
                  <span className="text-right text-[4.5px] text-[#5f6b64]">{row.e}</span>
                  <span className="text-right text-[4.5px] font-bold" style={{ color: accent }}>
                    {row.b}
                  </span>
                  <span className="flex justify-end">
                    <span
                      className="rounded-full px-1 py-[1px] text-[3.5px] font-bold"
                      style={
                        row.paid
                          ? { background: `${accent}18`, color: accent }
                          : { background: "#fdf1e3", color: "#c07a2d" }
                      }
                    >
                      {row.paid ? "Paid" : "Pending"}
                    </span>
                  </span>
                </div>
              ))}
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
