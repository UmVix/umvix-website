"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Bot, Globe, Smartphone } from "lucide-react";
import TiltCard from "@/components/motion/TiltCard";
import Reveal from "@/components/motion/Reveal";
import ProjectVisual, { VisualKind } from "@/components/portfolio/ProjectVisual";
import AppScreensVisual from "@/components/portfolio/AppScreensVisual";
import PhamDashboardVisual from "@/components/portfolio/PhamDashboardVisual";
import MedLabDashboardVisual from "@/components/portfolio/MedLabDashboardVisual";
import WebsiteShotVisual from "@/components/portfolio/WebsiteShotVisual";
import WebsiteMockupVisual from "@/components/portfolio/WebsiteMockupVisual";
import ChatbotPrototypeVisual from "@/components/portfolio/ChatbotPrototypeVisual";
import OrderAlertVisual from "@/components/portfolio/OrderAlertVisual";
import ClientOnboardingVisual from "@/components/portfolio/ClientOnboardingVisual";
import LeadRouterVisual from "@/components/portfolio/LeadRouterVisual";
import TahanaWellnessVisual from "@/components/portfolio/TahanaWellnessVisual";
import SaporeRestaurantVisual from "@/components/portfolio/SaporeRestaurantVisual";

type Category = "Web" | "AI" | "Mobile";

type Project = {
  title: string;
  category: Category;
  description: string;
  tags: string[];
  accent: string;
  variant: number;
  /** Real project: link opened on click (e.g. App Store). */
  href?: string;
  /** Real project: marketing screenshots rendered instead of the procedural mockup. */
  images?: string[];
  /** Real project with a bespoke recreated UI. */
  custom?:
    | "pham-dashboard"
    | "medlab-dashboard"
    | "website"
    | "chatbot"
    | "order-alert"
    | "onboarding"
    | "lead-router"
    | "wellness"
    | "restaurant";
  /** Web projects: URL shown in the browser-frame chrome. */
  frameUrl?: string;
};

