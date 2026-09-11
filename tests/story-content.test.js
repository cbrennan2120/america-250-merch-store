import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseline = {
  "content/stories/bill-of-rights/story.md": "59360b30e6e29f67c54eef82ed65ad70fc707f74846586ee53329817176a7b87",
  "content/stories/civil-rights-movement/story.md": "2449a691c08c15fe1a21fdd60763d0760eb50f4d971c755ce5bd531847ad5acb",
  "content/stories/d-day-and-the-fight-against-fascism/story.md": "cf17e14a4ab95838200278e34b79e92c3a905484b998133618b7b82ba2f5e5fa",
  "content/stories/declaration-of-independence/story.md": "cfde238379bd75da7f88bd2a7c39386ff77a4ba4e77520cc554842e9046c593a",
  "content/stories/lexington-and-concord/story.md": "09537fd7c773f8e5e5253a3dfc3f8dc11e17fa2232a7a25b97a01cf8d87ebcee",
  "content/stories/underground-railroad/story.md": "bd41c094dc84cac97c974d69aa183742556e135d82aea60c45ec4fdae43a0bee",
  "content/stories/union-soldiers-and-emancipation/story.md": "dba39e6f58e28c027bbdf7e9cc3af73c9458f3fed01d4c3e9111597dacab0f12",
  "content/stories/washington-surrenders-command/story.md": "e5ca67d4c2ad40c4c69e5ac6fda3145243108a18974e95c4357970c0566f2354",
  "content/stories/watergate-accountability/story.md": "d9b88f0ccb8182e38780944574cd29187744350ea99d30f67bcb8c9064c0d72f",
  "content/stories/womens-suffrage/story.md": "2ea33be0d863d6b5f94dec2a96336ffd39716ea83a4a3815a162eae97a83312f"
};

describe("story content freeze", () => {
  it("keeps all ten approved story source packages unchanged", () => {
    for (const [path, expectedHash] of Object.entries(baseline)) {
      const normalizedSource = readFileSync(resolve(path), "utf8").replace(/\r\n/g, "\n");
      const actualHash = createHash("sha256").update(normalizedSource).digest("hex");
      expect(actualHash, path).toBe(expectedHash);
    }
  });
});
