import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { productDesigns, products } from "../src/data/content.js";
import { pageSeo } from "../src/data/page-seo.js";
import { baseGraph, escapeHtml, jsonLd, productSchemas, renderProductGrid } from "./lib/static-content.mjs";
import { productPage } from "./lib/product-page.mjs";
import { stories } from "../src/data/story-manifest.js";

const root = resolve(import.meta.dirname, "..");

function replaceManagedBlock(html, name, content) {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  const block = `${start}\n${content}\n${end}`;
  const pattern = new RegExp(`${start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
  if (pattern.test(html)) return html.replace(pattern, block);
  if (name === "structured-data") return html.replace("</head>", `  ${block}\n</head>`);
  throw new Error(`Missing ${name} build markers.`);
}

function applySeo(html, seo) {
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const replacements = [
    [/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`],
    [/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`],
    [/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`],
    [/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${title}">`],
    [/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${description}">`],
    [/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`]
  ];
  return replacements.reduce((output, [pattern, replacement]) => {
    if (!pattern.test(output)) throw new Error(`Missing SEO field in ${seo.path}: ${pattern}`);
    return output.replace(pattern, replacement);
  }, html);
}

async function update(relativePath, transform) {
  const filename = resolve(root, relativePath);
  const source = await readFile(filename, "utf8");
  await writeFile(filename, transform(source), "utf8");
}

await update("index.html", (html) => {
  const withProducts = replaceManagedBlock(html, "homepage-products", renderProductGrid(products, productDesigns));
  return applySeo(replaceManagedBlock(withProducts, "structured-data", jsonLd(baseGraph())), pageSeo.home);
});

await update("shop/index.html", (html) => {
  const withProducts = replaceManagedBlock(html, "shop-products", renderProductGrid(products, productDesigns, true));
  return applySeo(replaceManagedBlock(withProducts, "structured-data", jsonLd([...baseGraph(), ...productSchemas(products)])), pageSeo.shop);
});

for (const seo of [pageSeo.about, pageSeo.privacy, pageSeo.timeline, pageSeo.quiz]) {
  await update(seo.path, (html) => applySeo(replaceManagedBlock(html, "structured-data", jsonLd(baseGraph())), seo));
}

await update(pageSeo.flight93.path, (html) => applySeo(html, pageSeo.flight93));

for (const product of products) {
  const target = resolve(root, "shop", product.slug);
  await mkdir(target, { recursive: true });
  await writeFile(resolve(target, "index.html"), productPage(product, products, stories), "utf8");
}

console.log(`Rendered crawler-visible content, static schema, and ${products.length} product pages.`);
