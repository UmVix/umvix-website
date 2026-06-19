export type ServiceItem = {
  id: number;
  label: string;
  sub: string;
  color: string;
  rgb: string;
  shadow: string;
  icon: string;
};

export type PillPosition = {
  x: number;
  y: number;
};

/** Equal-distance slots on four sides of the orb: top, right, bottom, left */
export const ORBIT_RADIUS = 168;
/** Extra horizontal push for left/right pills only */
export const SIDE_ORBIT_RADIUS = ORBIT_RADIUS + 22;

export const PILL_POSITIONS: PillPosition[] = [
  { x: 0, y: -ORBIT_RADIUS },
  { x: SIDE_ORBIT_RADIUS, y: 0 },
  { x: 0, y: ORBIT_RADIUS },
  { x: -SIDE_ORBIT_RADIUS, y: 0 },
];

/** Tilt angle (deg) per pill: top, right, bottom, left */
export const PILL_TILTS = [-6, 7, 5, -8] as const;

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 0,
    label: "Agentic AI",
    sub: "Autonomous systems",
    color: "#C96B7F",
    rgb: "201, 107, 127",
    shadow: "rgba(201, 107, 127, 0.12)",
    icon: "◈",
  },
  {
    id: 1,
    label: "Web Platforms",
    sub: "Scalable apps",
    color: "#5E9E8F",
    rgb: "94, 158, 143",
    shadow: "rgba(94, 158, 143, 0.12)",
    icon: "⬡",
  },
  {
    id: 2,
    label: "Mobile Apps",
    sub: "iOS & Android",
    color: "#6E8FB5",
    rgb: "110, 143, 181",
    shadow: "rgba(110, 143, 181, 0.12)",
    icon: "◎",
  },
  {
    id: 3,
    label: "Automation",
    sub: "Workflow pipelines",
    color: "#B8965A",
    rgb: "184, 150, 90",
    shadow: "rgba(184, 150, 90, 0.12)",
    icon: "⟳",
  },
];
