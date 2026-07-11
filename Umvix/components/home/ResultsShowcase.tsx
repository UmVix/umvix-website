"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { Star, MapPin } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { useReducedMotion } from "@/lib/hooks";

const UMVIX_LOGO = "/icons/logo-main.png";

/* -------------------------------------------------------------------------- */

export type ShowcaseItem = {
  title: string;
  category: string;
  /** Bold headline result, e.g. "5.0 Rating". */
  metric: string;
  /** Optional 1–2 letter badge; falls back to initials from the title. */
  initials?: string;
  /** Client rating out of 5. */
  rating: number;
  /** Client location. */
  location: string;
};

const DEFAULT_ITEMS: ShowcaseItem[] = [
  {
    title: "MileageQuest",
    category: "Apps & AI",
    metric: "5.0 Rating",
    rating: 5,
    location: "USA",
  },
  {
    title: "DoneRight",
    category: "Web & Automation",
    metric: "4.9 Rating",
    rating: 4.9,
    location: "Germany",
  },
  {
    title: "AI Chatbot",
    category: "AI Chatbots",
    metric: "5.0 Rating",
    rating: 5,
    location: "Qatar",
  },
  {
    title: "Dashboards",
    category: "Custom Dashboards",
    metric: "4.8 Rating",
    rating: 4.8,
    location: "USA",
  },
  {
    title: "PhamEnterprises",
    category: "Automation",
    metric: "5.0 Rating",
    rating: 5,
    location: "Germany",
  },
  {
    title: "Calorie Tracker",
    category: "Mobile Apps",
    metric: "4.7 Rating",
    rating: 4.7,
    location: "Qatar",
  },
  {
    title: "Vertex SaaS",
    category: "SaaS Development",
    metric: "4.9 Rating",
    rating: 4.9,
    location: "Germany",
  },
  {
    title: "Pulse Fintech",
    category: "Fintech Apps",
    metric: "5.0 Rating",
    rating: 5,
    location: "Qatar",
  },
  {
    title: "Northwind Retail",
    category: "Web Development",
    metric: "5.0 Rating",
    rating: 5,
    location: "USA",
  },
  {
    title: "Lumen Studio",
    category: "Website Design",
    metric: "4.8 Rating",
    rating: 4.8,
    location: "USA",
  },
  {
    title: "Harbor & Co.",
    category: "Logistics Automation",
    metric: "5.0 Rating",
    rating: 5,
    location: "Germany",
  },
  {
    title: "Solstice Health",
    category: "Healthcare Apps",
    metric: "4.9 Rating",
    rating: 4.9,
    location: "Qatar",
  },
];

/* -------------------------------------------------------------------------- */
/* Skeleton -> real reveal, based on the card's x position across the stage.  */
/* p = 0 (left edge) … 1 (right edge). Cards flow left -> right: they start    */
/* as skeletons on the left and morph into the real card crossing the middle. */
/* -------------------------------------------------------------------------- */

const REVEAL_START = 0.46; // p below this -> pure skeleton
const REVEAL_END = 0.6; // p above this -> fully real

function revealAt(p: number) {
  let t: number;
  if (p <= REVEAL_START) t = 0;
  else if (p >= REVEAL_END) t = 1;
  else t = (p - REVEAL_START) / (REVEAL_END - REVEAL_START);
  return t * t * (3 - 2 * t); // smoothstep
}

/** Overall opacity: ghost on the far left, solid on the right, dip at the hub. */
function fadeAt(p: number) {
  let o = 1;
  if (p < 0.42) o = 0.18 + (p / 0.42) * 0.82;
  if (p > 0.96) o = Math.max(0.22, 1 - (p - 0.96) / 0.04 * 0.78);
  const dc = Math.abs(p - 0.5);
  if (dc < 0.06) o = Math.min(o, (dc / 0.06) * (dc / 0.06) * 0.22);
  return o;
}

const LEFT_MASK = "linear-gradient(to right, transparent 0%, #000 10%, #000 100%)";
const RIGHT_MASK = "linear-gradient(to right, #000 0%, #000 90%, transparent 100%)";

/* -------------------------------------------------------------------------- */
/* Row geometry — 4 rows, each split at the hub into left / right halves.      */
/* Top rows form a shallow ∧ (far edges rise); bottom rows a shallow ∨.        */
/* CSS rotate is clockwise-positive.                                           */
/*   top-left  : +CW  (pivot right/hub) -> far-left rises                      */
/*   top-right : -CCW (pivot left/hub)  -> far-right rises                     */
/*   bot-left  : -CCW (pivot right/hub) -> far-left falls                      */
/*   bot-right : +CW  (pivot left/hub)  -> far-right falls                     */
/* -------------------------------------------------------------------------- */

