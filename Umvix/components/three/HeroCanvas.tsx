"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-40 w-40 animate-pulse rounded-full border border-brand-red/30 bg-brand-red/5 blur-md" />
    </div>
  ),
});

export default function HeroCanvas({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <HeroScene />
    </div>
  );
}
