import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { products } from "../src/data/content.js";
import { stories } from "../src/data/story-manifest.js";

const dist = resolve(import.meta.dirname, "..", "dist");
const origin = "https://spiritof1776.store";
const lastmod = new Date().toISOString().slice(0, 10);

const routes = [
  {
    path: "/",
    images: [
      { path: "/assets/brand/hero.webp", title: "Spirit of 1776 history and shop" },
      { path: "/assets/brand/social-card.png", title: "Spirit of 1776 stories worth keeping" }
    ]
  },
  { path: "/stories/", images: stories.slice(0, 4).map((story) => ({ path: story.socialImage, title: story.title })) },
  ...stories.map((story) => ({ path: story.href, images: [{ path: story.socialImage, title: story.title }] })),
  { path: "/timeline/" },
  { path: "/quiz/" },
  { path: "/shop/", images: products.map((product) => ({ path: product.image, title: product.name })) },
  ...products.map((product) => ({ path: product.href, images: [{ path: product.primaryImage, title: product.displayName }] })),
  { path: "/about/" },
  { path: "/privacy/" },
  {
    path: "/flight-93/",
    images: [{ path: "/assets/flight-93/social-card.jpg", title: "Flight 93: They learned, voted, and acted" }]
  }
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routes.map(({ path, images = [] }) => `  <url>
    <loc>${origin}${path}</loc>
    <lastmod>${lastmod}</lastmod>${images.map((image) => `
    <image:image><image:loc>${origin}${image.path}</image:loc><image:title>${image.title}</image:title></image:image>`).join("")}
  </url>`).join("\n")}
</urlset>
`;
const robots = `User-agent: *
Allow: /
Sitemap: ${origin}/sitemap.xml
`;

await mkdir(dist, { recursive: true });
await writeFile(resolve(dist, "sitemap.xml"), sitemap);
await writeFile(resolve(dist, "robots.txt"), robots);
console.log(`Added sitemap.xml and robots.txt with ${routes.length} public routes.`);