const projects: Project[] = [
  // ---- Web ----
  {
    title: "My Learning Mindset",
    category: "Web",
    description:
      "Personal learning dashboard — courses, field journals, AI literacy tracking, badges, and progress insights.",
    tags: ["Next.js", "EdTech", "Dashboards"],
    accent: "#7c5cf0",
    variant: 2,
    images: ["/images/portfolio/mylearningmindset/mlm-dashboard.png"],
    frameUrl: "mylearningmindset.com",
  },
  {
    title: "PhamEnterprises Hub",
    category: "Web",
    description:
      "Business management hub — budgets, purchasers, payroll, sub-contracts, inventory, and reports in one dashboard.",
    tags: ["Next.js", "PostgreSQL", "Dashboards"],
    accent: "#1e9e66",
    variant: 0,
    custom: "pham-dashboard",
  },
  {
    title: "MedLab Pro",
    category: "Web",
    description:
      "Diagnostic lab management system — patient queues, test orders, results, imaging reports, billing, and analytics.",
    tags: ["React", "Node.js", "Healthcare"],
    accent: "#b06a3e",
    variant: 1,
    custom: "medlab-dashboard",
  },
  {
    title: "Vertex SaaS",
    category: "Web",
    description: "High-converting SaaS marketing site with motion design and 98+ Lighthouse scores.",
    tags: ["Next.js", "Framer Motion", "Vercel"],
    accent: "#5c7cfa",
    variant: 0,
    custom: "website",
    frameUrl: "vertex.io",
  },
  {
    title: "Tahana Wellness",
    category: "Web",
    description:
      "Calm, premium website for a wellness studio — treatments, retreats, and online session booking.",
    tags: ["Next.js", "CMS", "Bookings"],
    accent: "#A7834E",
    variant: 0,
    custom: "wellness",
    frameUrl: "tahanawellness.com",
  },
  {
    title: "Sapore Ristorante",
    category: "Web",
    description:
      "Sito per una pizzeria artigianale romana — menù, la nostra storia e prenotazioni online.",
    tags: ["Next.js", "CMS", "Reservations"],
    accent: "#cf9b5c",
    variant: 0,
    custom: "restaurant",
    frameUrl: "saporeristorante.com",
  },
  // ---- AI ----  (3 chatbots + 3 automations)
  {
    title: "Nexus Support Bot",
    category: "AI",
    description: "Website support widget that answers questions, shares pricing, and books demos 24/7.",
    tags: ["Claude", "RAG", "Live Chat"],
    accent: "#22d3ee",
    variant: 0,
    custom: "chatbot",
  },
  {
    title: "Aria AI Copilot",
    category: "AI",
    description: "In-app copilot that summarizes tickets, drafts replies, and answers from your docs.",
    tags: ["Claude", "Embeddings", "Next.js"],
    accent: "#a78bfa",
    variant: 1,
    custom: "chatbot",
  },
  {
    title: "Tahana Booking Bot",
    category: "AI",
    description: "Messaging bot that greets visitors, shows open session slots, and confirms bookings.",
    tags: ["Claude", "WhatsApp", "Calendar"],
    accent: "#A7834E",
    variant: 2,
    custom: "chatbot",
  },
  {
    title: "Client Onboarding",
    category: "AI",
    description: "New signup automatically gets a welcome email and is added to your CRM — no code.",
    tags: ["Typeform", "Gmail", "HubSpot"],
    accent: "#34d399",
    variant: 0,
    custom: "onboarding",
  },
  {
    title: "Order Alerts",
    category: "AI",
    description: "Every new order pings your sales channel and logs itself to a spreadsheet instantly.",
    tags: ["Shopify", "Slack", "Sheets"],
    accent: "#fbbf24",
    custom: "order-alert",
    variant: 0,
  },
  {
    title: "Lead Router",
    category: "AI",
    description: "Incoming leads get scored by AI and the right rep is notified in seconds.",
    tags: ["Webhook", "Claude", "Slack"],
    accent: "#38bdf8",
    variant: 2,
    custom: "lead-router",
  },
  // ---- Mobile ----
  {
    title: "Evolve: Fitness Quest",
    category: "Mobile",
    description:
      "Gamified fitness app — XP levels, boss raids, AI fridge scans, and voice food logging. Live on the App Store.",
    tags: ["iOS", "AI", "Gamification"],
    accent: "#c65cf2",
    variant: 0,
    href: "https://apps.apple.com/pk/app/evolve-fitness-quest/id6743642232",
    images: [
      "/images/portfolio/evolve/evolve-4.png",
      "/images/portfolio/evolve/evolve-3.png",
      "/images/portfolio/evolve/evolve-5.png",
    ],
  },
  {
    title: "OverHerd: Anonymous Groups",
    category: "Mobile",
    description:
      "Anonymous social app — share thoughts with people nearby, join herds, and earn rewards for streaks and posts.",
    tags: ["iOS", "Social", "Community"],
    accent: "#e08e96",
    variant: 1,
    href: "https://apps.apple.com/pk/app/overherd-anonymous-groups/id6744361203",
    images: [
      "/images/portfolio/overherd/overherd-1.png",
      "/images/portfolio/overherd/overherd-2.png",
      "/images/portfolio/overherd/overherd-3.png",
    ],
  },
  {
    title: "Done Right: AI To-Do List",
    category: "Mobile",
    description:
      "AI-powered to-do list with photo-based task verification, smart suggestions, and shared lists.",
    tags: ["iOS", "AI", "Productivity"],
    accent: "#8b5cf6",
    variant: 2,
    href: "https://apps.apple.com/pk/app/done-right-ai-powered-to-do/id6746511581",
    images: [
      "/images/portfolio/doneright/doneright-4.png",
      "/images/portfolio/doneright/doneright-3.png",
      "/images/portfolio/doneright/doneright-5.png",
    ],
  },
  {
    title: "StripColt",
    category: "Mobile",
    description:
      "Markets companion tracking crypto, stocks, and forex with live pulse alerts and AI insights.",
    tags: ["iOS", "Fintech", "Markets"],
    accent: "#f97316",
    variant: 3,
    href: "https://apps.apple.com/pk/app/stripcolt/id6769766030",
    images: [
      "/images/portfolio/stripcolt/stripcolt-4.png",
      "/images/portfolio/stripcolt/stripcolt-3.png",
      "/images/portfolio/stripcolt/stripcolt-5.png",
    ],
  },
  {
    title: "Staywo",
    category: "Mobile",
    description:
      "Vacation rental booking app — search stays on a live map, request to book, and manage trips and payments.",
    tags: ["iOS", "Travel", "Booking"],
    accent: "#4f7df9",
    variant: 1,
    images: ["/images/portfolio/staywo/staywo-scene.png"],
  },
  {
    title: "Plinki",
    category: "Mobile",
    description:
      "Travel discovery app — explore places around you on the map, browse curated categories, and save favorites.",
    tags: ["iOS", "Travel", "Maps"],
    accent: "#e0603a",
    variant: 2,
    images: ["/images/portfolio/plinki/plinki-scene.png"],
  },
];

const kindFor: Record<Category, VisualKind> = { Web: "web", AI: "ai", Mobile: "mobile" };

const tabs: { label: string; icon?: typeof Globe }[] = [
  { label: "All" },
  { label: "Web", icon: Globe },
  { label: "AI", icon: Bot },
  { label: "Mobile", icon: Smartphone },
];

const cardEase = [0.22, 1, 0.36, 1] as const;

function CardLink({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) return <>{children}</>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="hover"
      className="block h-full"
    >
      {children}
    </a>
  );
}

