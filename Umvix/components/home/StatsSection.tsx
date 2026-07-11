"use client";

import CountUp from "@/components/motion/CountUp";
import Reveal from "@/components/motion/Reveal";

const stats = [
  { label: "Projects Delivered", value: 30, suffix: "+" },
  { label: "Clients Served", value: 17, suffix: "+" },
  { label: "Years of Experience", value: 8, suffix: "+" },
  { label: "AI Models Integrated", value: 25, suffix: "+" },
];

export default function StatsSection() {
  return (
    <section className="border-y border-brand-red/10 bg-brand-black-soft py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal stagger className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-brand-red sm:text-5xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-2 text-sm font-medium uppercase tracking-wider text-brand-gray">
                {stat.label}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
