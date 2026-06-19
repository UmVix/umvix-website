import { createMetadata } from "@/lib/metadata";
import ContactPageContent from "@/components/contact/ContactPageContent";

export const metadata = createMetadata({
  title: "Contact",
  description:
    "Get in touch with Umvix for project inquiries, quotes, and IT consulting.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageContent />;
}
