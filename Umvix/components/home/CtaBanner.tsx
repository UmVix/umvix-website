"use client";

import Reveal from "@/components/motion/Reveal";
import MagneticButton from "@/components/motion/MagneticButton";

export default function CtaBanner() {
  return (
    <section className="mx-auto max-w-5xl px-4">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 text-center md:p-16">
          <div
            aria-hidden
            className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_40%)]"
          />
          <div className="relative">
            <h2 className="text-3xl font-bold text-brand-white md:text-5xl">
              Ready to build something extraordinary?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-white/80">
              Let&apos;s discuss your next project and how our team can help you achieve
              your digital goals.
            </p>
            <div className="mt-10 flex justify-center">
              <MagneticButton href="/contact" variant="light">
                Get a Free Quote
              </MagneticButton>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
