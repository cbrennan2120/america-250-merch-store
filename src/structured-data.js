import { products, stories } from "./data/content.js";

const origin = "https://spiritof1776.store";

function addSchema(value) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(value);
  document.head.append(script);
}

export function injectStructuredData() {
  const pathname = window.location.pathname;
  const base = [
    {
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      name: "Spirit of 1776",
      url: `${origin}/`,
      logo: `${origin}/assets/brand/favicon-512.png`,
      description: "Independent American-history education and merchandise project."
    },
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: `${origin}/`,
      name: "Spirit of 1776",
      publisher: { "@id": `${origin}/#organization` }
    }
  ];

  const graph = [...base];
  const story = stories.find((candidate) => pathname === candidate.href);
  if (story) {
    graph.push({
      "@type": "Article",
      headline: story.title,
      description: story.summary,
      mainEntityOfPage: `${origin}${story.href}`,
      publisher: { "@id": `${origin}/#organization` },
      datePublished: "2026-08-06",
      dateModified: "2026-08-06",
      citation: story.sources
    });
  }

  if (pathname === "/shop/") {
    products.forEach((product) => graph.push({
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: `${origin}${product.image}`,
      url: `${origin}/shop/#${product.id}`,
      brand: { "@type": "Brand", name: "Spirit of 1776" },
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: product.priceLabel.replace(/[^0-9.]/g, ""),
        availability: "https://schema.org/PreOrder",
        url: product.productUrl || product.storeUrl
      }
    }));
  }

  addSchema({ "@context": "https://schema.org", "@graph": graph });
}
