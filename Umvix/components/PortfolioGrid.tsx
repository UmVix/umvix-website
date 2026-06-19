"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Badge from "@/components/Badge";
import TiltCard from "@/components/motion/TiltCard";
import Reveal from "@/components/motion/Reveal";

const projects = [
  {
    title: "EcoTrack Dashboard",
    category: "Dashboards",
    description: "A real-time sustainability monitoring platform for enterprise manufacturing.",
    image: "/api/placeholder/600/400",
    tags: ["Next.js", "Tailwind", "D3.js"],
  },
  {
    title: "SwiftPay Mobile",
    category: "Mobile",
    description: "A secure, lightning-fast fintech application for cross-border payments.",
    image: "/api/placeholder/600/400",
    tags: ["React Native", "Node.js", "AWS"],
  },
  {
    title: "Nexus AI Chatbot",
    category: "AI",
    description: "Intelligent customer support agent with multi-language support and CRM sync.",
    image: "/api/placeholder/600/400",
    tags: ["OpenAI", "Python", "LangChain"],
  },
  {
    title: "Global Logistics Portal",
    category: "Web",
    description: "Comprehensive supply chain management system for international shipping.",
    image: "/api/placeholder/600/400",
    tags: ["React", "PostgreSQL", "Docker"],
  },
  {
    title: "AutoFlow Workflows",
    category: "AI",
    description: "Custom AI automation system reducing manual data entry by 90%.",
    image: "/api/placeholder/600/400",
    tags: ["Python", "Make.com", "GPT-4"],
  },
  {
    title: "HealthConnect App",
    category: "Mobile",
    description: "Telemedicine platform connecting patients with specialists in real-time.",
    image: "/api/placeholder/600/400",
    tags: ["Flutter", "Firebase", "WebRTC"],
  },
];

const categories = ["All", "Web", "Mobile", "AI", "Dashboards"];

export default function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <>
      <Reveal stagger className="mt-12 flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            data-cursor="hover"
            className={
              activeCategory === category
                ? "btn-primary rounded-full px-6 py-2 text-sm font-medium"
                : "rounded-full bg-brand-black-soft px-6 py-2 text-sm font-medium text-brand-gray transition-colors hover:bg-brand-black-soft/80 hover:text-brand-white"
            }
          >
            {category}
          </button>
        ))}
      </Reveal>

      <Reveal y={32} delay={0.05}>
        <motion.div layout className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.title}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3 }}
              className="group [perspective:1000px]"
            >
              <TiltCard
                max={8}
                className="h-full overflow-hidden rounded-xl border border-brand-red/10 bg-brand-black-soft transition-colors duration-300 hover:border-brand-red/40"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Badge>{project.category}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-brand-white">{project.title}</h3>
                  <p className="mt-2 text-brand-gray">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs font-medium text-brand-red">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
        </motion.div>
      </Reveal>
    </>
  );
}
