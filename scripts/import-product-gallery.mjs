import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "public", "assets", "products", "gallery");

const mockups = {
  "currently-revolting-tee": [
    ["folded", "https://images-api.printify.com/mockup/6aa2ca11433bea2dae098b01/63300/127670/currently-revolting-tee.jpg?camera_label=folded-2&revision=1789138564631"],
    ["lifestyle", "https://images-api.printify.com/mockup/6aa2ca11433bea2dae098b01/63300/127673/currently-revolting-tee.jpg?camera_label=lifestyle&revision=1789138564631"],
    ["front", "https://images-api.printify.com/mockup/6aa2ca11433bea2dae098b01/63300/97992/currently-revolting-tee.jpg?camera_label=front&revision=1789138564631"]
  ],
  "currently-revolting-sticker": [
    ["front", "https://images-api.printify.com/mockup/6aa2cba809370e931d0cfa4f/72008/14861/currently-revolting-sticker.jpg?camera_label=front&revision=1789138815799"],
    ["notebook", "https://images-api.printify.com/mockup/6aa2cba809370e931d0cfa4f/72008/14856/currently-revolting-sticker.jpg?camera_label=context-1&revision=1789138815799"],
    ["bottle", "https://images-api.printify.com/mockup/6aa2cba809370e931d0cfa4f/72008/14852/currently-revolting-sticker.jpg?camera_label=context-2&revision=1789138815799"]
  ],
  "give-me-a-minute-crewneck": [
    ["front", "https://images-api.printify.com/mockup/6aa2cac7bfdf03703f070dc0/25450/98502/give-me-a-minute-crewneck.jpg?camera_label=front&revision=1789138757872"],
    ["folded", "https://images-api.printify.com/mockup/6aa2cac7bfdf03703f070dc0/25450/100648/give-me-a-minute-crewneck.jpg?camera_label=folded&revision=1789138757872"],
    ["detail", "https://images-api.printify.com/mockup/6aa2cac7bfdf03703f070dc0/25450/128101/give-me-a-minute-crewneck.jpg?camera_label=folded-2&revision=1789138757872"]
  ],
  "give-me-a-minute-sticker": [
    ["front", "https://images-api.printify.com/mockup/6aa2cbc5c254d35f800ed159/72008/14861/give-me-a-minute-sticker.jpg?camera_label=front&revision=1789138928440"],
    ["notebook", "https://images-api.printify.com/mockup/6aa2cbc5c254d35f800ed159/72008/14856/give-me-a-minute-sticker.jpg?camera_label=context-1&revision=1789138928440"],
    ["bottle", "https://images-api.printify.com/mockup/6aa2cbc5c254d35f800ed159/72008/14852/give-me-a-minute-sticker.jpg?camera_label=context-2&revision=1789138928440"]
  ],
  "liber-tea-mug": [
    ["front", "https://images-api.printify.com/mockup/6aa2ce7d40137f2859069679/94262/89287/liber-tea-mug.jpg?camera_label=front&revision=1789138681504"],
    ["left", "https://images-api.printify.com/mockup/6aa2ce7d40137f2859069679/94262/89289/liber-tea-mug.jpg?camera_label=left&revision=1789138681504"],
    ["right", "https://images-api.printify.com/mockup/6aa2ce7d40137f2859069679/94262/89290/liber-tea-mug.jpg?camera_label=right&revision=1789138681504"]
  ],
  "liber-tea-sticker": [
    ["front", "https://images-api.printify.com/mockup/6aa2cbe4b7bf2e772301ab38/72008/14861/liber-tea-sticker.jpg?camera_label=front&revision=1789138984664"],
    ["notebook", "https://images-api.printify.com/mockup/6aa2cbe4b7bf2e772301ab38/72008/14856/liber-tea-sticker.jpg?camera_label=context-1&revision=1789138984664"],
    ["bottle", "https://images-api.printify.com/mockup/6aa2cbe4b7bf2e772301ab38/72008/14852/liber-tea-sticker.jpg?camera_label=context-2&revision=1789138984664"]
  ]
};

await mkdir(output, { recursive: true });
for (const [slug, images] of Object.entries(mockups)) {
  for (const [label, url] of images) {
    const response = await fetch(`${url}&s=1600`);
    if (!response.ok) throw new Error(`Unable to fetch ${slug} ${label}: HTTP ${response.status}`);
    const source = Buffer.from(await response.arrayBuffer());
    for (const width of [768, 1200]) {
      await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: width === 1200 ? 86 : 80 }).toFile(resolve(output, `${slug}-${label}-${width}.webp`));
    }
  }
}

console.log(`Imported ${Object.values(mockups).flat().length} verified Printify mockups in two responsive sizes.`);
