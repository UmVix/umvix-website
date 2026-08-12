import { createMetadata } from "@/lib/metadata";
import { pageGraph } from "@/lib/structuredData";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/SectionHeading";
import ServiceCards from "@/components/services/ServiceCards";
import ProjectEstimator from "@/components/ai/ProjectEstimator";
import Reveal from "@/components/motion/Reveal";

const description =
  "Umvix services: web development, mobile app development, AI chatbot development, AI automation and workflows, and custom dashboards and SaaS platforms.";

export const metadata = createMetadata({
  title: "Services",
  description,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <JsonLd
        data={pageGraph({
          path: "/services",
          name: "Services | Umvix",
          description,
          breadcrumb: [{ name: "Services", path: "/services" }],
        })}
      />
      <Reveal y={24}>
        <SectionHeading
          as="h1"
          title="Our Services"
          subtitle="Comprehensive digital solutions designed to propel your business forward in an AI-first world."
          align="center"
          className="mb-16"
        />
      </Reveal>

      <ServiceCards />

      <div className="mt-20">
        <Reveal y={24}>
          <SectionHeading
            title="Not Sure Where to Start?"
            subtitle="Describe your idea and let our AI scope it out for you in seconds."
            align="center"
            className="mb-10"
          />
        </Reveal>
        <Reveal y={32} delay={0.06}>
          <ProjectEstimator />
        </Reveal>
      </div>
    </div>
  );
}
