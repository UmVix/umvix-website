"use client";

import type { IllustrationType } from "@/components/home/ServiceIllustration";
import ServiceIllustration from "@/components/home/ServiceIllustration";
import ServiceProjectsCollage from "@/components/home/ServiceProjectsCollage";

export type SmartSolutionService = {
  id: string;
  title: string;
  description: string;
  previewTitle: string;
  previewSubtitle: string;
  type: IllustrationType;
};

export const SMART_SOLUTIONS_SERVICES: SmartSolutionService[] = [
  {
    id: "ai",
    title: "Agentic AI",
    description:
      "Build intelligent systems that learn, adapt, and grow with your business.",
    previewTitle: "Set Up Your Chatbot",
    previewSubtitle:
      "Train your chatbot with data, use our ready-to-use templates or start from scratch.",
    type: "ai",
  },
  {
    id: "web",
    title: "Web Development",
    description:
      "Scalable web platforms engineered for performance, security, and long-term growth.",
    previewTitle: "Launch Your Platform",
    previewSubtitle:
      "From architecture to deployment — we build web products that scale with demand.",
    type: "web",
  },
  {
    id: "mobile",
    title: "Mobile Development",
    description:
      "Native and cross-platform apps for iOS and Android that users love to open.",
    previewTitle: "Ship Mobile Experiences",
    previewSubtitle:
      "Design, build, and iterate mobile apps with polished UX and reliable performance.",
    type: "mobile",
  },
  {
    id: "automation",
    title: "Automation",
    description:
      "Workflow pipelines that eliminate manual tasks and keep your operations moving.",
    previewTitle: "Automate Your Workflows",
    previewSubtitle:
      "Connect tools, trigger actions, and let intelligent automation handle the rest.",
    type: "automation",
  },
];

type SmartSolutionsPreviewProps = {
  service: SmartSolutionService;
};

export default function SmartSolutionsPreview({
  service,
}: SmartSolutionsPreviewProps) {
  return (
    <div className="flex h-full min-h-[18rem] flex-col lg:min-h-[26rem]">
      <div className="border-b border-white/10 px-5 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-red/15 text-sm font-bold text-brand-red">
            U
          </span>
          <span className="text-sm font-semibold tracking-wide text-brand-white">
            UMVIX
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-7">
        <h3 className="text-lg font-semibold text-brand-white sm:text-xl">
          {service.previewTitle}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-gray">
          {service.previewSubtitle}
        </p>

        <div className="relative mt-5 flex min-h-[11rem] flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/40 sm:min-h-[12rem] lg:min-h-[14rem]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {service.type === "web" ||
          service.type === "mobile" ||
          service.type === "ai" ||
          service.type === "automation" ? (
            <ServiceProjectsCollage kind={service.type} />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-5">
              <div className="h-full w-full max-w-md">
                <ServiceIllustration type={service.type} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
