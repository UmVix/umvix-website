"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import SmartSolutionsPreview, {
  SMART_SOLUTIONS_SERVICES,
} from "@/components/home/SmartSolutionsPreview";
import { useReducedMotion } from "@/lib/hooks";

const COUNT = SMART_SOLUTIONS_SERVICES.length;

// Each card is taller than the viewport so you scroll *through* it (revealing
// its lower content) before the next card rises up — matching the reference.
const CARD_RATIO = 1.32; // card height ÷ viewport height
const GAP_RATIO = 0.05; // gap between cards ÷ viewport height

function Heading() {
  return (
    <Reveal y={28}>
      <h2
        id="smart-solutions-heading"
        className="mx-auto w-full max-w-none text-center font-headline text-[clamp(1.2rem,3.4vw,3.1rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-brand-white whitespace-nowrap"
      >
        Smart <span className="text-brand-red">Agentic AI</span> For Your Business
      </h2>
    </Reveal>
  );
}

function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute left-1/4 top-1/3 h-64 w-[min(100%,40rem)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,31,61,0.12)_0%,transparent_72%)]" />
      <div className="absolute bottom-10 right-0 h-72 w-72 bg-[radial-gradient(circle_at_center,rgba(255,31,61,0.08)_0%,transparent_70%)]" />
    </div>
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

