import sharp from "sharp";
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
  const faviconOutputs = [
    { size: 32, outPath: path.join(iconsDir, "favicon-32.png") },
    { size: 48, outPath: path.join(iconsDir, "favicon-48.png") },
    { size: 96, outPath: path.join(iconsDir, "favicon-96.png") },
    { size: 180, outPath: path.join(iconsDir, "apple-touch-icon.png") },
    { size: 512, outPath: path.join(root, "app/icon.png") },
    { size: 180, outPath: path.join(root, "app/apple-icon.png") },
  ];

  for (const { size, outPath } of faviconOutputs) {
    await writeIcon(smallSrc, favCrop, size, outPath);
  }

  const navMeta = await sharp(path.join(iconsDir, "logo-nav.png")).metadata();
  console.log("logo-nav.png", navMeta.width, "x", navMeta.height);
  console.log("favicon crop", favCrop);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
