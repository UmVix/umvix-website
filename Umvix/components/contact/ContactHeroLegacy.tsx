"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import ScrollIndicator from "@/components/home/ScrollIndicator";
import SignalField from "@/components/effects/SignalField";

/** Previous static hero — kept as backup, not used on /contact */
export default function ContactHeroLegacy() {
  return (
    <section
      id="contact-hero"
      className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-6 pb-20 pt-10"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-brand-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_12%_50%,rgba(140,25,45,0.55),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_88%_42%,rgba(28,38,95,0.48),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(255,31,61,0.08),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-black/80" />
      </div>

      <SignalField density="normal" className="opacity-70" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-sm"
        >
          <MessageCircle size={14} className="text-brand-red" />
          <span className="text-sm font-medium text-brand-white">
            Let&apos;s Connect
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-headline text-[2.75rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-brand-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Get In{" "}
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            Touch
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-brand-gray sm:text-lg"
        >
          Have a product in mind, a platform to rebuild, or an AI workflow to
          automate? Share the details below — we&apos;ll reply with clear next
          steps, honest timelines, and a plan that fits your goals.
        </motion.p>
      </div>

      <ScrollIndicator targetId="contact-form" />
    </section>
  );
}
