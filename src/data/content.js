import { stories as storyManifest } from "./story-manifest.js";

export const STORE_URL = "https://shop.spiritof1776.store/";

export const productDesigns = [
  { id: "currently-revolting", name: "Currently Revolting" },
  { id: "give-me-a-minute", name: "Give Me a Minute" },
  { id: "liber-tea", name: "Liber-Tea" }
];

const shippingSummary = "Made to order. Shipping choices, costs, and delivery estimates appear after you enter your address at checkout.";
const returnSummary = "If your item arrives defective or damaged, contact us within 30 days. Printify's Terms and Returns Policy determine the available solution.";
const apparelCare = ["Machine wash cold with similar colors", "Tumble dry low", "Iron or steam on low heat", "Do not bleach or dry clean"];
const stickerSpecifications = ["White die-cut sticker", "Matte finish", "UV-protective laminate", "Premium water-resistant vinyl", "Printed with Eco-Solvent inks"];
const stickerCare = ["Apply to a clean, dry, smooth surface", "Brush dust away gently with a soft, clean, dry cloth"];
const gallery = (slug, images) => images.map(({ label, alt }) => ({
  src: `/assets/products/gallery/${slug}-${label}-1200.webp`,
  srcSet: `/assets/products/gallery/${slug}-${label}-768.webp 768w, /assets/products/gallery/${slug}-${label}-1200.webp 1200w`,
  alt
}));

