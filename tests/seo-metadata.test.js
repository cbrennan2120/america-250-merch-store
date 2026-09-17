import { describe, expect, it } from "vitest";
import { products } from "../src/data/content.js";
import { pageSeo } from "../src/data/page-seo.js";
import { stories } from "../src/data/story-manifest.js";

const records = [
  ...Object.values(pageSeo).map(({ route, title, description }) => ({ route, title, description })),
  ...stories.map(({ href: route, seoTitle: title, metaDescription: description }) => ({ route, title, description })),
  ...products.map(({ href: route, seoTitle: title, metaDescription: description }) => ({ route, title, description }))
];

describe("search metadata", () => {
  it("gives all 24 indexable pages a unique search result", () => {
    expect(records).toHaveLength(24);
    expect(new Set(records.map(({ route }) => route)).size).toBe(records.length);
    expect(new Set(records.map(({ title }) => title)).size).toBe(records.length);
    expect(new Set(records.map(({ description }) => description)).size).toBe(records.length);
  });

  it("keeps titles and descriptions concise and concrete", () => {
    for (const record of records) {
      expect(record.title.length, record.route).toBeGreaterThanOrEqual(45);
      expect(record.title.length, record.route).toBeLessThanOrEqual(70);
      expect(record.description.length, record.route).toBeGreaterThanOrEqual(120);
      expect(record.description.length, record.route).toBeLessThanOrEqual(160);
      expect(record.description, record.route).not.toMatch(/\b(?:discover|explore|learn more)\b/i);
    }
  });

  it("describes the current timeline and quiz instead of retired content", () => {
    expect(pageSeo.timeline.description).toContain("ten pivotal moments");
    expect(pageSeo.quiz.description).toContain("Watergate");
    expect(pageSeo.quiz.description).not.toContain("Liberty Bell");
  });
});
