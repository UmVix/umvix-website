"use client";

import Marquee from "@/components/motion/Marquee";
import Reveal from "@/components/motion/Reveal";

const techStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "React Native",
  "Flutter",
  "OpenAI",
  "LangChain",
  "PostgreSQL",
  "AWS",
  "Docker",
  "TailwindCSS",
  "Three.js",
];

export default function TechMarquee() {
  return (
    <section className="py-12">
      <Reveal y={20}>
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-brand-gray-muted">
          Our Technology Stack
        </p>
      </Reveal>
      <Reveal y={24} delay={0.05}>
        <Marquee speed={28}>
        {techStack.map((tech) => (
          <span
            key={tech}
            className="text-2xl font-semibold text-brand-gray-muted transition-colors hover:text-brand-red"
          >
            {tech}
          </span>
        ))}
        </Marquee>
      </Reveal>
    </section>
  );
}
