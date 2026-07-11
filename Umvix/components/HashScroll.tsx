"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  cancelScrollAnimation,
  getHashId,
  pulseSectionHighlight,
  scrollToSectionWhenReady,
} from "@/lib/hashScroll";
import { useReducedMotion } from "@/lib/hooks";

export default function HashScroll() {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useEffect(() => {
    const id = getHashId(window.location.hash);
    if (!id) return;

    let active = true;

    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 160));
      if (!active) return;

      await scrollToSectionWhenReady(id, {
        reduced,
        onComplete: () => {
          if (active) pulseSectionHighlight(id);
        },
      });
    })();

    return () => {
      active = false;
      cancelScrollAnimation();
    };
  }, [pathname, reduced]);

  return null;
}
