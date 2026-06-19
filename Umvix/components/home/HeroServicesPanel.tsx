"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks";

const SERVICES = [
  { index: "01", title: "Agentic AI", tagline: "Autonomous systems", type: "ai" },
  { index: "02", title: "Web Platforms", tagline: "Scalable apps", type: "web" },
  { index: "03", title: "Mobile Apps", tagline: "iOS & Android", type: "mobile" },
  { index: "04", title: "Automation", tagline: "Workflow pipelines", type: "automation" },
];

const CYCLE_MS = 4000;

export default function HeroServicesPanel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || reduced) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % SERVICES.length);
    }, CYCLE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reduced]);

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center lg:justify-end">
      {/* Dynamic Background Illustrations */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={SERVICES[active].type}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-12"
          >
            {SERVICES[active].type === "ai" && <AiNodes />}
            {SERVICES[active].type === "web" && <WebWireframe />}
            {SERVICES[active].type === "mobile" && <MobileWireframes />}
            {SERVICES[active].type === "automation" && <AutomationFlow />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Glass services card */}
      <div
        className="relative z-10 w-full max-w-sm lg:mr-0"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
              WHAT WE DO
            </span>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-brand-red/60" />
              ))}
            </div>
          </div>

          <ul className="p-2 space-y-1">
            {SERVICES.map((service, i) => {
              const isActive = i === active;
              return (
                <li key={service.title}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    data-cursor="hover"
                    className={`relative flex w-full items-start gap-5 rounded-xl px-5 py-4 text-left transition-all duration-500 ${
                      isActive
                        ? "bg-white/[0.07] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold mt-1 transition-colors duration-500 ${
                        isActive ? "text-brand-red" : "text-white/20"
                      }`}
                    >
                      {service.index}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`block text-lg font-bold tracking-tight transition-colors duration-500 ${
                          isActive ? "text-white" : "text-white/40"
                        }`}
                      >
                        {service.title}
                      </span>
                      <span className={`block text-xs mt-1 transition-colors duration-500 ${
                        isActive ? "text-white/50" : "text-white/20"
                      }`}>
                        &gt; {service.tagline}
                      </span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="active-dot"
                        className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-red shadow-[0_0_10px_rgba(255,31,61,0.8)]"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function AiNodes() {
  return (
    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" className="opacity-40">
      <motion.circle
        cx="200" cy="200" r="40"
        stroke="rgba(255,31,61,0.5)" strokeWidth="1"
        initial={{ r: 35 }}
        animate={{ r: 45 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
      />
      <circle cx="200" cy="200" r="30" fill="rgba(255,31,61,0.1)" />
      <text x="200" y="205" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" className="tracking-widest">GENERATING</text>
      
      {/* Nodes */}
      <NodePoint x={100} y={150} label="SEARCH" />
      <NodePoint x={300} y={150} label="CODE" />
      <NodePoint x={200} y={320} label="REASON" />
      
      {/* Connectors */}
      <Connector x1="135" y1="165" x2="175" y2="185" />
      <Connector x1="265" y1="165" x2="225" y2="185" />
      <Connector x1="200" y1="285" x2="200" y2="245" />
    </svg>
  );
}

function WebWireframe() {
  return (
    <svg width="450" height="300" viewBox="0 0 450 300" fill="none" className="opacity-30">
      <rect x="20" y="20" width="410" height="260" rx="12" stroke="white" strokeWidth="1.5" />
      <line x1="20" y1="60" x2="430" y2="60" stroke="white" strokeWidth="1" opacity="0.3" />
      <circle cx="45" cy="40" r="4" fill="rgba(255,31,61,0.6)" />
      <circle cx="60" cy="40" r="4" fill="white" opacity="0.2" />
      <circle cx="75" cy="40" r="4" fill="white" opacity="0.2" />
      
      <rect x="50" y="90" width="120" height="150" rx="6" stroke="white" strokeWidth="1" opacity="0.4" />
      <rect x="190" y="90" width="210" height="80" rx="6" stroke="white" strokeWidth="1" opacity="0.4" />
      <rect x="190" y="190" width="210" height="50" rx="6" stroke="white" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

function MobileWireframes() {
  return (
    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" className="opacity-30">
      <g transform="rotate(-10 150 200)">
        <rect x="80" y="50" width="120" height="240" rx="20" stroke="white" strokeWidth="2" />
        <rect x="100" y="70" width="80" height="15" rx="4" stroke="white" strokeWidth="1" opacity="0.3" />
        <rect x="95" y="100" width="90" height="100" rx="8" stroke="white" strokeWidth="1" opacity="0.5" />
      </g>
      <g transform="rotate(5 250 200)">
        <rect x="200" y="80" width="120" height="240" rx="20" stroke="white" strokeWidth="2" />
        <rect x="220" y="100" width="80" height="120" rx="8" stroke="rgba(255,31,61,0.4)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

function AutomationFlow() {
  return (
    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" className="opacity-40">
      <rect x="160" y="40" width="80" height="30" rx="4" stroke="white" strokeWidth="1" />
      <text x="200" y="59" textAnchor="middle" fill="white" fontSize="7" className="tracking-widest">INGESTION</text>
      
      <line x1="200" y1="70" x2="200" y2="110" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
      
      <rect x="120" y="110" width="60" height="30" rx="4" stroke="white" strokeWidth="1" />
      <text x="150" y="129" textAnchor="middle" fill="white" fontSize="7">PROCESS</text>
      
      <rect x="220" y="110" width="60" height="30" rx="4" stroke="white" strokeWidth="1" />
      <text x="250" y="129" textAnchor="middle" fill="white" fontSize="7">OUTPUT</text>
      
      <line x1="200" y1="140" x2="200" y2="180" stroke="rgba(255,31,61,0.6)" strokeWidth="1" />
      
      <rect x="150" y="180" width="100" height="40" rx="6" stroke="rgba(255,31,61,0.8)" strokeWidth="2" />
      <text x="200" y="205" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">PROFIT</text>
    </svg>
  );
}

function NodePoint({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="4" fill="white" />
      <circle cx={x} cy={y} r="12" stroke="white" strokeWidth="0.5" opacity="0.3" />
      <text x={x} y={y - 20} textAnchor="middle" fill="white" fontSize="7" opacity="0.6" className="tracking-widest">{label}</text>
    </g>
  );
}

function Connector({ x1, y1, x2, y2 }: { x1: string|number, y1: string|number, x2: string|number, y2: string|number }) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="white" strokeWidth="0.5" opacity="0.2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}
