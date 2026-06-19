"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Code, Smartphone, MessageSquare, BarChart, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import MagneticButton from "@/components/motion/MagneticButton";
import Reveal from "@/components/motion/Reveal";
import type { ServiceKey } from "@/components/three/ServiceSelectorScene";

const Scene = dynamic(() => import("@/components/three/ServiceSelectorScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-32 w-32 animate-pulse rounded-2xl border border-brand-red/30 bg-brand-red/5" />
    </div>
  ),
});

const META: Record<ServiceKey, { label: string; icon: typeof Code; desc: string }> = {
  web: { label: "Web Development", icon: Code, desc: "Fast, scalable web apps" },
  mobile: { label: "Mobile Apps", icon: Smartphone, desc: "iOS & Android experiences" },
  ai: { label: "AI Solutions", icon: MessageSquare, desc: "Chatbots & automation" },
  dashboard: { label: "Dashboards", icon: BarChart, desc: "Data-driven SaaS tools" },
};

const ORDER: ServiceKey[] = ["web", "mobile", "ai", "dashboard"];

export default function ServiceSelector() {
  const [selected, setSelected] = useState<ServiceKey[]>([]);

  const toggle = (key: ServiceKey) =>
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  return (
    <section className="mx-auto max-w-6xl px-4">
      <Reveal y={24}>
        <SectionHeading
          title="Build Your Project"
          subtitle="Click the floating modules to assemble your custom solution — watch it come together in real time."
          align="center"
        />
      </Reveal>

      <Reveal stagger className="mt-10 grid items-center gap-8 lg:grid-cols-2">
        {/* 3D canvas */}
        <div className="relative h-[420px] rounded-2xl border border-brand-red/15 bg-brand-black-soft">
          <Scene selected={selected} onToggle={toggle} />
          <div className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-xs text-brand-gray-muted">
            Tap a module to add it to your build
          </div>
        </div>

        {/* Quick-select + summary */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            {ORDER.map((key) => {
              const { label, icon: Icon } = META[key];
              const active = selected.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  data-cursor="hover"
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                    active
                      ? "border-brand-red bg-brand-red/10 text-brand-white accent-glow"
                      : "border-brand-red/15 bg-brand-black text-brand-gray hover:border-brand-red/40"
                  }`}
                >
                  <Icon size={20} className={active ? "text-brand-red" : ""} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {selected.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 16, height: 0 }}
                className="mt-6 overflow-hidden"
              >
                <div className="rounded-2xl border border-brand-red/20 bg-brand-black p-6">
                  <h3 className="text-lg font-bold text-brand-white">
                    Your Custom Build
                    <span className="ml-2 text-sm font-normal text-brand-red">
                      {selected.length} module{selected.length > 1 ? "s" : ""}
                    </span>
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {selected.map((key) => {
                      const { label, desc } = META[key];
                      return (
                        <motion.li
                          key={key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between border-b border-brand-red/10 pb-2 text-sm"
                        >
                          <span className="font-medium text-brand-white">{label}</span>
                          <span className="text-brand-gray-muted">{desc}</span>
                        </motion.li>
                      );
                    })}
                  </ul>
                  <div className="mt-6">
                    <MagneticButton href="/contact">
                      <span className="flex items-center gap-2">
                        Get a Quote for This Build <ArrowRight size={16} />
                      </span>
                    </MagneticButton>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
