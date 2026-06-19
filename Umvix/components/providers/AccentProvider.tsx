"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";

export type Mood = "neutral" | "excited" | "unsure" | "urgent" | "calm";

type AccentConfig = { intensity: number; speed: number };

const MOOD_CONFIG: Record<Mood, AccentConfig> = {
  neutral: { intensity: 1, speed: 1 },
  excited: { intensity: 1.6, speed: 1.8 },
  urgent: { intensity: 1.8, speed: 2.2 },
  unsure: { intensity: 0.7, speed: 0.6 },
  calm: { intensity: 0.6, speed: 0.5 },
};

type AccentContextValue = {
  mood: Mood;
  setMood: (m: Mood) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  playClick: () => void;
};

const AccentContext = createContext<AccentContextValue | null>(null);

export function useAccent() {
  const ctx = useContext(AccentContext);
  if (!ctx) throw new Error("useAccent must be used within AccentProvider");
  return ctx;
}

export default function AccentProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState<Mood>("neutral");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Reflect mood into CSS custom properties consumed across the site.
  useEffect(() => {
    const { intensity, speed } = MOOD_CONFIG[mood];
    const root = document.documentElement;
    root.style.setProperty("--accent-intensity", String(intensity));
    root.style.setProperty("--accent-speed", `${(3 / speed).toFixed(2)}s`);
  }, [mood]);

  const toggleSound = () => setSoundEnabled((v) => !v);

  const playClick = useMemo(
    () => () => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current) {
          const Ctx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext;
          audioCtxRef.current = new Ctx();
        }
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(620, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } catch {
        /* audio not available — silently ignore */
      }
    },
    [soundEnabled]
  );

  // Global soft click sound on interactive elements.
  useEffect(() => {
    if (!soundEnabled) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor="hover"]')) playClick();
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [soundEnabled, playClick]);

  const value = useMemo(
    () => ({ mood, setMood, soundEnabled, toggleSound, playClick }),
    [mood, soundEnabled, playClick]
  );

  return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>;
}
