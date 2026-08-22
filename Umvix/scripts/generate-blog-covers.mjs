/**
 * Generates a branded cover image for every blog post.
 *
 * Each cover is generative SVG artwork rendered to WebP at the 1200x630
 * Open Graph size. The composition is driven by the post's category (each has
 * its own motif) and seeded by its slug, so every post gets a distinct image
 * that still reads as part of one system. No text is drawn: the title is real
 * HTML on the page, which keeps it selectable, translatable, and accessible.
 *
 *   npm run covers            regenerate missing covers
 *   npm run covers -- --force rebuild every cover
 */

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const postsDir = path.join(root, "content/blog");
const outDir = path.join(root, "public/blog");

const WIDTH = 1200;
const HEIGHT = 630;

const RED = "#ff1f3d";
const RED_DARK = "#b30000";
const BLACK = "#000000";

/** Deterministic PRNG so a given slug always renders the same artwork. */
function seededRandom(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rand, min, max) => min + rand() * (max - min);
const pickInt = (rand, min, max) => Math.floor(pick(rand, min, max + 1));

/* ------------------------------------------------------------------ motifs */

/** Web Development — layered browser windows with a wireframe layout. */
function webMotif(rand) {
  let out = "";
  for (let i = 2; i >= 0; i--) {
    const x = 620 + i * 34;
    const y = 150 + i * 26;
    const w = 430;
    const h = 300;
    const opacity = 0.9 - i * 0.28;
    out += `<g opacity="${opacity.toFixed(2)}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#0d0d10" stroke="rgba(255,255,255,0.12)"/>
      <rect x="${x}" y="${y}" width="${w}" height="34" rx="14" fill="rgba(255,255,255,0.04)"/>
      <circle cx="${x + 22}" cy="${y + 17}" r="4.5" fill="${RED}"/>
      <circle cx="${x + 40}" cy="${y + 17}" r="4.5" fill="rgba(255,255,255,0.18)"/>
      <circle cx="${x + 58}" cy="${y + 17}" r="4.5" fill="rgba(255,255,255,0.18)"/>`;
    if (i === 0) {
      out += `<rect x="${x + 24}" y="${y + 62}" width="${pickInt(rand, 150, 240)}" height="16" rx="4" fill="${RED}" opacity="0.85"/>`;
      for (let r = 0; r < 3; r++) {
        out += `<rect x="${x + 24}" y="${y + 94 + r * 22}" width="${pickInt(rand, 200, 360)}" height="9" rx="4" fill="rgba(255,255,255,0.14)"/>`;
      }
      for (let c = 0; c < 3; c++) {
        out += `<rect x="${x + 24 + c * 130}" y="${y + 186}" width="112" height="76" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)"/>`;
      }
    }
    out += `</g>`;
  }
  return out;
}

/** Mobile Apps — phone frames with stacked UI blocks. */
function mobileMotif(rand) {
  let out = "";
  const frames = [
    { x: 700, y: 130, s: 0.82, o: 0.38 },
    { x: 810, y: 96, s: 1, o: 1 },
  ];
  for (const { x, y, s, o } of frames) {
    const w = 210 * s;
    const h = 420 * s;
    out += `<g opacity="${o}" transform="translate(${x} ${y})">
      <rect x="0" y="0" width="${w}" height="${h}" rx="${30 * s}" fill="#0d0d10" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
      <rect x="${w / 2 - 32 * s}" y="${12 * s}" width="${64 * s}" height="${9 * s}" rx="${5 * s}" fill="rgba(255,255,255,0.16)"/>
      <rect x="${18 * s}" y="${46 * s}" width="${w - 36 * s}" height="${120 * s}" rx="${12 * s}" fill="url(#accent)" opacity="0.55"/>`;
    for (let r = 0; r < 4; r++) {
      out += `<rect x="${18 * s}" y="${(184 + r * 40) * s}" width="${(w - 36 * s) * pick(rand, 0.55, 1)}" height="${12 * s}" rx="${6 * s}" fill="rgba(255,255,255,0.13)"/>`;
    }
    out += `<rect x="${18 * s}" y="${h - 58 * s}" width="${w - 36 * s}" height="${38 * s}" rx="${19 * s}" fill="${RED}" opacity="0.9"/></g>`;
  }
  return out;
}

