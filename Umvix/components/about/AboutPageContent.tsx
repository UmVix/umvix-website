"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import {
  ArrowUpRight,
  Bot,
  Code,
  Globe,
  MapPin,
  Rocket,
  ShieldCheck,
  Smartphone,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import CountUp from "@/components/motion/CountUp";
import MagneticButton from "@/components/motion/MagneticButton";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/SectionHeading";
import HeroAssembly from "@/components/about/HeroAssembly";
import { useReducedMotion } from "@/lib/hooks";

const stats = [
  {
    icon: Rocket,
    label: "Projects Delivered",
    value: 30,
    suffix: "+",
    detail: "Web, mobile, AI & automation",
  },
  {
    icon: Users,
    label: "Clients Served",
    value: 17,
    suffix: "+",
    detail: "Founders & growing teams",
  },
  {
    icon: Globe,
    label: "Countries Served",
    value: 9,
    suffix: "+",
    detail: "US, Europe & Middle East",
  },
  {
    icon: Star,
    label: "Average Rating",
    display: "4.9",
    detail: "Across client reviews",
  },
];

const capabilities = [
  {
    icon: Code,
    title: "Web Development",
    description:
      "Fast, SEO-ready sites and platforms, from landing pages to full-stack SaaS.",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description:
      "Native and cross-platform apps built for performance, retention, and scale.",
  },
  {
    icon: Bot,
    title: "AI Chatbots",
    description:
      "Custom LLM assistants that support customers, qualify leads, and save hours.",
  },
  {
    icon: Zap,
    title: "Automation",
    description:
      "Workflows that connect your tools and remove repetitive work from your team.",
  },
];

const clients = [
  { name: "MileageQuest", category: "Apps & AI", location: "USA", rating: 5 },
  { name: "DoneRight", category: "Web & Automation", location: "USA", rating: 4.9 },
  { name: "PhamEnterprises", category: "Automation", location: "USA", rating: 5 },
  { name: "Vertex SaaS", category: "SaaS Development", location: "Germany", rating: 4.9 },
  { name: "Pulse Fintech", category: "Fintech Apps", location: "Qatar", rating: 5 },
  { name: "Solstice Health", category: "Healthcare Apps", location: "USA", rating: 4.9 },
];

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description:
      "Every sprint ties back to a business outcome, not just features shipped.",
  },
  {
    icon: Globe,
    title: "Global Delivery",
    description:
      "We work with teams across the US, Europe, and the Middle East in their time zones.",
  },
  {
    icon: Users,
    title: "True Partnership",
    description:
      "Clear communication, honest timelines, and a team that feels like an extension of yours.",
  },
  {
    icon: ShieldCheck,
    title: "Built to Last",
    description:
      "Secure architecture, clean code, and products you can maintain long after launch.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={
            i < Math.floor(rating)
              ? "fill-brand-red text-brand-red"
              : i < rating
                ? "fill-brand-red/50 text-brand-red/50"
                : "text-white/15"
          }
        />
      ))}
    </div>
  );
}

