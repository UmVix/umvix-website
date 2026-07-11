"use client";

import { motion, type Variants } from "framer-motion";
import { Bot, Globe, Smartphone } from "lucide-react";
import TiltCard from "@/components/motion/TiltCard";
import { useReducedMotion } from "@/lib/hooks";

/**
 * 3D exploded-view assembly for the About hero: three pieces (Web browser,
 * Mobile phone, AI chip) start scattered in 3D space and assemble into one
 * composition — then keep a gentle floating motion. Mouse tilt via TiltCard
 * adds parallax depth between the translateZ layers.
 */

const spring = { type: "spring", stiffness: 60, damping: 14 } as const;

function pieceVariants(
  scattered: Record<string, number>,
  assembled: Record<string, number>,
  delay: number
): Variants {
  return {
    hidden: { ...scattered, opacity: 0 },
    show: {
      ...assembled,
      opacity: 1,
      transition: { ...spring, delay, opacity: { duration: 0.5, delay } },
    },
  };
}

const browserVariants = pieceVariants(
  { x: -70, y: -170, z: -160, rotateX: 42, rotateY: -38, rotateZ: -8 },
  { x: 0, y: -12, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0 },
  0.15
);

const phoneVariants = pieceVariants(
  { x: 250, y: 200, z: 150, rotateX: -20, rotateY: 55, rotateZ: 28 },
  { x: 104, y: 44, z: 80, rotateX: 0, rotateY: -10, rotateZ: 4 },
  0.5
);

const chipVariants = pieceVariants(
  { x: -250, y: -200, z: 130, rotateX: 30, rotateY: -60, rotateZ: -32 },
  { x: -112, y: -92, z: 55, rotateX: 0, rotateY: 8, rotateZ: -6 },
  0.8
);

