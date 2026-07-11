"use client";

/**
 * Client-onboarding automation — an email-centric design (distinct from
 * both the linear recipe and the order fan-out): a signup triggers a
 * welcome email (shown as an email client) plus a new CRM contact.
 */

type Props = {
  accent: string;
  title: string;
};

export default function ClientOnboardingVisual({ accent, title }: Props) {
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
          <p className="text-[6px] font-extrabold leading-tight">Client Onboarding</p>
          <p className="mb-1 text-[4px] text-white/40">New signup · welcome email + CRM contact, automatically</p>

          <div className="flex min-h-0 flex-1 items-stretch gap-1.5">
            {/* left rail: trigger + CRM */}
            <div className="flex w-[35%] flex-col">
              {/* trigger */}
              <div
                className="rounded-md border p-1.5"
                style={{ borderColor: `${accent}66`, background: `${accent}12` }}
              >
                <div className="flex items-center gap-1">
                  <span
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-md text-[6px]"
                    style={{ background: accent, color: "#0b0b0e" }}
                  >
                    ≡
                  </span>
                  <span className="text-[4px] font-bold uppercase tracking-wider" style={{ color: accent }}>
                    Trigger · Typeform
                  </span>
                </div>
                <p className="mt-1 text-[5px] font-bold">New signup</p>
                <p className="text-[4px] text-white/70">Ayesha Khan</p>
                <p className="text-[3.8px] text-white/45">ayesha.khan@gmail.com</p>
              </div>

              {/* connector */}
              <div className="relative my-[3px] ml-[9px] h-3 w-[1.5px] bg-white/12">
                <span
                  className="absolute left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                  style={{ background: accent, animation: "flow-down 1.6s ease-in-out infinite" }}
                />
              </div>

              {/* CRM contact added */}
              <div className="flex-1 rounded-md border border-white/[0.08] bg-white/[0.03] p-1.5">
                <span className="text-[4px] font-bold uppercase tracking-wider text-white/40">
                  HubSpot · Contact added
                </span>
                <div className="mt-1 flex items-center gap-1">
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[4.5px] font-extrabold text-white"
                    style={{ background: accent }}
                  >
                    AK
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[4.5px] font-bold">Ayesha Khan</p>
                    <p className="text-[3.5px] text-white/45">Lifecycle · Subscriber</p>
                  </div>
                </div>
                <span
                  className="mt-1 inline-block rounded-full px-1.5 py-[1px] text-[3.5px] font-bold"
                  style={{ background: `${accent}22`, color: accent }}
                >
                  New Lead
                </span>
              </div>
            </div>

            {/* right: welcome email preview */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-md border border-white/[0.08] bg-white text-[#22263a]">
              {/* email toolbar */}
              <div className="flex items-center gap-1 border-b border-black/[0.06] bg-[#f7f8fa] px-1.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
                <span className="ml-1 text-[4px] font-bold text-[#5c6272]">Welcome email</span>
                <span
                  className="ml-auto rounded-full px-1.5 py-[1px] text-[3.5px] font-bold text-white"
                  style={{ background: "#28a745" }}
                >
                  Sent ✓
                </span>
              </div>
              {/* meta */}
              <div className="flex flex-col gap-[1.5px] border-b border-black/[0.06] px-1.5 py-1">
                {[
                  ["From", "Umvix Team"],
                  ["To", "ayesha.khan@gmail.com"],
                  ["Subject", "Welcome to Umvix 🎉"],
                ].map(([k, v], i) => (
                  <div key={k} className="flex items-center gap-1">
                    <span className="w-6 shrink-0 text-[3.5px] text-[#9aa0ae]">{k}</span>
                    <span className={`truncate text-[4px] ${i === 2 ? "font-extrabold" : "font-semibold"}`}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              {/* body */}
              <div className="flex flex-1 flex-col gap-[3px] p-1.5 text-[4px] leading-relaxed text-[#5c6272]">
                <p className="font-bold text-[#22263a]">Hi Ayesha,</p>
                <p>Thanks for joining Umvix! Your account is ready — here&apos;s how to get started in three quick steps.</p>
                <span
                  className="mt-0.5 inline-block w-fit rounded-full px-2 py-[3px] text-[4px] font-bold text-white"
                  style={{ background: accent, boxShadow: `0 2px 6px ${accent}66` }}
                >
                  Get Started →
                </span>
                <p className="mt-auto text-[3.8px] text-[#9aa0ae]">— The Umvix Team</p>
              </div>
            </div>
          </div>

          {/* footer stats */}
          <div className="mt-1 flex items-center gap-1">
            <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-[3px] text-[4px] text-white/60">
              Runs today <span className="font-extrabold" style={{ color: accent }}>86</span>
            </span>
            <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-[3px] text-[4px] text-white/60">
              Saved <span className="font-extrabold" style={{ color: accent }}>5 hrs / wk</span>
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
