"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CODE = "umvix";

type Confetto = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
};

export default function EasterEgg() {
  const [active, setActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keystroke listener for the secret word.
  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-CODE.length);
      if (buffer === CODE) setActive(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Confetti burst.
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = ["#ff1f3d", "#b30000", "#ffffff", "#ff6b7d"];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = reduced ? 60 : 180;
    const pieces: Confetto[] = Array.from({ length: count }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.7) * 18,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let raf = 0;
    let frame = 0;
    const render = () => {
      frame += 1;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.vx *= 0.99;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        ctx.restore();
      }
      if (frame < 160) raf = requestAnimationFrame(render);
      else setActive(false);
    };
    raf = requestAnimationFrame(render);

    const timeout = setTimeout(() => setActive(false), 4000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[9998] flex items-center justify-center"
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="relative rounded-2xl border border-brand-red/40 bg-brand-black/80 px-10 py-6 text-center backdrop-blur"
          >
            <div className="bg-brand-gradient bg-clip-text text-3xl font-extrabold text-transparent">
              You found it.
            </div>
            <p className="mt-1 text-sm text-brand-gray">
              The Umvix secret handshake. You&apos;re clearly our kind of person.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
