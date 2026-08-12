/**
 * Generates public/og.png — the 1200x630 social/share card referenced by the
 * Open Graph and Twitter metadata in lib/metadata.ts.
 *
 * Run with `npm run og` after changing the logo or the tagline. The output is
 * committed so no image is rendered at request time.
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const WIDTH = 1200;
const HEIGHT = 630;
const LOGO_WIDTH = 420;

const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <radialGradient id="glow" cx="78%" cy="18%" r="70%">
      <stop offset="0%" stop-color="#ff1f3d" stop-opacity="0.30" />
      <stop offset="100%" stop-color="#ff1f3d" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ff1f3d" />
      <stop offset="100%" stop-color="#ff1f3d" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#000000" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />
  <rect x="0" y="${HEIGHT - 8}" width="${WIDTH}" height="8" fill="url(#rule)" />
</svg>`);

const caption = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <style>
    .headline {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 52px; font-weight: 800; fill: #ffffff; letter-spacing: -1.5px;
    }
    .sub {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 30px; font-weight: 500; fill: #a3a3a3;
    }
  </style>
  <text x="600" y="432" text-anchor="middle" class="headline">Web · Mobile · AI Development Agency</text>
  <text x="600" y="492" text-anchor="middle" class="sub">Ideas First. Ship Bold. Scale Up.</text>
</svg>`);

const logo = await sharp(path.join(root, "public/icons/logo-main.png"))
  .resize({ width: LOGO_WIDTH })
  .toBuffer();

const { height: logoHeight } = await sharp(logo).metadata();

await sharp(background)
  .composite([
    {
      input: logo,
      left: Math.round((WIDTH - LOGO_WIDTH) / 2),
      top: Math.round(300 - logoHeight / 2),
    },
    { input: caption, left: 0, top: 0 },
  ])
  .png()
  .toFile(path.join(root, "public/og.png"));

console.log(`Wrote public/og.png (${WIDTH}x${HEIGHT})`);
