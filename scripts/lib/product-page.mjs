import { ORIGIN, baseGraph, breadcrumbSchema, escapeHtml, jsonLd, productSchemas } from "./static-content.mjs";

const iconLinks = `<link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml" sizes="any">
  <link rel="icon" href="/assets/brand/favicon-48.png" type="image/png" sizes="48x48">
  <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="48x48">
  <link rel="apple-touch-icon" href="/assets/brand/favicon-192.png" sizes="192x192">
  <link rel="manifest" href="/site.webmanifest">`;

function header() {
  return `<a class="skip-link" href="#main">Skip to main content</a>
  <header class="site-header"><div class="nav-shell"><a class="wordmark" href="/">Spirit of 1776<small>Stories worth keeping</small></a><button class="menu-button" type="button" aria-expanded="false" aria-controls="primary-menu" data-menu-button>Menu</button><nav class="site-nav" id="primary-menu" aria-label="Primary navigation" data-menu><a href="/stories/">Stories</a><a href="/timeline/">Timeline</a><a href="/quiz/">Quiz</a><a href="/about/">About</a><a class="nav-shop" href="/shop/">Shop</a></nav></div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="shell footer-grid"><div><h2>Spirit of 1776</h2><p>An independent history project created by Chris Brennan.</p></div><div><h2>Explore</h2><ul><li><a href="/stories/">Stories</a></li><li><a href="/timeline/">Timeline</a></li><li><a href="/quiz/">Quiz</a></li><li><a href="/shop/">Shop</a></li></ul></div><div><h2>Project</h2><ul><li><a href="/about/">About and sources</a></li><li><a href="/privacy/">Privacy choices</a></li><li><a href="mailto:cbrennan2120@gmail.com">Contact Chris</a></li></ul></div></div><div class="shell footer-note">© 2026 Spirit of 1776. Independent project. Not affiliated with America250.</div></footer>`;
}

function socialMeta(product) {
  const canonical = `${ORIGIN}${product.href}`;
  const image = `${ORIGIN}${product.primaryImage}`;
  return `<meta property="og:type" content="product">
  <meta property="og:site_name" content="Spirit of 1776">
  <meta property="og:title" content="${escapeHtml(product.seoTitle)}">
  <meta property="og:description" content="${escapeHtml(product.metaDescription)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:alt" content="${escapeHtml(product.galleryImages[0].alt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(product.seoTitle)}">
  <meta name="twitter:description" content="${escapeHtml(product.metaDescription)}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${escapeHtml(product.galleryImages[0].alt)}">`;
}

function gallery(product) {
  return `<div class="product-gallery" role="group" aria-label="${escapeHtml(product.displayName)} product photos">${product.galleryImages.map((image, index) => `<figure class="product-gallery__item${index === 0 ? " product-gallery__item--primary" : ""}"><img src="${image.src}" srcset="${image.srcSet}" sizes="${index === 0 ? "(min-width: 64rem) 42rem, 100vw" : "(min-width: 64rem) 20rem, 50vw"}" width="1200" height="1200" alt="${escapeHtml(image.alt)}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async"></figure>`).join("")}</div>`;
}

const list = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;