export const products = [
  {
    id: "currently-revolting-tee",
    slug: "currently-revolting-tee",
    href: "/shop/currently-revolting-tee/",
    designId: "currently-revolting",
    designName: "Currently Revolting",
    displayName: "Currently Revolting Tee",
    name: "Currently Revolting Tee",
    category: "Apparel",
    priceLabel: "$29.99",
    image: "/assets/products/currently-revolting-tee.webp",
    alt: "Sticker-style chibi colonial patriot kicking over a tea crate with flying leaves",
    description: "A lightweight Gildan Softstyle unisex tee with a front DTG print of our tea-crate-kicking patriot. Adult sizes S-3XL in Dark Heather.",
    seoTitle: "Currently Revolting Tee | Spirit of 1776",
    metaDescription: "Shop the Currently Revolting chibi history tee in Dark Heather, available in adult sizes S–3XL and made to order.",
    longDescription: "Currently Revolting is for history fans who appreciate a good protest and a bad tea pun. A furious little patriot, flying tea leaves, and one doomed crate turn Revolutionary-era frustration into something worth wearing.",
    specifications: ["Gildan 64000 Softstyle unisex T-shirt", "Lightweight 4.5 oz/yd² fabric", "Classic crew neckline", "Ribbed collar and shoulder tape", "Front DTG print by Monster Digital"],
    materials: ["Dark Heather: 65% polyester and 35% ring-spun cotton"],
    careInstructions: apparelCare,
    sizesOrDimensions: "Adult sizes S–3XL. Dark Heather only. Consult Printify's size guide before ordering.",
    shippingSummary,
    returnSummary,
    primaryImage: "/assets/products/gallery/currently-revolting-tee-folded-1200.webp",
    galleryImages: gallery("currently-revolting-tee", [
      { label: "folded", alt: "Currently Revolting artwork printed on a folded Dark Heather Gildan Softstyle T-shirt" },
      { label: "front", alt: "Front view of the Currently Revolting Dark Heather unisex T-shirt" },
      { label: "lifestyle", alt: "Model wearing the Currently Revolting Dark Heather T-shirt" }
    ]),
    productUrl: "https://shop.spiritof1776.store/product/31839516",
    storeUrl: STORE_URL,
    analyticsLabel: "currently_revolting_tee",
    availability: "live",
    relatedStorySlugs: ["lexington-and-concord", "declaration-of-independence"]
  },
  {
    id: "currently-revolting-sticker",
    slug: "currently-revolting-sticker",
    href: "/shop/currently-revolting-sticker/",
    designId: "currently-revolting",
    designName: "Currently Revolting",
    displayName: "Currently Revolting Sticker",
    name: "Currently Revolting Sticker",
    category: "Stickers",
    priceLabel: "$7.49",
    image: "/assets/products/currently-revolting-sticker.webp",
    alt: "Die-cut chibi colonial patriot kicking over a wooden tea crate",
    description: "A four-inch die-cut sticker of our furious little patriot, ready for notebooks, bottles, and history kits.",
    seoTitle: "Currently Revolting Sticker | Spirit of 1776",
    metaDescription: "Shop the four-inch Currently Revolting matte die-cut vinyl sticker, made to order for history fans.",
    longDescription: "Currently Revolting turns a tea-crate tantrum into a small badge of Revolutionary-era mischief. Stick it somewhere that could use a little historical attitude.",
    specifications: stickerSpecifications,
    materials: ["Premium white vinyl", "Matte protective laminate"],
    careInstructions: stickerCare,
    sizesOrDimensions: "4 × 4 inch die-cut sticker in white vinyl.",
    shippingSummary,
    returnSummary,
    primaryImage: "/assets/products/gallery/currently-revolting-sticker-front-1200.webp",
    galleryImages: gallery("currently-revolting-sticker", [
      { label: "front", alt: "Front view of the four-inch Currently Revolting die-cut sticker" },
      { label: "notebook", alt: "Currently Revolting sticker displayed on a silver laptop" },
      { label: "bottle", alt: "Currently Revolting sticker displayed on a black skateboard deck" }
    ]),
    productUrl: "https://shop.spiritof1776.store/product/31839757",
    storeUrl: STORE_URL,
    analyticsLabel: "currently_revolting_sticker",
    availability: "live",
    relatedStorySlugs: ["lexington-and-concord", "declaration-of-independence"]
  },
  {
    id: "give-me-a-minute-crewneck",
    slug: "give-me-a-minute-crewneck",
    href: "/shop/give-me-a-minute-crewneck/",
    designId: "give-me-a-minute",
    designName: "Give Me a Minute",
    displayName: "Give Me a Minute Crewneck",
    name: "Give Me a Minute Crewneck",
    category: "Apparel",
    priceLabel: "$49.99",
    image: "/assets/products/give-me-a-minute-crewneck.webp",
    alt: "Frazzled chibi minuteman half dressed with one boot missing and a crooked tricorn hat",
    description: "A navy Gildan Heavy Blend crewneck starring a minuteman who is not quite ready, but is still showing up. Adult sizes S-3XL.",
    seoTitle: "Give Me a Minute Crewneck | Spirit of 1776",
    metaDescription: "Shop the Give Me a Minute chibi minuteman crewneck in Navy, available in adult sizes S–3XL and made to order.",
    longDescription: "Give Me a Minute is for everyone who has ever been called to action before finding the other boot. The frazzled minuteman brings a little chaos to a comfortable cold-weather layer.",
    specifications: ["Gildan 18000 Heavy Blend unisex crewneck", "8 oz/yd² fleece", "Classic fit", "Ribbed collar, cuffs, and waistband", "Front DTG print by Monster Digital"],
    materials: ["50% U.S. cotton and 50% polyester"],
    careInstructions: apparelCare,
    sizesOrDimensions: "Adult sizes S–3XL. Navy only. Consult Printify's size guide before ordering.",
    shippingSummary,
    returnSummary,
    primaryImage: "/assets/products/gallery/give-me-a-minute-crewneck-front-1200.webp",
    galleryImages: gallery("give-me-a-minute-crewneck", [
      { label: "front", alt: "Front view of the Give Me a Minute Navy Gildan Heavy Blend crewneck" },
      { label: "folded", alt: "Give Me a Minute crewneck folded to show the chibi minuteman print" },
      { label: "detail", alt: "Close view of the Give Me a Minute artwork on Navy crewneck fabric" }
    ]),
    productUrl: "https://shop.spiritof1776.store/product/31839649",
    storeUrl: STORE_URL,
    analyticsLabel: "give_me_a_minute_crewneck",
    availability: "live",
    relatedStorySlugs: ["lexington-and-concord"]
  },
  {
    id: "give-me-a-minute-sticker",
    slug: "give-me-a-minute-sticker",
    href: "/shop/give-me-a-minute-sticker/",
    designId: "give-me-a-minute",
    designName: "Give Me a Minute",
    displayName: "Give Me a Minute Sticker",
    name: "Give Me a Minute Sticker",
    category: "Stickers",
    priceLabel: "$7.49",
    image: "/assets/products/give-me-a-minute-sticker.webp",
    alt: "Panicked chibi minuteman with one boot on, one boot missing, and a musket under his arm",
    description: "A four-inch die-cut sticker for anyone who has ever been called to action before finishing breakfast.",
    seoTitle: "Give Me a Minute Sticker | Spirit of 1776",
    metaDescription: "Shop the four-inch Give Me a Minute chibi minuteman matte die-cut vinyl sticker, made to order.",
    longDescription: "Give Me a Minute is for anyone who has ever been called to action before finding the other boot. This panicked little minuteman is ready for notebooks, bottles, and everyday emergencies.",
    specifications: stickerSpecifications,
    materials: ["Premium white vinyl", "Matte protective laminate"],
    careInstructions: stickerCare,
    sizesOrDimensions: "4 × 4 inch die-cut sticker in white vinyl.",
    shippingSummary,
    returnSummary,
    primaryImage: "/assets/products/gallery/give-me-a-minute-sticker-front-1200.webp",
    galleryImages: gallery("give-me-a-minute-sticker", [
      { label: "front", alt: "Front view of the four-inch Give Me a Minute die-cut sticker" },
      { label: "notebook", alt: "Give Me a Minute sticker displayed on a silver laptop" },
      { label: "bottle", alt: "Give Me a Minute sticker displayed on a black skateboard deck" }
    ]),
    productUrl: "https://shop.spiritof1776.store/product/31839795",
    storeUrl: STORE_URL,
    analyticsLabel: "give_me_a_minute_sticker",
    availability: "live",
    relatedStorySlugs: ["lexington-and-concord"]
  },
  {
    id: "liber-tea-mug",
    slug: "liber-tea-mug",
    href: "/shop/liber-tea-mug/",
    designId: "liber-tea",
    designName: "Liber-Tea",
    displayName: "Liber-Tea Mug",
    name: "Liber-Tea Mug",
    category: "Mugs",
    priceLabel: "$19.99",
    image: "/assets/products/liber-tea-mug.webp",
    alt: "Horizontal mug artwork with cheerful chibi patriot raising an oversized steaming teacup",
    description: "An 11-ounce white ceramic mug for tea, coffee, and very serious puns about self-government.",
    seoTitle: "Liber-Tea Mug | Spirit of 1776",
    metaDescription: "Shop the 11-ounce Liber-Tea glossy white ceramic mug with a two-sided chibi patriot design.",
    longDescription: "Liber-Tea serves a very serious self-government pun with every cup. The cheerful patriot and oversized teacup wrap around an 11-ounce white mug.",
    specifications: ["11-ounce mug", "Glossy ceramic finish", "Two-sided dye-sublimation print", "Microwave-safe", "BPA-free"],
    materials: ["White glossy ceramic"],
    careInstructions: ["Hand wash only to protect the print", "Microwave-safe"],
    sizesOrDimensions: "11 fluid ounces. White only.",
    shippingSummary,
    returnSummary,
    primaryImage: "/assets/products/gallery/liber-tea-mug-front-1200.webp",
    galleryImages: gallery("liber-tea-mug", [
      { label: "front", alt: "Front view of the white 11-ounce Liber-Tea ceramic mug" },
      { label: "left", alt: "Left-side view showing the two-sided Liber-Tea mug design" },
      { label: "right", alt: "Right-side view of the glossy white Liber-Tea mug" }
    ]),
    productUrl: "https://shop.spiritof1776.store/product/31845608",
    storeUrl: STORE_URL,
    analyticsLabel: "liber_tea_mug",
    availability: "live",
    relatedStorySlugs: ["declaration-of-independence"]
  },
  {
    id: "liber-tea-sticker",
    slug: "liber-tea-sticker",
    href: "/shop/liber-tea-sticker/",
    designId: "liber-tea",
    designName: "Liber-Tea",
    displayName: "Liber-Tea Sticker",
    name: "Liber-Tea Sticker",
    category: "Stickers",
    priceLabel: "$7.49",
    image: "/assets/products/liber-tea-sticker.webp",
    alt: "Cheerful chibi patriot lifting an oversized steaming teacup with broken tea crates nearby",
    description: "A four-inch die-cut sticker for history fans who appreciate a well-timed tea joke.",
    seoTitle: "Liber-Tea Sticker | Spirit of 1776",
    metaDescription: "Shop the four-inch Liber-Tea chibi patriot matte die-cut vinyl sticker, made to order.",
    longDescription: "Liber-Tea turns a well-timed tea joke into a four-inch die-cut sticker. It is a cheerful little reminder that history and humor can share the same cup.",
    specifications: stickerSpecifications,
    materials: ["Premium white vinyl", "Matte protective laminate"],
    careInstructions: stickerCare,
    sizesOrDimensions: "4 × 4 inch die-cut sticker in white vinyl.",
    shippingSummary,
    returnSummary,
    primaryImage: "/assets/products/gallery/liber-tea-sticker-front-1200.webp",
    galleryImages: gallery("liber-tea-sticker", [
      { label: "front", alt: "Front view of the four-inch Liber-Tea die-cut sticker" },
      { label: "notebook", alt: "Liber-Tea sticker displayed on a silver laptop" },
      { label: "bottle", alt: "Liber-Tea sticker displayed on a black skateboard deck" }
    ]),
    productUrl: "https://shop.spiritof1776.store/product/31839925",
    storeUrl: STORE_URL,
    analyticsLabel: "liber_tea_sticker",
    availability: "live",
    relatedStorySlugs: ["declaration-of-independence"]
  }
];

