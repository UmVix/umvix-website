"use client";

import { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  speed?: number;
  className?: string;
};

export default function Marquee({ children, speed = 30, className = "" }: MarqueeProps) {
  return (
    <div className={`group relative flex overflow-hidden ${className}`}>
      <div
        className="flex shrink-0 items-center gap-12 pr-12 will-change-transform animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>
      <div
        aria-hidden
        className="flex shrink-0 items-center gap-12 pr-12 will-change-transform animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>
    </div>
  );
}
