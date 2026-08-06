import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { products, quizQuestions, stories, timeline } from "../src/data/content.js";

const root = resolve(import.meta.dirname, "..");
const errors = [];
const unique = (values) => new Set(values).size === values.length;
const approvedSource = (value) => {
  try {
    const host = new URL(value).hostname;
    return host.endsWith(".gov") || host === "loc.gov" || host.endsWith(".loc.gov") || host === "si.edu" || host.endsWith(".si.edu");
  } catch {
    return false;
  }
};

if (products.length !== 3) errors.push("The launch catalog must contain exactly three products.");
if (!unique(products.map(({ id }) => id))) errors.push("Product IDs must be unique.");
for (const product of products) {
  for (const key of ["id", "name", "category", "priceLabel", "image", "imageAvif", "printFile", "alt", "description", "analyticsLabel", "availability"]) {
    if (!product[key]) errors.push(`Product ${product.id || "unknown"} is missing ${key}.`);
  }
  for (const file of [product.image, product.imageAvif, product.printFile]) {
    if (!existsSync(resolve(root, "public", file.replace(/^\//, "")))) errors.push(`Missing product asset ${file}.`);
  }
  const destination = product.productUrl || product.storeUrl;
  if (!destination?.startsWith("https://") || /example|placeholder/i.test(destination)) errors.push(`Product ${product.id} has an invalid store URL.`);
  if (product.availability === "live" && !product.productUrl) errors.push(`Live product ${product.id} requires a product-specific URL.`);
}

if (stories.length !== 3 || !unique(stories.map(({ slug }) => slug))) errors.push("Stories must contain three unique slugs.");
for (const story of stories) {
  if (!story.sources?.length || story.sources.some((source) => !approvedSource(source))) errors.push(`Story ${story.slug} needs approved institutional sources.`);
}

if (timeline.length !== 8) errors.push("Timeline must contain exactly eight milestones.");
if (timeline.some((entry) => !approvedSource(entry.source))) errors.push("Every timeline entry needs an approved institutional source.");

if (quizQuestions.length !== 10 || !unique(quizQuestions.map(({ id }) => id))) errors.push("Quiz must contain ten unique questions.");
for (const question of quizQuestions) {
  if (question.choices.length < 2 || question.correctIndex < 0 || question.correctIndex >= question.choices.length) errors.push(`Quiz question ${question.id} has invalid choices.`);
  if (!question.explanation || !approvedSource(question.source)) errors.push(`Quiz question ${question.id} needs an explanation and approved source.`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${products.length} products, ${stories.length} stories, ${timeline.length} timeline entries, and ${quizQuestions.length} quiz questions.`);
