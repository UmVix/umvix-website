"use client";

import { useEffect, useRef } from "react";

type ParticleTextProps = {
  lines: string[];
  /** Class used ONLY to measure font-size / weight / spacing / line-height. */
  measureClassName?: string;
  className?: string;
  /** Solid text color as "r, g, b". Defaults to white to match the headline. */
  rgb?: string;
  /** Evaporating particle color as "r, g, b". Defaults to brand red. */
  particleRgb?: string;
  /** Spacing (px) between sampled particles. Lower = denser text. */
  sampleGap?: number;
  marginTop?: number;
};

type Phase = "text" | "evaporating" | "scattered" | "reforming";

type Particle = {
  line: number; // which headline line this particle belongs to
  hx: number; // home (text) position
  hy: number;
  sx: number; // scatter target offset
  sy: number;
  size: number;
  delay: number; // 0..1 stagger so particles leave/return at different times
  amp: number; // drift amplitude for organic float
  freq: number; // drift frequency
  phase: number; // drift phase offset
};

type LineState = {
  phase: Phase;
  phaseStart: number;
  progress: number; // 0 = solid text, 1 = fully scattered
  hovering: boolean;
};

const PHASE_MS = {
  textHold: 700,
  evaporating: 1600,
  scattered: 300,
  reforming: 1600,
};

// Largest per-particle stagger as a fraction of a phase.
const MAX_DELAY = 0.45;