export default function SmartSolutionsSection() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // SSR + first client render -> stacked layout (avoids hydration mismatch and
  // duplicate ids / double GSAP from rendering both variants at once).
  const usePinned = mounted && isDesktop && !reduced;

  return (
    <section
      id="smart-solutions"
      className="relative"
      aria-labelledby="smart-solutions-heading"
    >
      {usePinned ? (
        <>
          <div className="site-container py-16 lg:py-20">
            <Heading />
          </div>
          <PinnedExperience />
        </>
      ) : (
        <StackedFallback />
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Desktop: full-height pinned filmstrip                                       */
/* -------------------------------------------------------------------------- */

function PinnedExperience() {
  const [active, setActive] = useState(0);
  const [vh, setVh] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 0
  );
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const cardH = vh * CARD_RATIO;
  const gap = vh * GAP_RATIO;
  const unit = cardH + gap;
  const stripH = COUNT * cardH + (COUNT - 1) * gap;
  // Top breathing room shared by the tabs + the preview rail so they line up.
  const topPad = Math.min(40, Math.max(8, vh * 0.04));
  const maxTranslate = Math.max(stripH - vh + topPad, 0);

  // Progress through the tall pin track. 0 -> sticky engages, 1 -> releases.
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  // Entrance progress: 0 when the section's top is at the bottom of the viewport,
  // 1 once it reaches the top (sticky engaged). Drives the slide-in-from-right.
  const { scrollYProgress: enterProgress } = useScroll({
    target: pinRef,
    offset: ["start end", "start start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.35,
    restDelta: 0.0005,
  });

  const enterSmooth = useSpring(enterProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
    restDelta: 0.0005,
  });

  // Translate the whole filmstrip up by the full scroll distance.
  const filmstripY = useTransform(smooth, [0, 1], [0, -maxTranslate]);

  // Active tab = whichever card currently sits under the viewport centre.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!unit) return;
    const center = p * maxTranslate + vh / 2 - topPad;
    const next = Math.min(COUNT - 1, Math.max(0, Math.floor(center / unit)));
    setActive((prev) => (prev === next ? prev : next));
  });

  // Clicking a tab jumps the page scroll so that card is centred.
  const goTo = useCallback(
    (index: number) => {
      const el = pinRef.current;
      if (!el || !maxTranslate) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const center = index * unit + cardH / 2;
      const p = Math.min(1, Math.max(0, (center - vh / 2 + topPad) / maxTranslate));
      window.scrollTo({ top: top + p * maxTranslate, behavior: "smooth" });
    },
    [unit, cardH, vh, maxTranslate, topPad]
  );

  return (
    <div
      ref={pinRef}
      className="relative"
      style={{ height: stripH ? stripH + topPad : "100vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <AmbientGlow />

        <div className="site-container relative z-10 grid h-full grid-cols-[minmax(0,38%)_minmax(0,1fr)] items-stretch gap-x-10 xl:gap-x-14">
          {/* Left: fixed service tabs — top-aligned with the preview card */}
          <div
            className="flex flex-col justify-start"
            style={{ paddingTop: topPad }}
          >
            <ServiceTabs active={active} onSelect={goTo} reduced={false} />
          </div>

          {/* Right: full-height window the filmstrip slides through */}
          <div className="smart-preview-rail" style={{ paddingTop: topPad }}>
            <motion.div
              style={{ y: filmstripY, gap: gap || undefined }}
              className="flex flex-col will-change-transform"
            >
              {SMART_SOLUTIONS_SERVICES.map((service, index) => (
                <FilmCard
                  key={service.id}
                  service={service}
                  index={index}
                  active={active}
                  enterProgress={enterSmooth}
                  scrollProgress={smooth}
                  cardH={cardH}
                  unit={unit}
                  vh={vh}
                  topPad={topPad}
                  maxTranslate={maxTranslate}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Single preview card — slides in from the right + fades as it scrolls in     */
/* -------------------------------------------------------------------------- */

type FilmCardProps = {
  service: (typeof SMART_SOLUTIONS_SERVICES)[number];
  index: number;
  active: number;
  enterProgress: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  cardH: number;
  unit: number;
  vh: number;
  topPad: number;
  maxTranslate: number;
};

function FilmCard({
  service,
  index,
  active,
  enterProgress,
  scrollProgress,
  cardH,
  unit,
  vh,
  topPad,
  maxTranslate,
}: FilmCardProps) {
  // The first card rides the section-entrance progress (it's already on screen
  // when the pin engages). Later cards animate as they scroll up into view.
  const isFirst = index === 0;

  // Scroll progress at which this card sits dead-centre of the viewport.
  const pCenter =
    maxTranslate > 0
      ? (index * unit + cardH / 2 - vh / 2 + topPad) / maxTranslate
      : 1;
  const enterDuration = maxTranslate > 0 ? (0.7 * unit) / maxTranslate : 0.3;
  const pStart = Math.max(0, pCenter - enterDuration);

  const source = isFirst ? enterProgress : scrollProgress;
  const xInput = isFirst ? [0, 1] : [pStart, pCenter];
  const opacityInput = isFirst ? [0, 0.45, 1] : [pStart, pCenter];
  const opacityOutput = isFirst ? [0, 0.8, 1] : [0, 1];

  const x = useTransform(source, xInput, isFirst ? [110, 0] : [120, 0], {
    clamp: true,
  });
  const opacity = useTransform(source, opacityInput, opacityOutput, {
    clamp: true,
  });

  return (
    <motion.div
      role="tabpanel"
      id={`smart-solution-panel-${service.id}`}
      aria-labelledby={`smart-solution-tab-${service.id}`}
      aria-hidden={index !== active}
      style={{ x, opacity, height: cardH || undefined }}
      className="shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_20px_60px_rgba(0,0,0,0.4)] will-change-[transform,opacity]"
    >
      <SmartSolutionsPreview service={service} />
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared tab list                                                            */
/* -------------------------------------------------------------------------- */

function ServiceTabs({
  active,
  onSelect,
  reduced,
}: {
  active: number;
  onSelect: (index: number) => void;
  reduced: boolean;
}) {
  return (
    <div role="tablist" aria-label="Services">
      {SMART_SOLUTIONS_SERVICES.map((item, index) => {
        const isActive = index === active;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`smart-solution-panel-${item.id}`}
            id={`smart-solution-tab-${item.id}`}
            data-cursor="hover"
            onClick={() => onSelect(index)}
            className="group w-full border-b border-white/10 py-5 text-left transition-colors sm:py-6"
          >
            <span
              className={`block text-xl font-semibold transition-colors sm:text-2xl ${
                isActive
                  ? "text-brand-white"
                  : "text-brand-gray-muted group-hover:text-brand-gray"
              }`}
            >
              {item.title}
            </span>

            <AnimatePresence initial={false}>
              {isActive && (
                <motion.p
                  key={`desc-${item.id}`}
                  initial={
                    reduced ? false : { opacity: 0, height: 0, marginTop: 0 }
                  }
                  animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                  exit={
                    reduced ? undefined : { opacity: 0, height: 0, marginTop: 0 }
                  }
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden text-sm leading-relaxed text-brand-gray sm:text-[0.95rem]"
                >
                  {item.description}
                </motion.p>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile / reduced-motion fallback — a sticky card deck: each service card    */
/* pins below the navbar and the next one slides up over it, so the section    */
/* reads as a stacked, layered deck instead of a plain list.                   */
/* -------------------------------------------------------------------------- */

function StackedFallback() {
  return (
    <div className="relative py-20 sm:py-24">
      <AmbientGlow />

      <div className="site-container relative z-10">
        <Heading />

        <div className="mt-12 flex flex-col gap-10">
          {SMART_SOLUTIONS_SERVICES.map((service, index) => (
            <div
              key={service.id}
              className="sticky"
              style={{
                // each card pins slightly lower so the previous cards' top
                // edges stay visible as a layered deck
                top: `calc(var(--nav-height) + ${0.75 + index * 0.85}rem)`,
                zIndex: index + 1,
              }}
            >
              <Reveal y={24} delay={index === 0 ? 0 : 0.05}>
                <div
                  role="tabpanel"
                  id={`smart-solution-panel-${service.id}`}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_-18px_50px_rgba(0,0,0,0.55),0_20px_60px_rgba(0,0,0,0.4)]"
                >
                  {/* card header — number chip + service name + blurb */}
                  <div className="relative border-b border-white/[0.06] px-5 py-4">
                    <div
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-red/40 to-transparent"
                    />
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-red/12 font-headline text-xs font-extrabold text-brand-red ring-1 ring-brand-red/25">
                        0{index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-brand-white">
                        {service.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-brand-gray">
                      {service.description}
                    </p>
                  </div>

                  <SmartSolutionsPreview service={service} />
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
