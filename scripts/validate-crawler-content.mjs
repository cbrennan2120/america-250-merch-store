import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { products, stories } from "../src/data/content.js";

const root = resolve(import.meta.dirname, "..");
const errors = [];
const read = (path) => readFileSync(resolve(root, path), "utf8");

function graphFrom(path) {
  const html = read(path);
  const matches = [...html.matchAll(/<script type="application\/ld\+json" data-static-structured-data>([\s\S]*?)<\/script>/g)];
  if (matches.length !== 1) {
    errors.push(`${path} must contain exactly one static JSON-LD graph; found ${matches.length}.`);
    return [];
  }
  try {
    return JSON.parse(matches[0][1])["@graph"] ?? [];
  } catch (error) {
    errors.push(`${path} contains invalid JSON-LD: ${error.message}`);
    return [];
  }
}

for (const [path, grouped] of [["index.html", false], ["shop/index.html", true]]) {
  const html = read(path);
  const cardCount = (html.match(/class="product-card"/g) || []).length;
  if (cardCount !== 6) errors.push(`${path} must expose six product cards in raw HTML; found ${cardCount}.`);
  for (const product of products) {
    for (const value of [product.displayName, product.description, product.priceLabel, product.image, product.href]) {
      if (!html.includes(value)) errors.push(`${path} is missing crawler-visible product content: ${value}`);
    }
  }
  if (grouped && (html.match(/class="product-design-group"/g) || []).length !== 3) errors.push("Shop raw HTML must contain three design groups.");
}

const homeGraph = graphFrom("index.html");
for (const type of ["Person", "Organization", "WebSite"]) {
  if (!homeGraph.some((node) => node["@type"] === type)) errors.push(`Homepage schema is missing ${type}.`);
}

const shopGraph = graphFrom("shop/index.html");
const productNodes = shopGraph.filter((node) => node["@type"] === "Product");
if (productNodes.length !== 6) errors.push(`Shop schema must contain six Product nodes; found ${productNodes.length}.`);
for (const product of products) {
  const node = productNodes.find((candidate) => candidate["@id"] === `https://spiritof1776.store${product.href}#product`);
  if (!node || node.name !== product.displayName || node.offers?.price !== product.priceLabel.replace(/[^0-9.]/g, "") || node.offers?.url !== product.productUrl || !node.image?.includes(`https://spiritof1776.store${product.primaryImage}`)) {
    errors.push(`Shop schema is incomplete for ${product.id}.`);
  }
}

