import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const dist = resolve(import.meta.dirname, "..", "dist");
const routes = [
  "/", "/stories/", "/stories/declaration/", "/stories/liberty-bell/", "/stories/lived-revolution/",
  "/timeline/", "/quiz/", "/shop/", "/about/", "/privacy/"
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>https://spiritof1776.store${route}</loc><lastmod>2026-08-06</lastmod></url>`).join("\n")}
</urlset>\n`;
const robots = `User-agent: *\nAllow: /\nSitemap: https://spiritof1776.store/sitemap.xml\n`;
await mkdir(dist, { recursive: true });
await writeFile(resolve(dist, "sitemap.xml"), sitemap);
await writeFile(resolve(dist, "robots.txt"), robots);
console.log("Added sitemap.xml and robots.txt.");
