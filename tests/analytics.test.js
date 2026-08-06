import { describe, expect, it } from "vitest";
import { buildAnalyticsEvent, isApprovedAnalyticsHost, readConsent, writeConsent } from "../src/lib/analytics.js";

function memoryStorage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

describe("privacy-limited analytics", () => {
  it("allows only production hostnames", () => {
    expect(isApprovedAnalyticsHost("spiritof1776.store")).toBe(true);
    expect(isApprovedAnalyticsHost("www.spiritof1776.store")).toBe(true);
    expect(isApprovedAnalyticsHost("localhost")).toBe(false);
    expect(isApprovedAnalyticsHost("deploy-preview-1--example.netlify.app")).toBe(false);
  });

  it("filters non-primitive event parameters", () => {
    expect(buildAnalyticsEvent("quiz_complete", { score: 8, answer: { secret: true }, ok: true })).toEqual({
      name: "quiz_complete", parameters: { score: 8, ok: true }
    });
  });

  it("persists consent safely", () => {
    const storage = memoryStorage();
    expect(readConsent(storage)).toBeNull();
    writeConsent("declined", storage);
    expect(readConsent(storage)).toBe("declined");
  });
});
