export const ORIGIN = "https://spiritof1776.store";

export const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

export function renderProductCard(product, headingLevel = 3) {
  const target = product.productUrl || product.storeUrl;
  return `<article class="product-card" id="${escapeHtml(product.id)}">
      <picture>${product.imageAvif ? `<source srcset="${escapeHtml(product.imageAvif)}" type="image/avif">` : ""}<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.alt)}" width="1200" height="1000" loading="lazy"></picture>
      <div class="product-card__body">
        <p class="eyebrow">${escapeHtml(product.category)}</p>
        <h${headingLevel}>${escapeHtml(product.displayName)}</h${headingLevel}>
        <p>${escapeHtml(product.description)}</p>
        <p class="product-price">${escapeHtml(product.priceLabel)}</p>
        <p class="product-status">Available now</p>
        <a class="button button--secondary" href="${escapeHtml(target)}" target="_blank" rel="noopener" data-product-link="${escapeHtml(product.analyticsLabel)}">View product<span aria-hidden="true"> ↗</span></a>
      </div>
    </article>`;
}

export function renderProductGrid(products, designs, grouped = false) {
  if (!grouped) return products.map((product) => renderProductCard(product)).join("\n");
  return designs.map((design) => {
    const designProducts = products.filter((product) => product.designId === design.id);
    return `<section class="product-design-group" aria-labelledby="design-${escapeHtml(design.id)}">
      <div class="product-design-group__heading"><p class="eyebrow">Original chibi design</p><h3 id="design-${escapeHtml(design.id)}">${escapeHtml(design.name)}</h3></div>
      <div class="card-grid">${designProducts.map((product) => renderProductCard(product, 4)).join("\n")}</div>
    </section>`;
  }).join("\n");
}

export const creatorId = "https://chrisbrennan.net/#person";
export const organizationId = `${ORIGIN}/#organization`;

export function baseGraph() {
  return [
    { "@type": "Person", "@id": creatorId, name: "Chris Brennan", url: "https://chrisbrennan.net/" },
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "Spirit of 1776",
      url: `${ORIGIN}/`,
      logo: `${ORIGIN}/assets/brand/favicon-512.png`,
      description: "Independent American-history education and merchandise project.",
      founder: { "@id": creatorId }
    },
    {
      "@type": "WebSite",
      "@id": `${ORIGIN}/#website`,
      url: `${ORIGIN}/`,
      name: "Spirit of 1776",
      publisher: { "@id": organizationId },
      creator: { "@id": creatorId }
    }
  ];
}

export function breadcrumbSchema(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${ORIGIN}${item.href}`
    }))
  };
}

export function productSchemas(products) {
  return products.map((product) => ({
    "@type": "Product",
    "@id": `${ORIGIN}/shop/#${product.id}`,
    name: product.displayName,
    description: product.description,
    image: `${ORIGIN}${product.image}`,
    url: `${ORIGIN}/shop/#${product.id}`,
    brand: { "@type": "Brand", name: "Spirit of 1776" },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.priceLabel.replace(/[^0-9.]/g, ""),
      availability: "https://schema.org/InStock",
      url: product.productUrl || product.storeUrl
    }
  }));
}

export function jsonLd(graph) {
  return `<script type="application/ld+json" data-static-structured-data>${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c")}</script>`;
}