export const stories = storyManifest.map((story) => ({
  ...story,
  eyebrow: story.era,
  sources: story.sources ?? []
}));

export const timeline = [
  { year: "1775", title: "Lexington and Concord", text: "Armed conflict begins after Massachusetts communities resist coercive searches and seizures.", source: "https://www.nps.gov/mima/learn/historyculture/the-battles-of-lexington-and-concord.htm" },
  { year: "1776", title: "The Declaration of Independence", text: "Congress adopts a public argument for natural rights and government by consent.", source: "https://www.archives.gov/founding-docs/declaration-transcript" },
  { year: "1783", title: "Washington surrenders command", text: "George Washington returns military authority to Congress, placing the army beneath civilian government.", source: "https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/resignation-of-military-commission" },
  { year: "1791", title: "The Bill of Rights", text: "The first ten amendments become concrete limits on federal power.", source: "https://www.archives.gov/founding-docs/bill-of-rights" },
  { year: "1830s-1865", title: "The Underground Railroad", text: "Freedom seekers and allies resist legalized human oppression through flight, aid, and direct action.", source: "https://www.nps.gov/subjects/undergroundrailroad/index.htm" },
  { year: "1861-1865", title: "Union soldiers and emancipation", text: "The Civil War becomes a war to preserve the Union and destroy slavery.", source: "https://www.archives.gov/milestone-documents/emancipation-proclamation" },
  { year: "1848-1920", title: "Women's suffrage", text: "Organizers force the nation to expand political self-government through the Nineteenth Amendment.", source: "https://www.archives.gov/milestone-documents/19th-amendment" },
  { year: "1944", title: "D-Day and the fight against fascism", text: "Allied forces open a foothold in Normandy against Nazi occupation and totalitarian rule.", source: "https://www.nationalww2museum.org/war/topics/d-day-and-normandy-campaign" },
  { year: "1954-1965", title: "The civil-rights movement", text: "Families, students, organizers, and marchers compel America to honor constitutional promises.", source: "https://www.archives.gov/milestone-documents/civil-rights-act" },
  { year: "1972-1974", title: "Watergate accountability", text: "Investigators, courts, Congress, and the public demonstrate that no leader stands above the law.", source: "https://www.archives.gov/research/investigations/watergate" }
];

