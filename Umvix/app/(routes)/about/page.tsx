import { createMetadata } from "@/lib/metadata";
import { pageGraph } from "@/lib/structuredData";
import JsonLd from "@/components/JsonLd";
import AboutPageContent from "@/components/about/AboutPageContent";

const description =
  "About Umvix — a software development agency building web platforms, mobile apps, AI chatbots, and automation. Our story, services, clients, and offices in Germany and Pakistan.";

export const metadata = createMetadata({
  title: "About",
  description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/about",
          name: "About | Umvix",
          description,
          type: "AboutPage",
          breadcrumb: [{ name: "About", path: "/about" }],
        })}
      />
      <AboutPageContent />
    </>
  );
}
