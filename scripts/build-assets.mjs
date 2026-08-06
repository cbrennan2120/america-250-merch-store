import { copyFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import TextToSVG from "text-to-svg";

const root = resolve(import.meta.dirname, "..");
const artworkDir = resolve(root, "assets", "artwork");
const outputDir = resolve(root, "public", "assets", "products");
const brandDir = resolve(root, "public", "assets", "brand");
const fontOutputDir = resolve(root, "public", "assets", "fonts");
const cinzel = TextToSVG.loadSync(resolve(root, "assets", "fonts", "Cinzel-Variable.ttf"));
const bebas = TextToSVG.loadSync(resolve(root, "assets", "fonts", "BebasNeue-Regular.ttf"));

await mkdir(outputDir, { recursive: true });
await mkdir(brandDir, { recursive: true });
await mkdir(fontOutputDir, { recursive: true });

const colors = {
  navy: "#13263d",
  red: "#a33a32",
  cream: "#f4eddb",
  gold: "#c8a35c",
  charcoal: "#272a2d"
};

function path(font, text, x, y, fontSize, fill, extra = {}) {
  return font.getPath(text, {
    x,
    y,
    fontSize,
    anchor: "center top",
    letterSpacing: extra.letterSpacing ?? 0.03,
    attributes: {
      fill,
      ...(extra.stroke ? { stroke: extra.stroke, "stroke-width": extra.strokeWidth ?? 8, "paint-order": "stroke" } : {})
    }
  });
}

async function embeddedImage(pathname) {
  const bytes = await readFile(pathname);
  return `data:image/png;base64,${bytes.toString("base64")}`;
}

async function renderPrintMasters() {
  const eagle = await embeddedImage(resolve(artworkDir, "eagle-crest-base.png"));
  const musicians = await embeddedImage(resolve(artworkDir, "fife-drum-base.png"));
  const flag = await embeddedImage(resolve(artworkDir, "flag-badge-base.png"));

  const eagleSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="4500" height="5400" viewBox="0 0 4500 5400">
      ${path(bebas, "SPIRIT OF 1776", 2250, 140, 650, colors.cream, { stroke: colors.navy, strokeWidth: 18 })}
      <image href="${eagle}" x="700" y="850" width="3100" height="3100" preserveAspectRatio="xMidYMid meet"/>
      ${path(bebas, "250 YEARS OF FREEDOM", 2250, 4140, 470, colors.gold, { stroke: colors.navy, strokeWidth: 14 })}
      ${path(cinzel, "EST. 1776", 2250, 4760, 260, colors.cream, { letterSpacing: 0.08 })}
    </svg>`;

  const crewneckSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="4500" height="5400" viewBox="0 0 4500 5400">
      ${path(bebas, "THE SPIRIT OF 1776", 2250, 120, 580, colors.cream, { stroke: colors.navy, strokeWidth: 18 })}
      <image href="${musicians}" x="500" y="780" width="3500" height="3500" preserveAspectRatio="xMidYMid meet"/>
      ${path(bebas, "FIFE  •  DRUM  •  FREEDOM", 2250, 4330, 390, colors.gold, { stroke: colors.navy, strokeWidth: 12 })}
      ${path(cinzel, "HISTORY IN MOTION", 2250, 4860, 220, colors.cream, { letterSpacing: 0.07 })}
    </svg>`;

  const stickerSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="3600" height="1800" viewBox="0 0 3600 1800">
      <image href="${flag}" x="0" y="0" width="3600" height="1800" preserveAspectRatio="xMidYMid slice"/>
      <rect x="250" y="500" width="3100" height="760" rx="90" fill="${colors.cream}" fill-opacity="0.94" stroke="${colors.navy}" stroke-width="30"/>
      ${path(bebas, "SPIRIT OF 1776", 1800, 555, 520, colors.navy)}
      ${path(cinzel, "250 YEARS  •  ONE ENDURING IDEA", 1800, 1030, 150, colors.red, { letterSpacing: 0.035 })}
    </svg>`;

  await Promise.all([
    sharp(Buffer.from(eagleSvg)).png({ compressionLevel: 9 }).toFile(resolve(outputDir, "eagle-tee-print.png")),
    sharp(Buffer.from(crewneckSvg)).png({ compressionLevel: 9 }).toFile(resolve(outputDir, "fife-drum-crewneck-print.png")),
    sharp(Buffer.from(stickerSvg)).png({ compressionLevel: 9 }).toFile(resolve(outputDir, "spirit-flag-sticker-print.png"))
  ]);
}

async function renderWebProduct(printName, slug, backdrop) {
  const mockup = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1000" viewBox="0 0 1200 1000">
      <defs><radialGradient id="g"><stop offset="0" stop-color="${backdrop}"/><stop offset="1" stop-color="#111827"/></radialGradient></defs>
      <rect width="1200" height="1000" rx="48" fill="url(#g)"/>
      <path d="M250 150 410 70h380l160 80 150 180-125 105-80-82v520H305V353l-80 82-125-105z" fill="${backdrop}" stroke="#f4eddb" stroke-opacity=".22" stroke-width="5"/>
    </svg>`;
  const art = await sharp(resolve(outputDir, printName))
    .resize({ width: 520, height: 650, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const composed = sharp(Buffer.from(mockup)).composite([{ input: art, left: 340, top: 175 }]);
  await composed.clone().avif({ quality: 72 }).toFile(resolve(outputDir, `${slug}-mockup.avif`));
  await composed.clone().webp({ quality: 82 }).toFile(resolve(outputDir, `${slug}-mockup.webp`));
}

async function renderStickerWeb() {
  const input = resolve(outputDir, "spirit-flag-sticker-print.png");
  await sharp(input).resize({ width: 1200 }).avif({ quality: 72 }).toFile(resolve(outputDir, "flag-sticker-mockup.avif"));
  await sharp(input).resize({ width: 1200 }).webp({ quality: 84 }).toFile(resolve(outputDir, "flag-sticker-mockup.webp"));
}

async function renderBrandAssets() {
  const eagle = await embeddedImage(resolve(artworkDir, "eagle-crest-base.png"));
  const og = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="${colors.navy}"/>
      <path d="M0 0h1200v18H0zm0 612h1200v18H0z" fill="${colors.red}"/>
      <image href="${eagle}" x="70" y="70" width="470" height="470" preserveAspectRatio="xMidYMid meet"/>
      ${path(bebas, "SPIRIT OF 1776", 855, 155, 100, colors.cream, { letterSpacing: 0.025 })}
      ${path(cinzel, "Stories worth keeping.", 855, 325, 38, colors.gold, { letterSpacing: 0.01 })}
      ${path(cinzel, "Freedom worth understanding.", 855, 405, 27, colors.cream, { letterSpacing: 0.006 })}
    </svg>`;
  const favicon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="12" fill="${colors.navy}"/>
      <path d="M32 8 38 22l15 1-12 10 4 15-13-8-13 8 4-15-12-10 15-1z" fill="${colors.gold}"/>
    </svg>`;
  await sharp(Buffer.from(og)).png().toFile(resolve(brandDir, "social-card.png"));
  await sharp(Buffer.from(og)).avif({ quality: 72 }).toFile(resolve(brandDir, "hero.avif"));
  await sharp(Buffer.from(og)).webp({ quality: 82 }).toFile(resolve(brandDir, "hero.webp"));
  await sharp(Buffer.from(favicon)).png().resize(512, 512).toFile(resolve(brandDir, "favicon-512.png"));
  await sharp(Buffer.from(favicon)).png().resize(192, 192).toFile(resolve(brandDir, "favicon-192.png"));
  await sharp(Buffer.from(favicon)).png().resize(32, 32).toFile(resolve(brandDir, "favicon-32.png"));
  await sharp(Buffer.from(favicon)).toFile(resolve(brandDir, "favicon.svg"));
}

for (const file of ["eagle-crest-base.png", "fife-drum-base.png", "flag-badge-base.png"]) {
  if (!existsSync(resolve(artworkDir, file))) throw new Error(`Missing source artwork: ${file}`);
}

await renderPrintMasters();
await Promise.all([
  renderWebProduct("eagle-tee-print.png", "eagle-tee", colors.charcoal),
  renderWebProduct("fife-drum-crewneck-print.png", "fife-drum-crewneck", colors.navy)
]);
await renderStickerWeb();
await renderBrandAssets();
await Promise.all([
  copyFile(resolve(root, "assets", "fonts", "Cinzel-Variable.ttf"), resolve(fontOutputDir, "Cinzel-Variable.ttf")),
  copyFile(resolve(root, "assets", "fonts", "BebasNeue-Regular.ttf"), resolve(fontOutputDir, "BebasNeue-Regular.ttf")),
  copyFile(resolve(root, "assets", "fonts", "OFL-Cinzel.txt"), resolve(fontOutputDir, "OFL-Cinzel.txt")),
  copyFile(resolve(root, "assets", "fonts", "OFL-Bebas-Neue.txt"), resolve(fontOutputDir, "OFL-Bebas-Neue.txt"))
]);

console.log("Built print masters, product mockups, and brand images.");
