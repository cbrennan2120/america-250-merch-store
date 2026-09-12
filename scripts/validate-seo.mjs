import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import { stories } from "../src/data/story-manifest.js";

const root = resolve(import.meta.dirname, "..");
const origin = "https://spiritof1776.store";
const errors = [];
const pages = [
  { file: "index.html", route: "/" },
  { file: "stories/index.html", route: "/stories/" },
  ...stories.map(({ slug }) => ({ file: `stories/${slug}/index.html`, route: `/stories/${slug}/` })),
  { file: "timeline/index.html", route: "/timeline/" },
  { file: "quiz/index.html", route: "/quiz/" },
  { file: "shop/index.html", route: "/shop/" },
  { file: "about/index.html", route: "/about/" },
  { file: "privacy/index.html", route: "/privacy/" },
  { file: "flight-93/index.html", route: "/flight-93/" }
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function metaContent(html, attribute, key) {
  const match = html.match(new RegExp(`<meta[^>]+${attribute}="${escapeRegExp(key)}"[^>]+content="([^"]+)"`, "i"));
  return match?.[1] ?? "";
}

function linkHref(html, rel) {
  const match = html.match(new RegExp(`<link[^>]+rel="${escapeRegExp(rel)}"[^>]+href="([^"]+)"`, "i"));
  return match?.[1] ?? "";
}

function count(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

const requiredProperties = ["og:type", "og:site_name", "og:title", "og:description", "og:url", "og:image", "og:image:alt"];
const requiredNames = ["description", "theme-color", "twitter:card", "twitter:title", "twitter:description", "twitter:image", "twitter:image:alt"];
const canonicalUrls = new Set();

for (const page of pages) {
  const html = readFileSync(resolve(root, page.file), "utf8");
  for (const property of requiredProperties) {
    const matches = count(html, new RegExp(`<meta[^>]+property="${escapeRegExp(property)}"`, "gi"));
    if (matches !== 1 || !metaContent(html, "property", property)) errors.push(`${page.file} must contain one populated ${property} tag.`);
  }
  for (const name of requiredNames) {
    const matches = count(html, new RegExp(`<meta[^>]+name="${escapeRegExp(name)}"`, "gi"));
    if (matches !== 1 || !metaContent(html, "name", name)) errors.push(`${page.file} must contain one populated ${name} tag.`);
  }

  const canonical = linkHref(html, "canonical");
  const expectedCanonical = `${origin}${page.route}`;
  if (canonical !== expectedCanonical) errors.push(`${page.file} canonical must be ${expectedCanonical}.`);
  if (canonicalUrls.has(canonical)) errors.push(`${page.file} duplicates canonical ${canonical}.`);
  canonicalUrls.add(canonical);
  if (metaContent(html, "property", "og:url") !== canonical) errors.push(`${page.file} og:url must match its canonical.`);
  if (metaContent(html, "property", "og:site_name") !== "Spirit of 1776") errors.push(`${page.file} must identify the Open Graph site name.`);
  if (metaContent(html, "name", "twitter:card") !== "summary_large_image") errors.push(`${page.file} must use the large Twitter card.`);
  if (metaContent(html, "name", "twitter:image") !== metaContent(html, "property", "og:image")) errors.push(`${page.file} social image tags must agree.`);

  for (const [href, rel] of [
    ["/assets/brand/favicon.svg", "icon"],
    ["/assets/brand/favicon-48.png", "icon"],
    ["/favicon.ico", "icon"],
    ["/assets/brand/favicon-192.png", "apple-touch-icon"],
    ["/site.webmanifest", "manifest"]
  ]) {
    if (!html.includes(`rel="${rel}" href="${href}"`)) errors.push(`${page.file} is missing ${href}.`);
    if (count(html, new RegExp(`href="${escapeRegExp(href)}"`, "g")) !== 1) errors.push(`${page.file} must reference ${href} exactly once.`);
  }
  if (html.includes("favicon-32.png")) errors.push(`${page.file} still references the undersized legacy favicon.`);

  const socialImage = metaContent(html, "property", "og:image");
  if (socialImage.startsWith(`${origin}/`)) {
    const localPath = resolve(root, "public", socialImage.slice(origin.length + 1));
    if (!existsSync(localPath)) errors.push(`${page.file} references missing social image ${socialImage}.`);
  }
}

const notFound = readFileSync(resolve(root, "404.html"), "utf8");
if (metaContent(notFound, "name", "robots") !== "noindex") errors.push("404.html must remain noindex.");
for (const href of ["/assets/brand/favicon.svg", "/assets/brand/favicon-48.png", "/favicon.ico", "/assets/brand/favicon-192.png", "/site.webmanifest"]) {
  if (!notFound.includes(`href="${href}"`)) errors.push(`404.html is missing ${href}.`);
}

const svgPath = resolve(root, "public", "assets", "brand", "favicon.svg");
const svg = readFileSync(svgPath, "utf8").trim();
if (!svg.startsWith("<svg") || !svg.includes("</svg>")) errors.push("favicon.svg must contain genuine SVG markup.");

for (const [file, width] of [["favicon-48.png", 48], ["favicon-96.png", 96], ["favicon-192.png", 192], ["favicon-512.png", 512]]) {
  const path = resolve(root, "public", "assets", "brand", file);
  const metadata = await sharp(path).metadata();
  if (metadata.format !== "png" || metadata.width !== width || metadata.height !== width) errors.push(`${file} must be a ${width}x${width} PNG.`);
}

const ico = readFileSync(resolve(root, "public", "favicon.ico"));
if (ico.subarray(0, 4).toString("hex") !== "00000100" || ico.readUInt8(6) !== 48 || ico.readUInt8(7) !== 48) errors.push("favicon.ico must contain a 48x48 icon image.");

const manifest = JSON.parse(readFileSync(resolve(root, "public", "site.webmanifest"), "utf8"));
for (const size of ["192x192", "512x512"]) {
  if (!manifest.icons?.some((icon) => icon.sizes === size && icon.type === "image/png")) errors.push(`site.webmanifest is missing its ${size} PNG icon.`);
}

const netlify = readFileSync(resolve(root, "netlify.toml"), "utf8");
if (!netlify.includes('for = "/site.webmanifest"') || !netlify.includes('Content-Type = "application/manifest+json; charset=utf-8"')) errors.push("Netlify must serve the web manifest with its correct MIME type.");
if (!netlify.includes('for = "/favicon.ico"') || !netlify.includes('Content-Type = "image/x-icon"')) errors.push("Netlify must serve favicon.ico with its correct MIME type.");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated technical SEO metadata for ${pages.length} public pages and the complete favicon family.`);
