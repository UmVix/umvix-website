"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  beforeLabel?: string;
  afterLabel?: string;
  beforeSrc?: string;
  afterSrc?: string;
  className?: string;
};

export default function BeforeAfterSlider({
  beforeLabel = "Before",
  afterLabel = "After",
  beforeSrc,
  afterSrc,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [width, setWidth] = useState(0);
  const dragging = useRef(false);

  // Measure the container so the clipped "before" image can be pinned to the
  // full width and stay perfectly aligned with the "after" layer while sliding.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div className={`group relative ${className}`}>
      {/* ambient glow behind the frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-brand-red/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
      />

      <div
        ref={containerRef}
        className="relative aspect-[16/10] w-full cursor-ew-resize select-none overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-inset ring-white/5"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="slider"
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Before and after comparison"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
        }}
      >
        {/* After (base layer) */}
        <div className="absolute inset-0">
          {afterSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={afterSrc}
              alt={afterLabel}
              draggable={false}
              className="h-full w-full object-cover"
            />
          ) : (
            <Placeholder label={afterLabel} variant="after" />
          )}
          <span className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-brand-red px-3.5 py-1.5 text-xs font-semibold text-brand-white shadow-lg shadow-brand-red/30 ring-1 ring-white/20">
            <Sparkle />
            {afterLabel}
          </span>
        </div>

        {/* Before (clipped layer) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          {beforeSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={beforeSrc}
              alt={beforeLabel}
              draggable={false}
              className="h-full max-w-none object-cover"
              style={{ width: width || "100%" }}
            />
          ) : (
            <Placeholder label={beforeLabel} variant="before" fullWidth={width} />
          )}
          {/* subtle desaturating veil to sell the "old" side */}
          <div className="pointer-events-none absolute inset-0 bg-black/10" />
          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/70 px-3.5 py-1.5 text-xs font-semibold text-white/80 ring-1 ring-white/10 backdrop-blur">
            {beforeLabel}
          </span>
        </div>

        {/* Divider + handle */}
        <div
          className="absolute top-0 z-10 h-full w-px bg-white/70 shadow-[0_0_18px_2px_rgba(255,31,61,0.55)]"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gradient shadow-[0_8px_24px_rgba(255,31,61,0.45)] ring-4 ring-black/30 transition-transform duration-200 group-hover:scale-110">
            {/* pulsing ring */}
            <span className="absolute inset-0 animate-ping rounded-full bg-brand-red/40" />
            <Grip />
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-brand-gray-muted">
        Drag · or use ← → keys
      </p>
    </div>
  );
}

function Grip() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="relative text-white">
      <path
        d="M9 7 L5 12 L9 17 M15 7 L19 12 L15 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
    </svg>
  );
}

function Placeholder({
  label,
  variant,
  fullWidth,
}: {
  label: string;
  variant: "before" | "after";
  fullWidth?: number;
}) {
  return (
    <div
      className={`flex h-full items-center justify-center ${
        variant === "before"
          ? "bg-[repeating-linear-gradient(45deg,#0a0a0a,#0a0a0a_12px,#141414_12px,#141414_24px)] text-brand-gray-muted"
          : "bg-brand-gradient text-brand-white"
      }`}
      style={{ width: fullWidth || "100%" }}
    >
      <span className="text-2xl font-bold opacity-80">{label}</span>
    </div>
  );
}
