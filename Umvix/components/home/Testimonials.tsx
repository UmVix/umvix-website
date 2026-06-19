"use client";

import { Quote } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/motion/Reveal";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO at TechFlow",
    quote:
      "Umvix transformed our manual workflows into a seamless AI-driven system. Their expertise in automation is unmatched.",
  },
  {
    name: "Michael Chen",
    role: "Product Manager at InnovateApp",
    quote:
      "The mobile app Umvix built for us exceeded all expectations. Clean code, great UI, and delivered on time.",
  },
  {
    name: "Elena Rodriguez",
    role: "Founder of DataViz",
    quote:
      "Their dashboard solutions gave us insights we never knew we had. Beautiful and functional data visualization.",
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <Reveal y={24}>
        <SectionHeading
          title="What Our Clients Say"
          subtitle="Hear from the partners who trust Umvix to build their digital products."
          align="center"
        />
      </Reveal>
      <Reveal stagger className="mt-12 grid gap-8 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col justify-between rounded-xl border border-brand-red/10 bg-brand-black-soft p-8 transition-colors duration-300 hover:border-brand-red/40"
          >
            <Quote size={28} className="text-brand-red" />
            <blockquote className="mt-4 text-brand-white">{t.quote}</blockquote>
            <figcaption className="mt-6">
              <div className="font-bold text-brand-white">{t.name}</div>
              <div className="text-sm text-brand-red">{t.role}</div>
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  );
}
