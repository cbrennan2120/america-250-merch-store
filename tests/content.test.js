import { describe, expect, it } from "vitest";
import { productDesigns, products, quizQuestions, stories, timeline } from "../src/data/content.js";

describe("launch content", () => {
  it("keeps the approved launch counts", () => {
    expect(products).toHaveLength(6);
    expect(stories).toHaveLength(10);
    expect(timeline).toHaveLength(10);
    expect(quizQuestions).toHaveLength(10);
  });

  it("uses unique stable identifiers", () => {
    expect(new Set(products.map(({ id }) => id)).size).toBe(products.length);
    expect(productDesigns.map(({ id }) => id)).toEqual(["currently-revolting", "give-me-a-minute", "liber-tea"]);
    expect(new Set(products.map(({ displayName }) => displayName)).size).toBe(products.length);
    expect(new Set(quizQuestions.map(({ id }) => id)).size).toBe(quizQuestions.length);
  });

  it("groups two products under each original design", () => {
    for (const design of productDesigns) {
      const matches = products.filter((product) => product.designId === design.id);
      expect(matches).toHaveLength(2);
      expect(matches.every((product) => product.designName === design.name)).toBe(true);
    }
  });

  it("keeps live products linked to their checkout pages", () => {
    for (const product of products) {
      expect(product.availability).toBe("live");
      expect(product.priceLabel).toMatch(/^\$\d+\.\d{2}$/);
      expect(product.productUrl).toMatch(/^https:\/\/shop\.spiritof1776\.store\/product\/\d+$/);
    }
  });
});
