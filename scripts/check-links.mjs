import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { stories } from "../src/data/story-manifest.js";
import { products } from "../src/data/content.js";

const root = resolve(import.meta.dirname, "..");
const htmlFiles = [
  "index.html",
  "404.html",
  "stories/index.html",
  ...stories.map((story) => `stories/${story.slug}/index.html`),
  "timeline/index.html",
  "quiz/index.html",
  "shop/index.html",
  ...products.map((product) => `shop/${product.slug}/index.html`),
  "about/index.html",
  "privacy/index.html",
  "flight-93/index.html"
];
const errors = [];

function targetExists(reference, sourceFile) {
  const clean = reference.split(/[?#]/)[0];
  if (!clean) return true;
  if (clean.startsWith("/assets/")) return existsSync(resolve(root, "public", clean.slice(1)));
  if (clean.startsWith("/src/")) return existsSync(resolve(root, clean.slice(1)));
  if (clean.startsWith("/")) {
    if (clean === "/") return existsSync(resolve(root, "index.html"));
    if (clean.endsWith("/")) return existsSync(resolve(root, clean.slice(1), "index.html"));
    return existsSync(resolve(root, clean.slice(1))) || existsSync(resolve(root, "public", clean.slice(1)));
  }
  return existsSync(resolve(root, dirname(sourceFile), clean));
}

for (const file of htmlFiles) {
  const html = await readFile(resolve(root, file), "utf8");
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    if (/^(https?:|mailto:|tel:|#)/.test(reference)) continue;
    if (!targetExists(reference, file)) errors.push(`${file}: missing ${reference}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Checked local links and assets across ${htmlFiles.length} pages.`);
