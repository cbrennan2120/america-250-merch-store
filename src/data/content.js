export const STORE_URL = "https://shop.spiritof1776.store/";

export const products = [
  {
    id: "eagle-tee",
    name: "Spirit Eagle T-Shirt",
    category: "T-shirt",
    priceLabel: "$29.99",
    image: "/assets/products/eagle-tee-mockup.webp",
    imageAvif: "/assets/products/eagle-tee-mockup.avif",
    printFile: "/assets/products/eagle-tee-print.png",
    alt: "Charcoal T-shirt concept with a vintage eagle, shield, and Spirit of 1776 lettering",
    description: "A four-color eagle-and-shield crest honoring 250 years of an unfinished American idea.",
    productUrl: "https://shop.spiritof1776.store/product/30706124",
    storeUrl: STORE_URL,
    analyticsLabel: "eagle_tee",
    availability: "live"
  },
  {
    id: "fife-drum-crewneck",
    name: "History in Motion Crewneck",
    category: "Crewneck sweatshirt",
    priceLabel: "$49.99",
    image: "/assets/products/fife-drum-crewneck-mockup.webp",
    imageAvif: "/assets/products/fife-drum-crewneck-mockup.avif",
    printFile: "/assets/products/fife-drum-crewneck-print.png",
    alt: "Navy crewneck concept with a fifer, two drummers, and History in Motion lettering",
    description: "A period-inspired fife-and-drum illustration built for cool evenings and curious conversations.",
    productUrl: "https://shop.spiritof1776.store/product/30706127",
    storeUrl: STORE_URL,
    analyticsLabel: "fife_drum_crewneck",
    availability: "live"
  },
  {
    id: "flag-sticker",
    name: "One Enduring Idea Sticker",
    category: "Die-cut sticker",
    priceLabel: "$7.49",
    image: "/assets/products/flag-sticker-mockup.webp",
    imageAvif: "/assets/products/flag-sticker-mockup.avif",
    printFile: "/assets/products/spirit-flag-sticker-print.png",
    alt: "Distressed thirteen-star flag sticker reading Spirit of 1776 and One Enduring Idea",
    description: "A weathered thirteen-star flag badge for notebooks, bottles, and history kits.",
    productUrl: "https://shop.spiritof1776.store/product/30706156",
    storeUrl: STORE_URL,
    analyticsLabel: "flag_sticker",
    availability: "live"
  }
];

export const stories = [
  {
    slug: "declaration",
    title: "What Changed on July 4, 1776?",
    eyebrow: "A document becomes a decision",
    summary: "Independence was debated, adopted, printed, and carried outward—not completed in a single dramatic signing.",
    href: "/stories/declaration/",
    sources: [
      "https://www.archives.gov/milestone-documents/declaration-of-independence",
      "https://www.archives.gov/founding-docs/declaration-history"
    ]
  },
  {
    slug: "liberty-bell",
    title: "Symbols, Myths, and the Liberty Bell",
    eyebrow: "A working bell becomes an argument",
    summary: "The bell's most familiar stories grew over time, as new generations gave its inscription new meaning.",
    href: "/stories/liberty-bell/",
    sources: [
      "https://www.nps.gov/inde/learn/historyculture/stories-libertybell.htm",
      "https://www.nps.gov/inde/faqs.htm"
    ]
  },
  {
    slug: "lived-revolution",
    title: "Who Lived Through the Revolution?",
    eyebrow: "Many choices, many costs",
    summary: "Women, Black Americans, Native nations, loyalists, laborers, and families experienced the war in sharply different ways.",
    href: "/stories/lived-revolution/",
    sources: [
      "https://www.loc.gov/classroom-materials/united-states-history-primary-source-timeline/american-revolution-1763-1783/revolutionary-war-home-front/",
      "https://www.loc.gov/classroom-materials/american-revolution/"
    ]
  }
];

export const timeline = [
  { year: "1765", title: "The Stamp Act", text: "Parliament taxes printed materials, intensifying arguments over representation.", source: "https://www.loc.gov/classroom-materials/american-revolution/" },
  { year: "1770", title: "The Boston Massacre", text: "British soldiers fire into a Boston crowd; competing accounts turn the event into powerful propaganda.", source: "https://www.loc.gov/classroom-materials/american-revolution/" },
  { year: "1773", title: "The Boston Tea Party", text: "Protesters destroy East India Company tea, prompting a stronger British response.", source: "https://www.nps.gov/bost/learn/historyculture/boston-tea-party.htm" },
  { year: "1775", title: "Lexington and Concord", text: "Fighting begins in Massachusetts on April 19, transforming political conflict into war.", source: "https://www.nps.gov/mima/learn/historyculture/the-battles-of-lexington-and-concord.htm" },
  { year: "1776", title: "Independence declared", text: "Congress adopts the Declaration on July 4; the first printed copies begin circulating the next day.", source: "https://www.archives.gov/founding-docs/declaration-history" },
  { year: "1777", title: "Saratoga", text: "An American victory helps convince France to enter the war as an ally.", source: "https://www.nps.gov/sara/learn/historyculture/the-battle-of-saratoga.htm" },
  { year: "1781", title: "Yorktown", text: "A combined American and French campaign traps Cornwallis, ending the war's last major battle.", source: "https://www.nps.gov/york/learn/historyculture/siege-of-yorktown.htm" },
  { year: "1783", title: "The Treaty of Paris", text: "The treaty formally ends the war and recognizes United States independence.", source: "https://www.archives.gov/milestone-documents/treaty-of-paris" }
];

