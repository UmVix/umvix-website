"use client";

import { useEffect, useRef } from "react";

type Props = {
  text?: string;
  className?: string;
  height?: number;
};

type P = {
  x: number;
  y: number;
  hx: number; // home x
  hy: number; // home y
  vx: number;
  vy: number;
};

export default function ParticleLogo({
  text = "UMVIX",
  className = "",
  height = 160,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let particles: P[] = [];
    let width = 0;
    let raf = 0;
    let exploded = false;
    let explodeUntil = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };

    const buildParticles = () => {
      width = wrap.clientWidth;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Render text to sample its pixels.
      ctx.clearRect(0, 0, width, height);
      const fontSize = Math.min(width / (text.length * 0.62), height * 0.8);
      ctx.fillStyle = "#fff";
      ctx.font = `800 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, width / 2, height / 2);

      const image = ctx.getImageData(0, 0, width * dpr, height * dpr);
      ctx.clearRect(0, 0, width, height);

      const gap = 5;
      const next: P[] = [];
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const idx = (Math.floor(y * dpr) * (width * dpr) + Math.floor(x * dpr)) * 4;
          if (image.data[idx + 3] > 128) {
            next.push({
              x: Math.random() * width,
              y: Math.random() * height,
              hx: x,
              hy: y,
              vx: 0,
              vy: 0,
            });
          }
        }
      }
      particles = next;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const now = performance.now();
      if (exploded && now > explodeUntil) exploded = false;

      for (const p of particles) {
        if (exploded) {
          // Drift outward.
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;
        } else {
          // Spring home.
          const dx = p.hx - p.x;
          const dy = p.hy - p.y;
          p.vx = (p.vx + dx * 0.08) * 0.78;
          p.vy = (p.vy + dy * 0.08) * 0.78;

          // Cursor repel.
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const dist = Math.hypot(mdx, mdy);
          if (dist < 40) {
            const force = (40 - dist) / 40;
            p.vx += (mdx / dist) * force * 4;
            p.vy += (mdy / dist) * force * 4;
          }

          p.x += p.vx;
          p.y += p.vy;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ff1f3d";
        ctx.fill();
      }

      if (visible) raf = requestAnimationFrame(render);
    };

    const explode = () => {
      exploded = true;
      explodeUntil = performance.now() + 1400;
      for (const p of particles) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 8;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(raf);
      }
    });

    buildParticles();
    observer.observe(canvas);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("click", explode);
    canvas.addEventListener("mouseenter", explode);
    window.addEventListener("resize", buildParticles);

    if (reduced) {
      // Static render: snap particles home and paint once.
      for (const p of particles) {
        p.x = p.hx;
        p.y = p.hy;
      }
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ff1f3d";
        ctx.fill();
      }
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("click", explode);
      canvas.removeEventListener("mouseenter", explode);
      window.removeEventListener("resize", buildParticles);
    };
  }, [text, height]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas
        ref={canvasRef}
        data-cursor="hover"
        aria-label={`${text} logo`}
        role="img"
        className="w-full cursor-pointer"
      />
    </div>
  );
}
