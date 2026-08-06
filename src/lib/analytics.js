export const CONSENT_KEY = "spirit1776.analytics-consent";

export function buildAnalyticsEvent(name, parameters = {}) {
  return {
    name,
    parameters: Object.fromEntries(
      Object.entries(parameters).filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))
    )
  };
}

export function isApprovedAnalyticsHost(hostname) {
  return ["spiritof1776.store", "www.spiritof1776.store"].includes(hostname);
}

export function readConsent(storage = globalThis.localStorage) {
  try {
    return storage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export function writeConsent(value, storage = globalThis.localStorage) {
  try {
    storage.setItem(CONSENT_KEY, value);
  } catch {
    // The site remains fully usable when storage is blocked.
  }
}
