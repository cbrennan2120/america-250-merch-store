import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { productDesigns, products, quizQuestions, stories, timeline } from "../src/data/content.js";

const root = resolve(import.meta.dirname, "..");
const errors = [];
const aboutHtml = readFileSync(resolve(root, "about", "index.html"), "utf8");
const unique = (values) => new Set(values).size === values.length;
const approvedSource = (value) => {
  try {
    const host = new URL(value).hostname;
  return host.endsWith(".gov")
    || host === "loc.gov"
    || host.endsWith(".loc.gov")
    || host === "si.edu"
    || host.endsWith(".si.edu")
    || host === "mountvernon.org"
    || host.endsWith(".mountvernon.org")
    || host === "nationalww2museum.org"
    || host.endsWith(".nationalww2museum.org");
  } catch {
    return false;
  }
};

if (products.length !== 6) errors.push("The chibi launch catalog must contain exactly six products.");
if (!unique(products.map(({ id }) => id))) errors.push("Product IDs must be unique.");
if (productDesigns.length !== 3 || !unique(productDesigns.map(({ id }) => id))) errors.push("The catalog must contain three unique designs.");
if (!unique(products.map(({ displayName }) => displayName))) errors.push("Product display names must be unique.");
const designIds = new Set(productDesigns.map(({ id }) => id));
for (const product of products) {
  for (const key of ["id", "slug", "href", "designId", "designName", "displayName", "name", "category", "priceLabel", "image", "alt", "description", "seoTitle", "metaDescription", "longDescription", "specifications", "materials", "careInstructions", "sizesOrDimensions", "shippingSummary", "returnSummary", "primaryImage", "galleryImages", "analyticsLabel", "availability", "relatedStorySlugs"]) {
    if (!product[key]) errors.push(`Product ${product.id || "unknown"} is missing ${key}.`);
  }
  if (product.slug !== product.id || product.href !== `/shop/${product.slug}/`) errors.push(`Product ${product.id} must use its stable internal product route.`);
  if (product.galleryImages?.length < 3) errors.push(`Product ${product.id} needs at least three gallery images.`);
  for (const galleryImage of product.galleryImages ?? []) {
    if (!galleryImage.src || !galleryImage.srcSet || !galleryImage.alt) errors.push(`Product ${product.id} has incomplete gallery image data.`);
    for (const reference of [galleryImage.src, ...galleryImage.srcSet.split(", ").map((entry) => entry.split(" ")[0])]) {
      if (!existsSync(resolve(root, "public", reference.replace(/^\//, "")))) errors.push(`Missing product gallery asset ${reference}.`);
    }
  }
  if (!designIds.has(product.designId)) errors.push(`Product ${product.id} has an unknown design ID.`);
  for (const file of [product.image]) {
    if (file && !existsSync(resolve(root, "public", file.replace(/^\//, "")))) errors.push(`Missing product asset ${file}.`);
  }
  const destination = product.productUrl || product.storeUrl;
  if (!destination?.startsWith("https://") || /example|placeholder/i.test(destination)) errors.push(`Product ${product.id} has an invalid store URL.`);
  if (product.availability === "live" && !product.productUrl) errors.push(`Live product ${product.id} requires a product-specific URL.`);
}
for (const design of productDesigns) {
  if (products.filter(({ designId }) => designId === design.id).length !== 2) errors.push(`Design ${design.id} must contain exactly two products.`);
}

if (stories.length !== 10 || !unique(stories.map(({ slug }) => slug))) errors.push("Stories must contain ten unique slugs.");
for (const story of stories) {
  if (!story.href?.startsWith("/stories/")) errors.push(`Story ${story.slug} must use a permanent /stories/ route.`);
  for (const key of ["publishedDate", "modifiedDate", "seoTitle", "metaDescription", "primaryImage", "imageAlt", "topics"]) {
    if (!story[key] || (Array.isArray(story[key]) && !story[key].length)) errors.push(`Story ${story.slug} is missing ${key}.`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(story.publishedDate) || !/^\d{4}-\d{2}-\d{2}$/.test(story.modifiedDate)) errors.push(`Story ${story.slug} has an invalid publication or review date.`);
  if (story.modifiedDate < story.publishedDate) errors.push(`Story ${story.slug} is modified before it was published.`);
  if (!existsSync(resolve(root, "public", story.primaryImage.replace(/^\//, "")))) errors.push(`Story ${story.slug} is missing its primary image.`);
  if (story.sources?.length && story.sources.some((source) => !approvedSource(source))) errors.push(`Story ${story.slug} has a non-institutional source.`);
}

if (timeline.length !== 10) errors.push("Timeline must contain exactly ten milestones.");
if (timeline.some((entry) => !approvedSource(entry.source))) errors.push("Every timeline entry needs an approved institutional source.");

if (quizQuestions.length !== 10 || !unique(quizQuestions.map(({ id }) => id))) errors.push("Quiz must contain ten unique questions.");
for (const question of quizQuestions) {
  if (question.choices.length < 2 || question.correctIndex < 0 || question.correctIndex >= question.choices.length) errors.push(`Quiz question ${question.id} has invalid choices.`);
  if (!question.explanation || !approvedSource(question.source)) errors.push(`Quiz question ${question.id} needs an explanation and approved source.`);
}

if (!aboutHtml.includes('href="https://chrisbrennan.net/" rel="author">Chris Brennan</a>')) {
  errors.push("The About page must identify and link to the project's creator.");
}
const publicHtmlPaths = [
  "index.html", "shop/index.html", "about/index.html", "privacy/index.html", "timeline/index.html", "quiz/index.html", "flight-93/index.html", "404.html", "stories/index.html",
  ...stories.map(({ slug }) => `stories/${slug}/index.html`)
];
const publicHtml = publicHtmlPaths.map((path) => readFileSync(resolve(root, path), "utf8"));
if (publicHtml.some((html) => html.includes("github.com/cbrennan2120/america-250-merch-store/issues"))) errors.push("Customer-facing pages must not use GitHub for contact.");
if (publicHtml.filter((html) => html.includes("AI-assisted")).length !== 1 || !aboutHtml.includes("AI-assisted")) errors.push("AI-assisted artwork disclosure must appear only on the About page.");
if (!publicHtml.every((html) => html.includes("mailto:cbrennan2120@gmail.com"))) errors.push("Every customer-facing page must provide the customer contact email.");
if (readFileSync(resolve(root, "index.html"), "utf8").includes("<span>Not affiliated with America250</span>")) errors.push("The homepage trust strip must not contain the affiliation disclaimer.");
if ((readFileSync(resolve(root, "shop", "index.html"), "utf8").match(/Not affiliated with America250/g) || []).length !== 1) errors.push("The shop page must keep the affiliation disclaimer only in its footer.");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${products.length} products, ${stories.length} stories, ${timeline.length} timeline entries, and ${quizQuestions.length} quiz questions.`);
