"use client";

import { useRef } from "react";
import ContactHero from "@/components/contact/ContactHero";
import ContactHeroBackground from "@/components/contact/ContactHeroBackground";
import ContactFormSection from "@/components/contact/ContactFormSection";
import ContactCtaCard from "@/components/contact/ContactCtaCard";

export default function ContactPageContent() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative flex flex-col">
      <ContactHeroBackground scrollTargetRef={scrollRef} />
      <div ref={scrollRef} className="relative z-10 flex flex-col">
        <ContactHero />
        <ContactFormSection />
        <ContactCtaCard />
      </div>
    </div>
  );
}
