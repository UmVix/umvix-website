"use client";

import { motion } from "framer-motion";

type GradientTextRevealProps = {
  text?: string;
  lines?: string[];
  className?: string;
  highlightWords?: string[];
  delay?: number;
  marginTop?: number;
  /** "white" (premium sheen, default) or "red" (brand gradient) for highlighted words. */
  highlightTone?: "white" | "red";
};

const container = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: 0.08, delayChildren: stagger },
  }),
};

const word = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function renderWords(
  line: string,
  lineIndex: number,
  highlight: Set<string>,
  highlightClass: string
) {
  return line.split(" ").map((w, i) => {
    const isHighlight = highlight.has(w.replace(/[.,!?]/g, "").toLowerCase());
    const isFirstWord = i === 0;

    return (
      <span
        key={`${lineIndex}-${i}`}
        className={`inline-block align-bottom ${isFirstWord ? "" : "ml-[0.35em]"} overflow-hidden`}
      >
        <motion.span
          variants={word}
          className={`inline-block font-extrabold will-change-transform ${
            isHighlight ? highlightClass : ""
          }`}
        >
          {w}
        </motion.span>
      </span>
    );
  });
}

export default function GradientTextReveal({
  marginTop = 0,
  text,
  lines,
  className = "",
  highlightWords = [],
  delay = 0,
  highlightTone = "white",
}: GradientTextRevealProps) {
  const headlineLines = lines ?? (text ? [text] : []);
  const highlight = new Set(highlightWords.map((w) => w.toLowerCase()));
  const highlightClass =
    highlightTone === "red"
      ? "bg-brand-gradient bg-clip-text text-transparent"
      : "bg-[linear-gradient(180deg,#ffffff_0%,#bdbdbd_100%)] bg-clip-text text-transparent";

  return (
    <motion.h1
      className={className}
      style={marginTop ? { marginTop } : undefined}
      variants={container}
      custom={delay}
      initial="hidden"
      animate="visible"
      aria-label={headlineLines.join(" ")}
    >
      {headlineLines.map((line, lineIndex) => (
        <span
          key={lineIndex}
          className={`block w-full overflow-hidden ${lineIndex > 0 ? "mt-2 sm:mt-3" : ""}`}
        >
          {renderWords(line, lineIndex, highlight, highlightClass)}
        </span>
      ))}
    </motion.h1>
  );
}
