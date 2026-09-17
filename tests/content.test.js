import { describe, expect, it } from "vitest";
import { productDesigns, products, quizQuestions, stories, timeline } from "../src/data/content.js";
import { storyTopicGroups } from "../src/data/story-manifest.js";

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
      expect(product.href).toBe(`/shop/${product.slug}/`);
      expect(product.galleryImages).toHaveLength(3);
      expect(product.productUrl).toMatch(/^https:\/\/shop\.spiritof1776\.store\/product\/\d+$/);
    }
  });

  it("connects every story through descriptive, topic-based discovery paths", () => {
    expect(storyTopicGroups.map(({ id }) => id)).toEqual([
      "founding-government",
      "expanding-citizenship",
      "resistance-coercion",
      "accountability-rule-law"
    ]);
    for (const story of stories) {
      expect(story.linkLabel.length).toBeGreaterThanOrEqual(35);
      expect(story.linkLabel).not.toBe("Read this story");
      const related = stories.filter((candidate) =>
        candidate.slug !== story.slug
        && candidate.topicGroupIds.some((id) => story.topicGroupIds.includes(id))
      );
      expect(related.length, story.slug).toBeGreaterThanOrEqual(3);
    }
  });
});