for (const product of products) {
  const path = `shop/${product.slug}/index.html`;
  const html = read(path);
  const graph = graphFrom(path);
  const productNode = graph.find((node) => node["@type"] === "Product");
  const breadcrumb = graph.find((node) => node["@type"] === "BreadcrumbList");
  if (!html.includes(`<h1 id="product-title">${product.displayName}</h1>`) || !html.includes(product.priceLabel) || !html.includes(product.productUrl)) errors.push(`${path} is missing its product name, price, or checkout URL.`);
  if ((html.match(/class="product-gallery__item/g) || []).length !== product.galleryImages.length) errors.push(`${path} must expose its complete gallery in raw HTML.`);
  if (!breadcrumb || breadcrumb.itemListElement?.length !== 3) errors.push(`${path} needs three-level BreadcrumbList schema.`);
  if (!productNode || productNode["@id"] !== `https://spiritof1776.store${product.href}#${"product"}` || productNode.offers?.url !== product.productUrl || productNode.offers?.price !== product.priceLabel.replace(/[^0-9.]/g, "")) errors.push(`${path} has incomplete Product or Offer schema.`);
}

const hubHtml = read("stories/index.html");
const hubGraph = graphFrom("stories/index.html");
if (!hubHtml.includes('class="breadcrumbs"') || !hubGraph.some((node) => node["@type"] === "BreadcrumbList")) errors.push("Stories hub needs visible and structured breadcrumbs.");
if (/Read (?:this|the) story/i.test(hubHtml) || /Read (?:this|the) story/i.test(read("index.html"))) errors.push("Homepage and Stories hub must use descriptive story-link anchors.");

for (const story of stories) {
  const path = `stories/${story.slug}/index.html`;
  const html = read(path);
  const graph = graphFrom(path);
  const article = graph.find((node) => node["@type"] === "Article");
  const breadcrumb = graph.find((node) => node["@type"] === "BreadcrumbList");
  if (!html.includes('class="breadcrumbs"') || !breadcrumb || breadcrumb.itemListElement?.length !== 3) errors.push(`${story.slug} needs visible and three-level structured breadcrumbs.`);
  if ((html.match(/class="related-story-card"/g) || []).length !== 3) errors.push(`${story.slug} needs exactly three topic-related story cards.`);
  if ((html.match(/data-related-story=/g) || []).length !== 3) errors.push(`${story.slug} related story cards need crawlable descriptive links.`);
  if (html.includes(`data-related-story="${story.slug}"`)) errors.push(`${story.slug} must not link to itself as a related story.`);
  if (!html.includes('rel="author">Chris Brennan</a>') || !html.includes(`<time datetime="${story.publishedDate}">`) || !html.includes(`<time datetime="${story.modifiedDate}">`)) errors.push(`${story.slug} needs a visible creator and publication/review dates.`);
  if (!article) {
    errors.push(`${story.slug} is missing Article schema.`);
    continue;
  }
  const expected = {
    headline: story.title,
    description: story.metaDescription,
    datePublished: `${story.publishedDate}T12:00:00-04:00`,
    dateModified: `${story.modifiedDate}T12:00:00-04:00`
  };
  for (const [key, value] of Object.entries(expected)) if (article[key] !== value) errors.push(`${story.slug} Article schema has an incorrect ${key}.`);
  if (article.image?.url !== `https://spiritof1776.store${story.primaryImage}` || article.image?.caption !== story.imageAlt) errors.push(`${story.slug} Article schema has incorrect primary-image data.`);
  if (article.author?.["@id"] !== "https://chrisbrennan.net/#person" || article.publisher?.["@id"] !== "https://spiritof1776.store/#organization") errors.push(`${story.slug} Article schema has incorrect author or publisher.`);
  if (article.mainEntityOfPage?.["@id"] !== `https://spiritof1776.store${story.href}`) errors.push(`${story.slug} Article schema has an incorrect canonical page.`);
  if (!Array.isArray(article.citation) || article.citation.length < 3) errors.push(`${story.slug} Article schema needs at least three source citations.`);
  const relatedSlugs = [...html.matchAll(/data-related-story="([^"]+)"/g)].map((match) => match[1]);
  if (relatedSlugs.length !== 3 || new Set(relatedSlugs).size !== 3) errors.push(`${story.slug} needs three unique related-story links.`);
  if (relatedSlugs.includes(story.slug) || relatedSlugs.some((slug) => !stories.some((candidate) => candidate.slug === slug))) errors.push(`${story.slug} has an invalid related-story destination.`);
}

const pagesThatMustNotLinkFlight93 = [
  "index.html", "stories/index.html", "shop/index.html", "about/index.html", "privacy/index.html", "timeline/index.html", "quiz/index.html",
  ...stories.map(({ slug }) => `stories/${slug}/index.html`),
  ...products.map(({ slug }) => `shop/${slug}/index.html`)
];
for (const path of pagesThatMustNotLinkFlight93) {
  if (/href="\/flight-93\/?"/.test(read(path))) errors.push(`${path} must not link to the standalone Flight 93 page.`);
}

for (const path of ["about/index.html", "privacy/index.html", "timeline/index.html", "quiz/index.html"]) graphFrom(path);

const siteSource = read("src/site.js");
if (/renderProducts|innerHTML\s*=|injectStructuredData|application\/ld\+json/.test(siteSource)) errors.push("Browser JavaScript must not render product cards or structured data.");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Validated crawler-visible identity, ten articles, six products, prices, images, links, and static JSON-LD.");
