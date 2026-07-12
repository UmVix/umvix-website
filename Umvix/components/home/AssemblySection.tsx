"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Portfolio assembly: scattered fragments of real portfolio work fly in and
 * click together — a mobile app on the left and a web dashboard on the right —
 * capability chips dock onto the devices, and the finished products light up.
 *
 * Desktop: scroll-driven (pinned section scrubbed by scroll).
 * Mobile: the same scene auto-plays once it scrolls into view — scroll-scrub
 * pinning is unreliable on mobile browsers (dynamic toolbars resize the
 * viewport mid-gesture) and 320vh of hijacked scroll feels broken on touch.
 */

const APP_SHOT = "/images/portfolio/evolve/evolve-3.png";
const DASH_SHOT = "/images/portfolio/mylearningmindset/mlm-dashboard.png";

// where each phone fragment starts (px offsets + rotation)
const PHONE_SCATTERS = [
  { x: -420, y: -280, r: -24 },
  { x: -520, y: -80, r: 18 },
  { x: -560, y: 60, r: -12 },
  { x: -360, y: 200, r: 22 },
  { x: -480, y: 340, r: 16 },
  { x: -400, y: 460, r: -18 },
];

// dashboard fragments fly in from the right side
const DASH_SCATTERS = [
  { x: 380, y: -300, r: 16 },
  { x: 520, y: -180, r: -20 },
  { x: 620, y: -40, r: 12 },
  { x: 420, y: 160, r: -14 },
  { x: 560, y: 300, r: 20 },
  { x: 640, y: 420, r: -16 },
];

const LEFT_CHIPS = [
  { label: "Design", top: 56, from: -340 },
  { label: "Code", top: 250, from: -400 },
];
// dashboard chips drop in from above and rise from below
const DASH_CHIPS = [
  { label: "AI", side: "top" as const, left: "24%", from: -240 },
  { label: "Launch", side: "bottom" as const, left: "62%", from: 260 },
];

