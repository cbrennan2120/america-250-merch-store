import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { products, quizQuestions, stories, timeline } from "../src/data/content.js";

const root = resolve(import.meta.dirname, "..");
const errors = [];
const aboutHtml = readFileSync(resolve(root, "about", "index.html"), "utf8");
const structuredDataSource = readFileSync(resolve(root, "src", "structured-data.js"), "utf8");
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
for (const product of products) {
  for (const key of ["id", "name", "category", "priceLabel", "image", "alt", "description", "analyticsLabel", "availability"]) {
    if (!product[key]) errors.push(`Product ${product.id || "unknown"} is missing ${key}.`);
  }
  for (const file of [product.image]) {
    if (file && !existsSync(resolve(root, "public", file.replace(/^\//, "")))) errors.push(`Missing product asset ${file}.`);
  }
  const destination = product.productUrl || product.storeUrl;
  if (!destination?.startsWith("https://") || /example|placeholder/i.test(destination)) errors.push(`Product ${product.id} has an invalid store URL.`);
  if (product.availability === "live" && !product.productUrl) errors.push(`Live product ${product.id} requires a product-specific URL.`);
}

if (stories.length !== 10 || !unique(stories.map(({ slug }) => slug))) errors.push("Stories must contain ten unique slugs.");
for (const story of stories) {
  if (!story.href?.startsWith("/stories/")) errors.push(`Story ${story.slug} must use a permanent /stories/ route.`);
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
if (!structuredDataSource.includes('"@id": "https://chrisbrennan.net/#person"')) {
  errors.push("Structured data must reference the shared Chris Brennan Person identity.");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${products.length} products, ${stories.length} stories, ${timeline.length} timeline entries, and ${quizQuestions.length} quiz questions.`);
