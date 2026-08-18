import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outputRoot = resolve(root, "output");
const pageRoot = resolve(root, "new");
const imageRoot = resolve(root, "public", "assets", "new");
let sharpFactory;

async function getSharp() {
  if (!sharpFactory) sharpFactory = (await import("sharp")).default;
  return sharpFactory;
}

const stories = [
  {
    slug: "declaration-of-independence",
    package: "declaration-of-independence",
    file: "declaration-of-independence-story.md",
    contact: "declaration-contact-sheet.png",
    era: "1776",
    format: "Founding folio",
    theme: "folio",
    summary: "Natural rights, public argument, and the revolutionary claim that government receives its power from the people.",
    merch: ["Franklin & the giant draft", "Printer's night-shift badge", "Rights Before Rulers mug"]
  },
  {
    slug: "lexington-and-concord",
    package: "lexington-and-concord",
    file: "lexington-and-concord-story.md",
    contact: "lexington-and-concord-contact-sheet.png",
    era: "1775",
    format: "Dispatch timeline",
    theme: "dispatch",
    summary: "How alarms, uncertain choices, and community resistance turned a weapons search into open conflict.",
    merch: ["Midnight alarm rider", "North Bridge defenders", "Give Me a Minute minuteman"]
  },
  {
    slug: "washington-surrenders-command",
    package: "washington-surrenders-command",
    file: "washington-surrenders-command-story.md",
    contact: "washington-surrenders-command-contact-sheet.png",
    era: "1783",
    format: "Civic gallery",
    theme: "gallery",
    summary: "The victorious general returns his commission and demonstrates that military power belongs beneath civilian government.",
    merch: ["Washington returns the commission", "Citizen, not Caesar emblem", "Power Given Back desk mug"]
  },
  {
    slug: "bill-of-rights",
    package: "bill-of-rights",
    file: "bill-of-rights-story.md",
    contact: "bill-of-rights-contact-sheet.png",
    era: "1791",
    format: "Amendment cards",
    theme: "amendments",
    summary: "Promises become enforceable rules that tell the federal government what it must not do.",
    merch: ["Madison's revision desk", "Twelve proposals messenger", "Rules Government Must Obey badge"]
  },
  {
    slug: "underground-railroad",
    package: "underground-railroad",
    file: "underground-railroad-story.md",
    contact: "underground-railroad-contact-sheet.png",
    era: "c. 1830–1865",
    format: "Night journey",
    theme: "night",
    summary: "Freedom seekers led their own resistance to legalized oppression, aided by courageous networks of people and places.",
    merch: ["Freedom seeker character study", "Courage travels by night", "Freedom Taken, Not Given print"]
  },
  {
    slug: "union-soldiers-and-emancipation",
    package: "union-soldiers-and-emancipation",
    file: "union-soldiers-and-emancipation-story.md",
    contact: "union-soldiers-and-emancipation-contact-sheet.png",
    era: "1861–1865",
    format: "Field report",
    theme: "field-report",
    summary: "Enslaved people and Black soldiers helped transform a war for Union into a war that destroyed slavery.",
    merch: ["United States Colored Troops portrait", "Freedom reaches the lines", "Liberated Become Liberators poster"]
  },
  {
    slug: "womens-suffrage",
    package: "womens-suffrage",
    file: "womens-suffrage-story.md",
    contact: "womens-suffrage-contact-sheet.png",
    era: "1848–1920",
    format: "Campaign scrapbook",
    theme: "scrapbook",
    summary: "Generations of organizers force the nation to expand the meaning of political self-government.",
    merch: ["Votes for Women marcher", "Suffrage sash sticker", "Self-Government Means Everyone mug"]
  },
  {
    slug: "d-day-and-the-fight-against-fascism",
    package: "d-day-and-the-fight-against-fascism",
    file: "d-day-and-the-fight-against-fascism-story.md",
    contact: "d-day-and-the-fight-against-fascism-contact-sheet.png",
    era: "1944",
    format: "Mission dossier",
    theme: "dossier",
    summary: "A vast coalition accepts terrible risk to open a foothold against Nazi occupation and totalitarian rule.",
    merch: ["Allied landing crew", "A Foothold for Liberation patch", "Coalition of Courage print"]
  },
  {
    slug: "civil-rights-movement",
    package: "civil-rights-movement",
    file: "civil-rights-movement-story.md",
    contact: "civil-rights-movement-contact-sheet.png",
    era: "1954–1965",
    format: "Movement poster",
    theme: "movement",
    summary: "Families, organizers, students, and marchers compel America to honor promises it had long denied.",
    merch: ["Montgomery walkers", "Selma marchers character study", "Honor the Promise poster"]
  },
  {
    slug: "watergate-accountability",
    package: "watergate-accountability",
    file: "watergate-accountability-story.md",
    contact: "watergate-accountability-contact-sheet.png",
    era: "1972–1974",
    format: "Evidence file",
    theme: "evidence",
    summary: "Investigators, courts, Congress, and the public prove that no president stands beyond the reach of law.",
    merch: ["Follow the tape investigator", "No Leader Above the Law badge", "Accountability desk mug"]
  }
];

