"use client";

/**
 * Full marketing-website mockups (not dashboards) presented inside a
 * floating browser window — same scene language as the dashboard cards.
 * variant 0 = SaaS landing, 1 = fashion store, 2 = restaurant. Each fills
 * the frame edge-to-edge, everything visible with no scroll.
 */

type Props = {
  variant: number;
  accent: string;
  title: string;
  url: string;
};

/* ---------------------------------- variant 0: SaaS / startup landing (dark) ---------------------------------- */

function SaaSSite({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col bg-[#0b0b12] text-white">
      {/* nav */}
      <div className="flex items-center justify-between px-2 py-1.5">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-[3px]" style={{ background: accent }} />
          <span className="text-[6px] font-extrabold">Vertex</span>
        </div>
        <div className="flex items-center gap-2 text-[4.5px] text-white/55">
          <span>Product</span>
          <span>Pricing</span>
          <span>Customers</span>
          <span>Docs</span>
        </div>
        <span
          className="rounded-full px-2 py-[3px] text-[4.5px] font-bold text-white"
          style={{ background: accent, boxShadow: `0 2px 8px ${accent}66` }}
        >
          Get Started
        </span>
      </div>

      {/* hero */}
      <div className="relative flex flex-1 flex-col items-center justify-center gap-1 px-3 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-[70%]"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}33, transparent 70%)` }}
        />
        <span
          className="relative rounded-full border px-1.5 py-[1px] text-[4px] font-bold"
          style={{ borderColor: `${accent}55`, color: accent }}
        >
          ✦ Vertex 2.0 is live
        </span>
        <p className="relative text-[13px] font-extrabold leading-[1.05] tracking-tight">
          Ship products <span style={{ color: accent }}>10× faster</span>
        </p>
        <p className="relative max-w-[68%] text-[4.5px] leading-relaxed text-white/50">
          The all-in-one platform for modern product teams to build, launch, and scale.
        </p>
        <div className="relative mt-0.5 flex gap-1">
          <span
            className="rounded-full px-2.5 py-[3px] text-[4.5px] font-bold text-white"
            style={{ background: accent, boxShadow: `0 2px 8px ${accent}66` }}
          >
            Start Free
          </span>
          <span className="rounded-full border border-white/20 px-2.5 py-[3px] text-[4.5px] font-semibold text-white/80">
            Book Demo
          </span>
        </div>
        {/* app preview card */}
        <div className="relative mt-1.5 w-[76%] rounded-md border border-white/10 bg-white/[0.04] p-1">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[3.5px] font-semibold text-white/50">Revenue</span>
            <span className="text-[3.5px] font-bold" style={{ color: accent }}>
              ▲ 18.2%
            </span>
          </div>
          <div className="flex h-5 items-end gap-[2px] px-0.5 pt-0.5">
            {[40, 62, 48, 78, 58, 92, 70, 100, 82, 66, 94, 74].map((h, i) => (
              <div
                key={i}
                className="w-full origin-bottom rounded-t-[1.5px]"
                style={{
                  height: `${h}%`,
                  background:
                    i % 3 === 1 ? `${accent}33` : `linear-gradient(180deg, ${accent}, ${accent}88)`,
                  animation: "rise-bar 2.6s ease-in-out infinite",
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* trusted-by logo strip */}
      <div className="flex items-center justify-center gap-2.5 border-t border-white/[0.06] py-1">
        {[16, 22, 14, 20, 18].map((w, i) => (
          <div key={i} className="h-1 rounded-full bg-white/20" style={{ width: `${w}px` }} />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- variant 1: fashion e-commerce (light) ---------------------------------- */

function StoreSite({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col bg-white text-[#22201e]">
      {/* nav */}
      <div className="flex items-center justify-between border-b border-black/[0.06] px-2 py-1">
        <div className="flex items-center gap-1.5 text-[4.5px] font-semibold text-[#8a857f]">
          <span style={{ color: accent }}>Shop</span>
          <span>New In</span>
          <span>Sale</span>
        </div>
        <span className="text-[7px] font-extrabold tracking-[0.25em]">MAISON</span>
        <div className="flex items-center gap-1 text-[4.5px] text-[#8a857f]">
          <span>Search</span>
          <span
            className="flex h-3 w-3 items-center justify-center rounded-full text-[4px] font-bold text-white"
            style={{ background: accent }}
          >
            2
          </span>
        </div>
      </div>

      {/* hero split */}
      <div className="flex flex-1">
        <div className="flex w-1/2 flex-col justify-center gap-1 p-2">
          <span className="text-[4px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
            New Season
          </span>
          <p className="text-[11px] font-extrabold leading-[1.05]">
            Timeless
            <br />
            Essentials
          </p>
          <p className="max-w-[85%] text-[4px] leading-relaxed text-[#9a938c]">
            Curated pieces designed to last beyond the season.
          </p>
          <span
            className="mt-0.5 inline-block w-fit rounded-full px-2.5 py-[3px] text-[4.5px] font-bold text-white"
            style={{ background: accent }}
          >
            Shop Collection
          </span>
        </div>
        <div
          className="relative w-1/2 overflow-hidden"
          style={{ background: `linear-gradient(150deg, ${accent}44, ${accent}11 60%, #f2f0ee)` }}
        >
          <div className="absolute -right-2 -top-2 h-14 w-14 rounded-full bg-white/25 blur-[2px]" />
          <div
            className="absolute bottom-2 left-2 rounded-full bg-white px-1.5 py-0.5 text-[4px] font-bold"
            style={{ color: accent }}
          >
            −30% Today
          </div>
        </div>
      </div>

      {/* product row */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5">
        {[
          { n: "Wool Coat", p: "$189", g: "44" },
          { n: "Silk Blouse", p: "$95", g: "22" },
          { n: "Leather Bag", p: "$149", g: "33" },
        ].map((it) => (
          <div
            key={it.n}
            className="flex flex-col overflow-hidden rounded-md border border-black/[0.06] bg-white shadow-[0_1px_4px_rgba(30,25,20,0.05)]"
          >
            <div
              className="h-6"
              style={{ background: `linear-gradient(145deg, ${accent}${it.g}, #f4f2f0)` }}
            />
            <div className="p-1">
              <p className="truncate text-[4.5px] font-bold">{it.n}</p>
              <div className="flex items-center justify-between">
                <span className="text-[3.5px] text-[#a8a099]">★ 4.9</span>
                <span className="text-[5px] font-extrabold" style={{ color: accent }}>
                  {it.p}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- variant 2: restaurant / hospitality (warm) ---------------------------------- */

function RestaurantSite({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col bg-[#faf6f0] text-[#2a211a]">
      {/* nav */}
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-[7px] font-extrabold italic tracking-tight" style={{ color: accent }}>
          Sapore
        </span>
        <div className="flex items-center gap-2 text-[4.5px] font-semibold text-[#8a7d70]">
          <span>Menu</span>
          <span>About</span>
          <span>Gallery</span>
        </div>
        <span
          className="rounded-full px-2 py-[3px] text-[4.5px] font-bold text-white"
          style={{ background: accent }}
        >
          Book a Table
        </span>
      </div>

      {/* hero image */}
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}aa 55%, #6d3b1f)` }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_75%_25%,white,transparent_45%)]"
        />
        <div className="absolute inset-x-2 bottom-1.5">
          <span className="rounded-full bg-white/20 px-1.5 py-[1px] text-[4px] font-bold text-white backdrop-blur">
            ★ 4.9 · 2,300 reviews
          </span>
          <p className="mt-0.5 text-[11px] font-extrabold leading-[1.05] text-white">
            Authentic
            <br />
            Italian Kitchen
          </p>
          <span className="mt-0.5 inline-block rounded-full bg-white px-2 py-[3px] text-[4.5px] font-bold" style={{ color: accent }}>
            Reserve Now
          </span>
        </div>
      </div>

      {/* featured dishes */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5">
        {[
          { n: "Truffle Pasta", p: "$24", g: "55" },
          { n: "Wood Pizza", p: "$18", g: "33" },
          { n: "Tiramisu", p: "$9", g: "22" },
        ].map((d) => (
          <div
            key={d.n}
            className="flex flex-col overflow-hidden rounded-md bg-white shadow-[0_1px_4px_rgba(60,40,20,0.06)]"
          >
            <div
              className="h-5"
              style={{ background: `linear-gradient(145deg, ${accent}${d.g}, #f0e9e0)` }}
            />
            <div className="flex items-center justify-between p-1">
              <span className="truncate text-[4.5px] font-bold">{d.n}</span>
              <span className="text-[5px] font-extrabold" style={{ color: accent }}>
                {d.p}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- scene ---------------------------------- */

export default function WebsiteMockupVisual({ variant, accent, title, url }: Props) {
  const v = ((variant % 3) + 3) % 3;

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
            {url}
          </span>
        </div>
        <div className="h-[calc(100%-1.25rem)]">
          {v === 0 && <SaaSSite accent={accent} />}
          {v === 1 && <StoreSite accent={accent} />}
          {v === 2 && <RestaurantSite accent={accent} />}
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
