"use client";

/**
 * Chatbot prototypes — three distinct chat UIs presented in the AI
 * console frame. variant 0 = website support widget (light),
 * 1 = dark AI copilot with sidebar, 2 = messaging booking bot.
 */

type Props = {
  variant: number;
  accent: string;
  title: string;
};

function TypingDots({ accent }: { accent: string }) {
  return (
    <span className="flex items-center gap-[1.5px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1 w-1 rounded-full"
          style={{ background: accent, animation: "thinking-bounce 1.4s ease-in-out infinite", animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

/* ---------------------------------- variant 0: website support widget (light) ---------------------------------- */

function SupportWidget({ accent }: { accent: string }) {
  return (
    <div
      className="relative flex h-full items-end justify-end p-2"
      style={{ background: `radial-gradient(ellipse at 30% 20%, ${accent}22, #0e0e14 70%)` }}
    >
      {/* live stats rail beside the widget */}
      <div className="absolute left-2 top-1/2 flex w-[29%] -translate-y-1/2 flex-col gap-1.5">
        <div className="rounded-lg border border-white/10 bg-black/40 p-1.5 backdrop-blur">
          <p className="text-[3.5px] font-bold uppercase tracking-widest text-white/40">
            Auto-resolved
          </p>
          <p className="text-[8px] font-extrabold leading-tight" style={{ color: accent }}>
            78%
          </p>
          <div className="mt-0.5 h-[3px] overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[78%] rounded-full" style={{ background: accent }} />
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/40 p-1.5 backdrop-blur">
          <p className="text-[3.5px] font-bold uppercase tracking-widest text-white/40">
            Avg. reply
          </p>
          <p className="text-[6.5px] font-extrabold leading-tight text-white">2.4s</p>
        </div>
        {["⚡ Instant answers", "🌙 Online 24/7", "★ 4.9 CSAT"].map((c) => (
          <span
            key={c}
            className="rounded-full border px-1.5 py-[2.5px] text-[4px] font-semibold text-white/75"
            style={{ borderColor: `${accent}44`, background: "rgba(0,0,0,0.35)" }}
          >
            {c}
          </span>
        ))}
      </div>
      <div className="flex h-[92%] w-[64%] flex-col overflow-hidden rounded-lg bg-white text-[#22263a] shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
        {/* header */}
        <div className="flex items-center gap-1 px-1.5 py-1 text-white" style={{ background: accent }}>
          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-white/25 text-[5px] font-bold">
            N
          </span>
          <span className="text-[5px] font-extrabold leading-none">
            Nexus Assistant
            <span className="ml-1 inline-flex items-center gap-0.5 text-[3.5px] font-medium text-white/80">
              <span className="h-1 w-1 rounded-full bg-[#7dffb0]" />
              Online
            </span>
          </span>
          <span className="ml-auto text-[6px] leading-none text-white/70">×</span>
        </div>
        {/* messages */}
        <div className="flex flex-1 flex-col gap-1 p-1.5">
          <div className="max-w-[80%] self-start rounded-lg rounded-tl-[2px] bg-[#f1f2f6] px-1.5 py-1">
            <p className="text-[4.5px] leading-snug">Hi! 👋 How can I help you today?</p>
          </div>
          <div
            className="max-w-[70%] self-end rounded-lg rounded-tr-[2px] px-1.5 py-1 text-white"
            style={{ background: accent }}
          >
            <p className="text-[4.5px] leading-snug">What are your pricing plans?</p>
          </div>
          <div className="max-w-[82%] self-start rounded-lg rounded-tl-[2px] bg-[#f1f2f6] px-1.5 py-1">
            <p className="text-[4.5px] leading-snug">We have Starter, Pro, and Scale. Want a quick breakdown?</p>
          </div>
          <div className="flex items-center gap-1 self-start rounded-full bg-[#f1f2f6] px-1.5 py-1">
            <TypingDots accent={accent} />
          </div>
          {/* quick replies */}
          <div className="mt-auto flex flex-wrap gap-1">
            {["See pricing", "Book a demo", "Talk to human"].map((q) => (
              <span
                key={q}
                className="rounded-full border px-1.5 py-[2px] text-[4px] font-semibold"
                style={{ borderColor: `${accent}55`, color: accent }}
              >
                {q}
              </span>
            ))}
          </div>
        </div>
        {/* input */}
        <div className="flex items-center gap-1 border-t border-black/[0.06] px-1.5 py-1">
          <span className="flex-1 text-[4px] text-[#9aa0ae]">Message…</span>
          <span
            className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[5px] text-white"
            style={{ background: accent }}
          >
            ➤
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- variant 1: dark AI copilot with sidebar ---------------------------------- */

function CopilotChat({ accent }: { accent: string }) {
  return (
    <div className="flex h-full bg-[#0e0e14] text-white">
      {/* sidebar */}
      <div className="flex w-[27%] flex-col gap-[3px] border-r border-white/[0.06] bg-white/[0.02] p-1">
        <span
          className="mb-0.5 rounded-[4px] px-1 py-[3px] text-center text-[4px] font-bold text-white"
          style={{ background: accent }}
        >
          + New chat
        </span>
        {["Pricing questions", "Refund policy", "API onboarding", "Feature request"].map((c, i) => (
          <div
            key={c}
            className="truncate rounded-[3px] px-1 py-[2.5px] text-[4px]"
            style={i === 0 ? { background: "rgba(255,255,255,0.06)", color: "white" } : { color: "rgba(255,255,255,0.5)" }}
          >
            {c}
          </div>
        ))}
        <div className="mt-auto flex items-center gap-1 px-1 opacity-60">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: `${accent}66` }} />
          <span className="text-[4px]">Aria · Pro</span>
        </div>
      </div>
      {/* main chat */}
      <div className="flex min-w-0 flex-1 flex-col p-1.5">
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-start gap-1 self-end">
            <div className="max-w-[70%] rounded-lg rounded-tr-[2px] bg-white/[0.06] px-1.5 py-1">
              <p className="text-[4.5px] leading-snug">Summarize this quarter's support tickets.</p>
            </div>
          </div>
          <div className="flex items-start gap-1">
            <span
              className="flex h-3 w-3 shrink-0 items-center justify-center rounded-md text-[4px] font-bold text-white"
              style={{ background: accent }}
            >
              A
            </span>
            <div className="max-w-[78%] rounded-lg rounded-tl-[2px] border border-white/[0.08] bg-white/[0.03] px-1.5 py-1">
              <p className="text-[4.5px] leading-snug text-white/85">
                Handled 1,204 tickets — 78% auto-resolved. Top themes: billing, login, and exports.
              </p>
              <div className="mt-1 flex gap-1">
                {["Billing 34%", "Login 22%", "Exports 14%"].map((t) => (
                  <span
                    key={t}
                    className="rounded-[3px] px-1 py-[1px] text-[3.5px] font-semibold"
                    style={{ background: `${accent}1f`, color: accent }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              {/* mini trend bars */}
              <div className="mt-1 flex h-3 items-end gap-[2px]">
                {[40, 65, 50, 80, 58, 92, 70, 100, 76, 60].map((h, i) => (
                  <span
                    key={i}
                    className="w-full rounded-t-[1px]"
                    style={{
                      height: `${h}%`,
                      background: i % 3 === 1 ? `${accent}33` : `${accent}bb`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-[3.2px] uppercase tracking-widest text-white/35">Sources</span>
                {["tickets.csv", "help-docs"].map((s) => (
                  <span
                    key={s}
                    className="rounded-[2px] border border-white/10 bg-white/[0.04] px-1 py-[0.5px] text-[3.2px] text-white/55"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="flex h-3 w-3 shrink-0 items-center justify-center rounded-md text-[4px] font-bold text-white"
              style={{ background: accent }}
            >
              A
            </span>
            <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-1.5 py-1">
              <TypingDots accent={accent} />
            </div>
          </div>
        </div>
        {/* input */}
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-1">
          <span className="flex-1 text-[4px] text-white/40">Ask Aria anything…</span>
          <span
            className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[5px] text-white"
            style={{ background: accent }}
          >
            ➤
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- variant 2: messaging booking bot ---------------------------------- */

function BookingBot({ accent }: { accent: string }) {
  const CREAM = "#F2EDE0";
  const INK = "#3a3025";
  const MUTED = "#8a7d6a";
  return (
    <div className="flex h-full flex-col" style={{ background: CREAM, color: INK }}>
      {/* header */}
      <div className="flex items-center gap-1 border-b px-1.5 py-1" style={{ borderColor: `${accent}33` }}>
        <span
          className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[5px] font-bold text-white"
          style={{ background: accent }}
        >
          T
        </span>
        <span className="text-[5px] font-extrabold leading-none">
          Tahana Bot
          <span className="ml-1 inline-flex items-center gap-0.5 text-[3.5px] font-medium" style={{ color: MUTED }}>
            <span className="h-1 w-1 rounded-full" style={{ background: "#4caf7d" }} />
            typically replies instantly
          </span>
        </span>
      </div>
      {/* thread */}
      <div className="flex flex-1 flex-col gap-1 p-1.5">
        <div className="max-w-[80%] self-start rounded-lg rounded-tl-[2px] bg-white px-1.5 py-1 shadow-[0_1px_3px_rgba(90,70,40,0.08)]">
          <p className="text-[4.5px] leading-snug">Welcome to Tahana ✨ Want to book a session?</p>
        </div>
        {/* rich card: slots */}
        <div className="max-w-[86%] self-start overflow-hidden rounded-lg border bg-white shadow-[0_1px_3px_rgba(90,70,40,0.08)]" style={{ borderColor: `${accent}33` }}>
          <div className="px-1.5 py-1 text-[4px] font-bold" style={{ color: INK }}>
            Available today
          </div>
          <div className="grid grid-cols-3 gap-1 px-1.5 pb-1.5">
            {["2:00 PM", "4:00 PM", "6:30 PM"].map((s, i) => (
              <span
                key={s}
                className="rounded-[4px] px-1 py-[3px] text-center text-[4px] font-bold"
                style={
                  i === 1
                    ? { background: accent, color: "white" }
                    : { border: `1px solid ${accent}66`, color: accent }
                }
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div
          className="max-w-[60%] self-end rounded-lg rounded-tr-[2px] px-1.5 py-1 text-white"
          style={{ background: accent }}
        >
          <p className="text-[4.5px] leading-snug">4 PM works 🙌</p>
        </div>
        {/* booking confirmation card */}
        <div
          className="flex max-w-[86%] items-center gap-1.5 self-start rounded-lg border bg-white px-1.5 py-1 shadow-[0_1px_3px_rgba(90,70,40,0.08)]"
          style={{ borderColor: `${accent}44` }}
        >
          <span
            className="flex h-4 w-4 shrink-0 flex-col items-center justify-center rounded-[4px] text-white"
            style={{ background: accent }}
          >
            <span className="text-[3px] font-bold uppercase leading-none opacity-80">Fri</span>
            <span className="text-[5.5px] font-extrabold leading-none">16</span>
          </span>
          <span className="min-w-0">
            <span className="block text-[4.5px] font-bold leading-tight">Booking confirmed 🎉</span>
            <span className="block text-[3.8px]" style={{ color: MUTED }}>
              Aroma Massage · Fri 4:00 PM
            </span>
          </span>
          <span
            className="ml-auto shrink-0 rounded-full px-1 py-[1.5px] text-[3.5px] font-bold"
            style={{ background: `${accent}18`, color: accent }}
          >
            + Calendar
          </span>
        </div>
        <div className="flex items-center gap-1 self-start rounded-full bg-white px-1.5 py-1 shadow-[0_1px_3px_rgba(90,70,40,0.08)]">
          <TypingDots accent={accent} />
        </div>
      </div>
      {/* input */}
      <div className="flex items-center gap-1 border-t px-1.5 py-1" style={{ borderColor: `${accent}33` }}>
        <span className="flex-1 text-[4px]" style={{ color: MUTED }}>
          Type a message…
        </span>
        <span
          className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[5px] text-white"
          style={{ background: accent }}
        >
          ➤
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------- scene ---------------------------------- */

export default function ChatbotPrototypeVisual({ variant, accent, title }: Props) {
  const v = ((variant % 3) + 3) % 3;
  const label = ["Support Bot", "AI Copilot", "Booking Bot"][v];

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
        className="absolute inset-x-[11%] top-[13%] h-full overflow-hidden rounded-xl border border-white/12 bg-[#0b0b0e] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.02]"
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
            AI
          </span>
        </div>
        <div className="h-[calc(100%-1.25rem)]">
          {v === 0 && <SupportWidget accent={accent} />}
          {v === 1 && <CopilotChat accent={accent} />}
          {v === 2 && <BookingBot accent={accent} />}
        </div>
      </div>

      {/* glass shine sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.09] to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
      <span className="sr-only">{title} chatbot preview</span>
    </div>
  );
}
