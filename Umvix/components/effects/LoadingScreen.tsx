"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const LOGO = "/icons/logo-main.png";
const WAVE_DURATION = 2.2;

/** Persists across re-renders / Strict Mode remounts in the same page load. */
let loaderHasCompleted = false;

/** Wavy left-to-right reveal polygon for the logo color fill. */
function waveClip(progress: number) {
  const edge = progress * 108;
  const steps = 14;
  const points = ["0% 0%"];

  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * 100;
    const wobble =
      Math.sin((i / steps) * Math.PI * 5 + progress * Math.PI * 2) * 2.8;
    points.push(`${Math.min(102, edge + wobble)}% ${y}%`);
  }

  points.push("0% 100%");
  return `polygon(${points.join(", ")})`;
}

const WAVE_KEYFRAMES = Array.from({ length: 28 }, (_, i) =>
  waveClip(i / 27)
);

export default function LoadingScreen() {
  const [show, setShow] = useState(() => !loaderHasCompleted);

  useEffect(() => {
    if (!show || loaderHasCompleted) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduced ? 400 : 2600;

    const finish = () => {
      setShow(false);
    };

    const timer = window.setTimeout(finish, hold);
    const fallback = window.setTimeout(finish, 4000);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(fallback);
    };
  }, [show]);

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        loaderHasCompleted = true;
      }}
    >
      {show && (
        <motion.div
          key="umvix-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          className="loading-screen-overlay loading-screen-js fixed inset-0 z-[10000] flex items-center justify-center bg-brand-black"
        >
        {/* Ambient breathing glow */}
        <motion.div
          animate={{ opacity: [0.12, 0.32, 0.12], scale: [1, 1.18, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute h-72 w-72 rounded-full bg-brand-red/15 blur-[90px]"
        />

        <div className="relative flex w-[260px] flex-col items-center sm:w-[340px]">
          <div
            className="relative w-full"
            style={{ aspectRatio: "1024 / 683" }}
          >
            <Image
              src={LOGO}
              alt=""
              fill
              priority
              aria-hidden
              className="select-none object-contain opacity-[0.14] grayscale"
            />

            <motion.div
              initial={{ clipPath: WAVE_KEYFRAMES[0] }}
              animate={{ clipPath: WAVE_KEYFRAMES }}
              transition={{ duration: WAVE_DURATION, ease: [0.45, 0, 0.25, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={LOGO}
                alt="Umvix"
                fill
                priority
                className="select-none object-contain drop-shadow-[0_0_18px_rgba(255,31,61,0.25)]"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