/** AI & Chatbots — a neural node graph with a highlighted activation path. */
function aiMotif(rand) {
  const layers = [3, 5, 5, 3];
  const originX = 660;
  const spanX = 420;
  const nodes = layers.map((count, li) =>
    Array.from({ length: count }, (_, ni) => ({
      x: originX + (spanX / (layers.length - 1)) * li,
      y: 315 + (ni - (count - 1) / 2) * pick(rand, 62, 78),
    }))
  );

  let edges = "";
  let hot = "";
  for (let li = 0; li < nodes.length - 1; li++) {
    const hotFrom = pickInt(rand, 0, nodes[li].length - 1);
    const hotTo = pickInt(rand, 0, nodes[li + 1].length - 1);
    for (let a = 0; a < nodes[li].length; a++) {
      for (let b = 0; b < nodes[li + 1].length; b++) {
        const p = nodes[li][a];
        const q = nodes[li + 1][b];
        const line = `M${p.x} ${p.y} L${q.x} ${q.y}`;
        if (a === hotFrom && b === hotTo) {
          hot += `<path d="${line}" stroke="${RED}" stroke-width="2.4" opacity="0.95"/>`;
        } else {
          edges += `<path d="${line}" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>`;
        }
      }
    }
  }

  let dots = "";
  for (const layer of nodes) {
    for (const n of layer) {
      const hotNode = rand() > 0.72;
      dots += `<circle cx="${n.x}" cy="${n.y}" r="${hotNode ? 9 : 6.5}" fill="${hotNode ? RED : "#15151a"}" stroke="${hotNode ? "none" : "rgba(255,255,255,0.22)"}" stroke-width="1.5"/>`;
      if (hotNode) {
        dots += `<circle cx="${n.x}" cy="${n.y}" r="17" fill="${RED}" opacity="0.16"/>`;
      }
    }
  }
  return edges + hot + dots;
}

/** Automation — a node-and-connector workflow with orthogonal routing. */
function automationMotif(rand) {
  const cols = [700, 890, 1080];
  const boxes = [
    { x: cols[0], y: 200 },
    { x: cols[0], y: 400 },
    { x: cols[1], y: 300 },
    { x: cols[2], y: 190 },
    { x: cols[2], y: 410 },
  ];
  const w = 96;
  const h = 62;

  const link = (a, b) => {
    const midX = (a.x + w + b.x) / 2;
    return `<path d="M${a.x + w} ${a.y + h / 2} H${midX} V${b.y + h / 2} H${b.x}" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="1.8"/>
      <circle cx="${midX}" cy="${(a.y + b.y) / 2 + h / 2}" r="3.5" fill="${RED}" opacity="${pick(rand, 0.5, 1).toFixed(2)}"/>`;
  };

  let out = link(boxes[0], boxes[2]) + link(boxes[1], boxes[2]) + link(boxes[2], boxes[3]) + link(boxes[2], boxes[4]);

  boxes.forEach((b, i) => {
    const active = i === 2;
    out += `<g>
      <rect x="${b.x}" y="${b.y}" width="${w}" height="${h}" rx="12" fill="${active ? "url(#accent)" : "#0d0d10"}" stroke="${active ? "none" : "rgba(255,255,255,0.14)"}"/>
      <rect x="${b.x + 16}" y="${b.y + 18}" width="${pickInt(rand, 30, 56)}" height="7" rx="3.5" fill="rgba(255,255,255,${active ? 0.75 : 0.28})"/>
      <rect x="${b.x + 16}" y="${b.y + 34}" width="${pickInt(rand, 22, 44)}" height="7" rx="3.5" fill="rgba(255,255,255,${active ? 0.45 : 0.14})"/>
    </g>`;
  });
  return out;
}

