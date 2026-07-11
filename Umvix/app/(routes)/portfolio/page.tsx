import { createMetadata } from "@/lib/metadata";
import SectionHeading from "@/components/SectionHeading";
import PortfolioGrid from "@/components/PortfolioGrid";
import TransformationShowcase from "@/components/portfolio/TransformationShowcase";
import Reveal from "@/components/motion/Reveal";

export const metadata = createMetadata({
  title: "Portfolio",
  description:
    "Browse the Umvix portfolio of web development, software, and digital projects.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal y={24}>
        <SectionHeading
          title="Our Portfolio"
          subtitle="A showcase of our recent projects across web, mobile, and artificial intelligence."
          align="center"
        />
      </Reveal>
      <PortfolioGrid />

      <div className="mt-28">
        <Reveal y={24}>
          <SectionHeading
            title="The Umvix Transformation"
            subtitle="The same business — before and after Umvix. Outdated legacy platforms rebuilt into modern, high-converting experiences."
            align="center"
            className="mb-14"
          />
        </Reveal>
        <TransformationShowcase className="mx-auto max-w-6xl" />
      </div>
    </div>
  );
}