type FanRowConfig = {
  yOffset: number; // px from vertical centre of the stage
  leftRotate: number; // deg applied to the left half (pivot = hub/right edge)
  rightRotate: number; // deg applied to the right half (pivot = hub/left edge)
  bow: number; // px — parabolic lift at row edges (bow/slope curve)
  duration: number; // marquee loop seconds
};

const ROWS: FanRowConfig[] = [
  { yOffset: -140, leftRotate: 11, rightRotate: -11, bow: 38, duration: 48 }, // outer top
  { yOffset: -48, leftRotate: 5, rightRotate: -5, bow: 16, duration: 55 }, // inner top
  { yOffset: 48, leftRotate: -5, rightRotate: 5, bow: 16, duration: 42 }, // inner bottom
  { yOffset: 140, leftRotate: -11, rightRotate: 11, bow: 38, duration: 51 }, // outer bottom
];

/** Vertical bow offset: flat at hub, rises/falls smoothly toward the edges. */
function bowOffset(p: number, row: FanRowConfig) {
  const edge = Math.abs(p - 0.5) * 2; // 0 at hub … 1 at far edge
  const curve = edge * edge * (3 - 2 * edge); // smoothstep bow
  if (row.yOffset < 0) return -row.bow * curve;
  if (row.yOffset > 0) return row.bow * curve;
  return 0;
}

/* -------------------------------------------------------------------------- */
/* Section                                                                    */
/* -------------------------------------------------------------------------- */

type ResultsShowcaseProps = {
  items?: ShowcaseItem[];
  logoSrc?: string;
  title?: ReactNode | null;
  subtitle?: string | null;
};