/** Gentle post-assembly breathing/float. */
function Float({
  children,
  duration,
  offset = 8,
  className = "",
  disabled,
}: {
  children: React.ReactNode;
  duration: number;
  offset?: number;
  className?: string;
  disabled: boolean;
}) {
  return (
    <motion.div
      className={className}
      style={{ transformStyle: "preserve-3d" }}
      animate={disabled ? undefined : { y: [0, -offset, 0] }}
      transition={{ duration, delay: 1.8, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function PieceLabel({ icon: Icon, text, className = "" }: { icon: typeof Globe; text: string; className?: string }) {
  return (
    <span
      className={`absolute z-10 flex items-center gap-1.5 rounded-full border border-brand-red/30 bg-brand-black/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-white shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur ${className}`}
    >
      <Icon size={11} className="text-brand-red" />
      {text}
    </span>
  );
}

/* -------------------------------- the three pieces -------------------------------- */

function BrowserPiece() {
  return (
    // badge lives on the un-clipped wrapper — inside the rounded box it would
    // be cut off by the overflow-hidden
    <div className="relative w-56 sm:w-64">
      <div
        className="overflow-hidden rounded-xl border border-white/12 bg-[#0b0b0e]"
        style={{
          boxShadow:
            "0 40px 80px -20px rgba(0,0,0,0.9), 0 0 60px -12px rgba(255,31,61,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
      <div className="flex h-6 items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.04] px-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
        <span className="ml-1.5 flex-1 rounded-full bg-black/40 px-2 py-[2px] text-[7px] text-white/40">umvix.com</span>
      </div>
      <div className="flex gap-2 p-2.5">
        <div className="flex w-[30%] flex-col gap-1.5 rounded-md bg-white/[0.03] p-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <span
                className="h-1.5 w-1.5 rounded-[2px]"
                style={{ background: i === 0 ? "#ff1f3d" : "rgba(255,255,255,0.18)" }}
              />
              <span className="h-1 flex-1 rounded-full bg-white/12" />
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex gap-1.5">
            {[0, 1].map((i) => (
              <div key={i} className="flex-1 rounded-md border border-white/[0.07] bg-white/[0.04] p-1.5">
                <span className="block h-1 w-[65%] rounded-full bg-white/15" />
                <span className="mt-1 block text-[8px] font-extrabold" style={{ color: i === 0 ? "#ff1f3d" : "#34d399" }}>
                  {i === 0 ? "+38%" : "12.4k"}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-1 items-end gap-[3px] rounded-md border border-white/[0.07] bg-white/[0.03] p-1.5 pt-2">
            {[35, 55, 42, 72, 58, 90, 68, 100].map((h, i) => (
              <span
                key={i}
                className="flex-1 origin-bottom rounded-t-[2px]"
                style={{
                  height: `${h * 0.22}px`,
                  background:
                    i % 3 === 1 ? "rgba(255,255,255,0.14)" : "linear-gradient(180deg,#ff1f3d,#b3000055)",
                  animation: "rise-bar 2.6s ease-in-out infinite",
                  animationDelay: `${i * 0.13}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
      <PieceLabel icon={Globe} text="Web" className="-left-2 -top-2.5" />
    </div>
  );
}

function PhonePiece() {
  return (
    // badge on the un-clipped wrapper (see BrowserPiece)
    <div className="relative w-[5.4rem] sm:w-24">
      <div
        className="overflow-hidden rounded-[1.1rem] border-[3px] border-[#1c1c1f] bg-[#0b0b0e] ring-1 ring-white/15"
        style={{
          boxShadow:
            "0 34px 70px -18px rgba(0,0,0,0.95), 0 0 45px -8px rgba(255,31,61,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
      <div className="absolute left-1/2 top-1 z-10 h-[6px] w-9 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
      <div className="flex h-44 flex-col gap-1.5 p-1.5 pt-4 sm:h-48">
        <div
          className="rounded-lg p-1.5"
          style={{ background: "linear-gradient(135deg, #ff1f3d, #b30000)" }}
        >
          <span className="block text-[5px] font-semibold uppercase tracking-widest text-white/70">Balance</span>
          <span className="block text-[9px] font-extrabold text-white">$24.5k</span>
        </div>
        <div className="flex justify-between px-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-3.5 w-3.5 rounded-full border"
              style={{
                borderColor: i === 0 ? "#ff1f3d" : "rgba(255,255,255,0.15)",
                background: i === 0 ? "rgba(255,31,61,0.15)" : "rgba(255,255,255,0.05)",
              }}
            />
          ))}
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-1 rounded-md bg-white/[0.05] p-1">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: i === 0 ? "#ff1f3dcc" : "rgba(255,255,255,0.12)" }} />
            <span className="flex flex-col gap-0.5">
              <span className="h-[2.5px] w-6 rounded-full bg-white/30" />
              <span className="h-[2.5px] w-4 rounded-full bg-white/12" />
            </span>
          </div>
        ))}
      </div>
      </div>
      <PieceLabel icon={Smartphone} text="Mobile" className="-right-3 -top-2.5" />
    </div>
  );
}

function ChipPiece() {
  return (
    <div
      className="relative h-28 w-28 rounded-2xl border border-white/12 bg-[#0b0b0e] p-2 sm:h-32 sm:w-32"
      style={{
        boxShadow:
          "0 34px 70px -18px rgba(0,0,0,0.95), 0 0 45px -8px rgba(255,31,61,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <PieceLabel icon={Bot} text="AI" className="-left-2 -top-2.5" />
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {/* circuit traces */}
        {[
          "M50 50 L20 22",
          "M50 50 L80 22",
          "M50 50 L16 62",
          "M50 50 L84 62",
          "M50 50 L34 88",
          "M50 50 L66 88",
        ].map((d, i) => (
          <g key={i}>
            <path d={d} stroke="rgba(255,255,255,0.14)" strokeWidth="1.4" fill="none" />
            <path d={d} stroke="#ff1f3d" strokeWidth="1.4" fill="none" strokeDasharray="4 40" opacity="0.9">
              <animate attributeName="stroke-dashoffset" values="44;0" dur="2.2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </path>
          </g>
        ))}
        {/* outer nodes */}
        {[
          [20, 22],
          [80, 22],
          [16, 62],
          [84, 62],
          [34, 88],
          [66, 88],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3.5" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        ))}
        {/* core */}
        <rect x="36" y="36" width="28" height="28" rx="7" fill="rgba(255,31,61,0.14)" stroke="#ff1f3d" strokeWidth="1.4" />
        <circle cx="50" cy="50" r="5" fill="#ff1f3d">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

/* -------------------------------- assembly scene -------------------------------- */

export default function HeroAssembly() {
  const reduced = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[460px] [perspective:1400px]">
      <TiltCard max={6} glare={false} className="group">
        {/* mobile: scale the whole composition down so the fixed assembly
            offsets (x: ±~110px) and the overhanging piece badges stay inside
            the narrow column instead of clipping at the viewport edges */}
        <div
          className="origin-center scale-[0.8] sm:scale-100"
          style={{ transformStyle: "preserve-3d" }}
        >
        <motion.div
          initial={reduced ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="relative flex h-[340px] items-center justify-center sm:h-[460px]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ambient glow behind the composition */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[75%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: "radial-gradient(ellipse, rgba(255,31,61,0.16), transparent 68%)" }}
          />

          {/* orbiting particles */}
          {!reduced && (
            <div aria-hidden className="absolute inset-0" style={{ animation: "spin-slow 30s linear infinite" }}>
              {[
                { top: "12%", left: "18%", size: 5, delay: 0 },
                { top: "22%", left: "85%", size: 4, delay: 0.8 },
                { top: "78%", left: "10%", size: 4, delay: 1.6 },
                { top: "88%", left: "72%", size: 6, delay: 0.4 },
              ].map((p, i) => (
                <span
                  key={i}
                  className="absolute rounded-full bg-brand-red"
                  style={{
                    top: p.top,
                    left: p.left,
                    width: p.size,
                    height: p.size,
                    boxShadow: "0 0 10px rgba(255,31,61,0.8)",
                    animation: `soft-pulse 2.6s ease-in-out ${p.delay}s infinite`,
                  }}
                />
              ))}
            </div>
          )}

          {/* connection beams — drawn after the pieces assemble */}
          <motion.svg
            aria-hidden
            viewBox="0 0 460 460"
            className="pointer-events-none absolute inset-0 h-full w-full"
            initial={reduced ? undefined : { opacity: 0 }}
            variants={{ show: { opacity: 1, transition: { delay: 1.35, duration: 0.4 } } }}
          >
            {["M230 218 L334 262", "M230 218 L118 126"].map((d, i) => (
              <motion.path
                key={i}
                d={d}
                fill="none"
                stroke="rgba(255,31,61,0.55)"
                strokeWidth="1.5"
                strokeDasharray="5 6"
                variants={{
                  show: {
                    pathLength: [0, 1],
                    transition: { delay: 1.35 + i * 0.2, duration: 0.7, ease: "easeOut" },
                  },
                }}
                style={{ pathLength: reduced ? 1 : undefined }}
              />
            ))}
          </motion.svg>

          {/* base platform disc */}
          <motion.div
            aria-hidden
            variants={pieceVariants({ y: 80, rotateX: 70 }, { y: 175, rotateX: 74 }, 0)}
            className="absolute h-40 w-72 rounded-[100%] sm:w-80"
            style={{
              transformStyle: "preserve-3d",
              background: "radial-gradient(ellipse, rgba(255,31,61,0.22), rgba(255,31,61,0.04) 55%, transparent 72%)",
              border: "1px solid rgba(255,31,61,0.25)",
            }}
          />

          {/* WEB — center piece */}
          <motion.div variants={browserVariants} className="absolute" style={{ transformStyle: "preserve-3d" }}>
            <Float duration={5.5} disabled={reduced}>
              <BrowserPiece />
            </Float>
          </motion.div>

          {/* AI — top-left piece */}
          <motion.div variants={chipVariants} className="absolute" style={{ transformStyle: "preserve-3d" }}>
            <Float duration={6.5} offset={10} disabled={reduced}>
              <ChipPiece />
            </Float>
          </motion.div>

          {/* MOBILE — front-right piece */}
          <motion.div variants={phoneVariants} className="absolute" style={{ transformStyle: "preserve-3d" }}>
            <Float duration={4.8} offset={7} disabled={reduced}>
              <PhonePiece />
            </Float>
          </motion.div>
        </motion.div>
        </div>
      </TiltCard>

      {/* caption */}
      <motion.p
        initial={reduced ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.7, duration: 0.6 }}
        className="mt-2 text-center text-xs font-medium uppercase tracking-[0.25em] text-brand-gray-muted"
      >
        Web · Mobile · AI — <span className="text-brand-red">one connected team</span>
      </motion.p>
    </div>
  );
}
