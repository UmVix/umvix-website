"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";
import styles from "./ServiceOrb.module.css";
import type { ServiceItem } from "./types";
import { DEFAULT_SERVICES } from "./types";
import { useOrbAnimation } from "./useOrbAnimation";
import { useParticleCanvas } from "./useParticleCanvas";

export type ServiceOrbProps = {
  services?: ServiceItem[];
  autoCycleMs?: number;
  onServiceChange?: (id: number) => void;
  className?: string;
};

export default function ServiceOrb({
  services = DEFAULT_SERVICES,
  autoCycleMs = 2800,
  onServiceChange,
  className = "",
}: ServiceOrbProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  const pillWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pillFloatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const pulseRingRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mobileSceneRef = useRef<HTMLDivElement>(null);
  const mobileOrbRef = useRef<HTMLDivElement>(null);
  const mobilePillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileLineRefs = useRef<(SVGLineElement | null)[]>([]);

  const reduced = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const {
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
  } = useOrbAnimation({
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
  });

  useParticleCanvas(canvasRef, panelRef, mouseRef, {
    activeColor: active.color,
    reduced,
    enabled: isDesktop,
  });

  // Mobile connector wires: measured from the real layout (orb center →
  // top-center of each pill), so they stay attached at any viewport width.
  useEffect(() => {
    if (isDesktop) return;
    const scene = mobileSceneRef.current;
    const orb = mobileOrbRef.current;
    if (!scene || !orb) return;

    const measure = () => {
      const sceneRect = scene.getBoundingClientRect();
      if (!sceneRect.width) return;
      const orbRect = orb.getBoundingClientRect();
      const orbCx = orbRect.left + orbRect.width / 2 - sceneRect.left;
      const orbCy = orbRect.top + orbRect.height / 2 - sceneRect.top;

      mobileLineRefs.current.forEach((line, i) => {
        const pill = mobilePillRefs.current[i];
        if (!line || !pill) return;
        const rect = pill.getBoundingClientRect();
        line.setAttribute("x1", String(rect.left + rect.width / 2 - sceneRect.left));
        line.setAttribute("y1", String(rect.top + 1 - sceneRect.top));
        line.setAttribute("x2", String(orbCx));
        line.setAttribute("y2", String(orbCy));
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(scene);
    window.addEventListener("resize", measure);
    // Pills slide in with a translate animation — re-measure once they settle.
    const pills = mobilePillRefs.current.filter(Boolean) as HTMLButtonElement[];
    pills.forEach((pill) => pill.addEventListener("animationend", measure));

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      pills.forEach((pill) => pill.removeEventListener("animationend", measure));
    };
  }, [isDesktop, services.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
    handlePanelMouseMove(e);
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
    handlePanelMouseLeave();
  };

  const popoverService =
    popoverIndex !== null ? services[popoverIndex] ?? active : null;

  const ambientStyle = {
    "--ambient-rgb": active.rgb,
  } as React.CSSProperties;

  return (
    <div className={className}>
      {/* Desktop orb system */}
      <div
        ref={panelRef}
        className={styles.panel}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.ambientPrimary} style={ambientStyle} aria-hidden />
        <div className={styles.ambientSecondary} style={ambientStyle} aria-hidden />

        <canvas ref={canvasRef} className={styles.canvas} aria-hidden />

        <svg className={styles.connectors} aria-hidden>
          {services.map((service, i) => (
            <line
              key={service.id}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className={styles.connectorLine}
              x1="0"
              y1="0"
              x2="0"
              y2="0"
              stroke={service.color}
            />
          ))}
        </svg>

        <div ref={sceneRef} className={styles.scene}>
          <div className={styles.pillLayer}>
            {services.map((service, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={service.id}
                  ref={(el) => {
                    pillWrapperRefs.current[i] = el;
                  }}
                  className={styles.pillWrapper}
                >
                  <div
                    ref={(el) => {
                      pillFloatRefs.current[i] = el;
                    }}
                    className={styles.pillFloat}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      data-cursor="hover"
                      data-id={service.id}
                      className={`${styles.servicePill} ${isActive ? styles.servicePillActive : ""}`}
                      style={
                        isActive
                          ? ({ "--active-rgb": service.rgb } as React.CSSProperties)
                          : undefined
                      }
                      onClick={() => handlePillClick(i)}
                      onKeyDown={(e) => handlePillKeyDown(e, i)}
                      onMouseEnter={handlePillMouseEnter}
                      onMouseLeave={handlePillMouseLeave}
                    >
                      <span className={styles.pillIcon}>{service.icon}</span>
                      <div>
                        <p className={styles.pillLabel}>{service.label}</p>
                        <p className={styles.pillSub}>{service.sub}</p>
                      </div>
                      <span
                        className={`${styles.pillIndicator} ${isActive ? styles.pillIndicatorActive : ""}`}
                        style={{ backgroundColor: service.color, color: service.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.orbAnchor}>
            <div ref={orbRef} className={styles.orb}>
              <div className={styles.orbCore} />
              <div className={styles.orbHighlight} aria-hidden />
              <div className={styles.shimmerRing} aria-hidden />
              <div className={styles.orbitRing1} aria-hidden />
              <div className={styles.orbitRing2} aria-hidden />
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  ref={(el) => {
                    pulseRingRefs.current[i] = el;
                  }}
                  className={styles.pulseRing}
                  aria-hidden
                />
              ))}
            </div>
          </div>

          {popoverService && (
            <div
              ref={popoverRef}
              className={styles.popover}
              style={{ borderLeft: `3px solid ${popoverService.color}` }}
            >
              <p className={styles.popoverTitle}>{popoverService.label}</p>
              <p className={styles.popoverDesc}>{popoverService.sub}</p>
              <Link
                href="/services"
                className={styles.popoverLink}
                style={{ color: popoverService.color }}
                data-cursor="hover"
              >
                → Learn More
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: fluid holo scene — a centered orb with a cycle-progress arc,
          a 2x2 service grid below it, and connector wires measured from the
          real layout so nothing depends on a fixed viewport size. */}
      <div className={styles.mobilePanel}>
        <div ref={mobileSceneRef} className={styles.mobileScene}>
          <div className={styles.mobileAmbient} style={ambientStyle} aria-hidden />

          {/* connector wires from each pill up to the orb */}
          <svg className={styles.mobileConnectors} aria-hidden>
            {services.map((service, i) => (
              <line
                key={service.id}
                ref={(el) => {
                  mobileLineRefs.current[i] = el;
                }}
                className={`${styles.mobileConnectorLine} ${
                  i === activeIndex ? styles.mobileConnectorLineActive : ""
                }`}
                x1="0"
                y1="0"
                x2="0"
                y2="0"
                stroke={service.color}
                style={{ color: service.color }}
              />
            ))}
          </svg>

          {/* center orb — tints to the active service, with a progress arc
              that sweeps once per auto-cycle */}
          <div className={styles.mobileOrbStage}>
            <div
              ref={mobileOrbRef}
              className={styles.mobileOrb}
              style={
                {
                  "--orb-color": active.color,
                  "--orb-rgb": active.rgb,
                } as React.CSSProperties
              }
              aria-hidden
            >
              <div className={styles.mobileOrbFloat}>
                <div className={styles.orbCore} />
                <div className={styles.orbHighlight} />
                <div className={styles.shimmerRing} />
              </div>
              <div className={styles.mobileOrbRing} />
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className={styles.mobilePulseRing}
                  style={{ animationDelay: `${i * 1.4}s` }}
                />
              ))}
              <svg className={styles.mobileProgressSvg} viewBox="0 0 100 100">
                <circle
                  key={activeIndex}
                  className={styles.mobileProgressArc}
                  cx="50"
                  cy="50"
                  r="49"
                  pathLength={100}
                  style={{
                    stroke: active.color,
                    animationDuration: `${autoCycleMs}ms`,
                  }}
                />
              </svg>
            </div>
          </div>

          {/* service grid */}
          <div className={styles.mobilePillGrid}>
            {services.map((service, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={service.id}
                  ref={(el) => {
                    mobilePillRefs.current[i] = el;
                  }}
                  type="button"
                  data-cursor="hover"
                  onClick={() => setActive(i, false)}
                  className={`${styles.servicePill} ${styles.mobileGridPill} ${
                    isActive ? styles.servicePillActive : ""
                  }`}
                  style={
                    {
                      ...(isActive
                        ? ({ "--active-rgb": service.rgb } as React.CSSProperties)
                        : {}),
                      animationDelay: `${0.15 + i * 0.12}s`,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className={styles.pillIcon}
                    style={isActive ? { color: service.color } : undefined}
                  >
                    {service.icon}
                  </span>
                  <div className={styles.mobilePillText}>
                    <p className={styles.pillLabel}>{service.label}</p>
                    <p className={styles.pillSub}>{service.sub}</p>
                  </div>
                  <span
                    className={`${styles.pillIndicator} ${
                      isActive ? styles.pillIndicatorActive : ""
                    }`}
                    style={{ backgroundColor: service.color, color: service.color }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