export function productPage(product, products, stories) {
  const canonical = `${ORIGIN}${product.href}`;
  const crumbs = [{ name: "Home", href: "/" }, { name: "Shop", href: "/shop/" }, { name: product.displayName, href: product.href }];
  const relatedStories = stories.filter((story) => product.relatedStorySlugs.includes(story.slug));
  const relatedFormats = products.filter((candidate) => candidate.designId === product.designId && candidate.id !== product.id);
  const productSchema = productSchemas([product])[0];
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#13263d">
  <meta name="description" content="${escapeHtml(product.metaDescription)}">
  ${socialMeta(product)}
  <link rel="canonical" href="${canonical}">
  ${iconLinks}
  ${jsonLd([...baseGraph(), productSchema, breadcrumbSchema(crumbs)])}
  <title>${escapeHtml(product.seoTitle)}</title>
</head>
<body class="product-page">
  ${header()}
  <main id="main">
    <nav class="shop-breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/shop/">Shop</a></li><li><span aria-current="page">${escapeHtml(product.displayName)}</span></li></ol></nav>
    <section class="product-detail shell" aria-labelledby="product-title">
      ${gallery(product)}
      <div class="product-detail__copy">
        <p class="eyebrow">${escapeHtml(product.designName)} · ${escapeHtml(product.category)}</p>
        <h1 id="product-title">${escapeHtml(product.displayName)}</h1>
        <p class="product-detail__price">${escapeHtml(product.priceLabel)}</p>
        <p class="product-status">Available now · Made to order</p>
        <p class="lede">${escapeHtml(product.longDescription)}</p>
        <a class="button product-checkout" href="${product.productUrl}" target="_blank" rel="noopener" data-product-link="${product.analyticsLabel}">Choose options and checkout<span aria-hidden="true"> ↗</span></a>
        <p class="product-detail__checkout-note">Size or color selections, shipping, taxes, and the final total are shown on the secure Printify checkout page.</p>
      </div>
    </section>
    <section class="section section--cream" aria-labelledby="details-heading"><div class="shell"><div class="section-heading"><p class="eyebrow">Product details</p><h2 id="details-heading">Know what you are ordering.</h2></div><div class="product-facts">
      <article><h3>Specifications</h3>${list(product.specifications)}</article>
      <article><h3>Materials</h3>${list(product.materials)}<h3>Size or dimensions</h3><p>${escapeHtml(product.sizesOrDimensions)}</p></article>
      <article><h3>Care</h3>${list(product.careInstructions)}</article>
    </div></div></section>
    <section class="section shell" aria-labelledby="fulfillment-heading"><div class="section-heading"><p class="eyebrow">Made to order</p><h2 id="fulfillment-heading">Fulfillment, shipping, and issues.</h2></div><div class="policy-grid"><article class="feature-card"><h3>Shipping</h3><p>${escapeHtml(product.shippingSummary)}</p></article><article class="feature-card"><h3>If something arrives wrong</h3><p>${escapeHtml(product.returnSummary)}</p><p><a href="mailto:cbrennan2120@gmail.com">Email Chris for help</a></p></article></div></section>
    ${relatedStories.length ? `<section class="section section--navy" aria-labelledby="related-history"><div class="shell"><div class="section-heading"><p class="eyebrow">The history behind the humor</p><h2 id="related-history">Keep exploring the story.</h2></div><div class="card-grid">${relatedStories.map((story) => `<article class="feature-card"><p class="eyebrow">${escapeHtml(story.era)}</p><h3>${escapeHtml(story.title)}</h3><p>${escapeHtml(story.summary)}</p><a href="${story.href}">Read ${escapeHtml(story.title)}</a></article>`).join("")}</div></div></section>` : ""}
    ${relatedFormats.length ? `<section class="section shell" aria-labelledby="related-format"><div class="section-heading"><p class="eyebrow">Same design, another format</p><h2 id="related-format">More ${escapeHtml(product.designName)}.</h2></div><div class="card-grid">${relatedFormats.map((related) => `<article class="product-card"><picture><img src="${related.image}" alt="${escapeHtml(related.alt)}" width="1200" height="1000" loading="lazy"></picture><div class="product-card__body"><p class="eyebrow">${escapeHtml(related.category)}</p><h3>${escapeHtml(related.displayName)}</h3><p>${escapeHtml(related.description)}</p><p class="product-price">${escapeHtml(related.priceLabel)}</p><a class="button button--secondary" href="${related.href}">View details<span aria-hidden="true"> →</span></a></div></article>`).join("")}</div></section>` : ""}
    <nav class="product-back shell" aria-label="Back to the collection"><a class="button button--secondary" href="/shop/">See all six products</a></nav>
  </main>
  ${footer()}
  <aside class="consent-banner" data-consent-banner hidden aria-label="Analytics preferences"><p><strong>Your choice matters.</strong> Optional analytics help us understand what visitors use. The site works without it. <a href="/privacy/">Learn more</a>.</p><div class="button-row"><button class="button" type="button" data-consent-accept>Allow analytics</button><button class="button button--secondary" type="button" data-consent-decline>Continue without</button></div></aside>
  <script type="module" src="/src/site.js"></script>
</body>
</html>`;
}
