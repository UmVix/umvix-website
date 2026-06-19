"use client";

import SectionHeading from "@/components/SectionHeading";
import CodeTerminal from "@/components/home/CodeTerminal";
import Reveal from "@/components/motion/Reveal";

export default function FluentCodeSection() {
  return (
    <section>
      <Reveal y={24}>
        <SectionHeading
          title="We Speak Fluent Code"
          subtitle="From pixel-perfect frontends to AI pipelines and automation scripts — this is what we do all day."
          align="center"
          className="mb-10"
        />
      </Reveal>
      <Reveal y={32} delay={0.06}>
        <CodeTerminal />
      </Reveal>
    </section>
  );
}
