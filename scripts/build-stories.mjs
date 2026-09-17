import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { products } from "../src/data/content.js";
import { stories as manifest, storyTopicGroups } from "../src/data/story-manifest.js";
import { ORIGIN, baseGraph, breadcrumbSchema, creatorId, jsonLd, organizationId } from "./lib/static-content.mjs";

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

const iconLinks = () => `<link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml" sizes="any">
  <link rel="icon" href="/assets/brand/favicon-48.png" type="image/png" sizes="48x48">
  <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="48x48">
  <link rel="apple-touch-icon" href="/assets/brand/favicon-192.png" sizes="192x192">
  <link rel="manifest" href="/site.webmanifest">`;

function socialMeta({ type, title, description, url, image, imageAlt }) {
  return `<meta property="og:type" content="${type}">
  <meta property="og:site_name" content="Spirit of 1776">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:alt" content="${escapeHtml(imageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}">`;
}

function inlineMarkdown(value) {
  return escapeHtml(value).replace(/\[([^\]]+)]\((https?:\/\/[^)]+)\)/g, '<a href="$2" rel="noreferrer">$1</a>');
}

function presentationCaption(value) {
  return inlineMarkdown(value.replace(/\s*Illustration:\s*original AI-assisted chibi artwork created for Spirit of 1776\.?\s*$/i, "").trim());
}

function sourceUrls(story) {
  return story.sources.flatMap((source) => [...source.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]));
}

const schemaDate = (value) => `${value}T12:00:00-04:00`;

function articleSchema(story) {
  const canonical = `${ORIGIN}${story.href}`;
  return {
    "@type": "Article",
    "@id": `${canonical}#article`,
    headline: story.title,
    description: story.metaDescription,
    image: { "@type": "ImageObject", url: `${ORIGIN}${story.primaryImage}`, caption: story.imageAlt },
    author: { "@id": creatorId },
    publisher: { "@id": organizationId },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    datePublished: schemaDate(story.publishedDate),
    dateModified: schemaDate(story.modifiedDate),
    citation: sourceUrls(story),
    keywords: story.topics.join(", ")
  };
}

function visibleBreadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items.map((item, index) => `<li>${index === items.length - 1 ? `<span aria-current="page">${escapeHtml(item.name)}</span>` : `<a href="${item.href}">${escapeHtml(item.name)}</a>`}</li>`).join("")}</ol></nav>`;
}

function displayDate(value) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function paragraphs(markdown) {
  return markdown
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((block) => `<p>${inlineMarkdown(block.replace(/[\r\n]+/g, " ").trim())}</p>`)
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
    <div class="shell footer-grid"><div><h2>Spirit of 1776</h2><p>An independent history project created by Chris Brennan.</p></div><div><h2>Explore</h2><ul><li><a href="/stories/">Stories</a></li><li><a href="/timeline/">Timeline</a></li><li><a href="/quiz/">Quiz</a></li><li><a href="/shop/">Shop</a></li></ul></div><div><h2>Project</h2><ul><li><a href="/about/">About and sources</a></li><li><a href="/privacy/">Privacy choices</a></li><li><a href="mailto:cbrennan2120@gmail.com">Contact Chris</a></li></ul></div></div>
    <div class="shell footer-note">© 2026 Spirit of 1776. Independent project. Not affiliated with America250.</div>
  </footer>`;
}

function merchCallout(story) {
  if (story.merchandiseMode === "none") return "";
  const related = products.filter((product) => story.relatedProductIds?.includes(product.id)).slice(0, 2);
  if (!related.length) return `<aside class="story-shop-note" aria-label="Related shop note"><p class="eyebrow">Shop note</p><h2>Inspired by the early republic collection</h2><p>The first chibi collection focuses on playful Revolutionary-era moments. Serious stories keep the product pitch out of the narrative.</p><a class="button button--secondary" href="/shop/">Visit the shop</a></aside>`;
  return `<aside class="story-shop-note" aria-label="Related collection"><p class="eyebrow">Related collection</p><h2>Carry the story forward</h2><div class="story-product-row">${related.map((product) => `<a class="story-product-mini" href="${product.href}"><img src="${product.image}" alt="" loading="lazy"><span>${product.name}</span><strong>${product.priceLabel}</strong></a>`).join("")}</div></aside>`;
}

