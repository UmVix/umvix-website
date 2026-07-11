"use client";

import Image from "next/image";

/**
 * Presentation-style visual for real app projects: 3 marketing
 * screenshots side by side on an ambient gradient scene — everything
 * visible at once, no scrolling. Center panel leads, side panels tilt
 * slightly; hovering the card straightens and lifts them.
 */

type Props = {
  images: string[];
  accent: string;
  title: string;
};

const panelStyles = [
  "origin-bottom -rotate-[5deg] translate-y-[7%] group-hover:-rotate-[2deg] group-hover:translate-y-[4%]",
  "z-10 -translate-y-[2%] group-hover:-translate-y-[5%] group-hover:scale-[1.03]",
  "origin-bottom rotate-[5deg] translate-y-[7%] group-hover:rotate-[2deg] group-hover:translate-y-[4%]",
];

export default function AppScreensVisual({ images, accent, title }: Props) {
  // Single image = a pre-composed scene (phones already arranged in the
  // artwork) — show it full-bleed with a soft zoom on hover.
  if (images.length === 1) {
    return (
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#08050e]">
        <Image
          src={images[0]}
          alt={`${title} app screens`}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        {/* accent glow wash so it sits in the same scene language as the other cards */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 110%, ${accent}2e, transparent 60%)`,
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#08050e]">
      {/* ambient accent lighting */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}33, transparent 60%), radial-gradient(ellipse 70% 55% at 15% 100%, ${accent}22, transparent 55%), radial-gradient(ellipse 70% 55% at 85% 100%, ${accent}1c, transparent 55%)`,
        }}
      />
      {/* perspective grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 95% 85% at 50% 35%, black 25%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 95% 85% at 50% 35%, black 25%, transparent 78%)",
        }}
      />
      {/* floor glow under the screens */}
      <div
        aria-hidden
        className="absolute bottom-[-14%] left-1/2 h-[40%] w-[80%] -translate-x-1/2 rounded-[100%] blur-2xl"
        style={{ background: `radial-gradient(ellipse, ${accent}45, transparent 70%)` }}
      />

      {/* the three screens, side by side — full screenshots, no cropping, no scroll */}
      <div className="absolute inset-x-[5%] bottom-[-5%] flex items-end justify-center gap-[3.5%]">
        {images.slice(0, 3).map((src, i) => (
          <div
            key={src}
            className={`w-[29%] overflow-hidden rounded-xl ring-1 ring-white/20 transition-all duration-500 ease-out ${panelStyles[i]}`}
            style={{
              boxShadow: `0 26px 55px -16px rgba(0,0,0,0.85), 0 0 40px -10px ${accent}50`,
            }}
          >
            <Image
              src={src}
              alt={`${title} app screenshot ${i + 1}`}
              width={500}
              height={1080}
              sizes="(max-width: 640px) 30vw, 15vw"
              className="block h-auto w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