const escapeHtml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function inlineMarkdown(value) {
  const escaped = escapeHtml(value);
  return escaped.replace(/\[([^\]]+)]\((https?:\/\/[^)]+)\)/g, '<a href="$2" rel="noreferrer">$1</a>');
}

function renderParagraphs(markdown) {
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
  if (!title || !subtitle || sourceStart < 0) throw new Error(`Missing required headings in ${config.file}`);

  const narrative = markdown.slice(0, sourceStart);
  const sourcesRaw = markdown.slice(sourceStart).replace(/^## Source credits and editorial notes\s*/m, "");
  const sectionMatches = [...narrative.matchAll(/^### (.+)$/gm)];
  if (sectionMatches.length !== 5) throw new Error(`${config.file} must contain exactly five narrative sections`);

  const sections = sectionMatches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = sectionMatches[index + 1]?.index ?? narrative.length;
    let content = narrative.slice(start, end).trim();
    const imageMatch = content.match(/!\[([^\]]+)]\(([^)]+\.png)\)/);
    const captionMatch = content.match(/^\*([^\n]+)\*$/m);
    if (index < 4 && (!imageMatch || !captionMatch)) throw new Error(`Missing illustration or caption in ${config.file}, section ${index + 1}`);
    if (imageMatch) content = content.replace(imageMatch[0], "");
    if (captionMatch) content = content.replace(captionMatch[0], "");
    return {
      heading: match[1],
      body: renderParagraphs(content),
      image: imageMatch?.[2] ?? null,
      alt: imageMatch?.[1] ?? "",
      caption: captionMatch?.[1] ?? ""
    };
  });

  const sourceLines = sourcesRaw.split("\n").map((line) => line.trim()).filter(Boolean);
  const notes = sourceLines.filter((line) => !line.startsWith("- "));
  const sources = sourceLines.filter((line) => line.startsWith("- ")).map((line) => line.slice(2));
  if (sources.length < 3) throw new Error(`${config.file} must contain at least three sources`);

  return { ...config, title, subtitle, sections, sources, notes };
}

function imageBase(config, filename) {
  return `/assets/new/${config.slug}/${filename.replace(/\.png$/i, "")}`;
}

function responsiveImage(config, filename, alt, eager = false) {
  const base = imageBase(config, filename);
  return `<img src="${base}-768.webp" srcset="${base}-768.webp 768w, ${base}-1536.webp 1536w" sizes="(min-width: 70rem) 48rem, (min-width: 48rem) 70vw, 100vw" width="1536" height="1024" alt="${escapeHtml(alt)}" loading="${eager ? "eager" : "lazy"}" decoding="async">`;
}

function storyCard(story, index) {
  const firstImage = story.sections[0].image;
  return `<article class="story-card story-card--${story.theme}">
    <a class="story-card__image" href="/new/${story.slug}/" tabindex="-1" aria-hidden="true">
      ${responsiveImage(story, firstImage, "", false)}
    </a>
    <div class="story-card__body">
      <div class="story-card__meta"><span>${String(index + 1).padStart(2, "0")}</span><span>${story.era}</span></div>
      <p class="story-card__format">Layout test: ${story.format}</p>
      <h2><a href="/new/${story.slug}/">${story.title}</a></h2>
      <p class="story-card__subtitle">${story.subtitle}</p>
      <p>${story.summary}</p>
      <a class="text-link" href="/new/${story.slug}/">Read this story <span aria-hidden="true">→</span></a>
    </div>
  </article>`;
}

function globalHeader(depth = 0) {
  const back = depth ? "/new/" : "/";
  const label = depth ? "All ten stories" : "Current Spirit of 1776 site";
  return `<a class="skip-link" href="#main">Skip to story</a>
  <header class="preview-header">
    <a class="preview-brand" href="/new/" aria-label="Spirit of 1776 story laboratory home">
      <span class="preview-brand__mark" aria-hidden="true">76</span>
      <span><strong>Spirit of 1776</strong><small>Story laboratory</small></span>
    </a>
    <a class="preview-back" href="${back}"><span aria-hidden="true">←</span> ${label}</a>
  </header>`;
}

