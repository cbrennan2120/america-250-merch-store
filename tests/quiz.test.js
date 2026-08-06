import { describe, expect, it } from "vitest";
import { buildShareText, getResultTier, scoreQuiz } from "../src/lib/quiz.js";

const questions = [
  { id: "one", correctIndex: 1 },
  { id: "two", correctIndex: 0 },
  { id: "three", correctIndex: 2 }
];

describe("quiz scoring", () => {
  it("scores only exact numeric answer matches", () => {
    expect(scoreQuiz(questions, { one: 1, two: 1, three: 2 })).toBe(2);
  });

  it("uses deterministic result thresholds", () => {
    expect(getResultTier(8, 10).id).toBe("history-keeper");
    expect(getResultTier(5, 10).id).toBe("liberty-scholar");
    expect(getResultTier(4, 10).id).toBe("curious-reader");
  });

  it("builds a share message without answer data", () => {
    const text = buildShareText(9, 10, "History Keeper");
    expect(text).toContain("9/10");
    expect(text).not.toContain("one");
  });
});
