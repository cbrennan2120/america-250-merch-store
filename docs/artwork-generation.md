# Artwork Generation and Production Notes

The three illustration layers were created with the built-in image generation workflow, using existing repository concepts as references. Generated lettering was deliberately excluded. Exact public-facing typography is converted to vector paths by `scripts/build-assets.mjs`, preventing misspellings and invented branding.

## Eagle and shield

Final illustration layer: `assets/artwork/eagle-crest-base.png`

Prompt:

> Use case: logo-brand. Asset type: transparent print illustration layer for a T-shirt. Image 1 is a concept reference only. Redraw the central bald eagle, early-American shield, stars, and small laurel details as an original refined vintage screen-print illustration. Preserve the strong symmetrical eagle-and-shield concept but remove the garment mockup, every word, every number, every banner inscription, and any invented company branding. Use a perfectly flat solid #00ff00 chroma-key background. Use a crisp hand-inked vintage engraving adapted to a four-color screen print, centered with generous padding. Use deep navy, muted brick red, warm parchment cream, and restrained antique gold. Do not use green in the subject. No text, letters, numbers, logos, seals, official America250 marks, watermark, shadows, gradients, floor plane, mockup, garment, reflections, or background texture.

## Fife and drum

Final illustration layer: `assets/artwork/fife-drum-base.png`

Prompt:

> Use case: logo-brand. Asset type: transparent print illustration layer for a crewneck sweatshirt. Image 1 is a concept reference only. Redraw the three Revolutionary-era musicians as an original refined vintage screen-print illustration: one fifer and two drummers walking together. Preserve the friendly family-history spirit and triangular group composition, but remove every word, number, ribbon inscription, border, badge, and flag. Use a perfectly flat solid #00ff00 chroma-key background. Use historically inspired hand-inked engraving simplified for a four-color screen print. Center the full-body trio with generous padding. Use deep navy, muted brick red, warm parchment cream, and restrained antique gold. No text, letters, numbers, logos, official seals, official America250 marks, watermark, modern objects, mockup, garment, flag, shadows, gradients, floor plane, reflections, or background texture.

## Thirteen-star flag badge

Final illustration layer: `assets/artwork/flag-badge-base.png`

Prompt:

> Use case: logo-brand. Asset type: transparent print illustration layer for a die-cut sticker. Image 1 is a concept reference only. Redraw the distressed American flag concept as an original horizontal vintage badge background using thirteen alternating stripes and a circular arrangement of thirteen cream stars in a navy canton. Remove the vehicle mockup and all lettering and numbers. Use a perfectly flat solid #00ff00 chroma-key background outside a wide rounded rectangle. Use clean vector-like screen-print illustration with tasteful weathered ink texture. Use deep navy, muted brick red, and warm parchment cream. No text, letters, numbers, logos, official America250 marks, watermark, vehicle, photo background, shadows, gradients, floor plane, or reflections.

## Background removal

Each generated layer was processed with the installed ImageGen chroma-key helper using border auto-detection, soft matte, and despill. Final alpha PNGs were visually inspected before use. Run `npm run assets` to regenerate print masters, web mockups, social imagery, and favicons from the reviewed layers.
