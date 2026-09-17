import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { products } from "../src/data/content.js";
import { pageSeo } from "../src/data/page-seo.js";
import { stories } from "../src/data/story-manifest.js";

const root = resolve(import.meta.dirname, "..");
const sitemap = readFileSync(resolve(root, "dist", "sitemap.xml"), "utf8");
const generator = readFileSync(resolve(root, "scripts", "postbuild.mjs"), "utf8");
const errors = [];
const urlBlocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);

if (urlBlocks.length !== 24) errors.push(`Sitemap must contain 24 public URLs; found ${urlBlocks.length}.`);
const locations = urlBlocks.map((block) => block.match(/<loc>([^<]+)<\/loc>/)?.[1]).filter(Boolean);
if (new Set(locations).size !== locations.length) errors.push("Sitemap URL locations must be unique.");
if (/new Date\s*\(/.test(generator)) errors.push("Sitemap dates must not be generated from the build date.");

function blockFor(path) {
  const canonical = `https://spiritof1776.store${path}`;
  const block = urlBlocks.find((candidate) => candidate.includes(`<loc>${canonical}</loc>`));
  if (!block) errors.push(`Sitemap is missing ${canonical}.`);
  return block || "";
}

for (const story of stories) {
  const block = blockFor(story.href);
  if (!block.includes(`<lastmod>${story.modifiedDate}</lastmod>`)) errors.push(`${story.slug} has an inaccurate sitemap lastmod.`);
  const imageLocations = [...block.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((match) => match[1]);
  const imageTitles = [...block.matchAll(/<image:title>([^<]+)<\/image:title>/g)];
  const imageCaptions = [...block.matchAll(/<image:caption>([^<]+)<\/image:caption>/g)];
  if (imageLocations.length !== 4 || new Set(imageLocations).size !== 4) errors.push(`${story.slug} must expose four unique sitemap images.`);
  if (imageLocations.some((location) => !location.endsWith("-1536.webp"))) errors.push(`${story.slug} sitemap images must use the full responsive source.`);
  if (imageTitles.length !== 4 || imageCaptions.length !== 4) errors.push(`${story.slug} sitemap images need four titles and four captions.`);
}

for (const product of products) {
  const block = blockFor(product.href);
  if (!block.includes(`<lastmod>${product.modifiedDate}</lastmod>`)) errors.push(`${product.id} has an inaccurate sitemap lastmod.`);
}

const flightBlock = blockFor("/flight-93/");
if (!flightBlock.includes(`<lastmod>${pageSeo.flight93.modifiedDate}</lastmod>`)) errors.push("Flight 93 must use its explicit sitemap modification date.");

for (const block of urlBlocks) {
  if (!/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(block)) errors.push("Every sitemap URL needs an explicit stable lastmod.");
  const imageCount = (block.match(/<image:image>/g) || []).length;
  if (imageCount !== (block.match(/<\/image:image>/g) || []).length) errors.push("Sitemap image elements are unbalanced.");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Validated 24 sitemap URLs, stable lastmod dates, and four titled and captioned images for every story.");
