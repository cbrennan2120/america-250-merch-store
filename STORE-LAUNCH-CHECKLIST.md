# Spirit of 1776 Owner Launch Checklist

The repository and preview can be completed without account credentials. The following steps require the store owner.

## 1. Approve the artwork

- Review `public/assets/products/eagle-tee-print.png` at full resolution.
- Review `public/assets/products/fife-drum-crewneck-print.png` at full resolution.
- Review `public/assets/products/spirit-flag-sticker-print.png` at full resolution.
- Confirm spelling, colors, cropping, and print-area placement for every selected product color and size.
- Confirm acceptance of mockup-only launch risk; avoid paid promotion until a real order provides quality feedback.

## 2. Complete Printify setup

- Complete Stripe identity and payout verification.
- Create exactly three products: T-shirt, crewneck sweatshirt, and die-cut sticker.
- Upload the matching print master to each product.
- Select variants and a print provider, then inspect every mockup at full resolution.
- Add complete descriptions, production details, sizing information, and visible shipping/return policies.
- Set initial targets at $29.99, $49.99, and $5.99, increasing a price when required to preserve at least a 35% pre-tax product margin.
- Publish all three products.
- Copy each product-specific URL into `src/data/content.js` and change each `availability` value from `prelaunch` to `live`.

## 3. Connect the store domain

- In Printify Pop-Up Store settings, connect `shop.spiritof1776.store` as a custom subdomain.
- Authorize the DNS change or add the exact CNAME supplied by Printify.
- Keep `spiritof1776.store` and the apex A records pointed at the existing Netlify project.
- Wait for DNS and HTTPS validation, then confirm the Printify URL redirects to the custom subdomain.

## 4. Create dedicated analytics

- Create a separate GA4 property and web stream for `https://spiritof1776.store`.
- Add `VITE_GA_MEASUREMENT_ID` in Netlify’s production environment variables; do not commit the value.
- Rebuild and deploy after setting the variable.
- Choose “Allow analytics” on production and confirm `page_view`, `story_open`, `story_read`, `quiz_complete`, `quiz_result_share`, and `product_outbound_click` in Realtime or DebugView.

## 5. Approve production

- Review the draft pull request’s Netlify Deploy Preview on phone and desktop.
- Confirm all three product URLs, final prices, and policy language.
- Merge into `main` only after approval.
- Smoke-test the production domain, HTTPS, redirects, 404 page, quiz, analytics choice, and shop subdomain.
