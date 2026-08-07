import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const dist = resolve(import.meta.dirname, "..", "dist");
const origin = "https://spiritof1776.store";
const lastmod = new Date().toISOString().slice(0, 10);
const routes = [
  { path: "/", images: [
    { path: "/assets/brand/hero.webp", title: "Vintage Spirit of 1776 eagle and shield artwork" },
    { path: "/assets/brand/social-card.png", title: "Spirit of 1776 stories worth keeping" }
  ] },
  { path: "/stories/" },
  { path: "/stories/declaration/" },
  { path: "/stories/liberty-bell/" },
  { path: "/stories/people/" },
  { path: "/timeline/" },
  { path: "/quiz/" },
  { path: "/shop/", images: [
    { path: "/assets/products/eagle-tee-mockup.webp", title: "Spirit Eagle T-Shirt" },
    { path: "/assets/products/fife-drum-crewneck-mockup.webp", title: "History in Motion Crewneck" },
    { path: "/assets/products/flag-sticker-mockup.webp", title: "One Enduring Idea Sticker" }
  ] },
  { path: "/about/" },
  { path: "/privacy/" }
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routes.map(({ path, images = [] }) => `  <url>
    <loc>${origin}${path}</loc>
    <lastmod>${lastmod}</lastmod>${images.map((image) => `
    <image:image><image:loc>${origin}${image.path}</image:loc><image:title>${image.title}</image:title></image:image>`).join("")}
  </url>`).join("\n")}
</urlset>\n`;
const robots = `User-agent: *\nAllow: /\nSitemap: https://spiritof1776.store/sitemap.xml\n`;
await mkdir(dist, { recursive: true });
await writeFile(resolve(dist, "sitemap.xml"), sitemap);
await writeFile(resolve(dist, "robots.txt"), robots);
console.log("Added sitemap.xml and robots.txt.");
