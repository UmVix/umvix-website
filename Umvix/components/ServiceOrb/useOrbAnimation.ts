"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { ServiceItem } from "./types";
import { PILL_POSITIONS, PILL_TILTS } from "./types";

type UseOrbAnimationOptions = {
  services: ServiceItem[];
  autoCycleMs: number;
  reduced: boolean;
  isDesktop: boolean;
  panelRef: React.RefObject<HTMLDivElement | null>;
  orbRef: React.RefObject<HTMLDivElement | null>;
  sceneRef: React.RefObject<HTMLDivElement | null>;
  pillWrapperRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  pillFloatRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  lineRefs: React.MutableRefObject<(SVGLineElement | null)[]>;
  pulseRingRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onServiceChange?: (id: number) => void;
};

export function useOrbAnimation({
  services,
  autoCycleMs,
  reduced,
  isDesktop,
  panelRef,
  orbRef,
  sceneRef,
  pillWrapperRefs,
  pillFloatRefs,
  popoverRef,
  lineRefs,
  pulseRingRefs,
  onServiceChange,
}: UseOrbAnimationOptions) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [popoverIndex, setPopoverIndex] = useState<number | null>(null);

  const activeIndexRef = useRef(0);
  const pausedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const floatTweensRef = useRef<gsap.core.Tween[]>([]);
  const basePositionsRef = useRef(PILL_POSITIONS.map((p) => ({ ...p })));

  const active = services[activeIndex] ?? services[0];

  const clearIntervalCycle = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startIntervalCycle = useCallback(() => {
    clearIntervalCycle();
    if (reduced || !isDesktop || services.length < 2) return;

    intervalRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % services.length;
        activeIndexRef.current = next;
        onServiceChange?.(services[next]?.id ?? next);
        return next;
      });
    }, autoCycleMs);
  }, [
    autoCycleMs,
    clearIntervalCycle,
    isDesktop,
    onServiceChange,
    reduced,
    services,
  ]);

  const updateConnectorLine = useCallback(
    (index: number) => {
      const panel = panelRef.current;
      const scene = sceneRef.current;
      const line = lineRefs.current[index];
      const service = services[index];
      if (!panel || !scene || !line || !service) return;

      const panelRect = panel.getBoundingClientRect();
      const sceneRect = scene.getBoundingClientRect();
      const pill = pillWrapperRefs.current[index];
      if (!pill) return;

      const pillRect = pill.getBoundingClientRect();
      const orbCx = sceneRect.left + sceneRect.width / 2 - panelRect.left;
      const orbCy = sceneRect.top + sceneRect.height * 0.5 - panelRect.top;
      const pillCx = pillRect.left + pillRect.width / 2 - panelRect.left;
      const pillCy = pillRect.top + pillRect.height / 2 - panelRect.top;

      line.setAttribute("x1", String(orbCx));
      line.setAttribute("y1", String(orbCy));
      line.setAttribute("x2", String(pillCx));
      line.setAttribute("y2", String(pillCy));

      const length = Math.hypot(pillCx - orbCx, pillCy - orbCy);
      line.style.stroke = service.color;
      line.style.filter = `drop-shadow(0 0 2px ${service.color}44)`;

      if (reduced) {
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = "0";
        line.style.opacity = index === activeIndexRef.current ? "0.35" : "0";
        return;
      }

      line.style.strokeDasharray = `${length}`;
      line.style.strokeDashoffset = `${length}`;
      line.style.opacity = index === activeIndexRef.current ? "0.35" : "0";

      gsap.to(line, {
        strokeDashoffset: 0,
        duration: 0.65,
        ease: "power2.out",
      });
    },
    [lineRefs, panelRef, pillWrapperRefs, reduced, sceneRef, services]
  );

  const triggerPulseRings = useCallback(() => {
    if (reduced) return;
    pulseRingRefs.current.forEach((ring, i) => {
      if (!ring) return;
      gsap.killTweensOf(ring);
      gsap.set(ring, { scale: 1, opacity: 0.25 });
      gsap.to(ring, {
        scale: 1.8,
        opacity: 0,
        duration: 1.5,
        delay: i * 0.5,
        ease: "power2.out",
      });
    });
  }, [pulseRingRefs, reduced]);

  const transitionOrbColor = useCallback(
    (service: ServiceItem) => {
      const orb = orbRef.current;
      if (!orb) return;

      if (reduced) {
        gsap.set(orb, {
          "--orb-color": service.color,
          "--orb-rgb": service.rgb,
          "--orb-shadow": service.shadow,
        });
        return;
      }

      gsap.to(orb, {
        "--orb-color": service.color,
        "--orb-rgb": service.rgb,
        "--orb-shadow": service.shadow,
        duration: 0.8,
        ease: "power2.inOut",
      });
    },
    [orbRef, reduced]
  );

  const showPopover = useCallback(
    (index: number) => {
      if (reduced) return;
      setPopoverIndex(index);

      if (popoverTimerRef.current) clearTimeout(popoverTimerRef.current);
      popoverTimerRef.current = setTimeout(() => {
        setPopoverIndex(null);
      }, 4000);
    },
    [reduced]
  );

  // Animate popover when it mounts
  useEffect(() => {
    const popover = popoverRef.current;
    if (popoverIndex === null || !popover || reduced) return;

    gsap.killTweensOf(popover);
    gsap.fromTo(
      popover,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  }, [popoverIndex, popoverRef, reduced]);

  const setActive = useCallback(
    (index: number, fromClick = false) => {
      activeIndexRef.current = index;
      setActiveIndex(index);
      const service = services[index];
      if (service) {
        onServiceChange?.(service.id);
        transitionOrbColor(service);
        triggerPulseRings();
      }
      if (fromClick) showPopover(index);
      startIntervalCycle();
    },
    [
      onServiceChange,
      services,
      showPopover,
      startIntervalCycle,
      transitionOrbColor,
      triggerPulseRings,
    ]
  );

  // Burst + float on mount (desktop)
  useEffect(() => {
    if (!isDesktop) return;

    floatTweensRef.current.forEach((t) => t.kill());
    floatTweensRef.current = [];

    const wrappers = pillWrapperRefs.current.filter(Boolean) as HTMLDivElement[];
    const floats = pillFloatRefs.current.filter(Boolean) as HTMLDivElement[];

    if (reduced) {
      wrappers.forEach((wrapper, i) => {
        const pos = PILL_POSITIONS[i];
        if (!pos) return;
        gsap.set(wrapper, {
          x: pos.x,
          y: pos.y,
          xPercent: -50,
          yPercent: -50,
          rotation: PILL_TILTS[i] ?? 0,
          scale: 1,
          opacity: 1,
        });
      });
      return;
    }

    gsap.set(wrappers, {
      x: 0,
      y: 0,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 0,
    });

    wrappers.forEach((wrapper, i) => {
      const pos = PILL_POSITIONS[i];
      if (!pos) return;
      gsap.to(wrapper, {
        x: pos.x,
        y: pos.y,
        rotation: PILL_TILTS[i] ?? 0,
        scale: 1,
        opacity: 1,
        duration: 0.7,
        delay: 0.5 + i * 0.15,
        ease: "back.out(1.4)",
      });
    });

    floats.forEach((floatEl, i) => {
      const tween = gsap.to(floatEl, {
        y: 10,
        duration: 2 + i * 0.4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 1.8 + i * 0.6,
      });
      floatTweensRef.current.push(tween);
    });

    return () => {
      floatTweensRef.current.forEach((t) => t.kill());
    };
  }, [isDesktop, pillFloatRefs, pillWrapperRefs, reduced]);

  // Active index side effects
  useEffect(() => {
    activeIndexRef.current = activeIndex;
    const service = services[activeIndex];
    if (service) transitionOrbColor(service);

    lineRefs.current.forEach((line, i) => {
      if (!line) return;
      line.style.opacity = i === activeIndex ? "0.35" : "0";
    });

    updateConnectorLine(activeIndex);
    triggerPulseRings();
  }, [
    activeIndex,
    services,
    transitionOrbColor,
    updateConnectorLine,
    triggerPulseRings,
    lineRefs,
  ]);

  // Auto-cycle start (desktop)
  useEffect(() => {
    if (!isDesktop) return;
    startIntervalCycle();
    return clearIntervalCycle;
  }, [isDesktop, startIntervalCycle, clearIntervalCycle]);

  // Mobile auto-cycle (no GSAP). activeIndex is a dependency so any change —
  // including a user tap — restarts the interval with a full period.
  useEffect(() => {
    if (isDesktop || reduced || services.length < 2) return;

    const id = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % services.length;
        activeIndexRef.current = next;
        onServiceChange?.(services[next]?.id ?? next);
        return next;
      });
    }, autoCycleMs);

    return () => clearInterval(id);
  }, [activeIndex, autoCycleMs, isDesktop, onServiceChange, reduced, services]);

  // Resize connector
  useEffect(() => {
    if (!isDesktop) return;
    const panel = panelRef.current;
    if (!panel) return;

    const onResize = () => updateConnectorLine(activeIndexRef.current);
    const observer = new ResizeObserver(onResize);
    observer.observe(panel);
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [isDesktop, panelRef, updateConnectorLine]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearIntervalCycle();
      if (popoverTimerRef.current) clearTimeout(popoverTimerRef.current);
      floatTweensRef.current.forEach((t) => t.kill());
      pillWrapperRefs.current.forEach((el) => el && gsap.killTweensOf(el));
      if (orbRef.current) gsap.killTweensOf(orbRef.current);
      if (popoverRef.current) gsap.killTweensOf(popoverRef.current);
    };
  }, [
    clearIntervalCycle,
    orbRef,
    pillWrapperRefs,
    popoverRef,
  ]);

  const handlePillClick = (index: number) => {
    setActive(index, true);
  };

  const handlePillKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePillClick(index);
    }
  };

  const handlePillMouseEnter = () => {
    pausedRef.current = true;
  };

  const handlePillMouseLeave = () => {
    pausedRef.current = false;
  };

  const handlePanelMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !isDesktop) return;

    const panel = panelRef.current;
    if (!panel) return;

    const panelRect = panel.getBoundingClientRect();
    const mx = e.clientX - panelRect.left;
    const my = e.clientY - panelRect.top;

    pillWrapperRefs.current.forEach((wrapper, i) => {
      if (!wrapper) return;
      const pos = basePositionsRef.current[i];
      if (!pos) return;

      const rect = wrapper.getBoundingClientRect();
      const px = rect.left + rect.width / 2 - panelRect.left;
      const py = rect.top + rect.height / 2 - panelRect.top;
      const dx = mx - px;
      const dy = my - py;
      const dist = Math.hypot(dx, dy);

      if (dist < 100) {
        gsap.to(wrapper, {
          x: pos.x + dx * 0.15,
          y: pos.y + dy * 0.15,
          rotation: PILL_TILTS[i] ?? 0,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(wrapper, {
          x: pos.x,
          y: pos.y,
          rotation: PILL_TILTS[i] ?? 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.6)",
          overwrite: "auto",
        });
      }
    });
  };

  const handlePanelMouseLeave = () => {
    pausedRef.current = false;
    if (reduced || !isDesktop) return;

    pillWrapperRefs.current.forEach((wrapper, i) => {
      if (!wrapper) return;
      const pos = basePositionsRef.current[i];
      if (!pos) return;
      gsap.to(wrapper, {
        x: pos.x,
        y: pos.y,
        rotation: PILL_TILTS[i] ?? 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.6)",
      });
    });
  };

  return {
    activeIndex,
    active,
    popoverIndex,
    handlePillClick,
    handlePillKeyDown,
    handlePillMouseEnter,
    handlePillMouseLeave,
    handlePanelMouseMove,
    handlePanelMouseLeave,
    setActive,
  };
}