function sourcesDrawer(story) {
  return `<details class="source-drawer"><summary>Sources, image captions, and editorial notes</summary><div class="source-drawer__body"><ul>${story.sources.map((source) => `<li>${inlineMarkdown(source)}</li>`).join("")}</ul>${story.notes.map((note) => `<p>${inlineMarkdown(note)}</p>`).join("")}<p><a href="/about/#artwork">How the artwork is made</a></p></div></details>`;
}

function relatedStoriesBlock(story, collection) {
  const groupNames = new Map(storyTopicGroups.map((group) => [group.id, group.name]));
  const storyIndex = collection.findIndex((candidate) => candidate.slug === story.slug);
  const related = collection
    .map((candidate, candidateIndex) => ({
      story: candidate,
      distance: Math.abs(candidateIndex - storyIndex),
      sharedGroups: candidate.topicGroupIds.filter((id) => story.topicGroupIds.includes(id))
    }))
    .filter((candidate) => candidate.story.slug !== story.slug && candidate.sharedGroups.length)
    .sort((a, b) => b.sharedGroups.length - a.sharedGroups.length || a.distance - b.distance)
    .slice(0, 3);

  return `<aside class="related-stories" aria-labelledby="related-stories-heading">
    <div class="related-stories__heading"><p class="eyebrow">Follow the idea</p><h2 id="related-stories-heading">Related stories</h2><p>Continue through moments connected by the same questions about liberty, power, citizenship, and law.</p></div>
    <div class="related-stories__grid">${related.map(({ story: candidate, sharedGroups }) => `<article class="related-story-card"><p class="related-story-card__topic">${sharedGroups.map((id) => escapeHtml(groupNames.get(id))).join(" · ")}</p><h3>${escapeHtml(candidate.title)}</h3><p>${escapeHtml(candidate.summary)}</p><a href="${candidate.href}" data-related-story="${candidate.slug}">${escapeHtml(candidate.linkLabel)} <span aria-hidden="true">→</span></a></article>`).join("")}</div>
  </aside>`;
}

