"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wand2, AlertTriangle, Target, Lightbulb, TrendingUp, type LucideIcon } from "lucide-react";
import MagneticButton from "@/components/motion/MagneticButton";

type CaseStudy = {
  headline: string;
  problem: string;
  solution: string;
  results: string[];
  tech_stack: string[];
};

export default function CaseStudyGenerator() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CaseStudy | null>(null);

  const submit = async () => {
    if (!name.trim() || description.trim().length < 10 || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/case-study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, techStack }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate case study.");
      setResult(data.caseStudy as CaseStudy);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 rounded-2xl border border-brand-red/20 bg-brand-black-soft p-6 md:p-8">
      <button
        onClick={() => setOpen((v) => !v)}
        data-cursor="hover"
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
            <Wand2 size={22} />
          </span>
          <span>
            <span className="block text-xl font-bold text-brand-white">
              AI Case Study Generator
            </span>
            <span className="block text-sm text-brand-gray">
              Admin tool — generate a polished case study from project details.
            </span>
          </span>
        </span>
        <span className="text-sm font-medium text-brand-red">
          {open ? "Hide" : "Open"}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Project name"
                  className="rounded-xl border border-brand-black-soft bg-brand-black px-4 py-3 text-brand-white outline-none focus:border-brand-red"
                />
                <input
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="Tech stack (e.g. Next.js, Postgres)"
                  className="rounded-xl border border-brand-black-soft bg-brand-black px-4 py-3 text-brand-white outline-none focus:border-brand-red"
                />
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description of the project..."
                className="resize-none rounded-xl border border-brand-black-soft bg-brand-black px-4 py-3 text-brand-white outline-none focus:border-brand-red"
              />
              <div>
                <MagneticButton onClick={submit}>
                  {loading ? "Generating..." : "Generate Case Study"}
                </MagneticButton>
              </div>
            </div>

            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative mt-6 overflow-hidden rounded-xl border border-brand-red/20 bg-brand-black p-6"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-brand-red/20 to-transparent animate-scan"
                  />
                  <div className="flex items-center gap-3 text-sm text-brand-gray">
                    <span className="inline-flex gap-1.5">
                      <Dot /> <Dot delay="0.2s" /> <Dot delay="0.4s" />
                    </span>
                    Writing your case study...
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

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 rounded-xl border border-brand-red/15 bg-brand-black p-6 md:p-8"
                >
                  <h3 className="text-2xl font-bold text-brand-white">{result.headline}</h3>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <Block icon={Target} title="The Problem" text={result.problem} />
                    <Block icon={Lightbulb} title="Our Solution" text={result.solution} />
                  </div>

                  <div className="mt-6">
                    <div className="mb-3 flex items-center gap-2 text-brand-red">
                      <TrendingUp size={18} />
                      <span className="text-sm font-semibold uppercase tracking-wider">
                        Results
                      </span>
                    </div>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {result.results.map((r, i) => (
                        <li key={i} className="flex gap-2 text-brand-gray">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {result.tech_stack.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-medium text-brand-red"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Block({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-brand-red">
        <Icon size={18} />
        <span className="text-sm font-semibold uppercase tracking-wider">{title}</span>
      </div>
      <p className="text-brand-gray">{text}</p>
    </div>
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