function merchLab(story) {
  const productTypes = ["tee", "mug", "sticker"];
  const labels = ["Apparel character", "Mug moment", "Sticker or print"];
  return `<aside class="merch-lab" aria-labelledby="merch-heading">
    <div class="merch-lab__intro">
      <p class="eyebrow">Character &amp; merch lab</p>
      <h2 id="merch-heading">Could this history live beyond the page?</h2>
      <p>These are art-direction experiments—not products for sale. The strongest characters can later be redrawn as clean, print-ready designs without turning the history itself into a punchline.</p>
    </div>
    <div class="merch-grid">
      ${story.merch.map((idea, index) => {
        const section = story.sections[index];
        const image = section.image ?? story.sections[0].image;
        const base = imageBase(story, image);
        return `<article class="merch-card merch-card--${productTypes[index]}">
          <div class="merch-card__object" aria-hidden="true"><img src="${base}-768.webp" alt="" loading="lazy" decoding="async"></div>
          <p>${labels[index]}</p><h3>${escapeHtml(idea)}</h3><span>Concept only</span>
        </article>`;
      }).join("\n")}
    </div>
  </aside>`;
}

function storyNavigation(index, collection) {
  const previous = collection[(index - 1 + collection.length) % collection.length];
  const next = collection[(index + 1) % collection.length];
  return `<nav class="story-nav" aria-label="Browse preview stories">
    <a href="/new/${previous.slug}/"><span>Previous experiment</span><strong>← ${previous.title}</strong></a>
    <a href="/new/${next.slug}/"><span>Next experiment</span><strong>${next.title} →</strong></a>
  </nav>`;
}

function renderSources(story) {
  return `<details class="source-drawer">
    <summary>Sources, credits, and editorial notes</summary>
    <div class="source-drawer__body">
      <ul>${story.sources.map((source) => `<li>${inlineMarkdown(source)}</li>`).join("")}</ul>
      ${story.notes.map((note) => `<p>${inlineMarkdown(note)}</p>`).join("")}
    </div>
  </details>`;
}