function storyPage(story, index, collection) {
  const previous = collection[(index - 1 + collection.length) % collection.length];
  const next = collection[(index + 1) % collection.length];
  const canonical = `https://spiritof1776.store/stories/${story.slug}/`;
  const crumbs = [{ name: "Home", href: "/" }, { name: "Stories", href: "/stories/" }, { name: story.title, href: story.href }];
  const merchandise = merchCallout(story);
  const relatedStories = relatedStoriesBlock(story, collection);
  const chapters = story.sections.map((section, sectionIndex) => {
    const figure = section.image ? `<figure class="story-chapter__figure">${responsiveImage(story, section.image, section.alt)}<figcaption>${presentationCaption(section.caption)}</figcaption></figure>` : "";
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
  <meta name="theme-color" content="#13263d">
  <meta name="description" content="${escapeHtml(story.metaDescription)}">
  ${socialMeta({ type: "article", title: story.seoTitle, description: story.metaDescription, url: canonical, image: `https://spiritof1776.store${story.primaryImage}`, imageAlt: story.imageAlt })}
  <link rel="canonical" href="${canonical}">
  ${iconLinks()}
  ${jsonLd([...baseGraph(), articleSchema(story), breadcrumbSchema(crumbs)])}
  <title>${escapeHtml(story.seoTitle)}</title>
</head>
<body class="story-page theme-${story.theme}">
  ${header()}
  <progress class="reading-progress" data-reading-progress max="100" value="0" aria-label="Reading progress"></progress>
  <main id="main">
    ${visibleBreadcrumbs(crumbs)}
    <article class="story-experiment" data-story-id="${story.slug}">
      <header class="story-hero">
        <div class="story-hero__copy">
          <p class="eyebrow">Story ${String(index + 1).padStart(2, "0")} / ${escapeHtml(story.era)}</p>
          <h1>${escapeHtml(story.title)}</h1>
          <p class="story-hero__subtitle">${escapeHtml(story.subtitle)}</p>
          <p class="story-hero__summary">${escapeHtml(story.summary)}</p>
          <p class="story-byline">By <a href="/about/" rel="author">Chris Brennan</a><br><span>Published <time datetime="${story.publishedDate}">${displayDate(story.publishedDate)}</time> · Reviewed <time datetime="${story.modifiedDate}">${displayDate(story.modifiedDate)}</time></span></p>
          <a class="button" href="#chapter-1">Begin the story</a>
        </div>
        <figure class="story-hero__art">${responsiveImage(story, story.sections[0].image, story.sections[0].alt, true)}<figcaption>${presentationCaption(story.sections[0].caption)}</figcaption></figure>
      </header>
      <div class="story-body">${chapters}</div>
      <div data-story-complete></div>
      ${sourcesDrawer(story)}${relatedStories}${merchandise ? `
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

function storyCard(story, index) {
  const previews = story.sections.slice(0, 3).map((section) => `<img src="${imageBase(story, section.image)}-768.webp" alt="" loading="lazy" decoding="async">`).join("");
  return `<article class="story-card story-card--${story.theme}" id="story-${story.slug}" data-era="${escapeHtml(story.era)}"><a class="story-card__preview" href="/stories/${story.slug}/" aria-label="Preview ${escapeHtml(story.title)}"><span class="story-card__number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>${previews}</a><div class="story-card__body"><div class="story-card__meta"><span>${escapeHtml(story.era)}</span><span>${story.readMinutes} min read</span></div><p class="story-card__format">${escapeHtml(story.format)}</p><h2>${escapeHtml(story.title)}</h2><p class="story-card__subtitle">${escapeHtml(story.subtitle)}</p><p>${escapeHtml(story.summary)}</p><a class="story-card__action" href="/stories/${story.slug}/" data-story-link="${story.slug}">${escapeHtml(story.linkLabel)} <span aria-hidden="true">→</span></a></div></article>`;
}

function hubPage(stories) {
  const crumbs = [{ name: "Home", href: "/" }, { name: "Stories", href: "/stories/" }];
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#13263d">
  <meta name="description" content="Ten illustrated Spirit of 1776 stories about liberty, accountability, and America's unfinished promises.">
  ${socialMeta({ type: "website", title: "Stories | Spirit of 1776", description: "Ten illustrated, sourced American-history stories.", url: "https://spiritof1776.store/stories/", image: "https://spiritof1776.store/assets/brand/social-card.png", imageAlt: "Spirit of 1776 illustrated American-history stories" })}
  <link rel="canonical" href="https://spiritof1776.store/stories/">
  ${iconLinks()}
  ${jsonLd([...baseGraph(), breadcrumbSchema(crumbs)])}
  <title>Stories | Spirit of 1776</title>
</head>
<body class="preview-index">
  ${header()}
  <main id="main">
    ${visibleBreadcrumbs(crumbs)}
    <section class="index-hero"><div class="index-hero__copy"><p class="eyebrow">Choose your moment</p><h1>Ten stories. One American idea.</h1><p>Start in 1775 and travel through two centuries of people defending liberty, limiting power, and holding leaders accountable. Every story is illustrated, sourced, and built for a quick read.</p><a class="button-link" href="#stories">Browse all ten <span aria-hidden="true">↓</span></a></div><div class="index-hero__mosaic" aria-hidden="true">${stories.slice(0, 4).map((story) => `<img src="${imageBase(story, story.sections[0].image)}-768.webp" alt="" decoding="async">`).join("")}</div></section>
    <nav class="story-jump" aria-label="Jump to a story"><div><p>Jump to a story</p><ol>${stories.map((story, index) => `<li><a href="#story-${story.slug}"><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(story.title)}</a></li>`).join("")}</ol></div></nav>
    <section class="preview-note" aria-labelledby="story-filter-heading"><p class="eyebrow">The complete collection</p><h2 id="story-filter-heading">Pick the moment that grabs you.</h2><p>Each preview shows scenes from the story, its place in the timeline, and how long it takes to read. Read chronologically or jump straight to the subject that interests you.</p></section>
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