function StatCard({
  stat,
  index,
  reducedMotion,
}: {
  stat: (typeof stats)[number];
  index: number;
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const sx = useSpring(px, { stiffness: 150, damping: 15 });
  const sy = useSpring(py, { stiffness: 150, damping: 15 });

  // Cursor position curves the card in 3D.
  const rotateX = useTransform(sy, [0, 1], [22, -22]);
  const rotateY = useTransform(sx, [0, 1], [-22, 22]);
  const glare = useTransform(
    [sx, sy],
    ([gx, gy]: number[]) =>
      `radial-gradient(circle at ${gx * 100}% ${gy * 100}%, rgba(255,31,61,0.22), transparent 60%)`
  );

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        duration: 0.6,
        delay: reducedMotion ? 0 : index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 650 }}
      className="group"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-brand-black-soft p-6 will-change-transform transition-[transform,border-color,box-shadow] duration-300 group-hover:scale-[1.03] group-hover:border-brand-red/30 group-hover:shadow-[0_20px_50px_-20px_rgba(255,31,61,0.45)] sm:p-8"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
        />
        <div
          style={{ transform: "translateZ(65px)" }}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
        >
          <stat.icon size={18} />
        </div>
        <div className="relative" style={{ transform: "translateZ(45px)" }}>
          <div className="bg-gradient-to-br from-brand-white to-brand-white/60 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            {"display" in stat ? (
              stat.display
            ) : (
              <CountUp value={stat.value} suffix={stat.suffix} />
            )}
          </div>
          <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-brand-white/80 sm:text-sm">
            {stat.label}
          </div>
          <div className="mt-1 text-xs text-brand-gray">{stat.detail}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AboutPageContent() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-24 pb-24">
      <section className="relative overflow-hidden pt-[calc(var(--nav-height)+2rem)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            background:
              "radial-gradient(ellipse at 70% 40%, #ff1f3d 0%, transparent 55%)",
          }}
        />
        <div className="site-container relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
            <Reveal y={24}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-brand-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                About Umvix
              </span>
              <h1
                className="mt-8 max-w-4xl font-headline text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-brand-white"
                style={{ fontFamily: "var(--font-headline), system-ui, sans-serif" }}
              >
                We Build Digital Products That{" "}
                <span className="text-brand-red">Ship & Scale</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-brand-gray">
                Umvix is a product-focused agency building apps, websites, AI chatbots,
                and automation for founders and teams who want results, not slide decks.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-8">
                <div className="neon-border-container rounded-full p-[1.5px]">
                  <Link
                    href="/contact"
                    data-cursor="hover"
                    className="neon-border-content group relative inline-flex items-center justify-center rounded-full bg-brand-black px-10 py-4 text-sm font-bold uppercase tracking-widest text-brand-white transition-all hover:bg-white/5"
                  >
                    Start a Project
                  </Link>
                </div>

                <Link
                  href="/services"
                  data-cursor="hover"
                  className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-brand-white transition-all hover:text-brand-white/80"
                >
                  View Services
                  <div className="neon-border-container flex h-10 w-10 items-center justify-center rounded-full p-[1.5px]">
                    <div className="neon-border-content flex h-full w-full items-center justify-center rounded-full bg-brand-black transition-all group-hover:bg-white/5">
                      <ArrowUpRight
                        size={18}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </div>
                  </div>
                </Link>
              </div>
            </Reveal>
            <HeroAssembly />
          </div>
        </div>
      </section>

      <section className="site-container">
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={index}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </section>

      <section className="site-container">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal y={24}>
            <SectionHeading
              title="Our Story"
              subtitle="From a small studio to a global delivery partner."
            />
          </Reveal>
          <Reveal y={24} delay={0.08}>
            <div className="flex flex-col gap-6 text-lg text-brand-gray">
              <p>
                Umvix began with a simple belief: great software should be accessible
                to businesses of every size, not locked behind enterprise budgets or
                bloated agency processes.
              </p>
              <p>
                Today we design and ship web platforms, mobile apps, AI chatbots, custom
                dashboards, and automation workflows for clients in the US, Germany,
                Qatar, and beyond. Every project is led by engineers and designers who
                care about clarity, speed, and long-term maintainability.
              </p>
              <p>
                We don&apos;t chase trends for their own sake. We pick the stack and
                architecture that fit your goals, communicate in plain language, and
                deliver work you can be proud to show customers and investors.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="site-container">
        <Reveal y={24}>
          <SectionHeading
            title="What We Build"
            subtitle="Four core disciplines, one team that ships end to end."
            align="center"
          />
        </Reveal>
        <Reveal stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-brand-black-soft p-6 transition-colors hover:border-brand-red/30"
            >
              <div className="mb-4 inline-flex rounded-xl bg-brand-red/10 p-3 text-brand-red">
                <item.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-brand-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-gray">
                {item.description}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="bg-brand-black-soft py-20">
        <div className="site-container">
          <Reveal y={24}>
            <SectionHeading
              title="Trusted Worldwide"
              subtitle="Real projects. Real reviews. Clients across apps, web, chatbots, and automation."
              align="center"
            />
          </Reveal>
          <Reveal stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <div
                key={client.name}
                className="rounded-2xl border border-white/10 bg-brand-black p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-brand-white">{client.name}</h3>
                    <p className="mt-1 text-sm text-brand-gray">{client.category}</p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/15 text-xs font-bold text-brand-red">
                    {client.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <StarRating rating={client.rating} />
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-xs text-brand-gray">
                    <MapPin size={11} className="text-brand-red" />
                    {client.location}
                  </span>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="site-container">
        <Reveal y={24}>
          <SectionHeading
            title="Our Core Values"
            subtitle="How we work with every client, on every project."
            align="center"
          />
        </Reveal>
        <Reveal stagger className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div key={value.title} className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-brand-red/10 p-4 text-brand-red">
                <value.icon size={28} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-brand-white">{value.title}</h3>
              <p className="text-sm leading-relaxed text-brand-gray">{value.description}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="site-container">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 text-center md:p-14">
            <div
              aria-hidden
              className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_40%)]"
            />
            <div className="relative">
              <h2 className="text-2xl font-bold text-brand-white md:text-4xl">
                Ready to build with a team that delivers?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-brand-white/80">
                Tell us about your app, website, chatbot, or automation idea. We&apos;ll
                reply with clear next steps, usually within one business day.
              </p>
              <div className="mt-8 flex justify-center">
                <MagneticButton href="/contact" variant="light">
                  Get in Touch
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
