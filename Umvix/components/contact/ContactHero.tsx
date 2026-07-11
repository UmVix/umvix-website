"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react";
import { useReducedMotion } from "@/lib/hooks";
import { submitContact } from "@/lib/contact/submitContact";
import styles from "./ContactHero.module.css";

type StepId = "name" | "email" | "project";

type FormData = {
  name: string;
  email: string;
  project: string;
};

const STEPS: StepId[] = ["name", "email", "project"];

const QUESTIONS: Record<StepId, string> = {
  name: "First things first — what's your name?",
  email: "Nice to meet you. What's the best email to reach you?",
  project: "Tell us what you're building.",
};

const stepVariants = {
  enter: { opacity: 0, y: 28 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function WordReveal({ text, reduced }: { text: string; reduced: boolean }) {
  const words = text.split(" ");

  if (reduced) {
    return <span>{text}</span>;
  }

  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={styles.word}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.45,
            delay: i * 0.045,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}

function MagneticContinueButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.35 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || disabled) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.28);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.28);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={styles.magneticWrap}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        data-cursor="hover"
        className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45"
      >
        {children}
      </button>
    </motion.div>
  );
}

function SuccessRitual({
  name,
  reduced,
  onScrollToForm,
}: {
  name: string;
  reduced: boolean;
  onScrollToForm: () => void;
}) {
  return (
    <motion.div
      className={styles.success}
      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.checkWrap}>
        <div className={styles.checkGlow} aria-hidden />
        <svg
          viewBox="0 0 88 88"
          className={styles.checkSvg}
          aria-hidden
        >
          <motion.circle
            cx="44"
            cy="44"
            r="40"
            fill="none"
            stroke="rgba(255,31,61,0.35)"
            strokeWidth="2"
            initial={reduced ? false : { pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
          <motion.circle
            cx="44"
            cy="44"
            r="40"
            fill="none"
            stroke="url(#checkGradient)"
            strokeWidth="2.5"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
          />
          <motion.path
            d="M26 44 L38 56 L62 30"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.35 }}
          />
          <defs>
            <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff1f3d" />
              <stop offset="100%" stopColor="#b30000" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <h2 className={styles.successTitle}>
        Signal received
        {name ? (
          <>
            ,{" "}
            <span className={styles.questionAccent}>{name.split(" ")[0]}</span>
          </>
        ) : null}
      </h2>
      <p className={styles.successSub}>
        Your brief is logged. Our team will review it and reply with clear next
        steps — usually within one business day.
      </p>

      <button
        type="button"
        onClick={onScrollToForm}
        className={styles.scrollCta}
      >
        Continue to full form
        <ChevronDown size={16} />
      </button>
    </motion.div>
  );
}

export default function ContactHero() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    project: "",
  });

  const step = STEPS[stepIndex];

  useEffect(() => {
    if (complete) return;
    const t = setTimeout(() => inputRef.current?.focus(), 320);
    return () => clearTimeout(t);
  }, [stepIndex, complete]);

  const scrollToForm = useCallback(() => {
    document
      .getElementById("contact-form")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  const canContinue = useCallback(() => {
    if (step === "name") return data.name.trim().length >= 2;
    if (step === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    if (step === "project") return data.project.trim().length >= 1;
    return false;
  }, [step, data]);

  const goNext = useCallback(async () => {
    if (!canContinue() || submitting) return;

    if (stepIndex >= STEPS.length - 1) {
      setSubmitting(true);
      setSubmitError("");

      try {
        await submitContact({
          source: "hero",
          name: data.name.trim(),
          email: data.email.trim(),
          project: data.project.trim(),
        });
        setComplete(true);
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setStepIndex((i) => i + 1);
  }, [canContinue, stepIndex, data, submitting]);

  const goBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && step !== "project" && canContinue()) {
      e.preventDefault();
      goNext();
    }
  };

  const update = (field: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (submitError) setSubmitError("");
  };

  const progress = complete ? 1 : (stepIndex + 1) / STEPS.length;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.35,
  });

  const contentY = useTransform(scrollProgress, [0, 0.45, 1], [0, -48, -160]);
  const contentScale = useTransform(scrollProgress, [0, 0.5, 1], [1, 0.97, 0.9]);
  const contentOpacity = useTransform(
    scrollProgress,
    [0, 0.25, 0.55, 0.85, 1],
    [1, 0.92, 0.72, 0.28, 0]
  );
  const contentBlur = useTransform(scrollProgress, [0, 0.35, 0.7, 1], [0, 1, 5, 14]);
  const contentFilter = useMotionTemplate`blur(${contentBlur}px)`;

  const scrollStyle = reduced
    ? undefined
    : {
        y: contentY,
        scale: contentScale,
        opacity: contentOpacity,
        filter: contentFilter,
      };

  return (
    <section id="contact-hero" ref={heroRef} className={styles.hero}>

      <motion.div className={styles.inner} style={scrollStyle}>
        {!complete && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.badge}
          >
            <MessageCircle size={14} className="text-brand-red" />
            Let&apos;s Connect
          </motion.div>
        )}

        {!complete && (
          <div className={styles.progress} aria-hidden>
            {STEPS.map((_, i) => (
              <div key={i} className={styles.progressDot}>
                <motion.span
                  className={styles.progressFill}
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: i < stepIndex ? 1 : i === stepIndex ? 0.55 : 0,
                  }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {complete ? (
            <SuccessRitual
              key="success"
              name={data.name}
              reduced={reduced}
              onScrollToForm={scrollToForm}
            />
          ) : (
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className={styles.question}>
                <WordReveal text={QUESTIONS[step]} reduced={reduced} />
              </h1>

              <div className={styles.inputWrap}>
                {step === "name" && (
                  <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    autoComplete="name"
                    value={data.name}
                    onChange={(e) => update("name", e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Your full name"
                    className={styles.fieldInput}
                  />
                )}

                {step === "email" && (
                  <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => update("email", e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="you@company.com"
                    className={styles.fieldInput}
                  />
                )}

                {step === "project" && (
                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={data.project}
                    onChange={(e) => update("project", e.target.value)}
                    placeholder="A SaaS dashboard, mobile app, AI workflow..."
                    className={`${styles.fieldInput} ${styles.fieldTextarea}`}
                    rows={4}
                  />
                )}

              </div>

              <p className={styles.hint}>
                {step === "project"
                  ? "Press Send signal when you're ready. A few sentences is perfect."
                  : "Press Enter or Continue to move forward."}
              </p>

              {submitError && (
                <p className="mt-4 rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-sm text-brand-white">
                  {submitError}
                </p>
              )}

              <div className={styles.actions}>
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className={styles.backBtn}
                    disabled={submitting}
                  >
                    Back
                  </button>
                )}
                <MagneticContinueButton
                  onClick={() => void goNext()}
                  disabled={!canContinue() || submitting}
                >
                  {step === "project" ? (
                    <>
                      {submitting ? "Sending..." : "Send signal"}
                      <ArrowRight size={16} />
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight size={16} />
                    </>
                  )}
                </MagneticContinueButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!complete && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 text-center text-xs uppercase tracking-[0.2em] text-brand-gray-muted"
            style={{ opacity: Math.max(0, 1 - progress * 0.5) }}
          >
            Step {stepIndex + 1} of {STEPS.length}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
