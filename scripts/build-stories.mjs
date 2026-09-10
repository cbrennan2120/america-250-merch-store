import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { products } from "../src/data/content.js";
import { stories as manifest } from "../src/data/story-manifest.js";

const root = resolve(import.meta.dirname, "..");
const contentRoot = resolve(root, "content", "stories");
const outputRoot = resolve(root, "output");
const pageRoot = resolve(root, "stories");
const imageRoot = resolve(root, "public", "assets", "stories");
let sharpFactory;

async function getSharp() {
  if (!sharpFactory) sharpFactory = (await import("sharp")).default;
  return sharpFactory;
}

const escapeHtml = (value = "") => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function inlineMarkdown(value) {
  return escapeHtml(value).replace(/\[([^\]]+)]\((https?:\/\/[^)]+)\)/g, '<a href="$2" rel="noreferrer">$1</a>');
}

function paragraphs(markdown) {
  return markdown
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((block) => `<p>${inlineMarkdown(block.replace(/\n/g, " "))}</p>`)
    .join("\n");
}

function parseStory(markdown, config) {
  const title = markdown.match(/^# (.+)$/m)?.[1];
  const subtitle = markdown.match(/^## (.+)$/m)?.[1];
  const sourceStart = markdown.indexOf("## Source credits and editorial notes");
  if (!title || !subtitle || sourceStart < 0) throw new Error(`Missing required headings in ${config.sourceFile}`);

  const narrative = markdown.slice(0, sourceStart);
  const sourceLines = markdown.slice(sourceStart)
    .replace(/^## Source credits and editorial notes\s*/m, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const sectionsRaw = [...narrative.matchAll(/^### (.+)$/gm)];
  if (sectionsRaw.length !== 5) throw new Error(`${config.slug} must contain exactly five story sections`);

  const sections = sectionsRaw.map((match, index) => {
    const start = match.index + match[0].length;
    const end = sectionsRaw[index + 1]?.index ?? narrative.length;
    let content = narrative.slice(start, end).trim();
    const imageMatch = content.match(/!\[([^\]]+)]\(([^)]+\.png)\)/);
    const captionMatch = content.match(/^\*([^\n]+)\*$/m);
    if (index < 4 && (!imageMatch || !captionMatch)) throw new Error(`${config.slug} section ${index + 1} needs an image and caption`);
    if (imageMatch) content = content.replace(imageMatch[0], "");
    if (captionMatch) content = content.replace(captionMatch[0], "");
    return {
      heading: match[1],
      body: paragraphs(content),
      image: imageMatch?.[2] ?? "",
      alt: imageMatch?.[1] ?? "",
      caption: captionMatch?.[1] ?? ""
    };
  });

  const sources = sourceLines.filter((line) => line.startsWith("- ")).map((line) => line.slice(2));
  const notes = sourceLines.filter((line) => !line.startsWith("- "));
  if (sources.length < 3) throw new Error(`${config.slug} needs at least three source credits`);
  return { ...config, title, subtitle, sections, sources, notes };
}

function imageBase(story, filename) {
  return `/assets/stories/${story.slug}/${filename.replace(/\.png$/i, "")}`;
}

function responsiveImage(story, filename, alt, eager = false) {
  const base = imageBase(story, filename);
  return `<img src="${base}-768.webp" srcset="${base}-768.webp 768w, ${base}-1536.webp 1536w" sizes="(min-width: 70rem) 44rem, (min-width: 48rem) 56vw, 100vw" width="1536" height="1024" alt="${escapeHtml(alt)}" loading="${eager ? "eager" : "lazy"}" decoding="async">`;
}

function header() {
  return `<a class="skip-link" href="#main">Skip to main content</a>
  <header class="site-header">
    <div class="nav-shell">
      <a class="wordmark" href="/">Spirit of 1776<small>Stories worth keeping</small></a>
      <button class="menu-button" type="button" aria-expanded="false" aria-controls="primary-menu" data-menu-button>Menu</button>
      <nav class="site-nav" id="primary-menu" aria-label="Primary navigation" data-menu>
        <a href="/stories/">Stories</a><a href="/timeline/">Timeline</a><a href="/quiz/">Quiz</a><a href="/about/">About</a><a class="nav-shop" href="/shop/">Shop</a>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="shell footer-grid"><div><h2>Spirit of 1776</h2><p>Clear stories, original goods, and an invitation to keep asking better questions.</p></div><div><h2>Explore</h2><ul><li><a href="/stories/">Stories</a></li><li><a href="/timeline/">Timeline</a></li><li><a href="/quiz/">Quiz</a></li><li><a href="/shop/">Shop</a></li></ul></div><div><h2>Project</h2><ul><li><a href="/about/">About and sources</a></li><li><a href="/privacy/">Privacy choices</a></li><li><a href="https://github.com/cbrennan2120/america-250-merch-store/issues" target="_blank" rel="noopener">Contact and corrections</a></li></ul></div></div>
    <div class="shell footer-note">© 2026 Spirit of 1776. Independent educational and merchandise project. Not affiliated with America250.</div>
  </footer>`;
}

function merchCallout(story) {
  if (story.merchandiseMode === "none") return "";
  const related = products.filter((product) => story.relatedProductIds?.includes(product.id)).slice(0, 2);
  if (!related.length) return `<aside class="story-shop-note" aria-label="Related shop note"><p class="eyebrow">Shop note</p><h2>Inspired by the early republic collection</h2><p>The first chibi collection focuses on playful Revolutionary-era moments. Serious stories keep the product pitch out of the narrative.</p><a class="button button--secondary" href="/shop/">Visit the shop</a></aside>`;
  return `<aside class="story-shop-note" aria-label="Related collection"><p class="eyebrow">Related collection</p><h2>Carry the story forward</h2><div class="story-product-row">${related.map((product) => `<a class="story-product-mini" href="${product.productUrl}" target="_blank" rel="noopener" data-product-link="${product.analyticsLabel}"><img src="${product.image}" alt="" loading="lazy"><span>${product.name}</span><strong>${product.priceLabel}</strong></a>`).join("")}</div></aside>`;
}

function sourcesDrawer(story) {
  return `<details class="source-drawer"><summary>Sources, image captions, and editorial notes</summary><div class="source-drawer__body"><ul>${story.sources.map((source) => `<li>${inlineMarkdown(source)}</li>`).join("")}</ul>${story.notes.map((note) => `<p>${inlineMarkdown(note)}</p>`).join("")}</div></details>`;
}

function storyPage(story, index, collection) {
  const previous = collection[(index - 1 + collection.length) % collection.length];
  const next = collection[(index + 1) % collection.length];
  const canonical = `https://spiritof1776.store/stories/${story.slug}/`;
  const merchandise = merchCallout(story);
  const chapters = story.sections.map((section, sectionIndex) => {
    const figure = section.image ? `<figure class="story-chapter__figure">${responsiveImage(story, section.image, section.alt)}<figcaption>${inlineMarkdown(section.caption)}</figcaption></figure>` : "";
    return `<section class="story-chapter" aria-labelledby="chapter-${sectionIndex + 1}">
      <div class="story-chapter__copy"><p class="chapter-number">Scene ${String(sectionIndex + 1).padStart(2, "0")}</p><h2 id="chapter-${sectionIndex + 1}">${escapeHtml(section.heading)}</h2>${section.body}</div>${figure ? `
      ${figure}` : ""}
    </section>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(story.summary)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(story.title)} | Spirit of 1776">
  <meta property="og:description" content="${escapeHtml(story.summary)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://spiritof1776.store${story.socialImage}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml"><link rel="icon" href="/assets/brand/favicon-32.png" sizes="32x32" type="image/png"><link rel="apple-touch-icon" href="/assets/brand/favicon-192.png"><link rel="manifest" href="/site.webmanifest">
  <title>${escapeHtml(story.title)} | Spirit of 1776</title>
</head>
<body class="story-page theme-${story.theme}">
  ${header()}
  <progress class="reading-progress" data-reading-progress max="100" value="0" aria-label="Reading progress"></progress>
  <main id="main">
    <article class="story-experiment" data-story-id="${story.slug}">
      <header class="story-hero">
        <div class="story-hero__copy">
          <p class="eyebrow">Story ${String(index + 1).padStart(2, "0")} / ${escapeHtml(story.era)}</p>
          <h1>${escapeHtml(story.title)}</h1>
          <p class="story-hero__subtitle">${escapeHtml(story.subtitle)}</p>
          <p class="story-hero__summary">${escapeHtml(story.summary)}</p>
          <a class="button" href="#chapter-1">Begin the story</a>
        </div>
        <figure class="story-hero__art">${responsiveImage(story, story.sections[0].image, story.sections[0].alt, true)}<figcaption>${inlineMarkdown(story.sections[0].caption)}</figcaption></figure>
      </header>
      <div class="story-body">${chapters}</div>
      <div data-story-complete></div>
      ${sourcesDrawer(story)}${merchandise ? `
      ${merchandise}` : ""}
    </article>
    <nav class="story-nav" aria-label="Browse stories"><a href="/stories/${previous.slug}/"><span>Previous</span><strong>${escapeHtml(previous.title)}</strong></a><a href="/stories/${next.slug}/"><span>Next</span><strong>${escapeHtml(next.title)}</strong></a></nav>
  </main>
  ${footer()}
  <aside class="consent-banner" data-consent-banner hidden aria-label="Analytics preferences"><p><strong>Your choice matters.</strong> Optional analytics help us understand what visitors use. The site works without it. <a href="/privacy/">Learn more</a>.</p><div class="button-row"><button class="button" type="button" data-consent-accept>Allow analytics</button><button class="button button--secondary" type="button" data-consent-decline>Continue without</button></div></aside>
  <script type="module" src="/src/story.js"></script>
  <script type="module" src="/src/site.js"></script>
</body>
</html>`;
}

function storyCard(story) {
  return `<article class="story-card story-card--${story.theme}" data-era="${escapeHtml(story.era)}"><a class="story-card__image" href="/stories/${story.slug}/" aria-label="Read ${escapeHtml(story.title)}">${responsiveImage(story, story.sections[0].image, "", false)}</a><div class="story-card__body"><p class="eyebrow">${escapeHtml(story.era)} / ${story.readMinutes} min read</p><h2><a href="/stories/${story.slug}/" data-story-link="${story.slug}">${escapeHtml(story.title)}</a></h2><p class="story-card__subtitle">${escapeHtml(story.subtitle)}</p><p>${escapeHtml(story.summary)}</p></div></article>`;
}

function hubPage(stories) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Ten illustrated Spirit of 1776 stories about liberty, accountability, and America's unfinished promises.">
  <meta property="og:type" content="website"><meta property="og:title" content="Stories | Spirit of 1776"><meta property="og:description" content="Ten illustrated, sourced American-history stories."><meta property="og:image" content="https://spiritof1776.store/assets/brand/social-card.png">
  <link rel="canonical" href="https://spiritof1776.store/stories/"><link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml"><link rel="icon" href="/assets/brand/favicon-32.png" sizes="32x32" type="image/png"><link rel="apple-touch-icon" href="/assets/brand/favicon-192.png"><link rel="manifest" href="/site.webmanifest">
  <title>Stories | Spirit of 1776</title>
</head>
<body class="preview-index">
  ${header()}
  <main id="main">
    <section class="index-hero"><div class="index-hero__copy"><p class="eyebrow">Ten chibi history stories</p><h1>Liberty keeps asking for courage.</h1><p>Meet the people who argued, resisted, served, marched, investigated, and forced American promises to grow. The art is playful; the history stays sourced and serious where it needs to be.</p><a class="button" href="#stories">Explore all ten</a></div><div class="index-hero__mosaic" aria-hidden="true">${stories.slice(0, 4).map((story) => `<img src="${imageBase(story, story.sections[0].image)}-768.webp" alt="" decoding="async">`).join("")}</div></section>
    <section class="preview-note" aria-labelledby="story-filter-heading"><p class="eyebrow">Story path</p><h2 id="story-filter-heading">From 1775 to Watergate</h2><p>These ten moments trace a through-line: rights before rulers, power on loan, liberty widened by people brave enough to demand that America live up to its own words.</p></section>
    <section class="story-grid" id="stories" aria-label="Ten Spirit of 1776 stories">${stories.map(storyCard).join("\n")}</section>
  </main>
  ${footer()}
  <aside class="consent-banner" data-consent-banner hidden aria-label="Analytics preferences"><p><strong>Your choice matters.</strong> Optional analytics help us understand what visitors use. The site works without it. <a href="/privacy/">Learn more</a>.</p><div class="button-row"><button class="button" type="button" data-consent-accept>Allow analytics</button><button class="button button--secondary" type="button" data-consent-decline>Continue without</button></div></aside>
  <script type="module" src="/src/story.js"></script>
  <script type="module" src="/src/site.js"></script>
</body>
</html>`;
}

async function buildImages(story) {
  const sourceDir = resolve(outputRoot, story.slug);
  const targetDir = resolve(imageRoot, story.slug);
  await mkdir(targetDir, { recursive: true });
  const images = story.sections.map((section) => section.image).filter(Boolean);
  for (const filename of images) {
    const source = resolve(sourceDir, filename);
    await access(source);
    const stem = filename.replace(/\.png$/i, "");
    for (const { width, quality } of [{ width: 768, quality: 80 }, { width: 1536, quality: 86 }]) {
      const target = resolve(targetDir, `${stem}-${width}.webp`);
      const current = await stat(target).catch(() => null);
      if (!current || process.env.FORCE_STORY_ASSETS === "1") {
        const sharp = await getSharp();
        await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(target);
      }
    }
  }
}

await mkdir(pageRoot, { recursive: true });
await mkdir(imageRoot, { recursive: true });

const parsedStories = [];
for (const config of manifest) {
  const markdown = await readFile(resolve(root, config.sourceFile), "utf8");
  const story = parseStory(markdown, config);
  if (story.sections.filter((section) => section.image).length !== 4) throw new Error(`${story.slug} must have exactly four illustrations`);
  await buildImages(story);
  parsedStories.push(story);
}

for (const [index, story] of parsedStories.entries()) {
  const target = resolve(pageRoot, story.slug);
  await mkdir(target, { recursive: true });
  await writeFile(resolve(target, "index.html"), storyPage(story, index, parsedStories), "utf8");
}

await writeFile(resolve(pageRoot, "index.html"), hubPage(parsedStories), "utf8");
console.log(`Built ${parsedStories.length} permanent story pages.`);
