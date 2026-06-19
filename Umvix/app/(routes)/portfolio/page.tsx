import { createMetadata } from "@/lib/metadata";
import SectionHeading from "@/components/SectionHeading";
import PortfolioGrid from "@/components/PortfolioGrid";
import CaseStudyGenerator from "@/components/ai/CaseStudyGenerator";
import BeforeAfterSlider from "@/components/portfolio/BeforeAfterSlider";
import Reveal from "@/components/motion/Reveal";

export const metadata = createMetadata({
  title: "Portfolio",
  description:
    "Browse the Umvix portfolio of web development, software, and digital projects.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Reveal y={24}>
        <SectionHeading
          title="Our Portfolio"
          subtitle="A showcase of our recent projects across web, mobile, and artificial intelligence."
          align="center"
        />
      </Reveal>
      <PortfolioGrid />

      <div className="mt-20">
        <Reveal y={24}>
          <SectionHeading
            title="The Umvix Transformation"
            subtitle="Drag the handle to see how we redesigned a client's outdated platform into a modern experience."
            align="center"
            className="mb-10"
          />
        </Reveal>
        <Reveal y={32} delay={0.06}>
          <BeforeAfterSlider
            beforeLabel="Legacy Site"
            afterLabel="Umvix Redesign"
            className="mx-auto max-w-4xl"
          />
        </Reveal>
      </div>

      <Reveal y={28} delay={0.04} className="mt-20 block">
        <CaseStudyGenerator />
      </Reveal>
    </div>
  );
}
