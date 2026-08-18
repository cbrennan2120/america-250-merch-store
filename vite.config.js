import { resolve } from "node:path";
import { defineConfig } from "vite";

const page = (path) => resolve(import.meta.dirname, path);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: page("index.html"),
        stories: page("stories/index.html"),
        declaration: page("stories/declaration/index.html"),
        libertyBell: page("stories/liberty-bell/index.html"),
        people: page("stories/people/index.html"),
        timeline: page("timeline/index.html"),
        quiz: page("quiz/index.html"),
        shop: page("shop/index.html"),
        about: page("about/index.html"),
        privacy: page("privacy/index.html"),
        newPreview: page("new/index.html"),
        newDeclaration: page("new/declaration-of-independence/index.html"),
        newLexington: page("new/lexington-and-concord/index.html"),
        newWashington: page("new/washington-surrenders-command/index.html"),
        newBillOfRights: page("new/bill-of-rights/index.html"),
        newUndergroundRailroad: page("new/underground-railroad/index.html"),
        newUnionEmancipation: page("new/union-soldiers-and-emancipation/index.html"),
        newWomensSuffrage: page("new/womens-suffrage/index.html"),
        newDDay: page("new/d-day-and-the-fight-against-fascism/index.html"),
        newCivilRights: page("new/civil-rights-movement/index.html"),
        newWatergate: page("new/watergate-accountability/index.html"),
        notFound: page("404.html")
      }
    }
  }
});
