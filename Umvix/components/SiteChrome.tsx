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

/**
 * Bundles all global client-side chrome (providers, overlays, floating widgets)
 * so the root layout can stay a server component.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <AccentProvider>
      <AmbientBackground />
      <LoadingScreen />
      <NoiseOverlay />
      <ScrollProgress />
      <CustomCursor />
      <EasterEgg />
      
      {children}

      {/* Floating Controls — Left Side Mid */}
      <div className="fixed left-6 top-1/2 z-[110] flex -translate-y-1/2 flex-col gap-4">
        <SentimentWidget />
        <SoundToggle />
      </div>

      <ChatWidget />
    </AccentProvider>
  );
}
