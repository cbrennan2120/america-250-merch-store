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
        notFound: page("404.html")
      }
    }
  }
});
