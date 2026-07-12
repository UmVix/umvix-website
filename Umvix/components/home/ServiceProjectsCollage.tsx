"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import WebsiteShotVisual from "@/components/portfolio/WebsiteShotVisual";
import PhamDashboardVisual from "@/components/portfolio/PhamDashboardVisual";
import MedLabDashboardVisual from "@/components/portfolio/MedLabDashboardVisual";
import WebsiteMockupVisual from "@/components/portfolio/WebsiteMockupVisual";
import TahanaWellnessVisual from "@/components/portfolio/TahanaWellnessVisual";
import SaporeRestaurantVisual from "@/components/portfolio/SaporeRestaurantVisual";
import ChatbotPrototypeVisual from "@/components/portfolio/ChatbotPrototypeVisual";
import ClientOnboardingVisual from "@/components/portfolio/ClientOnboardingVisual";
import OrderAlertVisual from "@/components/portfolio/OrderAlertVisual";
import LeadRouterVisual from "@/components/portfolio/LeadRouterVisual";
import {
  DocuExtractVisual,
  InvoiceSyncVisual,
  ReportDigestVisual,
  VoiceAgentVisual,
} from "@/components/home/ExtraPrototypeVisuals";

/**
 * Fills the Smart Solutions preview box with the real portfolio work:
 * a staggered collage of project visuals — mobile shows the actual app
 * screenshots, web shows the portfolio site/dashboard cards at mini
 * scale. Purely decorative (pointer-events disabled).
 */

type Props = {
  kind: "web" | "mobile" | "ai" | "automation";
};

/**
 * The portfolio visuals are designed with fixed-px details for the ~390px-wide
 * portfolio grid cards. Lay them out at that exact width and scale to fit the
 * mini card, so their content density stays identical at every screen size
 * (rendering them wider leaves their fixed-px content floating in empty boxes).
 */
const VISUAL_DESIGN_WIDTH = 390;

/** Renders a portfolio card at its design width, scaled to fit the mini card. */
function MiniCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / VISUAL_DESIGN_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full shrink-0 overflow-hidden rounded-lg border border-white/10"
      style={{ aspectRatio: "16 / 11" }}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: VISUAL_DESIGN_WIDTH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Connector wires "plugging" the collage cards into each other. */
