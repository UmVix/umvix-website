import { createMetadata } from "@/lib/metadata";
import { pageGraph } from "@/lib/structuredData";
import JsonLd from "@/components/JsonLd";
import ContactPageContent from "@/components/contact/ContactPageContent";

const description =
  "Contact Umvix for project inquiries, quotes, and consulting on web, mobile app, AI, and automation projects. Email info@umvix.com or send us a message.";

export const metadata = createMetadata({
  title: "Contact",
  description,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/contact",
          name: "Contact | Umvix",
          description,
          type: "ContactPage",
          breadcrumb: [{ name: "Contact", path: "/contact" }],
        })}
      />
      <ContactPageContent />
    </>
  );
}
