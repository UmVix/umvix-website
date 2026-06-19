"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useAccent } from "@/components/providers/AccentProvider";

export default function SoundToggle() {
  const { soundEnabled, toggleSound, playClick } = useAccent();

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.1, x: 4 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        toggleSound();
        if (!soundEnabled) setTimeout(playClick, 0);
      }}
      data-cursor="hover"
      aria-label={soundEnabled ? "Mute UI sounds" : "Enable UI sounds"}
      aria-pressed={soundEnabled}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-red/30 bg-brand-black-soft text-brand-gray shadow-lg transition-colors hover:text-brand-white"
    >
      {soundEnabled ? (
        <Volume2 size={18} className="text-brand-red" />
      ) : (
        <VolumeX size={18} />
      )}
    </motion.button>
  );
}
