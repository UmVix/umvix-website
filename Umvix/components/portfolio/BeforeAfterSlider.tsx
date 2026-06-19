"use client";

import { useCallback, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

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
  const dragging = useRef(false);

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
    <div
      ref={containerRef}
      className={`relative aspect-video w-full select-none overflow-hidden rounded-2xl border border-brand-red/15 ${className}`}
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
          <img src={afterSrc} alt={afterLabel} className="h-full w-full object-cover" />
        ) : (
          <Placeholder label={afterLabel} variant="after" />
        )}
        <span className="absolute right-3 top-3 rounded-full bg-brand-red px-3 py-1 text-xs font-semibold text-brand-white">
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
          <img src={beforeSrc} alt={beforeLabel} className="h-full w-full object-cover" style={{ width: containerRef.current?.clientWidth }} />
        ) : (
          <Placeholder label={beforeLabel} variant="before" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-brand-black/80 px-3 py-1 text-xs font-semibold text-brand-white">
          {beforeLabel}
        </span>
      </div>

      {/* Handle */}
      <div
        className="absolute top-0 z-10 flex h-full w-0.5 cursor-ew-resize items-center justify-center bg-brand-red"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="btn-primary flex h-10 w-10 items-center justify-center rounded-full shadow-lg accent-glow">
          <MoveHorizontal size={18} />
        </div>
      </div>
    </div>
  );
}

function Placeholder({
  label,
  variant,
}: {
  label: string;
  variant: "before" | "after";
}) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center ${
        variant === "before"
          ? "bg-[repeating-linear-gradient(45deg,#0a0a0a,#0a0a0a_12px,#141414_12px,#141414_24px)] text-brand-gray-muted"
          : "bg-brand-gradient text-brand-white"
      }`}
    >
      <span className="text-2xl font-bold opacity-80">{label}</span>
    </div>
  );
}
