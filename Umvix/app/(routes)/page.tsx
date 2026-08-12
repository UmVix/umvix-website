import { createMetadata } from "@/lib/metadata";
import { pageGraph } from "@/lib/structuredData";
import JsonLd from "@/components/JsonLd";
import Hero from "@/components/home/Hero";
import SmartSolutionsSection from "@/components/home/SmartSolutionsSection";
import ResultsShowcase from "@/components/home/ResultsShowcase";
import AssemblySection from "@/components/home/AssemblySection";

const description =
  "Umvix is a software development agency building web platforms, mobile apps, AI chatbots, and automation for founders and growing teams. Based in Bielefeld, Germany and Islamabad, Pakistan.";

export const metadata = createMetadata({
  fullTitle: "Umvix — Web, Mobile App & AI Development Agency",
  description,
  path: "/",
});

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <JsonLd
        data={pageGraph({
          path: "/",
          name: "Umvix — Web, Mobile App & AI Development Agency",
          description,
        })}
      />
      <Hero />
      <ResultsShowcase />
      <SmartSolutionsSection />
      <AssemblySection />
    </div>
  );
}
