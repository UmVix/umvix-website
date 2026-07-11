"use client";

/**
 * Extra prototype visuals unique to the home Smart Solutions collage —
 * same console-scene language as the portfolio cards, but these designs
 * exist only here to round out the Agentic AI and Automation previews.
 */

function ConsoleScene({
  accent,
  label,
  badge,
  children,
}: {
  accent: string;
  label: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#050507]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 85% 60% at 22% 8%, ${accent}30, transparent 58%), radial-gradient(ellipse 70% 55% at 88% 95%, ${accent}1c, transparent 55%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-[-12%] left-1/2 h-[38%] w-[75%] -translate-x-1/2 rounded-[100%] blur-2xl"
        style={{ background: `radial-gradient(ellipse, ${accent}38, transparent 70%)` }}
      />
      <div
        className="absolute inset-x-[9%] top-[13%] h-full overflow-hidden rounded-xl border border-white/12 bg-[#0b0b0e]"
        style={{
          boxShadow: `0 30px 60px -18px rgba(0,0,0,0.9), 0 0 50px -12px ${accent}45, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        <div className="flex h-5 items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.04] px-2">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: accent, boxShadow: `0 0 6px ${accent}`, animation: "soft-pulse 2s ease-in-out infinite" }}
          />
          <span className="text-[6px] font-semibold uppercase tracking-widest text-white/55">{label}</span>
          <span
            className="ml-auto rounded-full px-1.5 py-[1px] text-[5px] font-bold uppercase tracking-wider"
            style={{ background: `${accent}22`, color: accent }}
          >
            {badge}
          </span>
        </div>
        <div className="h-[calc(100%-1.25rem)]">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- AI · realtime voice agent ---------------- */

export function VoiceAgentVisual({ accent = "#fb7185" }: { accent?: string }) {
  return (
    <ConsoleScene accent={accent} label="Voice Agent" badge="Live">
      <div className="flex h-full flex-col items-center justify-center gap-2 p-2 text-white">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: `${accent}1f`, boxShadow: `0 0 20px ${accent}55` }}
        >
          <div
            className="h-4 w-4 rounded-full"
            style={{ background: accent, animation: "soft-pulse 1.6s ease-in-out infinite" }}
          />
        </div>
        <div className="flex h-8 items-center gap-[3px]">
          {[35, 62, 88, 50, 100, 72, 92, 46, 78, 58, 96, 40, 66, 84, 38].map((h, i) => (
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
        <div className="w-[72%] rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-1">
          <p className="text-[4px] font-bold uppercase tracking-widest text-white/35">Caller</p>
          <p className="text-[5px] text-white/85">&ldquo;I&rsquo;d like to move my appointment to Friday.&rdquo;</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="rounded-full px-1.5 py-[1.5px] text-[4.5px] font-bold"
            style={{ background: `${accent}22`, color: accent }}
          >
            Intent · Reschedule
          </span>
          <span className="rounded-full border border-white/10 px-1.5 py-[1.5px] text-[4.5px] text-white/55">
            Fri 2:30 PM booked ✓
          </span>
        </div>
      </div>
    </ConsoleScene>
  );
}

/* ---------------- AI · document intelligence ---------------- */

export function DocuExtractVisual({ accent = "#fbbf24" }: { accent?: string }) {
  return (
    <ConsoleScene accent={accent} label="Docu Extract" badge="AI">
      <div className="flex h-full gap-2 p-2 text-white">
        <div className="relative flex w-[42%] flex-col gap-1 overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.04] p-1.5">
          <div className="h-1 w-[55%] rounded-full bg-white/30" />
          {["90%", "82%", "70%", "88%", "60%", "78%", "46%"].map((w, i) => (
            <div key={i} className="h-1 rounded-full bg-white/15" style={{ width: w }} />
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
              style={{
                borderColor: i === 0 ? `${accent}66` : "rgba(255,255,255,0.08)",
                background: i === 0 ? `${accent}14` : "rgba(255,255,255,0.03)",
              }}
            >
              <span className="h-1 w-1 rounded-full" style={{ background: accent }} />
              <span className="text-[6px] font-medium text-white/75">{t}</span>
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
    </ConsoleScene>
  );
}

/* ---------------- Automation · morning report digest ---------------- */

export function ReportDigestVisual({ accent = "#f472b6" }: { accent?: string }) {
  return (
    <ConsoleScene accent={accent} label="Automation" badge="Daily">
      <div className="flex h-full flex-col p-2 text-white">
        <p className="text-[6px] font-extrabold leading-tight">Morning Digest</p>
        <p className="mb-1.5 text-[4px] text-white/40">Every day at 9:00 — metrics summarized and delivered</p>

        {/* horizontal flow */}
        <div className="flex items-center gap-1">
          {[
            { k: "Trigger", v: "9:00 AM", app: "Cron" },
            { k: "Summarize", v: "KPIs + trends", app: "Claude" },
            { k: "Deliver", v: "Team inbox", app: "Gmail" },
          ].map((s, i, arr) => (
            <div key={s.k} className="flex min-w-0 flex-1 items-center gap-1">
              <div
                className="min-w-0 flex-1 rounded-md border p-1"
                style={
                  i === 0
                    ? { borderColor: `${accent}66`, background: `${accent}12` }
                    : { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }
                }
              >
                <p className="text-[3.5px] font-bold uppercase tracking-wider" style={{ color: i === 0 ? accent : "rgba(255,255,255,0.4)" }}>
                  {s.k} · {s.app}
                </p>
                <p className="truncate text-[4.5px] font-semibold text-white/85">{s.v}</p>
              </div>
              {i < arr.length - 1 && (
                <span
                  className="h-1 w-1 shrink-0 rounded-full"
                  style={{ background: accent, animation: "soft-pulse 1.4s ease-in-out infinite", animationDelay: `${i * 0.4}s` }}
                />
              )}
            </div>
          ))}
        </div>

        {/* digest preview */}
        <div className="mt-1.5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-white/[0.08] bg-white text-[#22263a]">
          <div className="flex items-center gap-1 border-b border-black/[0.06] bg-[#f7f8fa] px-1.5 py-[3px]">
            <span className="text-[4px] font-bold text-[#5c6272]">📈 Your daily summary — Tue</span>
            <span className="ml-auto rounded-full px-1 py-[0.5px] text-[3.5px] font-bold text-white" style={{ background: "#28a745" }}>
              Sent ✓
            </span>
          </div>
          <div className="grid flex-1 grid-cols-3 gap-1 p-1.5">
            {[
              {
                l: "Revenue",
                v: "$4,120",
                d: "▲ 12%",
                bars: [45, 62, 38, 70, 55, 82, 96],
                rows: [
                  ["Stripe", "$3.2k"],
                  ["PayPal", "$920"],
                ],
              },
              {
                l: "Signups",
                v: "38",
                d: "▲ 9%",
                bars: [30, 52, 44, 66, 50, 74, 88],
                rows: [
                  ["Organic", "24"],
                  ["Referral", "14"],
                ],
              },
              {
                l: "Tickets",
                v: "6 open",
                d: "▼ 3",
                bars: [72, 58, 64, 42, 50, 32, 24],
                rows: [
                  ["Resolved", "11"],
                  ["Pending", "6"],
                ],
              },
            ].map((m) => (
              <div key={m.l} className="flex flex-col rounded-[4px] bg-[#f4f5f9] p-1">
                <p className="text-[3.5px] text-[#9aa0ae]">{m.l}</p>
                <p className="text-[5px] font-extrabold leading-tight">{m.v}</p>
                <p className="text-[3.5px] font-bold" style={{ color: accent }}>
                  {m.d}
                </p>
                {/* week sparkline */}
                <div className="mt-1 flex min-h-[8px] flex-1 items-end gap-[2px]">
                  {m.bars.map((h, i) => (
                    <span
                      key={i}
                      className="flex-1 rounded-t-[1.5px]"
                      style={{
                        height: `${h}%`,
                        background: i === m.bars.length - 1 ? accent : `${accent}55`,
                      }}
                    />
                  ))}
                </div>
                {/* breakdown */}
                <div className="mt-1 flex flex-col gap-[2px] border-t border-black/[0.05] pt-[3px]">
                  {m.rows.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-[3.5px] text-[#9aa0ae]">{k}</span>
                      <span className="text-[3.5px] font-bold text-[#22263a]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-1 flex items-center gap-1">
          <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-[2px] text-[4px] text-white/60">
            Sent this month <span className="font-extrabold" style={{ color: accent }}>22</span>
          </span>
          <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-[2px] text-[4px] text-white/60">
            Saved <span className="font-extrabold" style={{ color: accent }}>4 hrs / wk</span>
          </span>
        </div>
      </div>
    </ConsoleScene>
  );
}

/* ---------------- Automation · invoice sync ---------------- */

export function InvoiceSyncVisual({ accent = "#22d3ee" }: { accent?: string }) {
  return (
    <ConsoleScene accent={accent} label="Automation" badge="Active">
      <div className="flex h-full flex-col p-2 text-white">
        <p className="text-[6px] font-extrabold leading-tight">Invoice Sync</p>
        <p className="mb-1.5 text-[4px] text-white/40">New invoices parsed and posted to accounting</p>

        <div className="grid min-h-0 flex-1 grid-cols-2 gap-1.5">
          {/* incoming files */}
          <div className="flex flex-col gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] p-1.5">
            <span className="text-[4px] font-bold uppercase tracking-wider text-white/40">Drive · Inbox</span>
            {["INV-1042.pdf", "INV-1041.pdf", "INV-1040.pdf"].map((f, i) => (
              <div
                key={f}
                className="flex items-center gap-1 rounded-[4px] border px-1 py-[3px]"
                style={
                  i === 0
                    ? { borderColor: `${accent}66`, background: `${accent}12` }
                    : { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }
                }
              >
                <span
                  className="flex h-2.5 w-2 items-center justify-center rounded-[2px] text-[3px] font-bold"
                  style={{ background: i === 0 ? accent : "rgba(255,255,255,0.12)", color: i === 0 ? "#0b0b0e" : "white" }}
                >
                  P
                </span>
                <span className="truncate text-[4.2px] text-white/80">{f}</span>
                {i === 0 && (
                  <span className="ml-auto flex gap-[1px]">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="h-[2px] w-[2px] rounded-full"
                        style={{ background: accent, animation: "thinking-bounce 1.4s ease-in-out infinite", animationDelay: `${d * 0.18}s` }}
                      />
                    ))}
                  </span>
                )}
              </div>
            ))}
            <div className="mt-auto">
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[66%] rounded-full" style={{ background: accent }} />
              </div>
              <p className="mt-0.5 text-[3.5px] text-white/45">Parsing 2 of 3…</p>
            </div>
          </div>

          {/* posted to accounting */}
          <div className="flex flex-col gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] p-1.5">
            <span className="text-[4px] font-bold uppercase tracking-wider text-white/40">QuickBooks · Posted</span>
            {[
              { n: "Acme Corp", a: "$2,400" },
              { n: "Northline Ltd", a: "$1,180" },
              { n: "Bright & Co", a: "$860" },
            ].map((r) => (
              <div key={r.n} className="flex items-center justify-between rounded-[4px] bg-white/[0.02] px-1 py-[3px]">
                <span className="truncate text-[4.2px] text-white/75">{r.n}</span>
                <span className="text-[4.2px] font-bold" style={{ color: accent }}>
                  {r.a}
                </span>
              </div>
            ))}
            <span className="mt-auto flex items-center gap-1 text-[3.8px] text-white/50">
              <span className="h-1 w-1 rounded-full" style={{ background: accent }} />
              3 posted today · 0 errors
            </span>
          </div>
        </div>
      </div>
    </ConsoleScene>
  );
}
