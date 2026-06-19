"use client";

import { type RefObject } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useReducedMotion } from "@/lib/hooks";
import styles from "./ContactHero.module.css";

type ContactHeroBackgroundProps = {
  scrollTargetRef: RefObject<HTMLElement | null>;
};

export default function ContactHeroBackground({
  scrollTargetRef,
}: ContactHeroBackgroundProps) {
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.35,
    restDelta: 0.0008,
  });

  const glowRedY = useTransform(progress, [0, 0.5, 1], ["0%", "14%", "32%"]);
  const glowRedX = useTransform(progress, [0, 1], ["0%", "6%"]);
  const glowRedScale = useTransform(progress, [0, 0.45, 1], [1, 1.14, 0.92]);

  const glowBlueY = useTransform(progress, [0, 0.5, 1], ["0%", "22%", "48%"]);
  const glowBlueX = useTransform(progress, [0, 1], ["0%", "-8%"]);
  const glowBlueScale = useTransform(progress, [0, 0.55, 1], [1, 1.1, 1.22]);

  const silkWashY = useTransform(progress, [0, 1], ["0%", "18%"]);
  const silkWashOpacity = useTransform(progress, [0, 0.35, 0.7, 1], [0.92, 0.62, 0.78, 0.95]);

  const silkLinesY = useTransform(progress, [0, 1], ["0%", "28%"]);
  const silkLinesRotate = useTransform(progress, [0, 1], [0, 9]);
  const silkLinesOpacity = useTransform(progress, [0, 0.5, 1], [0.1, 0.16, 0.08]);

  const dotGridY = useTransform(progress, [0, 1], ["0%", "38%"]);
  const dotGridOpacity = useTransform(progress, [0, 0.25, 0.75, 1], [0.32, 0.58, 0.42, 0.28]);
  const dotGridScale = useTransform(progress, [0, 0.5, 1], [1, 1.06, 1.12]);

  const dotFineY = useTransform(progress, [0, 1], ["0%", "-22%"]);
  const dotFineOpacity = useTransform(progress, [0, 0.4, 1], [0.18, 0.32, 0.14]);

  const ringScale = useTransform(progress, [0, 0.4, 0.75, 1], [1, 1.18, 1.05, 0.88]);
  const ringY = useTransform(progress, [0, 1], ["0%", "16%"]);
  const ringOpacity = useTransform(progress, [0, 0.3, 0.65, 1], [0.42, 0.82, 0.55, 0.35]);

  const vignetteOpacity = useTransform(progress, [0, 0.45, 1], [0.5, 0.32, 0.68]);

  const streakY = useTransform(progress, [0, 1], ["-20%", "120%"]);
  const streakOpacity = useTransform(progress, [0, 0.15, 0.5, 0.85, 1], [0, 0.35, 0.2, 0.45, 0.1]);

  const grainOpacity = useTransform(progress, [0, 0.5, 1], [0.03, 0.045, 0.025]);

  const scrollBarScale = useTransform(progress, [0, 1], [0, 1]);

  if (reduced) {
    return <StaticBackground />;
  }

  return (
    <div className={styles.bgLayer} aria-hidden>
      <motion.div
        className={styles.scrollProgress}
        style={{ scaleY: scrollBarScale }}
      />

      <motion.div
        className={styles.scrollStreak}
        style={{ y: streakY, opacity: streakOpacity }}
      />

      <motion.div style={{ y: glowRedY, x: glowRedX, scale: glowRedScale }}>
        <motion.div
          className={styles.bgGlowRed}
          animate={{ x: [0, 24, 0], y: [0, 18, 0] }}
          transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
        />
      </motion.div>
      <motion.div style={{ y: glowBlueY, x: glowBlueX, scale: glowBlueScale }}>
        <motion.div
          className={styles.bgGlowBlue}
          animate={{ x: [0, -20, 0], y: [0, -16, 0] }}
          transition={{ duration: 28, ease: "easeInOut", repeat: Infinity }}
        />
      </motion.div>

      <motion.div
        className={styles.silkWash}
        style={{ y: silkWashY, opacity: silkWashOpacity }}
      />

      <motion.div
        className={styles.silkLines}
        style={{
          y: silkLinesY,
          rotate: silkLinesRotate,
          opacity: silkLinesOpacity,
        }}
      />

      <motion.div
        className={styles.dotGrid}
        style={{ y: dotGridY, opacity: dotGridOpacity, scale: dotGridScale }}
      />
      <motion.div
        className={styles.dotGridFine}
        style={{ y: dotFineY, opacity: dotFineOpacity }}
      />

      {FLOAT_DOTS.map((dot, i) => (
        <ScrollFloatDot key={i} dot={dot} progress={progress} index={i} />
      ))}

      <motion.div
        className={styles.ringIllusion}
        style={{
          y: ringY,
          scale: ringScale,
          opacity: ringOpacity,
        }}
      />

      <motion.div
        className={styles.vignette}
        style={{ opacity: vignetteOpacity }}
      />

      <motion.div className={styles.bgGrain} style={{ opacity: grainOpacity }} />
    </div>
  );
}

function ScrollFloatDot({
  dot,
  progress,
  index,
}: {
  dot: (typeof FLOAT_DOTS)[number];
  progress: ReturnType<typeof useSpring>;
  index: number;
}) {
  const drift = 0.08 + index * 0.035;
  const y = useTransform(progress, [0, 1], [0, 220 * drift]);
  const opacity = useTransform(
    progress,
    [0, 0.2, 0.55, 1],
    [dot.baseOpacity, dot.baseOpacity + 0.35, dot.baseOpacity + 0.15, dot.baseOpacity * 0.6]
  );
  const scale = useTransform(progress, [0, 0.5, 1], [1, 1.4, 0.85]);

  return (
    <motion.span
      className={styles.floatDot}
      style={{
        left: dot.left,
        top: dot.top,
        width: dot.size,
        height: dot.size,
        y,
        opacity,
        scale,
      }}
    />
  );
}

function StaticBackground() {
  return (
    <div className={styles.bgLayer} aria-hidden>
      <div className={styles.bgGlowRed} />
      <div className={styles.bgGlowBlue} />
      <div className={styles.silkWash} />
      <div className={styles.silkLines} />
      <div className={styles.dotGrid} />
      <div className={styles.dotGridFine} />
      <div className={styles.ringIllusion} />
      <div className={styles.vignette} />
      <div className={styles.bgGrain} />
    </div>
  );
}

const FLOAT_DOTS = [
  {
    left: "12%",
    top: "22%",
    size: 4,
    drift: -12,
    duration: 5.2,
    delay: 0,
    baseOpacity: 0.2,
  },
  {
    left: "78%",
    top: "18%",
    size: 3,
    drift: 10,
    duration: 6.1,
    delay: 0.4,
    baseOpacity: 0.18,
  },
  {
    left: "68%",
    top: "62%",
    size: 5,
    drift: -14,
    duration: 7,
    delay: 0.8,
    baseOpacity: 0.22,
  },
  {
    left: "24%",
    top: "70%",
    size: 3,
    drift: 8,
    duration: 5.8,
    delay: 1.1,
    baseOpacity: 0.16,
  },
  {
    left: "48%",
    top: "38%",
    size: 2,
    drift: -6,
    duration: 4.5,
    delay: 0.2,
    baseOpacity: 0.14,
  },
  {
    left: "88%",
    top: "48%",
    size: 3,
    drift: 9,
    duration: 6.4,
    delay: 1.5,
    baseOpacity: 0.17,
  },
];
