import { buildAnalyticsEvent, isApprovedAnalyticsHost, readConsent, writeConsent } from "./lib/analytics.js";

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || "";
const canMeasure = Boolean(measurementId) && isApprovedAnalyticsHost(window.location.hostname);
let loaded = false;

function loadAnalytics() {
  if (!canMeasure || loaded) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_path: `${window.location.pathname}${window.location.search}`
  });
  if (window.location.pathname === "/shop/") {
    window.gtag("event", "shop_view", { catalog_size: 3 });
  }
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);
}

export function track(name, parameters = {}) {
  if (!loaded || typeof window.gtag !== "function") return;
  const event = buildAnalyticsEvent(name, parameters);
  window.gtag("event", event.name, event.parameters);
}

export function initializeConsent() {
  const banner = document.querySelector("[data-consent-banner]");
  if (!canMeasure) {
    banner?.remove();
    return;
  }

  const existing = readConsent();
  if (existing === "accepted") loadAnalytics();
  if (!existing && banner) banner.hidden = false;

  banner?.querySelector("[data-consent-accept]")?.addEventListener("click", () => {
    writeConsent("accepted");
    banner.hidden = true;
    loadAnalytics();
    track("analytics_consent", { status: "accepted" });
  });
  banner?.querySelector("[data-consent-decline]")?.addEventListener("click", () => {
    writeConsent("declined");
    banner.hidden = true;
  });

  document.querySelector("[data-reset-consent]")?.addEventListener("click", () => {
    writeConsent("");
    if (banner) banner.hidden = false;
  });
}