function Tile({
  p,
  i,
  shot,
  cols,
  rows,
  scatters,
  baseStart,
  reduced,
  scatterScale = 1,
}: {
  p: MotionValue<number>;
  i: number;
  shot: string;
  cols: number;
  rows: number;
  scatters: { x: number; y: number; r: number }[];
  baseStart: number;
  reduced: boolean;
  /** Shrinks the fly-in distances for small screens. */
  scatterScale?: number;
}) {
  const s = scatters[i];
  const start = baseStart + i * 0.06;
  const end = start + 0.34;
  const x = useTransform(p, [start, end], [s.x * scatterScale, 0]);
  const y = useTransform(p, [start, end], [s.y * scatterScale, 0]);
  const rotate = useTransform(p, [start, end], [s.r, 0]);
  const opacity = useTransform(p, [start, start + 0.1], [0, 1]);

  const col = i % cols;
  const row = Math.floor(i / cols);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${(col * 100) / cols}%`,
        top: `${(row * 100) / rows}%`,
        width: `${100 / cols}%`,
        height: `${100 / rows}%`,
        backgroundImage: `url(${shot})`,
        backgroundSize: `${cols * 100}% ${rows * 100}%`,
        backgroundPosition: `${cols > 1 ? (col * 100) / (cols - 1) : 0}% ${
          rows > 1 ? (row * 100) / (rows - 1) : 0
        }%`,
        ...(reduced ? {} : { x, y, rotate, opacity }),
      }}
    />
  );
}

function Seams({
  p,
  cols,
  rows,
  reduced,
}: {
  p: MotionValue<number>;
  cols: number;
  rows: number;
  reduced: boolean;
}) {
  const opacity = useTransform(p, [0.75, 0.9], [0.5, 0]);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: reduced ? 0 : opacity,
        backgroundImage:
          "linear-gradient(rgba(255,31,61,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,31,61,0.5) 1px, transparent 1px)",
        backgroundSize: `${100 / cols}% ${100 / rows}%`,
      }}
    />
  );
}

function Chip({
  p,
  label,
  from,
  side,
  index,
  reduced,
  top,
  left,
}: {
  p: MotionValue<number>;
  label: string;
  from: number;
  side: "left" | "right" | "top" | "bottom";
  index: number;
  reduced: boolean;
  top?: number;
  left?: string;
}) {
  const start = 0.52 + index * 0.07;
  const end = start + 0.2;
  const move = useTransform(p, [start, end], [from, 0]);
  const opacity = useTransform(p, [start, end], [0, 1]);

  const vertical = side === "top" || side === "bottom";
  const placement =
    side === "left"
      ? "right-full mr-4 flex-row items-center"
      : side === "right"
        ? "left-full ml-4 flex-row-reverse items-center"
        : side === "top"
          ? "bottom-full mb-3 flex-col items-center"
          : "top-full mt-3 flex-col-reverse items-center";

  const motionStyle = vertical
    ? reduced
      ? { transform: "translateX(-50%)" }
      : { x: "-50%", y: move, opacity }
    : reduced
      ? {}
      : { x: move, opacity };

  return (
    <motion.div
      className={`absolute hidden gap-2 xl:flex ${placement}`}
      style={{ top, left, ...motionStyle }}
    >
      <span className="whitespace-nowrap rounded-full border border-brand-red/40 bg-brand-black-soft/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-white shadow-[0_0_20px_rgba(255,31,61,0.15)]">
        {label}
      </span>
      <span
        className={
          vertical
            ? "h-8 w-0 border-l border-dashed border-brand-red/50"
            : "h-0 w-8 border-t border-dashed border-brand-red/50"
        }
      />
      <span
        className="h-1.5 w-1.5 rounded-full bg-brand-red"
        style={{ boxShadow: "0 0 8px rgba(255,31,61,0.9)" }}
      />
    </motion.div>
  );
}

/** Tracks whether the viewport is at the `lg` breakpoint (1024px) or wider. */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

export default function AssemblySection() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // SSR + first client render -> the auto-play variant (no pin), matching the
  // SmartSolutions section's hydration strategy.
  const pinned = mounted && isDesktop && !reduced;

  return pinned ? (
    <DesktopAssembly reduced={reduced} />
  ) : (
    <MobileAssembly reduced={reduced} />
  );
}

/* Desktop: 320vh pin, scrubbed by scroll. */
function DesktopAssembly({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <AssemblyScene
          p={scrollYProgress}
          reduced={reduced}
          scatterScale={1}
          subtitle="These are real apps from the Umvix portfolio — keep scrolling and watch design, code, and AI click together into shipped products."
        />
      </div>
    </section>
  );
}

/* Mobile / reduced-motion: normal-flow section; the scene assembles itself
   once it scrolls into view (reduced motion renders it pre-assembled). */
function MobileAssembly({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const p = useMotionValue(reduced ? 1 : 0);
  const inView = useInView(ref, { once: true, margin: "-30% 0px -30% 0px" });

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(p, 1, { duration: 3.6, ease: "easeInOut" });
    return () => controls.stop();
  }, [inView, reduced, p]);

  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center overflow-hidden py-20 sm:py-24"
    >
      <AssemblyScene
        p={p}
        reduced={reduced}
        scatterScale={0.45}
        subtitle="Real apps from the Umvix portfolio — design, code, and AI click together into shipped products."
      />
    </section>
  );
}

/* The shared scene: ambient background, heading, and the two devices. */
function AssemblyScene({
  p,
  reduced,
  scatterScale,
  subtitle,
}: {
  p: MotionValue<number>;
  reduced: boolean;
  scatterScale: number;
  subtitle: string;
}) {
  const glowOpacity = useTransform(p, [0.82, 0.95], [0, 1]);
  const badgeOpacity = useTransform(p, [0.86, 0.96], [0, 1]);
  const badgeY = useTransform(p, [0.86, 0.96], [12, 0]);

  return (
    <>
        {/* ambient background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 75%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            background: "radial-gradient(ellipse at 50% 60%, #ff1f3d 0%, transparent 55%)",
          }}
        />

        {/* centered heading — same treatment as the other home headings */}
        <div className="relative z-10 mb-8 px-4 text-center">
          <h2 className="font-headline text-[clamp(1.4rem,3.4vw,3.1rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-brand-white">
            Watch Our <span className="text-brand-red">Portfolio</span> Assemble Itself
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-brand-gray sm:text-base">
            {subtitle}
          </p>
        </div>

        {/* the devices being assembled — app left, dashboard right */}
        <div className="relative z-10 mt-10">
          {/* glow behind the finished pair */}
          <motion.div
            aria-hidden
            className="absolute -inset-10 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse, rgba(198,92,242,0.3), rgba(255,31,61,0.14) 60%, transparent 75%)",
              opacity: reduced ? 1 : glowOpacity,
            }}
          />

          {/* ready-to-ship badge */}
          <motion.div
            className="absolute -top-12 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-brand-red/40 bg-brand-black-soft/95 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-white shadow-[0_10px_30px_rgba(255,31,61,0.25)]"
            style={reduced ? undefined : { opacity: badgeOpacity, y: badgeY }}
          >
            <span className="mr-1.5 text-brand-red">✓</span>
            Ready to Ship
          </motion.div>

          {/* phone (112px) + gap (12px) + browser (216px) = 340px — fits a 390px
              viewport without clipping either device */}
          <div className="flex items-center justify-center gap-3 sm:gap-8 lg:gap-12">
            {/* phone frame (left) */}
            <div
              className="relative h-[15rem] w-[7rem] shrink-0 rounded-[1.8rem] border-[3px] border-[#1c1c1f] bg-[#0b0b0e] ring-1 ring-white/15 sm:h-[26rem] sm:w-[12.5rem] sm:rounded-[2.2rem]"
              style={{ boxShadow: "0 40px 80px -24px rgba(0,0,0,0.9)" }}
            >
              <div className="absolute left-1/2 top-1.5 z-20 h-[6px] w-[36%] -translate-x-1/2 rounded-full bg-black ring-1 ring-black/40" />
              <div className="absolute inset-[5px] overflow-hidden rounded-[1.5rem] sm:rounded-[1.8rem]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Tile
                    key={i}
                    p={p}
                    i={i}
                    shot={APP_SHOT}
                    cols={2}
                    rows={3}
                    scatters={PHONE_SCATTERS}
                    baseStart={0.04}
                    reduced={reduced}
                    scatterScale={scatterScale}
                  />
                ))}
                <Seams p={p} cols={2} rows={3} reduced={reduced} />
              </div>

              {/* left chips dock onto the phone */}
              {LEFT_CHIPS.map((c, i) => (
                <Chip
                  key={c.label}
                  p={p}
                  label={c.label}
                  top={c.top}
                  from={c.from}
                  side="left"
                  index={i * 2}
                  reduced={reduced}
                />
              ))}
            </div>

            {/* dashboard browser frame (right) — same height as the phone */}
            <div
              className="relative h-[15rem] w-[13.5rem] shrink-0 rounded-lg border border-white/12 bg-[#0b0b0e] ring-1 ring-white/10 sm:h-[26rem] sm:w-[32rem] sm:rounded-xl lg:w-[46rem]"
              style={{ boxShadow: "0 40px 80px -24px rgba(0,0,0,0.9)" }}
            >
              <div className="flex h-4 items-center gap-1 border-b border-white/[0.07] bg-white/[0.04] px-2 sm:h-5 sm:gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 hidden flex-1 items-center rounded-full bg-black/40 px-2 py-[2px] text-[8px] text-white/40 sm:flex">
                  mylearningmindset.com
                </span>
              </div>
              <div className="relative h-[calc(100%-1rem)] overflow-hidden rounded-b-lg sm:h-[calc(100%-1.25rem)] sm:rounded-b-xl">
                {/* aspect-locked stage so the screenshot never distorts — sides crop instead */}
                <div
                  className="absolute left-1/2 top-0 h-full -translate-x-1/2"
                  style={{ aspectRatio: "2000 / 1046" }}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Tile
                      key={i}
                      p={p}
                      i={i}
                      shot={DASH_SHOT}
                      cols={3}
                      rows={2}
                      scatters={DASH_SCATTERS}
                      baseStart={0.08}
                      reduced={reduced}
                      scatterScale={scatterScale}
                    />
                  ))}
                  <Seams p={p} cols={3} rows={2} reduced={reduced} />
                </div>
              </div>

              {/* chips drop onto the dashboard from above and below */}
              {DASH_CHIPS.map((c, i) => (
                <Chip
                  key={c.label}
                  p={p}
                  label={c.label}
                  left={c.left}
                  from={c.from}
                  side={c.side}
                  index={i * 2 + 1}
                  reduced={reduced}
                />
              ))}
            </div>
          </div>
        </div>
    </>
  );
}
