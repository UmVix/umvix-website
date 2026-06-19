"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 35;
const CONNECT_DISTANCE = 80;
const REPULSION_RADIUS = 90;
const REPULSION_FORCE = 0.28;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
};

type UseParticleCanvasOptions = {
  activeColor: string;
  reduced: boolean;
  enabled: boolean;
};

export function useParticleCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  panelRef: React.RefObject<HTMLDivElement | null>,
  mouseRef: React.RefObject<{ x: number; y: number; active: boolean }>,
  { activeColor, reduced, enabled }: UseParticleCanvasOptions
) {
  const particlesRef = useRef<Particle[]>([]);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const rafRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    const panel = panelRef.current;
    if (!canvas || !panel) return;

    const initParticles = (width: number, height: number) => {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: 0.6 + Math.random() * 1.2,
        opacity: 0.06 + Math.random() * 0.12,
      }));
    };

    const resize = () => {
      const rect = panel.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);

      sizeRef.current = { width, height, dpr };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particlesRef.current.length === 0) {
        initParticles(width, height);
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(panel);

    const parseRgb = (hex: string) => {
      const n = Number.parseInt(hex.replace("#", ""), 16);
      if (Number.isNaN(n)) return { r: 255, g: 77, b: 109 };
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    };

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      if (document.hidden) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = sizeRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const rgb = parseRgb(activeColor);

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const tintRadius = Math.min(width, height) * 0.35;

      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;

          if (mouse?.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < REPULSION_RADIUS && dist > 0.001) {
              const force = (1 - dist / REPULSION_RADIUS) * REPULSION_FORCE;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          p.vx *= 0.99;
          p.vy *= 0.99;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        const distToOrb = Math.hypot(p.x - cx, p.y - cy);
        const tintMix =
          distToOrb < tintRadius ? 1 - distToOrb / tintRadius : 0;
        const r = Math.round(255 * (1 - tintMix) + rgb.r * tintMix);
        const g = Math.round(255 * (1 - tintMix) + rgb.g * tintMix);
        const b = Math.round(255 * (1 - tintMix) + rgb.b * tintMix);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < CONNECT_DISTANCE) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 * (1 - dist / CONNECT_DISTANCE)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef, panelRef, mouseRef, activeColor, reduced, enabled]);
}