export default function ResultsShowcase({
  items = DEFAULT_ITEMS,
  logoSrc,
  title = (
    <>
      Results That Speak <span className="text-brand-red">Louder</span> Than Pitches
    </>
  ),
  subtitle = "Real outcomes from real projects — a constant stream of wins built one engagement at a time.",
}: ResultsShowcaseProps) {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  return (
    <section
      aria-label="Client results showcase"
      className="relative w-full overflow-hidden bg-brand-black py-16 sm:py-20"
    >
      {(title || subtitle) && (
        <div className="site-container relative z-30 mb-10 text-center sm:mb-12">
          {title && (
            <Reveal y={28}>
              <h2 className="mx-auto w-full max-w-none text-center font-headline text-[clamp(1.4rem,3.4vw,3.1rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-brand-white sm:whitespace-nowrap">
                {title}
              </h2>
            </Reveal>
          )}
          {subtitle && (
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-brand-gray sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div ref={stageRef} className="relative h-[26rem] w-full sm:h-[30rem]">
        <div className="absolute inset-x-0 bottom-0 top-0 z-10 overflow-visible">
          {ROWS.map((row, i) => (
            <FanRow
              key={i}
              row={row}
              items={rotateArray(items, i * 3)}
              stageRef={stageRef}
              reduced={reduced}
            />
          ))}
        </div>

        <EnergyWall reduced={reduced} />

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
          <LogoBadge logoSrc={logoSrc} />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Fan row — two marquee halves that pivot at the hub                          */
/* -------------------------------------------------------------------------- */

function FanRow({
  row,
  items,
  stageRef,
  reduced,
}: {
  row: FanRowConfig;
  items: ShowcaseItem[];
  stageRef: React.RefObject<HTMLDivElement | null>;
  reduced: boolean;
}) {
  const leftTrackRef = useRef<HTMLDivElement>(null);
  const rightTrackRef = useRef<HTMLDivElement>(null);
  const leftCardRefs = useRef<HTMLDivElement[]>([]);
  const rightCardRefs = useRef<HTMLDivElement[]>([]);
  const txRef = useRef(0);

  const doubled = [...items, ...items];

  useEffect(() => {
    const leftTrack = leftTrackRef.current;
    const rightTrack = rightTrackRef.current;
    const stage = stageRef.current;
    if (!leftTrack || !rightTrack || !stage) return;

    const cards = [
      ...leftCardRefs.current.filter(Boolean),
      ...rightCardRefs.current.filter(Boolean),
    ];
    const lastReveal = new Float32Array(cards.length).fill(-1);
    const lastFade = new Float32Array(cards.length).fill(-1);
    const lastBow = new Float32Array(cards.length).fill(-999);

    let setWidth = 1;
    let stageWidth = 1;
    let stageLeft = 0;

    const measure = () => {
      setWidth = leftTrack.scrollWidth / 2 || 1;
      const rect = stage.getBoundingClientRect();
      stageWidth = rect.width || 1;
      stageLeft = rect.left;
      txRef.current = txRef.current % setWidth;
      if (txRef.current > 0) txRef.current -= setWidth;
    };

    const paint = () => {
      const tx = txRef.current;
      const t = `translate3d(${tx}px,0,0)`;
      leftTrack.style.transform = t;
      rightTrack.style.transform = t;

      for (let i = 0; i < cards.length; i++) {
        const rect = cards[i].getBoundingClientRect();
        const p = (rect.left + rect.width / 2 - stageLeft) / stageWidth;
        const r = revealAt(p);
        const fade = fadeAt(p);
        const bow = bowOffset(p, row);

        if (Math.abs(r - lastReveal[i]) > 0.004) {
          lastReveal[i] = r;
          cards[i].style.setProperty("--reveal", r.toFixed(3));
        }
        if (Math.abs(fade - lastFade[i]) > 0.004) {
          lastFade[i] = fade;
          cards[i].style.opacity = fade.toFixed(3);
        }
        if (Math.abs(bow - lastBow[i]) > 0.05) {
          lastBow[i] = bow;
          cards[i].style.transform = `translateY(${bow.toFixed(1)}px)`;
        }
      }
    };

    measure();
    paint();

    const ro = new ResizeObserver(() => {
      measure();
      paint();
    });
    ro.observe(stage);
    ro.observe(leftTrack);

    if (reduced) {
      return () => ro.disconnect();
    }

    let raf = 0;
    let prev = 0;
    let running = false;

    const tick = (now: number) => {
      if (!prev) prev = now;
      const dt = Math.min(48, now - prev);
      prev = now;
      // Flow left -> right: tx increases toward 0, wrapping by one set width.
      txRef.current += (setWidth * dt) / (row.duration * 1000);
      if (txRef.current >= 0) txRef.current -= setWidth;
      paint();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      prev = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(stage);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.duration, reduced, items, stageRef]);

  const half = (side: "left" | "right") => {
    const isLeft = side === "left";
    return (
      <div
        className="absolute w-1/2 overflow-hidden"
        style={{
          top: "-5rem",
          bottom: "-5rem",
          left: isLeft ? 0 : "50%",
          clipPath: "inset(-5rem 0 -5rem 0)",
          maskImage: isLeft ? LEFT_MASK : RIGHT_MASK,
          WebkitMaskImage: isLeft ? LEFT_MASK : RIGHT_MASK,
        }}
      >
        {/* Strip centred on the row line, pivoting at the hub edge. */}
        <div
          className="absolute h-[4.5rem] w-[220%] overflow-visible"
          style={{
            top: `calc(50% + ${row.yOffset}px)`,
            [isLeft ? "right" : "left"]: 0,
            transform: `translateY(-50%) rotate(${
              isLeft ? row.leftRotate : row.rightRotate
            }deg)`,
            transformOrigin: isLeft ? "100% 50%" : "0% 50%",
          }}
        >
          <div
            ref={isLeft ? leftTrackRef : rightTrackRef}
            className="absolute left-0 top-0 flex h-full w-max gap-3 overflow-visible will-change-transform sm:gap-4"
          >
            {doubled.map((item, i) => (
              <PortfolioCard
                key={`${side}-${i}`}
                item={item}
                cardRef={(el) => {
                  const refs = isLeft ? leftCardRefs : rightCardRefs;
                  if (el) refs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {half("left")}
      {half("right")}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Card — skeleton layer crossfades into the real layer via --reveal          */
/* -------------------------------------------------------------------------- */

function PortfolioCard({
  item,
  cardRef,
}: {
  item: ShowcaseItem;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const initials =
    item.initials ??
    item.title
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div
      ref={cardRef}
      className="relative h-[4.5rem] w-[14.5rem] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-brand-black-soft will-change-[opacity,transform] sm:w-[17.5rem]"
    >
      {/* Skeleton layer */}
      <div
        className="absolute inset-0"
        style={{ opacity: "calc(1 - var(--reveal, 1))" }}
        aria-hidden
      >
        <div className="flex h-full animate-pulse items-center gap-3 px-3.5">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-3/4 rounded bg-white/10" />
            <div className="h-2 w-1/2 rounded bg-white/[0.06]" />
          </div>
          <div className="space-y-2">
            <div className="h-2.5 w-14 rounded bg-white/10" />
            <div className="ml-auto h-2 w-8 rounded bg-white/[0.06]" />
          </div>
        </div>
      </div>

      {/* Real layer */}
      <div
        className="absolute inset-0 flex items-center gap-3 px-3.5"
        style={{ opacity: "var(--reveal, 1)" }}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-red/15 text-sm font-bold text-brand-red shadow-[0_0_15px_rgba(255,31,61,0.1)]">
          {initials}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[0.85rem] font-semibold text-brand-white">
              {item.title}
            </p>
            <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-white/5 px-1.5 py-0.5 text-[0.6rem] font-medium text-brand-gray-muted">
              <MapPin size={8} className="text-brand-red/60" />
              {item.location}
            </div>
          </div>

          <div className="mt-0.5 flex items-center gap-2">
            <p className="truncate text-[0.7rem] text-brand-gray-muted">
              {item.category}
            </p>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={8}
                  className={`${
                    i < Math.floor(item.rating)
                      ? "fill-brand-red text-brand-red"
                      : "fill-white/10 text-white/10"
                  } animate-pulse`}
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="ml-auto flex flex-col items-end justify-center">
          <span className="whitespace-nowrap text-[0.8rem] font-bold text-brand-red">
            {item.metric}
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Centre logo + funnel (wide cap at the hub -> thin stem past the bottom)     */
/* -------------------------------------------------------------------------- */

function LogoBadge({ logoSrc = UMVIX_LOGO }: { logoSrc?: string }) {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-white from-38% to-brand-red p-3 shadow-[0_18px_50px_rgba(255,31,61,0.4)] ring-1 ring-white/25 sm:h-24 sm:w-24 sm:p-3.5">
      <Image
        src={logoSrc}
        alt="Umvix"
        width={120}
        height={80}
        className="relative z-10 h-full w-full object-contain object-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
      />
    </div>
  );
}

function EnergyWall({ reduced }: { reduced: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
      {/* soft radial glow around the hub */}
      <div
        className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[28rem] sm:w-[28rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,31,61,0.26), rgba(255,31,61,0.07) 42%, transparent 68%)",
        }}
      />

      {/* translucent energy curtain — full height */}
      <div
        className="absolute inset-y-0 left-1/2 w-16 -translate-x-1/2 overflow-hidden sm:w-24"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,31,61,0.09) 28%, rgba(255,31,61,0.2) 50%, rgba(255,31,61,0.09) 72%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 92%, transparent)",
        }}
      >
        {/* light sweep travelling up the curtain */}
        {!reduced && (
          <div
            className="absolute inset-x-0 h-44"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.22) 50%, transparent)",
              animation: "wall-sweep 3.4s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* core light line — full height */}
      <div
        className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(255,255,255,0.85) 16%, var(--brand-red) 50%, rgba(255,255,255,0.85) 84%, transparent)",
          boxShadow:
            "0 0 16px 2px rgba(255,31,61,0.55), 0 0 44px 8px rgba(255,31,61,0.22)",
        }}
      />

      {/* sparks rising along the wall */}
      {!reduced &&
        [0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="absolute bottom-6 left-1/2 rounded-full bg-white"
            style={{
              marginLeft: [-16, -7, 0, 8, 15][i],
              width: i % 2 ? 3 : 2,
              height: i % 2 ? 3 : 2,
              boxShadow: "0 0 8px 2px rgba(255,31,61,0.8)",
              animation: `beam-rise ${5.5 + i * 1.2}s linear ${i * 1.15}s infinite`,
            }}
          />
        ))}

      {/* pulse rings expanding from the hub (echo the logo's rounded square) */}
      {!reduced &&
        [0, 1].map((i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-24 w-24 rounded-2xl border border-brand-red/45 sm:h-28 sm:w-28 sm:rounded-3xl"
            style={{ animation: `hub-ring 3s ease-out ${i * 1.5}s infinite` }}
          />
        ))}

      {/* wide floor glow — the beam lands and spreads across the bottom */}
      <div
        className="absolute -bottom-16 left-1/2 h-40 w-[75vw] max-w-[62rem] -translate-x-1/2 rounded-[100%] blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(255,31,61,0.3), rgba(255,31,61,0.1) 45%, transparent 72%)",
        }}
      />
      {/* thin base line running wide along the bottom edge */}
      <div
        className="absolute bottom-0 left-1/2 h-px w-[85vw] max-w-[72rem] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,31,61,0.7) 50%, transparent)",
          boxShadow: "0 0 18px 2px rgba(255,31,61,0.35)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-[3px] w-[26rem] max-w-[60vw] -translate-x-1/2 blur-[2px]"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.75) 50%, transparent)",
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* utils                                                                      */
/* -------------------------------------------------------------------------- */

function rotateArray<T>(arr: T[], by: number): T[] {
  if (arr.length === 0) return arr;
  const n = by % arr.length;
  return [...arr.slice(n), ...arr.slice(0, n)];
}
