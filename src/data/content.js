import { stories as storyManifest } from "./story-manifest.js";

export const STORE_URL = "https://shop.spiritof1776.store/";

export const products = [
  {
    id: "currently-revolting-tee",
    name: "Currently Revolting Chibi Patriot T-Shirt",
    category: "Apparel",
    priceLabel: "$29.99",
    image: "/assets/products/currently-revolting-tee.webp",
    alt: "Sticker-style chibi colonial patriot kicking over a tea crate with flying leaves",
    description: "A furious-but-cute Revolutionary-era patriot for readers who like their history with a little comic spark.",
    productUrl: "https://shop.spiritof1776.store/product/31839516",
    storeUrl: STORE_URL,
    analyticsLabel: "currently_revolting_tee",
    availability: "live",
    relatedStorySlugs: ["lexington-and-concord", "declaration-of-independence"]
  },
  {
    id: "currently-revolting-sticker",
    name: "Currently Revolting Chibi Patriot Sticker",
    category: "Stickers",
    priceLabel: "$7.49",
    image: "/assets/products/currently-revolting-sticker.webp",
    alt: "Die-cut chibi colonial patriot kicking over a wooden tea crate",
    description: "A bold die-cut sticker version of the tea-crate tantrum, made for notebooks, bottles, and history kits.",
    productUrl: "https://shop.spiritof1776.store/product/31839757",
    storeUrl: STORE_URL,
    analyticsLabel: "currently_revolting_sticker",
    availability: "live",
    relatedStorySlugs: ["lexington-and-concord", "declaration-of-independence"]
  },
  {
    id: "give-me-a-minute-crewneck",
    name: "Give Me a Minute Chibi Minuteman Crewneck",
    category: "Apparel",
    priceLabel: "$49.99",
    image: "/assets/products/give-me-a-minute-crewneck.webp",
    alt: "Frazzled chibi minuteman half dressed with one boot missing and a crooked tricorn hat",
    description: "A soft crewneck built around the most relatable militia moment: not quite ready, but still showing up.",
    productUrl: "https://shop.spiritof1776.store/product/31839649",
    storeUrl: STORE_URL,
    analyticsLabel: "give_me_a_minute_crewneck",
    availability: "live",
    relatedStorySlugs: ["lexington-and-concord"]
  },
  {
    id: "give-me-a-minute-sticker",
    name: "Give Me a Minute Chibi Minuteman Sticker",
    category: "Stickers",
    priceLabel: "$7.49",
    image: "/assets/products/give-me-a-minute-sticker.webp",
    alt: "Panicked chibi minuteman with one boot on, one boot missing, and a musket under his arm",
    description: "A compact sticker for anyone who has ever been called to action before finishing breakfast.",
    productUrl: "https://shop.spiritof1776.store/product/31839795",
    storeUrl: STORE_URL,
    analyticsLabel: "give_me_a_minute_sticker",
    availability: "live",
    relatedStorySlugs: ["lexington-and-concord"]
  },
  {
    id: "liber-tea-mug",
    name: "Liber-Tea Chibi Patriot Mug",
    category: "Mugs",
    priceLabel: "$19.99",
    image: "/assets/products/liber-tea-mug.webp",
    alt: "Horizontal mug artwork with cheerful chibi patriot raising an oversized steaming teacup",
    description: "A bright white mug for tea, coffee, and very serious puns about self-government.",
    productUrl: "https://shop.spiritof1776.store/product/31845608",
    storeUrl: STORE_URL,
    analyticsLabel: "liber_tea_mug",
    availability: "live",
    relatedStorySlugs: ["declaration-of-independence"]
  },
  {
    id: "liber-tea-sticker",
    name: "Liber-Tea Chibi Patriot Sticker",
    category: "Stickers",
    priceLabel: "$7.49",
    image: "/assets/products/liber-tea-sticker.webp",
    alt: "Cheerful chibi patriot lifting an oversized steaming teacup with broken tea crates nearby",
    description: "A playful die-cut sticker for history fans who appreciate a well-timed tea joke.",
    productUrl: "https://shop.spiritof1776.store/product/31839925",
    storeUrl: STORE_URL,
    analyticsLabel: "liber_tea_sticker",
    availability: "live",
    relatedStorySlugs: ["declaration-of-independence"]
  }
];

export const stories = storyManifest.map((story) => ({
  slug: story.slug,
  title: story.title,
  eyebrow: story.era,
  summary: story.summary,
  href: story.href,
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
