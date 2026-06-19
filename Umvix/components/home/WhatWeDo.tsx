"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ServiceIllustration, {
  type IllustrationType,
} from "@/components/home/ServiceIllustration";
import { useInView, useReducedMotion } from "@/lib/hooks";

type Service = {
  index: string;
  title: string;
  tagline: string;
  type: IllustrationType;
};

const SERVICES: Service[] = [
  { index: "01", title: "Web Development", tagline: "Scalable web platforms", type: "web" },
  { index: "02", title: "Mobile Apps", tagline: "iOS & Android", type: "mobile" },
  { index: "03", title: "AI Chatbots", tagline: "Conversational AI", type: "ai" },
  { index: "04", title: "AI Automation", tagline: "Workflow automation", type: "automation" },
  { index: "05", title: "Custom Dashboards", tagline: "Data & analytics", type: "dashboard" },
];

const CYCLE_MS = 3400;

export default function WhatWeDo() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const reduced = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || reduced || !inView) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % SERVICES.length);
    }, CYCLE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reduced, inView]);

  return (
    <section ref={ref} className="relative mx-auto max-w-6xl px-4">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* Left: copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-brand-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
            What We Do
          </span>
          <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-brand-white sm:text-5xl">
            Capabilities that move
            <br />
            your business forward
          </h2>
          <p className="mt-5 max-w-md text-lg text-brand-gray">
            From enterprise web platforms to custom AI solutions, we engineer
            technology that cuts costs, boosts efficiency, and drives growth.
          </p>

          {/* Live illustration stage */}
          <div className="relative mt-8 hidden h-56 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] lg:block">
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={SERVICES[active].type}
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 p-6"
              >
                <ServiceIllustration type={SERVICES[active].type} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: glass list panel */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="glass overflow-hidden rounded-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-white/60">
              What We Do
            </span>
            <div className="flex gap-1.5">
              {SERVICES.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? "w-5 bg-brand-red" : "w-1.5 bg-white/25"
                  }`}
                />
              ))}
            </div>
          </div>

          <ul className="p-2">
            {SERVICES.map((service, i) => {
              const isActive = i === active;
              return (
                <li key={service.title}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    data-cursor="hover"
                    className={`relative flex w-full items-center gap-5 overflow-hidden rounded-xl px-5 py-4 text-left transition-colors duration-300 ${
                      isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    {/* active left accent */}
                    <span
                      className={`absolute inset-y-2 left-0 w-0.5 rounded-full bg-brand-red transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span
                      className={`font-mono text-sm transition-colors duration-300 ${
                        isActive ? "text-brand-red" : "text-brand-white/30"
                      }`}
                    >
                      {service.index}
                    </span>
                    <span className="flex-1">
                      <span
                        className={`block text-lg font-semibold transition-colors duration-300 ${
                          isActive ? "text-brand-white" : "text-brand-white/70"
                        }`}
                      >
                        {service.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-brand-gray">
                        {service.tagline}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      className={`shrink-0 transition-all duration-300 ${
                        isActive
                          ? "translate-x-0 text-brand-red opacity-100"
                          : "-translate-x-1 text-brand-white/40 opacity-0"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
