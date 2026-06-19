"use client";

import { useEffect, useRef } from "react";

const LERP_DEFAULT = 0.1;
const LERP_REDUCED = 1;

export default function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef(0);
  const lerpRef = useRef(LERP_DEFAULT);

  useEffect(() => {
    lerpRef.current = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? LERP_REDUCED
      : LERP_DEFAULT;

    const getTarget = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      return scrollable > 0
        ? Math.min(1, Math.max(0, window.scrollY / scrollable))
        : 0;
    };

    const render = () => {
      const target = targetRef.current;
      const prev = currentRef.current;
      const next = prev + (target - prev) * lerpRef.current;
      currentRef.current = next;

      const fill = fillRef.current;
      if (fill) {
        const heightPct = next > 0 ? Math.max(next * 100, 10) : 0;
        fill.style.height = `${heightPct}%`;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    const onScroll = () => {
      targetRef.current = getTarget();
    };

    targetRef.current = getTarget();
    rafRef.current = requestAnimationFrame(render);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="scroll-progress pointer-events-none fixed right-5 top-1/2 z-[70] hidden h-36 w-[3px] -translate-y-1/2 md:block lg:right-6"
    >
      <div className="absolute inset-0 rounded-full bg-white/[0.06]" />
      <div
        ref={fillRef}
        className="scroll-progress-fill absolute left-0 top-0 h-0 w-full rounded-full will-change-[height]"
      />
    </div>
  );
}
