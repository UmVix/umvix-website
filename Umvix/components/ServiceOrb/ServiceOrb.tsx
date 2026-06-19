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

      {/* Mobile fallback */}
      <div className={styles.mobilePanel}>
        <div
          className={styles.mobileCard}
          style={{
            borderLeft: `3px solid ${active.color}`,
          }}
        >
          <p className={styles.mobileCardLabel}>{active.label}</p>
          <p className={styles.mobileCardSub}>{active.sub}</p>
        </div>
        <div className={styles.mobilePills}>
          {services.map((service, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={service.id}
                type="button"
                data-cursor="hover"
                className={`${styles.mobilePill} ${isActive ? styles.mobilePillActive : ""}`}
                style={
                  isActive
                    ? { borderLeft: `2.5px solid ${service.color}` }
                    : undefined
                }
                onClick={() => setActive(i, false)}
              >
                <span className={styles.pillIcon}>{service.icon}</span>
                <div>
                  <p className={styles.pillLabel}>{service.label}</p>
                  <p className={styles.pillSub}>{service.sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
