# Spirit of 1776

An evergreen, family-friendly American-history project at [spiritof1776.store](https://spiritof1776.store). The site combines sourced stories, an interactive quiz, and a three-product Printify collection.

## Local development

```powershell
npm.cmd install
npm.cmd run dev
```

Quality checks:

```powershell
npm.cmd run check
npx.cmd playwright install chromium
npm.cmd run test:e2e
```

Production build output is written to `dist/`.

## Architecture

- Vanilla Vite multi-page site; no backend or user accounts.
- Shared product, story, timeline, and quiz data in `src/data/content.js`.
- Consent-controlled GA4 that runs only on approved production hostnames.
- Printify handles product checkout, payment, fulfillment, shipping, and support.
- Netlify deploys the apex domain from `main`; pull requests receive Deploy Previews.

## Store status

The site intentionally labels all products as prelaunch until the owner completes the account-only steps in [`STORE-LAUNCH-CHECKLIST.md`](STORE-LAUNCH-CHECKLIST.md). Once products are published, replace each `productUrl`, change `availability` to `live`, confirm final pricing, and rebuild. Validation prevents a live product from shipping without a product-specific URL.

## Artwork

Print masters are generated from three reviewed illustration layers by `npm run assets`. Source prompts and production notes are in [`docs/artwork-generation.md`](docs/artwork-generation.md). The fonts are Cinzel and Bebas Neue under the SIL Open Font License; license files ship beside the font assets.
