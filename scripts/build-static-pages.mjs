import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { productDesigns, products } from "../src/data/content.js";
import { baseGraph, jsonLd, productSchemas, renderProductGrid } from "./lib/static-content.mjs";
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

async function update(relativePath, transform) {
  const filename = resolve(root, relativePath);
  const source = await readFile(filename, "utf8");
  await writeFile(filename, transform(source), "utf8");
}

await update("index.html", (html) => {
  const withProducts = replaceManagedBlock(html, "homepage-products", renderProductGrid(products, productDesigns));
  return replaceManagedBlock(withProducts, "structured-data", jsonLd(baseGraph()));
});

await update("shop/index.html", (html) => {
  const withProducts = replaceManagedBlock(html, "shop-products", renderProductGrid(products, productDesigns, true));
  return replaceManagedBlock(withProducts, "structured-data", jsonLd([...baseGraph(), ...productSchemas(products)]));
});

for (const page of ["about/index.html", "privacy/index.html", "timeline/index.html", "quiz/index.html"]) {
  await update(page, (html) => replaceManagedBlock(html, "structured-data", jsonLd(baseGraph())));
}

for (const product of products) {
  const target = resolve(root, "shop", product.slug);
  await mkdir(target, { recursive: true });
  await writeFile(resolve(target, "index.html"), productPage(product, products, stories), "utf8");
}

console.log(`Rendered crawler-visible content, static schema, and ${products.length} product pages.`);
