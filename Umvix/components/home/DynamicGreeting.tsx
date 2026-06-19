"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";

// Module-level cache: survives re-renders and client-side route changes
// within the same session without refetching.
let cachedGreeting: string | null = null;

const SESSION_KEY = "umvix:greeting";

export default function DynamicGreeting() {
  const [fullText, setFullText] = useState<string>(cachedGreeting ?? "");
  const [typed, setTyped] = useState<string>(cachedGreeting ?? "");
  const reduced = useReducedMotion();
  const fetchedRef = useRef(false);

  // Fetch once per session.
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    if (cachedGreeting) {
      setFullText(cachedGreeting);
      return;
    }

    const stored =
      typeof window !== "undefined" ? sessionStorage.getItem(SESSION_KEY) : null;
    if (stored) {
      cachedGreeting = stored;
      setFullText(stored);
      return;
    }

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/greeting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hour: new Date().getHours() }),
          signal: controller.signal,
        });
        const data = await res.json();
        const greeting: string =
          data?.greeting || "Welcome — let's build something extraordinary.";
        cachedGreeting = greeting;
        sessionStorage.setItem(SESSION_KEY, greeting);
        setFullText(greeting);
      } catch {
        setFullText("Welcome — let's build something extraordinary.");
      }
    })();

    return () => controller.abort();
  }, []);

  // Typewriter effect.
  useEffect(() => {
    if (!fullText) return;
    if (reduced) {
      setTyped(fullText);
      return;
    }
    setTyped("");
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      i += 1;
      setTyped(fullText.slice(0, i));
      if (i < fullText.length) {
        // Slight jitter for a human typing feel.
        timer = setTimeout(tick, 28 + Math.random() * 45);
      }
    };
    timer = setTimeout(tick, 200);
    return () => clearTimeout(timer);
  }, [fullText, reduced]);

  const isTyping = typed.length < fullText.length;

  return (
    <span
      className={`inline-block min-h-[1.4em] text-brand-red ${
        isTyping ? "typewriter-caret" : ""
      }`}
      aria-live="polite"
    >
      {typed || "\u00A0"}
    </span>
  );
}
