"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  Clock,
  Layers,
  Cpu,
  ListChecks,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import MagneticButton from "@/components/motion/MagneticButton";

type Estimate = {
  project_type: string;
  estimated_timeline: string;
  complexity_level: string;
  recommended_tech_stack: string[];
  key_considerations: string[];
};

export default function ProjectEstimator() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<Estimate | null>(null);

  const submit = async () => {
    if (description.trim().length < 10 || loading) return;
    setLoading(true);
    setError(null);
    setEstimate(null);

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate estimate.");
      setEstimate(data.estimate as Estimate);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-brand-red/20 bg-brand-black-soft p-6 md:p-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
          <Sparkles size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-brand-white">AI Project Estimator</h3>
          <p className="text-sm text-brand-gray">
            Describe your idea and get an instant AI-powered scope estimate.
          </p>
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        placeholder="e.g. A mobile app for booking home-cleaning services with real-time tracking, in-app payments, and an admin dashboard..."
        className="w-full resize-none rounded-xl border border-brand-black-soft bg-brand-black px-4 py-3 text-brand-white outline-none transition-colors focus:border-brand-red"
      />

      <div className="mt-4">
        <MagneticButton onClick={submit}>
          {loading ? "Analyzing..." : "Estimate My Project"}
        </MagneticButton>
      </div>

      {/* Thinking indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden"
          >
            <div className="relative overflow-hidden rounded-xl border border-brand-red/20 bg-brand-black p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-brand-red/20 to-transparent animate-scan"
              />
              <div className="flex items-center gap-3 text-brand-gray">
                <span className="inline-flex gap-1.5">
                  <Dot /> <Dot delay="0.2s" /> <Dot delay="0.4s" />
                </span>
                <span className="text-sm">AI is analyzing your project scope...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-sm text-brand-white">
          <AlertTriangle size={18} className="shrink-0 text-brand-red" />
          {error}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {estimate && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="mt-6 grid gap-4 sm:grid-cols-2"
          >
            <ResultCard icon={Layers} label="Project Type" value={estimate.project_type} />
            <ResultCard icon={Clock} label="Estimated Timeline" value={estimate.estimated_timeline} />
            <ResultCard icon={Sparkles} label="Complexity" value={estimate.complexity_level} />
            <ResultCard
              icon={Cpu}
              label="Recommended Tech Stack"
              tags={estimate.recommended_tech_stack}
            />
            <ResultCard
              icon={ListChecks}
              label="Key Considerations"
              list={estimate.key_considerations}
              className="sm:col-span-2"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultCard({
  icon: Icon,
  label,
  value,
  tags,
  list,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  value?: string;
  tags?: string[];
  list?: string[];
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      className={`rounded-xl border border-brand-red/15 bg-brand-black p-5 ${className}`}
    >
      <div className="mb-2 flex items-center gap-2 text-brand-red">
        <Icon size={18} />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      {value && <p className="text-lg font-semibold text-brand-white">{value}</p>}
      {tags && (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-medium text-brand-red"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      {list && (
        <ul className="space-y-1.5">
          {list.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-brand-gray">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="h-2 w-2 rounded-full bg-brand-red animate-thinking-bounce"
      style={{ animationDelay: delay }}
    />
  );
}
