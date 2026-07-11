"use client";

import { ReactNode } from "react";
import AccentProvider from "@/components/providers/AccentProvider";
import AmbientBackground from "@/components/effects/AmbientBackground";
import NoiseOverlay from "@/components/effects/NoiseOverlay";
import CustomCursor from "@/components/effects/CustomCursor";
import LoadingScreen from "@/components/effects/LoadingScreen";
import ScrollProgress from "@/components/effects/ScrollProgress";
import EasterEgg from "@/components/effects/EasterEgg";
import SentimentWidget from "@/components/effects/SentimentWidget";
import SoundToggle from "@/components/effects/SoundToggle";
import ChatWidget from "@/components/ai/ChatWidget";
import HashScroll from "@/components/HashScroll";

/**
 * Bundles all global client-side chrome (providers, overlays, floating widgets)
 * so the root layout can stay a server component.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <AccentProvider>
      <HashScroll />
      <AmbientBackground />
      <LoadingScreen />
      <NoiseOverlay />
      <ScrollProgress />
      <CustomCursor />
      <EasterEgg />
      
      {children}

      {/* Floating Controls — Left Side Mid. Hidden below lg: on mobile the
          content column starts at the same left offset, so the fixed buttons
          would sit on top of headings, buttons, and footer links. */}
      <div className="fixed left-6 top-1/2 z-[110] hidden -translate-y-1/2 flex-col gap-4 lg:flex">
        <SentimentWidget />
        <SoundToggle />
      </div>

      <ChatWidget />
    </AccentProvider>
  );
}