export const quizQuestions = [
  {
    id: "independence-vote",
    prompt: "On which date did Congress adopt the resolution for independence?",
    choices: ["July 2, 1776", "July 4, 1776", "August 2, 1776", "July 8, 1776"],
    correctIndex: 0,
    explanation: "Congress adopted the Lee Resolution on July 2. It adopted the Declaration's final text on July 4.",
    source: "https://www.archives.gov/founding-docs/declaration-history"
  },
  {
    id: "declaration-adopted",
    prompt: "What happened on July 4, 1776?",
    choices: ["Every delegate signed the parchment", "Congress adopted the Declaration", "The war ended", "The Constitution took effect"],
    correctIndex: 1,
    explanation: "Congress adopted the Declaration on July 4; delegates began signing the engrossed parchment on August 2.",
    source: "https://www.archives.gov/milestone-documents/declaration-of-independence"
  },
  {
    id: "dunlap",
    prompt: "Who printed the first broadside copies of the Declaration?",
    choices: ["Benjamin Franklin", "John Dunlap", "Mary Katherine Goddard", "Paul Revere"],
    correctIndex: 1,
    explanation: "Congress sent the adopted text to printer John Dunlap on the night of July 4.",
    source: "https://www.archives.gov/founding-docs/declaration-history"
  },
  {
    id: "bell-name",
    prompt: "What was the Liberty Bell originally called?",
    choices: ["The Freedom Bell", "The State House Bell", "The Congress Bell", "The Philadelphia Bell"],
    correctIndex: 1,
    explanation: "It served Pennsylvania's State House and was known simply as the State House bell.",
    source: "https://www.nps.gov/inde/learn/historyculture/stories-libertybell.htm"
  },
  {
    id: "bell-crack",
    prompt: "What do historians know for certain about the Liberty Bell's first crack?",
    choices: ["It cracked on July 4", "A cannon blast caused it", "No exact date or cause is documented", "It arrived cracked from London"],
    correctIndex: 2,
    explanation: "There is no surviving record that establishes exactly when or why the famous crack began.",
    source: "https://www.nps.gov/inde/faqs.htm"
  },
  {
    id: "bell-symbol",
    prompt: "Which movement helped popularize the name “Liberty Bell” in the 1830s?",
    choices: ["Abolition", "Temperance", "Conservation", "Labor reform"],
    correctIndex: 0,
    explanation: "Abolitionists embraced the bell's inscription and used the Liberty Bell name in antislavery publications.",
    source: "https://www.nps.gov/inde/learn/historyculture/stories-libertybell.htm"
  },
  {
    id: "home-front",
    prompt: "How did the war change many women's daily work?",
    choices: ["It ended household production", "Many took on farms, businesses, and camp work", "Women were required to leave cities", "It guaranteed voting rights"],
    correctIndex: 1,
    explanation: "Women maintained farms and businesses and often performed essential cooking, laundry, and nursing work in army camps.",
    source: "https://www.loc.gov/classroom-materials/united-states-history-primary-source-timeline/american-revolution-1763-1783/revolutionary-war-home-front/"
  },
  {
    id: "native-nations",
    prompt: "Did Native nations all choose the same side in the Revolution?",
    choices: ["Yes, all supported Britain", "Yes, all supported independence", "No, choices differed and many tried neutrality", "Native nations were not involved"],
    correctIndex: 2,
    explanation: "Native nations made different strategic choices; many feared further colonial expansion, while others sought neutrality.",
    source: "https://www.loc.gov/classroom-materials/united-states-history-primary-source-timeline/american-revolution-1763-1783/revolutionary-war-home-front/"
  },
  {
    id: "african-americans",
    prompt: "Which statement best describes Black Americans during the Revolution?",
    choices: ["All served one side", "The war immediately ended slavery", "People pursued freedom through different paths on both sides", "Black Americans were barred from all military service"],
    correctIndex: 2,
    explanation: "Some sought freedom through British lines, some served in American forces, and many remained enslaved despite revolutionary language.",
    source: "https://www.loc.gov/classroom-materials/united-states-history-primary-source-timeline/american-revolution-1763-1783/revolutionary-war-home-front/"
  },
  {
    id: "peace",
    prompt: "Which agreement formally ended the Revolutionary War?",
    choices: ["Treaty of Paris, 1783", "Articles of Confederation", "Bill of Rights", "Jay Treaty"],
    correctIndex: 0,
    explanation: "The 1783 Treaty of Paris ended the war and recognized United States independence.",
    source: "https://www.archives.gov/milestone-documents/treaty-of-paris"
  }
];
