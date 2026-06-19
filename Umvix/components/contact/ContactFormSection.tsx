"use client";

import Reveal from "@/components/motion/Reveal";
import ContactForm from "@/components/ContactForm";

export default function ContactFormSection() {
  return (
    <section id="contact-form" className="relative px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal y={24}>
          <div className="text-center">
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-brand-white sm:text-4xl md:text-5xl">
              Send Us a{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                Message
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-brand-gray sm:text-base">
              Fill out the form below and we&apos;ll get back to you as soon as
              possible. All fields marked with{" "}
              <span className="text-brand-red">*</span> are required.
            </p>
          </div>
        </Reveal>

        <Reveal y={32} delay={0.08} className="mt-12">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
