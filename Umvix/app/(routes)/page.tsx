import { createMetadata } from "@/lib/metadata";
import Hero from "@/components/home/Hero";
import SmartSolutionsSection from "@/components/home/SmartSolutionsSection";
import ResultsShowcase from "@/components/home/ResultsShowcase";

export const metadata = createMetadata({
  title: "Home",
  description:
    "Welcome to Umvix — your trusted IT agency for web development, software solutions, and digital transformation.",
  path: "/",
});

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ResultsShowcase />
      <SmartSolutionsSection />
    </div>
  );
}
