"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import ParticleText from "@/components/motion/ParticleText";
import ServiceOrb, { DEFAULT_SERVICES } from "@/components/ServiceOrb";
import ScrollIndicator from "@/components/home/ScrollIndicator";

const HEADLINE_CLASS =
  "block m-0 w-full text-left text-[3rem] font-extrabold font-headline leading-[1.1] tracking-[-0.03em] text-brand-white sm:text-[3.75rem] md:text-[4.75rem] lg:text-[5.75rem] xl:text-[6.75rem] xl:leading-[1.08]";

export default function Hero() {
  const ambientRef = useRef<HTMLDivElement>(null);

  const handleServiceChange = useCallback((id: number) => {
    const service = DEFAULT_SERVICES.find((s) => s.id === id);
    if (!service || !ambientRef.current) return;
    gsap.to(ambientRef.current, {
      "--ambient-color": service.color,
      duration: 1.2,
      ease: "power2.inOut",
    });
  }, []);

  useEffect(() => {
    handleServiceChange(0);
  }, [handleServiceChange]);

  return (
    <section
      id="hero"
      className="relative flex min-h-[85vh] items-start overflow-x-hidden pt-[var(--nav-height)] pb-14 lg:pb-20"
    >
      {/* Ambient color bleed — shifts with active service */}
      <div
        ref={ambientRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={
          {
            background:
              "radial-gradient(ellipse at 75% 50%, var(--ambient-color, #C96B7F) 0%, transparent 65%)",
            opacity: 0.06,
            "--ambient-color": "#C96B7F",
          } as React.CSSProperties
        }
      />

      <div className="site-container relative z-10 py-2 sm:py-4">
        <div className="grid items-start gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          {/* Left Side: Headline & CTAs */}
          <div className="content-rail flex w-full flex-col items-start">
            <div className="hero-headline-glow w-full">
              <ParticleText
                marginTop={12}
                lines={["Ideas First.", "Ship Bold.", "Scale Up."]}
                measureClassName={HEADLINE_CLASS}
                rgb="255, 255, 255"
                particleRgb="255, 31, 61"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="mt-10 flex flex-wrap items-center gap-8"
            >
              <div className="neon-border-container rounded-full p-[1.5px]">
                <Link
                  href="/contact"
                  data-cursor="hover"
                  className="neon-border-content group relative inline-flex items-center justify-center rounded-full bg-brand-black px-10 py-4 text-sm font-bold uppercase tracking-widest text-brand-white transition-all hover:bg-white/5"
                >
                  Start Project
                </Link>
              </div>

              <Link
                href="/portfolio"
                data-cursor="hover"
                className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-brand-white transition-all hover:text-brand-white/80"
              >
                View Our Work
                <div className="neon-border-container flex h-10 w-10 items-center justify-center rounded-full p-[1.5px]">
                  <div className="neon-border-content flex h-full w-full items-center justify-center rounded-full bg-brand-black transition-all group-hover:bg-white/5">
                    <ArrowUpRight
                      size={18}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Right Side: ServiceOrb */}
          <div className="relative flex w-full items-start justify-center overflow-visible pt-4 lg:ml-8 lg:justify-end xl:ml-12">
            <ServiceOrb
              services={DEFAULT_SERVICES}
              autoCycleMs={2800}
              onServiceChange={handleServiceChange}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
