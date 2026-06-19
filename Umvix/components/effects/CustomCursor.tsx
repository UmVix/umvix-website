"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const trail = trailRef.current;
    if (!dot || !ring || !trail) return;

    setEnabled(true);
    document.body.classList.add("custom-cursor-active");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let trailX = mouseX;
    let trailY = mouseY;
    let raf = 0;

    const applyPosition = () => {
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;
    };

    applyPosition();
    dot.style.opacity = "1";
    ring.style.opacity = "1";
    trail.style.opacity = "0.25";

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'a, button, [data-cursor="hover"], input, textarea, select, label'
      );
      const isHover = Boolean(interactive);
      ring.dataset.hover = isHover ? "true" : "false";
      dot.dataset.hover = isHover ? "true" : "false";
    };

    const render = () => {
      // Dot tracks instantly; ring/trail use light easing for a premium feel.
      ringX += (mouseX - ringX) * 0.42;
      ringY += (mouseY - ringY) * 0.42;
      trailX += (mouseX - trailX) * 0.22;
      trailY += (mouseY - trailY) * 0.22;
      applyPosition();
      raf = requestAnimationFrame(render);
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      trail.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      trail.style.opacity = "0.25";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Always render DOM so refs exist when the effect runs (fixes init bug).
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[9999] hidden md:block ${
        enabled ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={trailRef}
        className="custom-cursor-trail fixed left-0 top-0 h-12 w-12 rounded-full opacity-0"
      />
      <div
        ref={ringRef}
        data-hover="false"
        className="custom-cursor-ring fixed left-0 top-0 h-8 w-8 rounded-full border border-brand-red opacity-0"
      />
      <div
        ref={dotRef}
        data-hover="false"
        className="custom-cursor-dot fixed left-0 top-0 h-2 w-2 rounded-full bg-brand-red opacity-0"
      />
    </div>
  );
}
