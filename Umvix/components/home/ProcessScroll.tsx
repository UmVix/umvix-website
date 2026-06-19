"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, PenTool, Code2, BrainCircuit, Rocket } from "lucide-react";
import { useReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  { icon: Search, title: "Discovery", desc: "We dig into your goals, users, and constraints to define a sharp strategy." },
  { icon: PenTool, title: "Design", desc: "Wireframes and high-fidelity prototypes that balance beauty and usability." },
  { icon: Code2, title: "Development", desc: "Agile, test-driven engineering with clean, scalable architecture." },
  { icon: BrainCircuit, title: "AI Integration", desc: "We embed intelligent automation and LLM features where they add real value." },
  { icon: Rocket, title: "Launch", desc: "Deployment, monitoring, and ongoing support to keep you ahead." },
];

export default function ProcessScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: -distance,
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${distance}`,
        pin: true,
        scrub: 1,
        animation: tween,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.width = `${self.progress * 100}%`;
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-brand-white">Our Process</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-brand-red/15 bg-brand-black-soft p-6">
              <s.icon className="mb-3 text-brand-red" size={28} />
              <h3 className="text-xl font-bold text-brand-white">
                {String(i + 1).padStart(2, "0")} · {s.title}
              </h3>
              <p className="mt-2 text-brand-gray">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Progress bar */}
      <div className="absolute left-0 right-0 top-0 z-20 px-8 pt-8">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand-red">
            Our Process
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-brand-black-soft">
            <div
              ref={progressRef}
              className="h-full w-0 rounded-full bg-brand-gradient"
              style={{ willChange: "width" }}
            />
          </div>
        </div>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex h-full items-center gap-8 px-8 will-change-transform"
        style={{ width: "max-content" }}
      >
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="flex h-[60vh] w-[80vw] max-w-2xl shrink-0 flex-col justify-center rounded-3xl border border-brand-red/15 bg-brand-black-soft p-10 md:w-[55vw]"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red accent-glow">
              <s.icon size={40} />
            </div>
            <div className="mt-6 text-7xl font-extrabold text-brand-red/20">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="mt-2 text-4xl font-bold text-brand-white">{s.title}</h3>
            <p className="mt-4 max-w-md text-lg text-brand-gray">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