export default function PortfolioGrid() {
  const [activeTab, setActiveTab] = useState("All");

  const visible =
    activeTab === "All" ? projects : projects.filter((p) => p.category === activeTab);

  const selectTab = (label: string) => {
    setActiveTab(label);
  };

  return (
    <>
      {/* filter tabs */}
      <Reveal className="mt-12 flex justify-center">
        <div className="flex flex-wrap justify-center gap-1.5 rounded-full border border-white/10 bg-brand-black-soft/80 p-1.5 backdrop-blur">
          {tabs.map(({ label, icon: Icon }) => {
            const active = activeTab === label;
            const count =
              label === "All" ? projects.length : projects.filter((p) => p.category === label).length;
            return (
              <button
                key={label}
                onClick={() => selectTab(label)}
                data-cursor="hover"
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  active ? "text-brand-white" : "text-brand-gray hover:text-brand-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="portfolio-tab-pill"
                    className="absolute inset-0 rounded-full bg-brand-gradient shadow-[0_6px_20px_rgba(255,31,61,0.35)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {Icon && <Icon size={14} />}
                  {label}
                  <span
                    className={`rounded-full px-1.5 text-[10px] font-semibold ${
                      active ? "bg-white/20 text-white" : "bg-white/[0.06] text-brand-gray-muted"
                    }`}
                  >
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* project cards */}
      <motion.div layout className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
            <motion.div
              key={project.title}
              layout
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.5, delay: (index % 6) * 0.07, ease: cardEase },
              }}
              exit={{ opacity: 0, scale: 0.93, y: 16, transition: { duration: 0.25 } }}
              className="group relative [perspective:1200px]"
            >
              {/* hover halo behind the card */}
              <div
                aria-hidden
                className="absolute -inset-2 -z-10 rounded-3xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `radial-gradient(ellipse at 50% 30%, ${project.accent}2b, transparent 70%)` }}
              />
              <CardLink href={project.href}>
              <TiltCard
                max={7}
                className="h-full overflow-hidden rounded-2xl border border-white/10 bg-brand-black-soft transition-colors duration-300 hover:border-white/20"
              >
                <div className="relative overflow-hidden">
                  {project.custom === "pham-dashboard" ? (
                    <PhamDashboardVisual accent={project.accent} title={project.title} />
                  ) : project.custom === "medlab-dashboard" ? (
                    <MedLabDashboardVisual accent={project.accent} title={project.title} />
                  ) : project.custom === "chatbot" ? (
                    <ChatbotPrototypeVisual
                      variant={project.variant}
                      accent={project.accent}
                      title={project.title}
                    />
                  ) : project.custom === "lead-router" ? (
                    <LeadRouterVisual accent={project.accent} title={project.title} />
                  ) : project.custom === "wellness" ? (
                    <TahanaWellnessVisual
                      title={project.title}
                      url={project.frameUrl ?? "tahanawellness.com"}
                    />
                  ) : project.custom === "restaurant" ? (
                    <SaporeRestaurantVisual
                      title={project.title}
                      url={project.frameUrl ?? "saporeristorante.com"}
                    />
                  ) : project.custom === "order-alert" ? (
                    <OrderAlertVisual accent={project.accent} title={project.title} />
                  ) : project.custom === "onboarding" ? (
                    <ClientOnboardingVisual accent={project.accent} title={project.title} />
                  ) : project.custom === "website" ? (
                    <WebsiteMockupVisual
                      variant={project.variant}
                      accent={project.accent}
                      title={project.title}
                      url={project.frameUrl ?? `${project.title.toLowerCase().split(" ")[0]}.com`}
                    />
                  ) : project.images && project.category === "Web" ? (
                    <WebsiteShotVisual
                      image={project.images[0]}
                      accent={project.accent}
                      title={project.title}
                      url={project.frameUrl ?? `${project.title.toLowerCase().split(" ")[0]}.com`}
                    />
                  ) : project.images ? (
                    <AppScreensVisual
                      images={project.images}
                      accent={project.accent}
                      title={project.title}
                    />
                  ) : (
                    <ProjectVisual
                      kind={kindFor[project.category]}
                      variant={project.variant}
                      accent={project.accent}
                      title={project.title}
                    />
                  )}
                  {/* category chip */}
                  <span
                    className="absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur"
                    style={{
                      color: project.accent,
                      borderColor: `${project.accent}55`,
                      background: "rgba(5,5,7,0.65)",
                    }}
                  >
                    {project.category}
                  </span>
                </div>
                <div className="border-t border-white/[0.06] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold leading-snug text-brand-white">
                      {project.title}
                    </h3>
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-brand-gray opacity-0 transition-all duration-300 group-hover:border-transparent group-hover:opacity-100"
                      style={{ background: "transparent" }}
                    >
                      <ArrowUpRight
                        size={14}
                        className="transition-colors duration-300"
                        style={{ color: project.accent }}
                      />
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-brand-gray">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-brand-gray transition-colors duration-300 group-hover:border-white/[0.14] group-hover:text-brand-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
              </CardLink>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

    </>
  );
}
