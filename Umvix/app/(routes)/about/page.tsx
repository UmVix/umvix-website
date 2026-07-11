import { createMetadata } from "@/lib/metadata";
import AboutPageContent from "@/components/about/AboutPageContent";

export const metadata = createMetadata({
  title: "About",
  description:
    "Learn about Umvix — we build apps, websites, AI chatbots, and automation for clients worldwide.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageContent />;
}
