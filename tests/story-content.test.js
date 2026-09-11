import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = {
  "content/stories/bill-of-rights/story.md": "1bed1f7ac206e1b2a3f097f521f97d538d69f2e9a74ea5358c2bda4d54a135fe",
  "content/stories/civil-rights-movement/story.md": "d2d7c9b935a412ebbf283aeae854a1b1915eb973b1a72078bf988f35f298135a",
  "content/stories/d-day-and-the-fight-against-fascism/story.md": "dd1e3ae19548f0de44a44480d1a6c587e29968e99d20ea59f09aa137ec3dc267",
  "content/stories/declaration-of-independence/story.md": "6aeafb08c5ac750066f49dfe82202a37f68fdf64656477171dd49fbb68826467",
  "content/stories/lexington-and-concord/story.md": "4d9a1f2474d9e276d156d2cc319e6f27a7e5dc9a951887a442f6f622a240313d",
  "content/stories/underground-railroad/story.md": "339976274aa2ec8305f060bcdbe2d699a929bb1342550aec9cac8432c2c894a1",
  "content/stories/union-soldiers-and-emancipation/story.md": "eb0e9e3ec5457c1b71c5f59853da09f54cae646a6105c4313638e1a49f8f0ae1",
  "content/stories/washington-surrenders-command/story.md": "25d32c4cefba8be98a01b99f3e400f3ca27b5841fc4fbc74e428da9271cb3300",
  "content/stories/watergate-accountability/story.md": "690d05e0f975e782d89d2f05ea220c974cf8f2ff85745ee4455166fd3561a5ea",
  "content/stories/womens-suffrage/story.md": "d5cdcc84473e9a4445c8ba9b040accb8bcf94184c0b5c785498b089aaf03d124"
};

describe("story content freeze", () => {
  it("keeps all ten approved story source packages unchanged", () => {
    for (const [path, expectedHash] of Object.entries(baseline)) {
      const actualHash = createHash("sha256").update(readFileSync(resolve(path))).digest("hex");
      expect(actualHash, path).toBe(expectedHash);
    }
  });
});
