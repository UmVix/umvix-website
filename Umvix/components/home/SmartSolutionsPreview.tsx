"use client";

import type { IllustrationType } from "@/components/home/ServiceIllustration";
import ServiceIllustration from "@/components/home/ServiceIllustration";

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

          {service.type === "ai" ? (
            <AiWorkflowMockup />
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

function AiWorkflowMockup() {
  return (
    <div className="relative flex h-full min-h-[11rem] w-full items-center justify-center p-4 sm:p-5 lg:min-h-[14rem]">
      <svg
        viewBox="0 0 520 280"
        className="h-full w-full max-h-[min(16rem,100%)]"
        fill="none"
        aria-hidden
      >
        <path
          d="M130 140 C 180 80, 220 80, 270 100"
          stroke="rgba(234,179,8,0.75)"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <path
          d="M270 100 C 320 120, 360 160, 390 200"
          stroke="rgba(59,130,246,0.75)"
          strokeWidth="2"
        />
        <rect
          x="48"
          y="108"
          width="132"
          height="64"
          rx="10"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.2)"
        />
        <text
          x="64"
          y="146"
          fill="rgba(255,255,255,0.75)"
          fontSize="13"
          fontFamily="system-ui, sans-serif"
        >
          Schedule Trigger
        </text>
        <rect
          x="220"
          y="72"
          width="118"
          height="56"
          rx="10"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.2)"
        />
        <text
          x="236"
          y="106"
          fill="rgba(255,255,255,0.75)"
          fontSize="13"
          fontFamily="system-ui, sans-serif"
        >
          Conditional
        </text>
        <rect
          x="350"
          y="168"
          width="118"
          height="56"
          rx="10"
          fill="rgba(255,31,61,0.08)"
          stroke="rgba(255,31,61,0.45)"
        />
        <text
          x="378"
          y="202"
          fill="rgba(255,255,255,0.85)"
          fontSize="13"
          fontFamily="system-ui, sans-serif"
        >
          Start
        </text>
        <circle cx="270" cy="100" r="5" fill="rgba(59,130,246,0.9)" />
        <circle cx="130" cy="140" r="4" fill="rgba(234,179,8,0.9)" />
      </svg>

      <div className="absolute bottom-4 left-4 flex gap-2">
        {["+", "−", "⌁"].map((label) => (
          <span
            key={label}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-xs text-brand-gray"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
