"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

type ScrollOptions = {
  reduced?: boolean;
  onComplete?: () => void;
};

let activeScrollTween: gsap.core.Tween | null = null;

export function getHashId(hash: string) {
  return hash.startsWith("#") ? hash.slice(1) : hash;
}

function getNavOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--nav-height"
  );
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 68;
}

function getTargetY(id: string) {
  const el = document.getElementById(id);
  if (!el) return null;
  return el.getBoundingClientRect().top + window.scrollY - getNavOffset();
}

function getScrollDuration(distance: number) {
  return Math.min(2.8, Math.max(1, distance / 620));
}

export function cancelScrollAnimation() {
  if (activeScrollTween) {
    activeScrollTween.kill();
    activeScrollTween = null;
  }
}

export function scrollToSection(
  id: string,
  options: ScrollOptions = {}
): Promise<void> {
  const targetY = getTargetY(id);
  if (targetY === null) return Promise.resolve();

  if (options.reduced) {
    window.scrollTo(0, targetY);
    options.onComplete?.();
    return Promise.resolve();
  }

  cancelScrollAnimation();

  const distance = Math.abs(targetY - window.scrollY);

  return new Promise((resolve) => {
    activeScrollTween = gsap.to(window, {
      scrollTo: { y: targetY, autoKill: true },
      duration: getScrollDuration(distance),
      ease: "power4.inOut",
      onComplete: () => {
        activeScrollTween = null;
        options.onComplete?.();
        resolve();
      },
    });
  });
}

export async function waitForSection(id: string, maxMs = 3500) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const el = document.getElementById(id);
    if (el && el.offsetHeight > 0) return el;
    await new Promise((resolve) => setTimeout(resolve, 60));
  }
  return document.getElementById(id);
}

export async function scrollToSectionWhenReady(
  id: string,
  options: ScrollOptions = {}
) {
  await waitForSection(id);
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
  await scrollToSection(id, options);

  // SmartSolutionsSection swaps layout after mount — nudge once more if needed.
  if (id === "smart-solutions" && !options.reduced) {
    await new Promise((resolve) => setTimeout(resolve, 420));
    const correctedY = getTargetY(id);
    if (correctedY !== null && Math.abs(correctedY - window.scrollY) > 48) {
      await scrollToSection(id, options);
    }
  }
}

export function pulseSectionHighlight(id: string) {
  const heading = document.getElementById(`${id}-heading`);
  if (!heading) return;

  heading.classList.remove("section-scroll-highlight");
  // Force reflow so the animation can replay on repeat clicks.
  void heading.offsetWidth;
  heading.classList.add("section-scroll-highlight");
}
