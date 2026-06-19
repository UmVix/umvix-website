"use client";

import { Code, Smartphone, MessageSquare, Zap, BarChart } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import TiltCard from "@/components/motion/TiltCard";
import Reveal from "@/components/motion/Reveal";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description:
      "High-performance, scalable web applications built with modern frameworks like Next.js and React.",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description:
      "Native and cross-platform mobile solutions delivering seamless experiences on iOS and Android.",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbots",
    description:
      "Intelligent conversational agents powered by LLMs to automate support and engagement.",
  },
  {
    icon: Zap,
    title: "AI Automation",
    description:
      "Streamline business processes with custom AI workflows that save time and reduce manual effort.",
  },
  {
    icon: BarChart,
    title: "Dashboards",
    description:
      "Data-driven SaaS dashboards and visualization tools for smarter business decisions.",
  },
];

export default function ServicesPreview() {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <SectionHeading
        title="Our Specialized Services"
        subtitle="Cutting-edge technology solutions tailored to your business needs."
        align="center"
      />
      <Reveal stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.title} className="group [perspective:1000px]">
            <TiltCard className="h-full rounded-xl border border-brand-red/10 bg-brand-black-soft p-6 transition-colors duration-300 hover:border-brand-red/40">
              <div className="mb-4 inline-flex rounded-lg bg-brand-red/10 p-3 text-brand-red">
                <service.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-brand-white">{service.title}</h3>
              <p className="mt-2 text-brand-gray">{service.description}</p>
            </TiltCard>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
