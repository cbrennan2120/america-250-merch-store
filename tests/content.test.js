import { describe, expect, it } from "vitest";
import { products, quizQuestions, stories, timeline } from "../src/data/content.js";

describe("launch content", () => {
  it("keeps the approved launch counts", () => {
    expect(products).toHaveLength(3);
    expect(stories).toHaveLength(3);
    expect(timeline).toHaveLength(8);
    expect(quizQuestions).toHaveLength(10);
  });

  it("uses unique stable identifiers", () => {
    expect(new Set(products.map(({ id }) => id)).size).toBe(products.length);
    expect(new Set(quizQuestions.map(({ id }) => id)).size).toBe(quizQuestions.length);
  });

  it("keeps prelaunch products honest", () => {
    for (const product of products) {
      expect(product.availability).toBe("prelaunch");
      expect(product.priceLabel).toContain("provisional");
      expect(product.storeUrl).toMatch(/^https:\/\//);
    }
  });
});