function storyPage(story, index, collection) {
  const chapters = story.sections.map((section, sectionIndex) => {
    const figure = section.image ? `<figure class="story-chapter__figure">
      ${responsiveImage(story, section.image, section.alt)}
      <figcaption>${inlineMarkdown(section.caption)}</figcaption>
    </figure>` : "";
    return `<section class="story-chapter story-chapter--${sectionIndex + 1}" aria-labelledby="chapter-${sectionIndex + 1}">
    <div class="story-chapter__copy">
      <p class="chapter-number">Scene ${String(sectionIndex + 1).padStart(2, "0")}</p>
      <h2 id="chapter-${sectionIndex + 1}">${section.heading}</h2>
      ${section.body}
    </div>
${figure ? `    ${figure}\n` : ""}
  </section>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="${escapeHtml(story.summary)}">
  <meta name="theme-color" content="#10253f">
  <title>${story.title} | Spirit of 1776 Story Lab</title>
  <link rel="stylesheet" href="/src/new-preview.css">
  <script type="module" src="/src/new-preview.js"></script>
</head>
<body class="preview-story theme-${story.theme}">
  ${globalHeader(1)}
  <progress class="reading-progress" data-reading-progress max="100" value="0" aria-label="Reading progress"></progress>
  <main id="main">
    <article class="story-experiment">
      <header class="story-hero">
        <div class="story-hero__copy">
          <p class="eyebrow">Story ${String(index + 1).padStart(2, "0")} <span>•</span> ${story.era}</p>
          <p class="layout-label">Presentation experiment: <strong>${story.format}</strong></p>
          <h1>${story.title}</h1>
          <p class="story-hero__subtitle">${story.subtitle}</p>
          <p class="story-hero__summary">${story.summary}</p>
          <a class="button-link" href="#chapter-1">Begin the story <span aria-hidden="true">↓</span></a>
        </div>
        <figure class="story-hero__art">
          <div class="story-hero__art-grid">
            ${story.sections.filter((section) => section.image).map((section) => `<img src="${imageBase(story, section.image)}-768.webp" width="768" height="512" alt="" loading="eager" decoding="async">`).join("\n")}
          </div>
          <figcaption>Four scenes in the Spirit of 1776 chibi history style.</figcaption>
        </figure>
      </header>
      <div class="story-body">${chapters}</div>
      ${renderSources(story)}
      ${merchLab(story)}
    </article>
    ${storyNavigation(index, collection)}
  </main>
  <footer class="preview-footer"><p>Experimental review section. Not affiliated with America250 or any government organization.</p><a href="/new/">Return to all stories</a></footer>
</body>
</html>`;
}

function indexPage(parsedStories) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="Preview ten illustrated Spirit of 1776 history stories and experimental article formats.">
  <meta name="theme-color" content="#10253f">
  <title>Ten Stories | Spirit of 1776 Story Lab</title>
  <link rel="stylesheet" href="/src/new-preview.css">
  <script type="module" src="/src/new-preview.js"></script>
</head>
<body class="preview-index">
  ${globalHeader(0)}
  <main id="main">
    <section class="index-hero">
      <div class="index-hero__copy">
        <p class="eyebrow">A working preview • Ten article experiments</p>
        <h1>Ten moments.<br><em>Ten ways to tell the story.</em></h1>
        <p>Meet the people who argued, organized, resisted, served, marched, investigated, and forced American liberty to grow. Each article below tests a different visual format—and a different path from historical character to collectible chibi art.</p>
        <a class="button-link" href="#stories">Explore all ten <span aria-hidden="true">↓</span></a>
      </div>
      <div class="index-hero__mosaic" aria-hidden="true">
        ${parsedStories.slice(0, 4).map((story) => `<img src="${imageBase(story, story.sections[0].image)}-768.webp" alt="" decoding="async">`).join("")}
      </div>
    </section>
    <section class="preview-note" aria-labelledby="preview-note-heading">
      <p class="eyebrow">What you are reviewing</p>
      <h2 id="preview-note-heading">One collection, ten presentation styles</h2>
      <p>The history and illustrations are complete working packages. These page designs are intentionally different so we can discover what feels most readable, memorable, and merchandise-ready before choosing a final system.</p>
      <ul><li>Family-friendly, sourced history</li><li>Full illustrated story sequences</li><li>Character and merchandise concept panels</li></ul>
    </section>
    <section class="story-grid" id="stories" aria-label="Ten story previews">
      ${parsedStories.map(storyCard).join("\n")}
    </section>
    <section class="review-prompt">
      <p class="eyebrow">Review prompt</p>
      <h2>Which format makes you want to keep reading?</h2>
      <p>Notice the layouts, image sizes, pacing, source treatment, and merchandise panels. The goal is not to choose the loudest page—it is to find a flexible visual language that makes history approachable and gives recurring characters a home.</p>
    </section>
  </main>
  <footer class="preview-footer"><p>Experimental review section. Not affiliated with America250 or any government organization.</p><a href="/">Visit the current Spirit of 1776 site</a></footer>
</body>
</html>`;
}

async function buildImages(story) {
  const sourceDir = resolve(outputRoot, story.package);
  const targetDir = resolve(imageRoot, story.slug);
  await mkdir(targetDir, { recursive: true });
  const images = [...story.sections.map((section) => section.image).filter(Boolean), story.contact];
  for (const filename of images) {
    const source = resolve(sourceDir, filename);
    await access(source);
    const stem = filename.replace(/\.png$/i, "");
    if (filename === story.contact) {
      const target = resolve(targetDir, `${stem}-768.webp`);
      const current = await stat(target).catch(() => null);
      if (!current || process.env.FORCE_NEW_PREVIEW_ASSETS === "1") {
        const sharp = await getSharp();
        await sharp(source).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toFile(target);
      }
      continue;
    }
    const variants = [
      { width: 768, quality: 80 },
      { width: 1536, quality: 86 }
    ];
    await Promise.all(variants.map(async ({ width, quality }) => {
      const target = resolve(targetDir, `${stem}-${width}.webp`);
      const current = await stat(target).catch(() => null);
      if (!current || process.env.FORCE_NEW_PREVIEW_ASSETS === "1") {
        const sharp = await getSharp();
        await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(target);
      }
    }));
  }
}

await mkdir(pageRoot, { recursive: true });
await mkdir(imageRoot, { recursive: true });

const parsedStories = [];
for (const config of stories) {
  const markdownPath = resolve(outputRoot, config.package, config.file);
  const markdown = await readFile(markdownPath, "utf8");
  const story = parseStory(markdown, config);
  if (story.sections.filter((section) => section.image).length !== 4) throw new Error(`${config.file} must have exactly four illustrations`);
  parsedStories.push(story);
}

for (const [index, story] of parsedStories.entries()) {
  await buildImages(story);
  const target = resolve(pageRoot, story.slug);
  await mkdir(target, { recursive: true });
  await writeFile(resolve(target, "index.html"), storyPage(story, index, parsedStories), "utf8");
}

await writeFile(resolve(pageRoot, "index.html"), indexPage(parsedStories), "utf8");
console.log(`Built /new/ preview with ${parsedStories.length} stories and ${parsedStories.length * 9} optimized image variants.`);
