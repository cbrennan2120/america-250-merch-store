import { describe, expect, it } from "vitest";
import { products, quizQuestions, stories, timeline } from "../src/data/content.js";

describe("launch content", () => {
  it("keeps the approved launch counts", () => {
    expect(products).toHaveLength(6);
    expect(stories).toHaveLength(10);
    expect(timeline).toHaveLength(10);
    expect(quizQuestions).toHaveLength(10);
  });

  it("uses unique stable identifiers", () => {
    expect(new Set(products.map(({ id }) => id)).size).toBe(products.length);
    expect(new Set(quizQuestions.map(({ id }) => id)).size).toBe(quizQuestions.length);
  });

  it("keeps live products linked to their checkout pages", () => {
    for (const product of products) {
      expect(product.availability).toBe("live");
      expect(product.priceLabel).toMatch(/^\$\d+\.\d{2}$/);
      expect(product.productUrl).toMatch(/^https:\/\/shop\.spiritof1776\.store\/product\/\d+$/);
    }
  });
});
