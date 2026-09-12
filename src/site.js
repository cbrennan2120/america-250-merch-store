import "./styles.css";
import { initializeConsent, track } from "./analytics.js";

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

setupNavigation();
initializeConsent();
setupTracking();
