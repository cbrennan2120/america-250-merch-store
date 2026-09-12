import { resolve } from "node:path";
import { defineConfig } from "vite";
import { stories } from "./src/data/story-manifest.js";
import { products } from "./src/data/content.js";

const page = (path) => resolve(import.meta.dirname, path);
const storyInputs = Object.fromEntries(stories.map((story) => [
  `story-${story.slug}`,
  page(`stories/${story.slug}/index.html`)
]));
const productInputs = Object.fromEntries(products.map((product) => [
  `product-${product.slug}`,
  page(`shop/${product.slug}/index.html`)
]));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: page("index.html"),
        stories: page("stories/index.html"),
        ...storyInputs,
        timeline: page("timeline/index.html"),
        quiz: page("quiz/index.html"),
        shop: page("shop/index.html"),
        ...productInputs,
        about: page("about/index.html"),
        privacy: page("privacy/index.html"),
        flight93: page("flight-93/index.html"),
        notFound: page("404.html")
      }
    }
  }
});
