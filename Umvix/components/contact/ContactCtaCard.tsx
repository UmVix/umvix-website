"use client";

import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

export default function ContactCtaCard() {
  const scrollToForm = () => {
    document
      .getElementById("contact-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative px-6 pb-24 pt-4 md:pb-32">
      {/* Ambient blobs — visible through glass */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-red/20 blur-[100px]" />
        <div className="absolute bottom-0 left-[15%] h-56 w-56 rounded-full bg-brand-red/10 blur-[80px]" />
        <div className="absolute bottom-12 right-[10%] h-48 w-48 rounded-full bg-indigo-900/30 blur-[90px]" />
      </div>

      <Reveal y={28} className="relative mx-auto max-w-3xl">
        <div className="contact-glass-card rounded-3xl p-8 text-center sm:p-12 md:p-14">
          <div className="relative z-[1]">
            <div className="contact-glass-icon mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full text-brand-red">
              <MessageCircle size={24} />
            </div>

            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-brand-white sm:text-4xl md:text-[2.5rem]">
              Ready to Work{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                Together?
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-brand-gray sm:text-base">
              Let&apos;s discuss how we can help bring your vision to life. Get
              in touch with us today and discover what we can build together.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={scrollToForm}
                className="btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold"
              >
                Get In Touch
                <ArrowRight size={16} />
              </button>

              <Link
                href="mailto:info@umvix.com"
                className="contact-glass-btn inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-brand-white transition-all"
              >
                <Mail size={16} />
                Send Email
              </Link>
            </div>

            <hr className="contact-glass-divider mx-auto mt-10 max-w-md" />

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-10">
              <a
                href="tel:+923165310133"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-brand-white/90 transition-colors hover:bg-white/[0.06] hover:text-brand-white"
              >
                <Phone size={16} className="text-brand-red" />
                +92-316 5310133
              </a>
              <a
                href="mailto:info@umvix.com"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-brand-white/90 transition-colors hover:bg-white/[0.06] hover:text-brand-white"
              >
                <Mail size={16} className="text-brand-red" />
                info@umvix.com
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
