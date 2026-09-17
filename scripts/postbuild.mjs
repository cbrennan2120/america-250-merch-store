import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { products } from "../src/data/content.js";
import { stories } from "../src/data/story-manifest.js";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const origin = "https://spiritof1776.store";
const staticLastmod = {
  "/": "2026-09-12",
  "/stories/": "2026-09-12",
  "/timeline/": "2026-09-11",
  "/quiz/": "2026-09-11",
  "/shop/": "2026-09-12",
  "/about/": "2026-09-12",
  "/privacy/": "2026-09-12",
  "/flight-93/": "2026-09-11"
};

const xmlEscape = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

function plainCaption(value = "") {
  return value
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/\s*Illustration:\s*original AI-assisted chibi artwork created for Spirit of 1776\.?\s*$/i, "")
    .trim();
}

async function storyImages(story) {
  const markdown = await readFile(resolve(root, story.sourceFile), "utf8");
  const headings = [...markdown.matchAll(/^### (.+)$/gm)];
  const images = headings.map((heading, index) => {
    const start = heading.index + heading[0].length;
    const end = headings[index + 1]?.index ?? markdown.indexOf("## Source credits and editorial notes");
    const section = markdown.slice(start, end);
    const image = section.match(/!\[([^\]]+)]\(([^)]+\.png)\)/);
    const caption = section.match(/^\*([^\n]+)\*$/m);
    if (!image) return null;
    const stem = image[2].replace(/\.png$/i, "");
    return {
      path: `/assets/stories/${story.slug}/${stem}-1536.webp`,
      title: `${story.title}: ${heading[1]}`,
      caption: plainCaption(caption?.[1] || image[1])
    };
  }).filter(Boolean);

  if (images.length !== 4) throw new Error(`${story.slug} must contribute exactly four sitemap images; found ${images.length}.`);
  return images;
}

const storyImageEntries = new Map();
for (const story of stories) storyImageEntries.set(story.slug, await storyImages(story));

const routes = [
  {
    path: "/",
    lastmod: staticLastmod["/"],
    images: [
      { path: "/assets/brand/hero.webp", title: "Spirit of 1776 illustrated history", caption: "Chibi American-history characters introduce ten sourced stories and a small history-goods collection." },
      { path: "/assets/brand/social-card.png", title: "Spirit of 1776 stories worth keeping", caption: "Spirit of 1776 illustrated American-history stories." }
    ]
  },
  {
    path: "/stories/",
    lastmod: staticLastmod["/stories/"],
    images: stories.slice(0, 4).map((story) => ({
      path: story.socialImage,
      title: story.title,
      caption: story.imageAlt
    }))
  },
  ...stories.map((story) => ({
    path: story.href,
    lastmod: story.modifiedDate,
    images: storyImageEntries.get(story.slug)
  })),
  { path: "/timeline/", lastmod: staticLastmod["/timeline/"] },
  { path: "/quiz/", lastmod: staticLastmod["/quiz/"] },
  {
    path: "/shop/",
    lastmod: staticLastmod["/shop/"],
    images: products.map((product) => ({ path: product.image, title: product.name, caption: product.alt }))
  },
  ...products.map((product) => ({
    path: product.href,
    lastmod: product.modifiedDate,
    images: [{ path: product.primaryImage, title: product.displayName, caption: product.alt }]
  })),
  { path: "/about/", lastmod: staticLastmod["/about/"] },
  { path: "/privacy/", lastmod: staticLastmod["/privacy/"] },
  {
    path: "/flight-93/",
    lastmod: staticLastmod["/flight-93/"],
    images: [{ path: "/assets/flight-93/social-card.jpg", title: "Flight 93: They learned, voted, and acted", caption: "Standalone illustrated Flight 93 civic-courage feature." }]
  }
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routes.map(({ path, lastmod, images = [] }) => `  <url>
    <loc>${origin}${path}</loc>
    <lastmod>${lastmod}</lastmod>${images.map((image) => `
    <image:image>
      <image:loc>${origin}${xmlEscape(image.path)}</image:loc>
      <image:title>${xmlEscape(image.title)}</image:title>
      <image:caption>${xmlEscape(image.caption || image.title)}</image:caption>
    </image:image>`).join("")}
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
console.log(`Added sitemap.xml and robots.txt with ${routes.length} public routes and stable modification dates.`);