export const quizQuestions = [
  {
    id: "lexington-why",
    prompt: "What made Lexington and Concord fit the Spirit of 1776 theme?",
    choices: ["Communities resisted coercive power", "It ended the war", "It created the Constitution", "It was fought overseas"],
    correctIndex: 0,
    explanation: "The battles grew from local resistance to British searches for arms and supplies.",
    source: "https://www.nps.gov/mima/learn/historyculture/the-battles-of-lexington-and-concord.htm"
  },
  {
    id: "declaration-power",
    prompt: "According to the Declaration, government gets just powers from what source?",
    choices: ["The consent of the governed", "A king's permission", "Military rank", "Inherited property"],
    correctIndex: 0,
    explanation: "The Declaration says governments derive just powers from the consent of the governed.",
    source: "https://www.archives.gov/founding-docs/declaration-transcript"
  },
  {
    id: "washington-command",
    prompt: "Why was Washington's resignation of command so important?",
    choices: ["It showed civilian government over military rule", "It made him king", "It ended voting", "It canceled Congress"],
    correctIndex: 0,
    explanation: "Washington gave military power back to civilian authority rather than keeping it personally.",
    source: "https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/resignation-of-military-commission"
  },
  {
    id: "bill-of-rights",
    prompt: "What is the Bill of Rights mainly designed to do?",
    choices: ["Limit government power and protect liberties", "Create a national church", "Name a president", "End state governments"],
    correctIndex: 0,
    explanation: "The first ten amendments protect liberties by setting limits on federal power.",
    source: "https://www.archives.gov/founding-docs/bill-of-rights"
  },
  {
    id: "underground-railroad",
    prompt: "What best describes the Underground Railroad?",
    choices: ["Resistance to legalized slavery", "A single train line", "A federal agency", "A Civil War battlefield"],
    correctIndex: 0,
    explanation: "It was a network of people, routes, and places used by freedom seekers resisting slavery.",
    source: "https://www.nps.gov/subjects/undergroundrailroad/index.htm"
  },
  {
    id: "emancipation",
    prompt: "How did emancipation change the Civil War's meaning?",
    choices: ["It linked Union victory to destroying slavery", "It made slavery permanent", "It ended the war immediately", "It removed Black soldiers from the conflict"],
    correctIndex: 0,
    explanation: "Emancipation made freedom a central Union war aim and opened paths for Black military service.",
    source: "https://www.archives.gov/milestone-documents/emancipation-proclamation"
  },
  {
    id: "suffrage",
    prompt: "What did the Nineteenth Amendment prohibit?",
    choices: ["Denying the vote because of sex", "All voting taxes", "Presidential elections", "Women holding office"],
    correctIndex: 0,
    explanation: "The amendment prohibits denying citizens the right to vote on account of sex.",
    source: "https://www.archives.gov/milestone-documents/19th-amendment"
  },
  {
    id: "d-day",
    prompt: "Why does D-Day belong in this broader liberty story?",
    choices: ["It was a sacrifice against fascist totalitarian rule", "It was a tax protest", "It created the Bill of Rights", "It happened in 1776"],
    correctIndex: 0,
    explanation: "The Normandy landings opened a Western Allied front against Nazi occupation.",
    source: "https://www.nationalww2museum.org/war/topics/d-day-and-normandy-campaign"
  },
  {
    id: "civil-rights",
    prompt: "What did the civil-rights movement force America to confront?",
    choices: ["Whether founding promises applied equally", "Whether monarchy should return", "Whether independence should be repealed", "Whether newspapers should close"],
    correctIndex: 0,
    explanation: "The movement pressed the country to honor promises of equal protection, voting rights, and citizenship.",
    source: "https://www.archives.gov/milestone-documents/civil-rights-act"
  },
  {
    id: "watergate",
    prompt: "What core principle did Watergate accountability demonstrate?",
    choices: ["No leader stands above the law", "Presidents cannot be investigated", "Courts have no role", "Congress cannot ask questions"],
    correctIndex: 0,
    explanation: "The scandal tested whether legal accountability reached the presidency itself.",
    source: "https://www.archives.gov/research/investigations/watergate"
  }
];