export default function ParticleText({
  lines,
  measureClassName = "",
  className = "",
  rgb = "255, 255, 255",
  particleRgb = "255, 31, 61",
  sampleGap = 4,
  marginTop = 0,
}: ParticleTextProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const measurer = measureRef.current;
    if (!wrapper || !canvas || !measurer) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let rafId = 0;

    // Font state captured during build so we can draw crisp solid text.
    let fontStr = "";
    let fontSizePx = 64;
    let lineHeightPx = 0;
    let letterSpacingPx = 0;
    let lineWidths: number[] = [];

    // Each headline line evaporates / reforms on its own, driven by which
    // line the cursor is currently over.
    let lineStates: LineState[] = [];

    // Smootherstep: zero 1st & 2nd derivatives at the ends -> very silky.
    const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

    const buildParticles = () => {
      const styles = getComputedStyle(measurer);
      const fontSize = parseFloat(styles.fontSize) || 64;
      const fontWeight = styles.fontWeight || "800";
      const fontFamily = styles.fontFamily || "sans-serif";
      let letterSpacing = parseFloat(styles.letterSpacing);
      if (Number.isNaN(letterSpacing)) letterSpacing = 0;
      let lineHeight = parseFloat(styles.lineHeight);
      if (Number.isNaN(lineHeight)) lineHeight = fontSize * 1.14;

      fontStr = `${fontWeight} ${fontSize}px ${fontFamily}`;
      fontSizePx = fontSize;
      lineHeightPx = lineHeight;
      letterSpacingPx = letterSpacing;

      width = wrapper.clientWidth;
      height = Math.ceil(lineHeight * lines.length + fontSize * 0.35);

      // Size canvas + the visible box.
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      wrapper.style.height = `${height}px`;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      // Offscreen render of the text to sample pixels from.
      const off = document.createElement("canvas");
      off.width = Math.floor(width * dpr);
      off.height = Math.floor(height * dpr);
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.scale(dpr, dpr);
      octx.fillStyle = "#fff";
      octx.textBaseline = "alphabetic";
      octx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      // letterSpacing is supported in modern Chromium/Safari/Firefox.
      try {
        (octx as CanvasRenderingContext2D & {
          letterSpacing: string;
        }).letterSpacing = `${letterSpacing}px`;
      } catch {
        /* ignore unsupported */
      }

      lineWidths = lines.map((line) => octx.measureText(line).width);

      lines.forEach((line, i) => {
        const baseline = lineHeight * i + fontSize * 0.82;
        octx.fillText(line, 0, baseline);
      });

      const data = octx.getImageData(0, 0, off.width, off.height).data;
      const step = Math.max(2, Math.round(sampleGap * dpr));
      const next: Particle[] = [];
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          const alpha = data[(y * off.width + x) * 4 + 3];
          if (alpha > 128) {
            const cssY = y / dpr;
            const lineIdx = Math.min(
              lines.length - 1,
              Math.max(0, Math.floor(cssY / lineHeight))
            );
            const angle = Math.random() * Math.PI * 2;
            const dist =
              fontSize * (0.6 + Math.random() * 1.6) * (0.5 + Math.random());
            next.push({
              line: lineIdx,
              hx: x / dpr,
              hy: cssY,
              // Bias the scatter upward so it reads as "evaporating".
              sx: Math.cos(angle) * dist,
              sy: Math.sin(angle) * dist - fontSize * (0.4 + Math.random()),
              size: 1 + Math.random() * 1.1,
              delay: Math.random() * MAX_DELAY,
              amp: fontSize * (0.04 + Math.random() * 0.08),
              freq: 0.0008 + Math.random() * 0.0014,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
      }
      particles = next;

      // Preserve existing per-line states across resizes where possible.
      const now = performance.now();
      lineStates = lines.map(
        (_, i) =>
          lineStates[i] ?? {
            phase: "text" as Phase,
            phaseStart: now,
            progress: 0,
            hovering: false,
          }
      );
    };

    const startPhase = (s: LineState, next: Phase, now: number) => {
      s.phase = next;
      s.phaseStart = now;
    };

    // Solid text stays fully visible until the line has scattered ~25%, then
    // cross-fades out as particles take over.
    const SOLID_T = 0.25;
    const solidFor = (p: number) => clamp01((SOLID_T - p) / SOLID_T);

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Advance each line's own phase machine (linear here; easing is applied
      // per-particle so the dissolve feels organic and staggered).
      for (const s of lineStates) {
        const elapsed = now - s.phaseStart;
        if (s.phase === "text") {
          s.progress = 0;
          if (s.hovering && elapsed >= PHASE_MS.textHold)
            startPhase(s, "evaporating", now);
        } else if (s.phase === "evaporating") {
          const t = Math.min(1, elapsed / PHASE_MS.evaporating);
          s.progress = t;
          if (t >= 1) startPhase(s, "scattered", now);
        } else if (s.phase === "scattered") {
          s.progress = 1;
          if (elapsed >= PHASE_MS.scattered) startPhase(s, "reforming", now);
        } else if (s.phase === "reforming") {
          const t = Math.min(1, elapsed / PHASE_MS.reforming);
          s.progress = 1 - t;
          if (t >= 1) startPhase(s, "text", now);
        }
      }

      const [tr, tg, tb] = rgb.split(",").map((v) => v.trim());
      const [pr, pg, pb] = particleRgb.split(",").map((v) => v.trim());

      // Crisp solid bold text (original color) for any whole / reforming line.
      ctx.font = fontStr;
      ctx.textBaseline = "alphabetic";
      try {
        (ctx as CanvasRenderingContext2D & {
          letterSpacing: string;
        }).letterSpacing = `${letterSpacingPx}px`;
      } catch {
        /* ignore unsupported */
      }
      lines.forEach((line, i) => {
        const solidAlpha = solidFor(lineStates[i].progress);
        if (solidAlpha <= 0.01) return;
        const baseline = lineHeightPx * i + fontSizePx * 0.82;
        ctx.fillStyle = `rgba(${tr}, ${tg}, ${tb}, ${solidAlpha})`;
        ctx.fillText(line, 0, baseline);
      });

      // Evaporating particles (brand color), staggered + gently drifting.
      ctx.fillStyle = `rgb(${pr}, ${pg}, ${pb})`;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const s = lineStates[p.line];
        if (s.progress <= 0.0001) continue;
        // Per-particle eased progress with stagger.
        const local = clamp01((s.progress - p.delay) / (1 - p.delay));
        const e = smoother(local);
        if (e <= 0.001) continue;
        const drift = e * p.amp;
        const x = p.hx + p.sx * e + Math.sin(now * p.freq + p.phase) * drift;
        const y = p.hy + p.sy * e + Math.cos(now * p.freq + p.phase) * drift;
        // Fade in quickly once it starts moving, then fade out as it travels.
        const alpha = clamp01(e / 0.12) * (1 - e * 0.85);
        if (alpha <= 0.02) continue;
        ctx.globalAlpha = alpha;
        ctx.fillRect(x, y, p.size, p.size);
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(draw);
    };

    const setHoveredLine = (idx: number) => {
      for (let i = 0; i < lineStates.length; i++)
        lineStates[i].hovering = i === idx;
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      let idx = -1;
      if (x >= 0 && y >= 0 && y < height) {
        const li = Math.floor(y / lineHeightPx);
        const pad = fontSizePx * 0.35;
        if (li >= 0 && li < lines.length && x <= (lineWidths[li] ?? width) + pad)
          idx = li;
      }
      setHoveredLine(idx);
    };

    const onLeave = () => setHoveredLine(-1);

    const ro = new ResizeObserver(() => {
      void document.fonts.ready.then(buildParticles);
    });
    ro.observe(wrapper);

    const init = async () => {
      await document.fonts.ready;
      buildParticles();
    };

    if (reduceMotion) {
      void init().then(() => {
        // Render crisp solid text once, no animation.
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        const [r, g, b] = rgb.split(",").map((v) => v.trim());
        ctx.font = fontStr;
        ctx.textBaseline = "alphabetic";
        try {
          (ctx as CanvasRenderingContext2D & {
            letterSpacing: string;
          }).letterSpacing = `${letterSpacingPx}px`;
        } catch {
          /* ignore unsupported */
        }
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
        lines.forEach((line, i) => {
          const baseline = lineHeightPx * i + fontSizePx * 0.82;
          ctx.fillText(line, 0, baseline);
        });
      });
      return () => ro.disconnect();
    }

    void init().then(() => {
      wrapper.addEventListener("pointermove", onMove);
      wrapper.addEventListener("pointerleave", onLeave);
      rafId = requestAnimationFrame(draw);
    });

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      wrapper.removeEventListener("pointermove", onMove);
      wrapper.removeEventListener("pointerleave", onLeave);
    };
  }, [lines, rgb, particleRgb, sampleGap]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full cursor-default ${className}`}
      style={marginTop ? { marginTop } : undefined}
    >
      {/* Hidden element used purely to measure the real headline font. */}
      <span
        ref={measureRef}
        aria-hidden
        className={`pointer-events-none invisible absolute left-0 top-0 ${measureClassName}`}
      >
        {lines[0]}
      </span>

      {/* Accessible text for screen readers / SEO. */}
      <h1 className="sr-only">{lines.join(" ")}</h1>

      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none block w-full"
      />
    </div>
  );
}
