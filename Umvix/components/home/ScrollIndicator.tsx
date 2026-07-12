"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks";

const SCROLL_CYCLE = {
  duration: 2.4,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.42, 0.48, 1],
};

type ScrollIndicatorProps = {
  /** Element id to scroll to on click */
  targetId?: string;
  className?: string;
};

export default function ScrollIndicator({
  targetId,
  className = "",
}: ScrollIndicatorProps) {
  const reduced = useReducedMotion();

  const scrollDown = () => {
    if (targetId) {
      document
        .getElementById(targetId)
        ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      return;
    }

    const hero = document.getElementById("hero");
    const next = hero?.nextElementSibling as HTMLElement | null;
    next?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <motion.button
      type="button"
      onClick={scrollDown}
      aria-label="Scroll to next section"
      initial={{ opacity: 0, y: 8, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      transition={{ duration: 0.8, delay: 1.1 }}
      className={`absolute bottom-5 left-1/2 z-20 cursor-pointer border-0 bg-transparent p-2 transition-opacity hover:opacity-80 sm:bottom-6 ${className}`}
    >
      <motion.span
        aria-hidden
        animate={reduced ? undefined : { y: [0, 7, 7, 0] }}
        transition={reduced ? undefined : SCROLL_CYCLE}
        className="relative flex h-[46px] w-[28px] items-start justify-center rounded-full border border-white/30 pt-2.5 will-change-transform"
      >
        <motion.span
          animate={
            reduced
              ? undefined
              : { y: [0, 20, 20, 0], opacity: [1, 0.25, 0.25, 1] }
          }
          transition={reduced ? undefined : SCROLL_CYCLE}
          className="h-2 w-2 rounded-full bg-brand-red will-change-transform"
        />
      </motion.span>
    </motion.button>
  );
}
