"use client";

export type IllustrationType =
  | "web"
  | "mobile"
  | "ai"
  | "automation"
  | "dashboard";

const STROKE = "rgba(255,255,255,0.55)";
const FAINT = "rgba(255,255,255,0.18)";
const RED = "rgba(255,31,61,0.9)";

export default function ServiceIllustration({ type }: { type: IllustrationType }) {
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 320 260" fill="none" className="h-full w-full">
        {type === "web" && <Web />}
        {type === "mobile" && <Mobile />}
        {type === "ai" && <Ai />}
        {type === "automation" && <Automation />}
        {type === "dashboard" && <Dashboard />}
      </svg>
    </div>
  );
}

function Web() {
  return (
    <g>
      <rect x="40" y="40" width="240" height="170" rx="12" stroke={STROKE} strokeWidth="2" />
      <line x1="40" y1="70" x2="280" y2="70" stroke={FAINT} strokeWidth="2" />
      <circle cx="56" cy="55" r="4" fill={RED} />
      <circle cx="72" cy="55" r="4" fill={FAINT} />
      <circle cx="88" cy="55" r="4" fill={FAINT} />
      <rect x="60" y="92" width="90" height="14" rx="4" fill={FAINT} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={60 + i * 70}
          y="130"
          width="56"
          height="56"
          rx="8"
          stroke={STROKE}
          strokeWidth="2"
          style={{ transformOrigin: "center", animation: `soft-pulse 2.4s ease-in-out ${i * 0.3}s infinite` }}
        />
      ))}
    </g>
  );
}

function Mobile() {
  return (
    <g>
      <g style={{ transformOrigin: "center", animation: "float-rotate 30s linear infinite" }}>
        <rect x="96" y="40" width="80" height="160" rx="16" stroke={FAINT} strokeWidth="2" transform="rotate(-8 136 120)" />
      </g>
      <rect x="150" y="50" width="84" height="166" rx="16" stroke={STROKE} strokeWidth="2" />
      <rect x="180" y="60" width="24" height="5" rx="2.5" fill={FAINT} />
      <rect x="164" y="80" width="56" height="40" rx="6" stroke={RED} strokeWidth="2"
        style={{ transformOrigin: "center", animation: "soft-pulse 2.2s ease-in-out infinite" }} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="164" y={132 + i * 20} width="56" height="12" rx="4" fill={FAINT} />
      ))}
    </g>
  );
}

function Ai() {
  return (
    <g>
      <rect x="50" y="60" width="150" height="48" rx="14" stroke={STROKE} strokeWidth="2" />
      <circle cx="74" cy="84" r="5" fill={RED} style={{ animation: "soft-pulse 1.6s ease-in-out infinite" }} />
      <circle cx="92" cy="84" r="5" fill={FAINT} style={{ animation: "soft-pulse 1.6s ease-in-out 0.2s infinite" }} />
      <circle cx="110" cy="84" r="5" fill={FAINT} style={{ animation: "soft-pulse 1.6s ease-in-out 0.4s infinite" }} />
      <rect x="130" y="140" width="150" height="48" rx="14" stroke={FAINT} strokeWidth="2" />
      <rect x="150" y="158" width="90" height="12" rx="6" fill={FAINT} />
      <circle cx="240" cy="84" r="26" stroke={RED} strokeWidth="2"
        style={{ transformOrigin: "240px 84px", animation: "spin-slow 12s linear infinite" }}
        strokeDasharray="6 6" />
      <circle cx="240" cy="84" r="8" fill={RED} opacity="0.8" />
    </g>
  );
}

function Automation() {
  return (
    <g>
      {/* connectors */}
      <path d="M160 60 L160 100 M160 100 L100 140 M160 100 L220 140 M100 160 L100 180 L220 180 L220 160"
        stroke={FAINT} strokeWidth="2" fill="none"
        strokeDasharray="120" strokeDashoffset="120"
        style={{ animation: "dash-draw 2.4s ease-out forwards" }} />
      <Node x={134} y={36} label red />
      <Node x={74} y={120} />
      <Node x={194} y={120} />
      <Node x={134} y={188} red />
    </g>
  );
}

function Node({ x, y, label, red }: { x: number; y: number; label?: boolean; red?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width="52" height="28" rx="6" stroke={red ? RED : STROKE} strokeWidth="2"
        style={{ transformOrigin: "center", animation: "soft-pulse 2.6s ease-in-out infinite" }} />
      <rect x={x + 10} y={y + 11} width="32" height="6" rx="3" fill={FAINT} />
      {label && <circle cx={x + 52} cy={y} r="3" fill={RED} />}
    </g>
  );
}

function Dashboard() {
  const bars = [70, 110, 60, 130, 90, 150];
  return (
    <g>
      <rect x="40" y="40" width="240" height="170" rx="12" stroke={STROKE} strokeWidth="2" />
      {/* line trend */}
      <path d="M60 150 L110 120 L150 135 L195 90 L240 110 L264 70" stroke={RED} strokeWidth="2.5" fill="none"
        strokeDasharray="320" strokeDashoffset="320"
        style={{ animation: "dash-draw 2s ease-out forwards" }} />
      {/* bars */}
      {bars.map((h, i) => (
        <rect
          key={i}
          x={60 + i * 36}
          y={190 - h}
          width="18"
          height={h}
          rx="3"
          fill={i % 2 === 0 ? FAINT : "rgba(255,31,61,0.35)"}
          style={{ transformOrigin: `${69 + i * 36}px 190px`, animation: `rise-bar ${2.2 + i * 0.2}s ease-in-out infinite` }}
        />
      ))}
    </g>
  );
}