/** SaaS & Dashboards — a chart panel with bars, a trend line, and stat tiles. */
function saasMotif(rand) {
  const x = 640;
  const y = 140;
  const w = 470;
  const h = 340;

  let tiles = "";
  for (let i = 0; i < 3; i++) {
    tiles += `<g>
      <rect x="${x + 24 + i * 142}" y="${y + 56}" width="126" height="66" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)"/>
      <rect x="${x + 38 + i * 142}" y="${y + 72}" width="${pickInt(rand, 40, 70)}" height="10" rx="5" fill="${i === 0 ? RED : "rgba(255,255,255,0.22)"}"/>
      <rect x="${x + 38 + i * 142}" y="${y + 94}" width="${pickInt(rand, 26, 48)}" height="7" rx="3.5" fill="rgba(255,255,255,0.12)"/>
    </g>`;
  }

  const baseline = y + h - 42;
  let bars = "";
  const points = [];
  for (let i = 0; i < 9; i++) {
    const bh = pick(rand, 34, 150);
    const bx = x + 30 + i * 48;
    bars += `<rect x="${bx}" y="${baseline - bh}" width="26" height="${bh}" rx="5" fill="${i === 7 ? RED : "rgba(255,255,255,0.10)"}"/>`;
    points.push([bx + 13, baseline - bh - 16]);
  }

  const line = points
    .map(([px, py], i) => `${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`)
    .join(" ");

  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#0d0d10" stroke="rgba(255,255,255,0.10)"/>
    <rect x="${x + 24}" y="${y + 24}" width="150" height="12" rx="6" fill="rgba(255,255,255,0.18)"/>
    ${tiles}${bars}
    <path d="${line}" fill="none" stroke="${RED}" stroke-width="2.6" stroke-linejoin="round" opacity="0.9"/>`;
}

const MOTIFS = {
  "Web Development": webMotif,
  "Mobile Apps": mobileMotif,
  "AI & Chatbots": aiMotif,
  Automation: automationMotif,
  "SaaS & Dashboards": saasMotif,
};

/* ------------------------------------------------------------------ canvas */

function buildSvg(slug, category) {
  const rand = seededRandom(slug);
  const motif = MOTIFS[category] ?? aiMotif;

  // Faint scattered particles give each cover a little unique texture.
  let particles = "";
  for (let i = 0; i < 46; i++) {
    particles += `<circle cx="${pick(rand, 0, WIDTH).toFixed(0)}" cy="${pick(rand, 0, HEIGHT).toFixed(0)}" r="${pick(rand, 0.6, 2).toFixed(1)}" fill="#fff" opacity="${pick(rand, 0.03, 0.13).toFixed(2)}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${RED}"/>
      <stop offset="100%" stop-color="${RED_DARK}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.2" cy="0.24" r="0.7">
      <stop offset="0%" stop-color="${RED}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${RED}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0 H0 V40" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
    </pattern>
    <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.78">
      <stop offset="55%" stop-color="${BLACK}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${BLACK}" stop-opacity="0.68"/>
    </radialGradient>
    <radialGradient id="core" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${RED}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${RED}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BLACK}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <ellipse cx="${WIDTH / 2}" cy="${HEIGHT / 2}" rx="520" ry="300" fill="url(#core)"/>
  ${particles}

  <!-- Motifs are authored around (865, 308); centre and scale them so the
       composition fills the frame instead of hugging one edge. -->
  <g transform="translate(${WIDTH / 2} ${HEIGHT / 2}) scale(1.2) translate(-865 -308)">
    ${motif(rand)}
  </g>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#vignette)"/>

  <!-- Brand accent bars, consistent across every cover. -->
  <rect x="64" y="${HEIGHT - 70}" width="72" height="5" rx="2.5" fill="url(#accent)"/>
  <rect x="0" y="${HEIGHT - 6}" width="${WIDTH}" height="6" fill="url(#accent)"/>
</svg>`;
}

/* -------------------------------------------------------------------- main */

/** Minimal frontmatter reader — avoids pulling a parser into a build script. */
function frontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!match) return {};
  const out = {};
  for (const line of match[1].split("\n")) {
    const kv = /^([a-zA-Z]+):\s*(.+)$/.exec(line.trim());
    if (kv) out[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

async function main() {
  const force = process.argv.includes("--force");
  await fs.mkdir(outDir, { recursive: true });

  const files = (await fs.readdir(postsDir)).filter(
    (f) => f.endsWith(".mdx") && !f.startsWith("_")
  );

  let written = 0;
  let skipped = 0;

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const target = path.join(outDir, `${slug}.webp`);

    if (!force) {
      try {
        await fs.access(target);
        skipped++;
        continue;
      } catch {
        // not generated yet — fall through and build it
      }
    }

    const { category } = frontmatter(await fs.readFile(path.join(postsDir, file), "utf8"));
    if (!MOTIFS[category]) {
      console.warn(`  ! ${slug}: unknown category "${category}", using the AI motif`);
    }

    await sharp(Buffer.from(buildSvg(slug, category)))
      .webp({ quality: 88, effort: 5 })
      .toFile(target);

    console.log(`  ✓ public/blog/${slug}.webp  (${category})`);
    written++;
  }

  console.log(`\n${written} cover${written === 1 ? "" : "s"} written, ${skipped} already present.`);
  if (skipped > 0 && !force) console.log("Run with --force to rebuild them.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