function Wires({ cols }: { cols: 2 | 3 }) {
  const gutters = cols === 2 ? [50] : [33.5, 66.5];
  const rows = [16, 44, 72];
  return (
    <div aria-hidden className="absolute inset-0 z-10">
      {gutters.map((g, gi) =>
        rows.map((y, yi) => (
          <div
            key={`${g}-${y}`}
            className="absolute flex items-center"
            style={{
              left: `calc(${g}% - 7%)`,
              width: "14%",
              top: `${y + (gi % 2 === 0 ? yi * 2 : -yi * 2)}%`,
              transform: "translateY(-50%)",
            }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red"
              style={{
                boxShadow: "0 0 8px rgba(255,31,61,0.9)",
                animation: "soft-pulse 2s ease-in-out infinite",
                animationDelay: `${(gi * 3 + yi) * 0.3}s`,
              }}
            />
            <span className="h-0 flex-1 border-t border-dashed border-brand-red/60" />
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red"
              style={{
                boxShadow: "0 0 8px rgba(255,31,61,0.9)",
                animation: "soft-pulse 2s ease-in-out infinite",
                animationDelay: `${(gi * 3 + yi) * 0.3 + 0.5}s`,
              }}
            />
          </div>
        ))
      )}
    </div>
  );
}

function Shot({ src, w, h }: { src: string; w: number; h: number }) {
  return (
    <Image
      src={src}
      alt=""
      width={w}
      height={h}
      sizes="(max-width: 1024px) 30vw, 12vw"
      className="block h-auto w-full shrink-0 rounded-lg border border-white/10"
    />
  );
}

export default function ServiceProjectsCollage({ kind }: Props) {
  if (kind === "web") {
    return (
      <div aria-hidden className="pointer-events-none relative w-full overflow-hidden p-2.5 sm:absolute sm:inset-0">
        <Wires cols={2} />
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex flex-col gap-2.5">
            <MiniCard>
              <WebsiteShotVisual
                image="/images/portfolio/mylearningmindset/mlm-dashboard.png"
                accent="#7c5cf0"
                title="My Learning Mindset"
                url="mylearningmindset.com"
              />
            </MiniCard>
            <MiniCard>
              <MedLabDashboardVisual accent="#b06a3e" title="MedLab Pro" />
            </MiniCard>
            <MiniCard>
              <TahanaWellnessVisual title="Tahana Wellness" url="tahanawellness.com" />
            </MiniCard>
          </div>
          <div className="-mt-8 flex flex-col gap-2.5">
            <MiniCard>
              <PhamDashboardVisual accent="#1e9e66" title="PhamEnterprises Hub" />
            </MiniCard>
            <MiniCard>
              <WebsiteMockupVisual variant={0} accent="#5c7cfa" title="Vertex SaaS" url="vertex.io" />
            </MiniCard>
            <MiniCard>
              <SaporeRestaurantVisual title="Sapore Ristorante" url="saporeristorante.com" />
            </MiniCard>
          </div>
        </div>
      </div>
    );
  }

  if (kind === "ai") {
    return (
      <div aria-hidden className="pointer-events-none relative w-full overflow-hidden p-2.5 sm:absolute sm:inset-0">
        <Wires cols={2} />
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex flex-col gap-2.5">
            <MiniCard>
              <ChatbotPrototypeVisual variant={0} accent="#22d3ee" title="Nexus Support Bot" />
            </MiniCard>
            <MiniCard>
              <ChatbotPrototypeVisual variant={2} accent="#A7834E" title="Tahana Booking Bot" />
            </MiniCard>
            <MiniCard>
              <VoiceAgentVisual />
            </MiniCard>
          </div>
          <div className="-mt-8 flex flex-col gap-2.5">
            <MiniCard>
              <ChatbotPrototypeVisual variant={1} accent="#a78bfa" title="Aria AI Copilot" />
            </MiniCard>
            <MiniCard>
              <LeadRouterVisual accent="#38bdf8" title="Lead Router" />
            </MiniCard>
            <MiniCard>
              <DocuExtractVisual />
            </MiniCard>
          </div>
        </div>
      </div>
    );
  }

  if (kind === "automation") {
    return (
      <div aria-hidden className="pointer-events-none relative w-full overflow-hidden p-2.5 sm:absolute sm:inset-0">
        <Wires cols={2} />
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex flex-col gap-2.5">
            <MiniCard>
              <ClientOnboardingVisual accent="#34d399" title="Client Onboarding" />
            </MiniCard>
            <MiniCard>
              <InvoiceSyncVisual />
            </MiniCard>
            <MiniCard>
              <LeadRouterVisual accent="#38bdf8" title="Lead Router" />
            </MiniCard>
          </div>
          <div className="-mt-8 flex flex-col gap-2.5">
            <MiniCard>
              <OrderAlertVisual accent="#fbbf24" title="Order Alerts" />
            </MiniCard>
            <MiniCard>
              <ReportDigestVisual />
            </MiniCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none relative w-full overflow-hidden p-2.5 sm:absolute sm:inset-0">
      <Wires cols={3} />
        <div className="grid grid-cols-3 gap-2.5">
        <div className="flex flex-col gap-2.5">
          <Shot src="/images/portfolio/evolve/evolve-1.png" w={361} h={781} />
          <Shot src="/images/portfolio/doneright/doneright-3.png" w={377} h={796} />
        </div>
        <div className="-mt-10 flex flex-col gap-2.5">
          <Shot src="/images/portfolio/staywo/staywo-scene.png" w={1850} h={1040} />
          <Shot src="/images/portfolio/evolve/evolve-3.png" w={362} h={781} />
        </div>
        <div className="-mt-4 flex flex-col gap-2.5">
          <Shot src="/images/portfolio/overherd/overherd-2.png" w={498} h={1083} />
          <Shot src="/images/portfolio/plinki/plinki-scene.png" w={1446} h={986} />
        </div>
      </div>
    </div>
  );
}
