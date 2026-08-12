import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const iconsDir = path.join(root, "public/icons");

function isLogoPixel(r, g, b, a) {
  if (a < 128) return false;
  if (r > 100 && r > g * 1.3 && r > b * 1.3) return true;
  if (r > 160 && g > 160 && b > 160) return true;
  return false;
}

async function detectBBox(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width;
  let minY = info.height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      if (isLogoPixel(data[i], data[i + 1], data[i + 2], data[i + 3])) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function squareCrop(box, padRatio = 0.08) {
  const pad = Math.round(Math.max(box.width, box.height) * padRatio);
  const left = Math.max(0, box.left - pad);
  const top = Math.max(0, box.top - pad);
  const right = box.left + box.width + pad;
  const bottom = box.top + box.height + pad;
  const width = right - left;
  const height = bottom - top;
  const size = Math.max(width, height);
  const cx = left + width / 2;
  const cy = top + height / 2;

  return {
    left: Math.round(cx - size / 2),
    top: Math.round(cy - size / 2),
    width: Math.round(size),
    height: Math.round(size),
  };
}

async function writeIcon(input, crop, size, outPath) {
  await sharp(input)
    .extract(crop)
    .resize(size, size)
    .png()
    .toFile(outPath);
}

/** Brand black — the favicon background. */
const ICON_BG = "#000000";
/** Share of the canvas the logo mark occupies; the rest is breathing room. */
const ICON_INSET = 0.7;

/**
 * Writes a favicon on a solid rounded-square background.
 *
 * The raw logo is a red-and-white mark on transparency, so on Google's white
 * search results the white half of it disappears and the icon reads as an
 * empty blob. Baking in the black background makes it legible on any surface.
 */
async function writeSearchIcon(input, crop, size, outPath) {
  const inner = Math.round(size * ICON_INSET);
  const offset = Math.round((size - inner) / 2);
  const radius = Math.round(size * 0.2);

  const mark = await sharp(input)
    .extract(crop)
    .resize(inner, inner)
    .png()
    .toBuffer();

  const background = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${ICON_BG}"/>` +
      `</svg>`
  );

  const png = await sharp(background)
    .composite([{ input: mark, left: offset, top: offset }])
    .png()
    .toBuffer();

  if (outPath) await sharp(png).toFile(outPath);
  return png;
}

/**
 * Packs PNGs into a multi-resolution .ico. Google fetches /favicon.ico at the
 * site root regardless of the <link> tags, so it needs to exist and match.
 */
function buildIco(images) {
  const HEADER = 6;
  const ENTRY = 16;
  const header = Buffer.alloc(HEADER);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = HEADER + ENTRY * images.length;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(ENTRY);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette size
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([
    header,
    ...entries,
    ...images.map(({ data }) => data),
  ]);
}

async function main() {
  const mainSrc = path.join(iconsDir, "logo-main.png");
  const smallSrc = path.join(iconsDir, "logo-small.png");

  const mainBox = await detectBBox(mainSrc);
  const smallBox = await detectBBox(smallSrc);

  const navPad = Math.round(mainBox.height * 0.06);
  await sharp(mainSrc)
    .extract({
      left: Math.max(0, mainBox.left - navPad),
      top: Math.max(0, mainBox.top - navPad),
      width: mainBox.width + navPad * 2,
      height: mainBox.height + navPad * 2,
    })
    .png()
    .toFile(path.join(iconsDir, "logo-nav.png"));

  const favCrop = squareCrop(smallBox, 0.06);

  // Transparent mark, still used where the site already paints a dark surface.
  await writeIcon(smallSrc, favCrop, 32, path.join(iconsDir, "favicon-32.png"));

  // Search/tab icons. Google only considers square icons that are a multiple
  // of 48px, hence 48/96/144/192 rather than the usual 16/32 ladder.
  const searchIcons = [
    { size: 48, outPath: path.join(iconsDir, "favicon-48.png") },
    { size: 96, outPath: path.join(iconsDir, "favicon-96.png") },
    { size: 144, outPath: path.join(iconsDir, "favicon-144.png") },
    { size: 192, outPath: path.join(iconsDir, "favicon-192.png") },
    { size: 180, outPath: path.join(iconsDir, "apple-touch-icon.png") },
    { size: 512, outPath: path.join(root, "app/icon.png") },
    { size: 180, outPath: path.join(root, "app/apple-icon.png") },
  ];

  for (const { size, outPath } of searchIcons) {
    await writeSearchIcon(smallSrc, favCrop, size, outPath);
  }

  const icoSizes = [32, 48, 96];
  const icoImages = [];
  for (const size of icoSizes) {
    icoImages.push({
      size,
      data: await writeSearchIcon(smallSrc, favCrop, size, null),
    });
  }
  await fs.writeFile(path.join(root, "public/favicon.ico"), buildIco(icoImages));

  const navMeta = await sharp(path.join(iconsDir, "logo-nav.png")).metadata();
  console.log("logo-nav.png", navMeta.width, "x", navMeta.height);
  console.log("favicon crop", favCrop);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
