import "./styles.css";
import { productDesigns, products } from "./data/content.js";
import { initializeConsent, track } from "./analytics.js";
import { injectStructuredData } from "./structured-data.js";

function productCard(product, headingLevel = 3) {
  const target = product.productUrl || product.storeUrl;
  const status = "Available now";
  const action = "View product";
  const imageMarkup = `<picture>
      ${product.imageAvif ? `<source srcset="${product.imageAvif}" type="image/avif">` : ""}
      <img src="${product.image}" alt="${product.alt}" width="1200" height="1000" loading="lazy">
    </picture>`;
  return `
    <article class="product-card" id="${product.id}">
      ${imageMarkup}
      <div class="product-card__body">
        <p class="eyebrow">${product.category}</p>
        <h${headingLevel}>${product.displayName}</h${headingLevel}>
        <p>${product.description}</p>
        <p class="product-price">${product.priceLabel}</p>
        <p class="product-status">${status}</p>
        <a class="button button--secondary" href="${target}" target="_blank" rel="noopener" data-product-link="${product.analyticsLabel}">${action}<span aria-hidden="true"> ↗</span></a>
      </div>
    </article>`;
}

function renderProducts() {
  document.querySelectorAll("[data-product-grid]").forEach((grid) => {
    if (grid.dataset.productDisplay === "grouped") {
      grid.innerHTML = productDesigns.map((design) => {
        const designProducts = products.filter((product) => product.designId === design.id);
        return `<section class="product-design-group" aria-labelledby="design-${design.id}">
          <div class="product-design-group__heading">
            <p class="eyebrow">Original chibi design</p>
            <h3 id="design-${design.id}">${design.name}</h3>
          </div>
          <div class="card-grid">${designProducts.map((product) => productCard(product, 4)).join("")}</div>
        </section>`;
      }).join("");
      return;
    }
    grid.innerHTML = products.map((product) => productCard(product)).join("");
  });
}

function setupNavigation() {
  const button = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-menu]");
  button?.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    nav?.classList.toggle("is-open", !open);
  });

  const current = window.location.pathname;
  document.querySelectorAll("[data-menu] a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href !== "/" && current.startsWith(href)) link.setAttribute("aria-current", "page");
    if (href === "/" && current === "/") link.setAttribute("aria-current", "page");
  });
}

function setupTracking() {
  document.addEventListener("click", (event) => {
    const productLink = event.target.closest("[data-product-link]");
    if (productLink) track("product_outbound_click", { product_id: productLink.dataset.productLink });
    const shareLink = event.target.closest("[data-story-link]");
    if (shareLink) track("story_open", { story_id: shareLink.dataset.storyLink });
  });

  const article = document.querySelector("[data-story-id]");
  if (article && "IntersectionObserver" in window) {
    const marker = document.querySelector("[data-story-complete]");
    if (marker) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          track("story_read", { story_id: article.dataset.storyId });
          observer.disconnect();
        }
      }, { threshold: 0.5 });
      observer.observe(marker);
    }
  }
}

renderProducts();
setupNavigation();
initializeConsent();
setupTracking();
injectStructuredData();
