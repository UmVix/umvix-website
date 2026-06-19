"use client";

import { Code, Smartphone, MessageSquare, Zap, BarChart, CheckCircle2 } from "lucide-react";
import TiltCard from "@/components/motion/TiltCard";
import Reveal from "@/components/motion/Reveal";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description:
      "We build fast, secure, and SEO-friendly web applications using the latest technologies. From simple landing pages to complex enterprise platforms, we ensure your web presence is powerful and scalable.",
    features: [
      "Custom Next.js & React Applications",
      "E-commerce Solutions (Shopify, Custom)",
      "Headless CMS Integration",
      "Performance Optimization & SEO",
      "Progressive Web Apps (PWA)",
    ],
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Our mobile development team creates intuitive and high-performing apps for iOS and Android. We focus on user experience and technical excellence to deliver apps that users love.",
    features: [
      "Native iOS (Swift) & Android (Kotlin)",
      "Cross-platform (React Native, Flutter)",
      "UI/UX Design for Mobile",
      "App Store Optimization (ASO)",
      "Backend Integration & APIs",
    ],
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot Development",
    description:
      "Leverage the power of Large Language Models (LLMs) to automate your customer interactions. We build custom chatbots that understand context, provide accurate answers, and integrate with your existing tools.",
    features: [
      "Custom GPT & LLM Integration",
      "Multi-channel Support (Web, WhatsApp, Slack)",
      "Knowledge Base Training",
      "Lead Generation Automations",
      "24/7 Intelligent Customer Support",
    ],
  },
  {
    icon: Zap,
    title: "AI Automation & Workflows",
    description:
      "Stop wasting time on repetitive tasks. We design and implement AI workflows that automate your business processes, from data entry to complex decision-making systems.",
    features: [
      "Zapier & Make.com Automations",
      "Custom Python Automation Scripts",
      "AI-driven Content Generation",
      "Automated Data Extraction & Processing",
      "Workflow Audit & Optimization",
    ],
  },
  {
    icon: BarChart,
    title: "Custom Dashboards & SaaS",
    description:
      "Turn your data into actionable insights. We build custom dashboards and SaaS platforms that help you visualize key metrics, manage users, and grow your business with data-driven decisions.",
    features: [
      "Real-time Data Visualization",
      "SaaS Architecture & Development",
      "User Management & RBAC",
      "Third-party API Integrations",
      "Custom Analytics Solutions",
    ],
  },
];

export default function ServiceCards() {
  return (
    <div className="grid gap-8">
      {services.map((service) => (
        <Reveal key={service.title}>
          <div className="group [perspective:1200px]">
            <TiltCard
              max={5}
              className="grid gap-8 rounded-2xl border border-brand-red/10 bg-brand-black-soft p-6 transition-colors duration-300 hover:border-brand-red/40 md:grid-cols-2 lg:items-center md:p-8"
            >
              <div className="flex flex-col gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                  <service.icon size={28} />
                </div>
                <h2 className="text-2xl font-bold text-brand-white">{service.title}</h2>
                <p className="text-lg text-brand-gray">{service.description}</p>
              </div>
              <div className="rounded-xl bg-brand-black p-6 md:p-8">
                <h3 className="mb-4 font-semibold text-brand-white">What&apos;s Included:</h3>
                <ul className="grid gap-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-brand-gray">
                      <CheckCircle2 size={18} className="shrink-0 text-brand-red" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
