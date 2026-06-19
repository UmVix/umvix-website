"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useAccent, type Mood } from "@/components/providers/AccentProvider";

const MOOD_COPY: Record<Mood, string> = {
  excited: "Love the energy! The site's pulse just turned up.",
  urgent: "On it — fast-track mode engaged.",
  unsure: "No worries. Let's keep things calm and clear.",
  calm: "Relaxed vibes. We'll take it step by step.",
  neutral: "Got it. Tell us more whenever you're ready.",
};

export default function SentimentWidget() {
  const { mood, setMood } = useAccent();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);

  const submit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setReply(null);
    try {
      const res = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      const next: Mood = data?.mood ?? "neutral";
      setMood(next);
      setReply(MOOD_COPY[next]);
    } catch {
      setReply("We couldn't read the mood, but we're still excited to help!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -10, y: "-50%", scale: 0.95 }}
            animate={{ opacity: 1, x: 0, y: "-50%", scale: 1 }}
            exit={{ opacity: 0, x: -10, y: "-50%", scale: 0.95 }}
            className="glass absolute left-14 top-1/2 z-[120] w-72 rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-brand-white">
                How are you feeling?
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close" data-cursor="hover">
                <X size={16} className="text-brand-gray hover:text-brand-white" />
              </button>
            </div>
            <p className="mt-1 text-xs text-brand-gray">
              Tell us your vibe about your project — we&apos;ll tune the experience.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="excited, unsure, urgent..."
                className="flex-1 rounded-lg bg-brand-black/60 px-3 py-2 text-sm text-brand-white outline-none focus:ring-1 focus:ring-brand-red"
              />
              <button
                onClick={submit}
                disabled={loading}
                data-cursor="hover"
                className="btn-primary rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50"
              >
                {loading ? "..." : "Set"}
              </button>
            </div>
            {reply && <p className="mt-3 text-xs text-brand-red">{reply}</p>}
            <div className="mt-3 text-[10px] uppercase tracking-wider text-brand-gray-muted">
              Current vibe: {mood}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.1, x: 4 }}
        whileTap={{ scale: 0.9 }}
        data-cursor="hover"
        aria-label="Set your mood"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-red/30 bg-brand-black-soft text-brand-red accent-glow shadow-lg"
      >
        <Sparkles size={20} />
      </motion.button>
    </div>
  );
}
