export const storyTopicGroups = [
  { id: "founding-government", name: "Founding and constitutional government" },
  { id: "expanding-citizenship", name: "Expanding the definition of citizenship" },
  { id: "resistance-coercion", name: "Resistance to coercive power" },
  { id: "accountability-rule-law", name: "Accountability and the rule of law" }
];

const storyDiscovery = {
  "lexington-and-concord": {
    linkLabel: "Read how Lexington and Concord turned a weapons search into war",
    topicGroupIds: ["resistance-coercion", "founding-government"]
  },
  "declaration-of-independence": {
    linkLabel: "Read why the Declaration grounded government power in consent",
    topicGroupIds: ["founding-government", "resistance-coercion"]
  },
  "washington-surrenders-command": {
    linkLabel: "Read why Washington surrendered military authority",
    topicGroupIds: ["founding-government", "accountability-rule-law"]
  },
  "bill-of-rights": {
    linkLabel: "Read how the Bill of Rights limits federal power",
    topicGroupIds: ["founding-government", "accountability-rule-law"]
  },
  "underground-railroad": {
    linkLabel: "Read how freedom seekers resisted legalized slavery",
    topicGroupIds: ["expanding-citizenship", "resistance-coercion"]
  },
  "womens-suffrage": {
    linkLabel: "Read how suffragists expanded political self-government",
    topicGroupIds: ["expanding-citizenship"]
  },
  "union-soldiers-and-emancipation": {
    linkLabel: "Read how emancipation transformed the Civil War",
    topicGroupIds: ["expanding-citizenship", "resistance-coercion"]
  },
  "d-day-and-the-fight-against-fascism": {
    linkLabel: "Read how D-Day opened a foothold against fascism",
    topicGroupIds: ["resistance-coercion"]
  },
  "civil-rights-movement": {
    linkLabel: "Read how families and organizers challenged segregation",
    topicGroupIds: ["expanding-citizenship", "accountability-rule-law"]
  },
  "watergate-accountability": {
    linkLabel: "Read how Watergate proved presidents answer to the law",
    topicGroupIds: ["accountability-rule-law"]
  }
};

export const stories = [
  {
    slug: "lexington-and-concord",
    title: "Lexington and Concord",
    subtitle: "When a Community Refused to Be Disarmed",
    era: "1775",
    format: "Dispatch timeline",
    theme: "dispatch",
    readMinutes: 10,
    summary: "How alarms, uncertain choices, and community resistance turned a weapons search into open conflict.",
    merchandiseMode: "featured",
    relatedProductIds: ["give-me-a-minute-crewneck", "give-me-a-minute-sticker"],
    socialImage: "/assets/stories/lexington-and-concord/01-the-alarm-spreads-1536.webp",
    publishedDate: "2026-09-10",
    modifiedDate: "2026-09-12",
    seoTitle: "Lexington and Concord | Spirit of 1776",
    metaDescription: "How alarms, uncertain choices, and community resistance turned a weapons search into open conflict.",
    primaryImage: "/assets/stories/lexington-and-concord/01-the-alarm-spreads-1536.webp",
    imageAlt: "Under a full moon, Samuel Prescott gallops along a dirt road while neighbors pass the alarm between candlelit farmhouses and local militiamen gather their equipment.",
    topics: ["founding era", "community resistance", "citizen soldiers"]
  },
  {
    slug: "declaration-of-independence",
    title: "The Declaration of Independence",
    subtitle: "Who Gives Government Its Power?",
    era: "1776",
    format: "Founding folio",
    theme: "folio",
    readMinutes: 10,
    summary: "Natural rights, public argument, and the revolutionary claim that government receives its power from the people.",
    merchandiseMode: "general",
    relatedProductIds: [],
    socialImage: "/assets/stories/declaration-of-independence/01-drafting-the-idea-1536.webp",
    publishedDate: "2026-09-10",
    modifiedDate: "2026-09-12",
    seoTitle: "The Declaration of Independence | Spirit of 1776",
    metaDescription: "Natural rights, public argument, and the revolutionary claim that government receives its power from the people.",
    primaryImage: "/assets/stories/declaration-of-independence/01-drafting-the-idea-1536.webp",
    imageAlt: "Thomas Jefferson writes at a crowded wooden desk while John Adams gestures and Benjamin Franklin reviews the draft through round spectacles.",
    topics: ["natural rights", "consent of the governed", "founding era"]
  },
  {
    slug: "washington-surrenders-command",
    title: "Washington Surrenders Command",
    subtitle: "The General Who Gave Power Back",
    era: "1783",
    format: "Civic gallery",
    theme: "gallery",
    readMinutes: 10,
    summary: "The victorious general returns his commission and demonstrates that military power belongs beneath civilian government.",
    merchandiseMode: "general",
    relatedProductIds: [],
    socialImage: "/assets/stories/washington-surrenders-command/01-the-newburgh-choice-1536.webp",
    publishedDate: "2026-09-10",
    modifiedDate: "2026-09-12",
    seoTitle: "Washington Surrenders Command | Spirit of 1776",
    metaDescription: "The victorious general returns his commission and demonstrates that military power belongs beneath civilian government.",
    primaryImage: "/assets/stories/washington-surrenders-command/01-the-newburgh-choice-1536.webp",
    imageAlt: "George Washington stands with spectacles and a blank paper among angry, exhausted Continental officers in a plain wooden meeting hall.",
    topics: ["civilian government", "military authority", "founding era"]
  },
  {
    slug: "bill-of-rights",
    title: "The Bill of Rights",
    subtitle: "Rules the Government Must Obey",
    era: "1791",
    format: "Amendment cards",
    theme: "amendments",
    readMinutes: 10,
    summary: "Promises become enforceable rules that tell the federal government what it must not do.",
    merchandiseMode: "general",
    relatedProductIds: [],
    socialImage: "/assets/stories/bill-of-rights/01-a-constitution-without-rights-1536.webp",
    publishedDate: "2026-09-10",
    modifiedDate: "2026-09-12",
    seoTitle: "The Bill of Rights | Spirit of 1776",
    metaDescription: "Promises become enforceable rules that tell the federal government what it must not do.",
    primaryImage: "/assets/stories/bill-of-rights/01-a-constitution-without-rights-1536.webp",
    imageAlt: "Delegates debate the Constitution while George Mason points to missing written protections and citizens watch from the gallery.",
    topics: ["Bill of Rights", "constitutional rights", "limited government"]
  },
  {
    slug: "underground-railroad",
    title: "The Underground Railroad",
    subtitle: "Freedom Was Taken, Not Given",
    era: "c. 1830–1865",
    format: "Night journey",
    theme: "night",
    readMinutes: 11,
    summary: "Freedom seekers led their own resistance to legalized oppression, aided by courageous networks of people and places.",
    merchandiseMode: "none",
    relatedProductIds: [],
    socialImage: "/assets/stories/underground-railroad/01-choosing-freedom-1536.webp",
    publishedDate: "2026-09-10",
    modifiedDate: "2026-09-12",
    seoTitle: "The Underground Railroad | Spirit of 1776",
    metaDescription: "Freedom seekers led their own resistance to legalized oppression, aided by courageous networks of people and places.",
    primaryImage: "/assets/stories/underground-railroad/01-choosing-freedom-1536.webp",
    imageAlt: "Harriet Tubman pauses at the edge of a moonlit Maryland wood while loved ones remain near a distant cabin.",
    topics: ["Underground Railroad", "freedom seekers", "resistance to slavery"]
  },
  {
    slug: "womens-suffrage",
    title: "Women's Suffrage",
    subtitle: "Who Counts as the People?",
    era: "1848–1920",
    format: "Campaign scrapbook",
    theme: "scrapbook",
    readMinutes: 11,
    summary: "Generations of organizers forced the nation to expand the meaning of political self-government.",
    merchandiseMode: "none",
    relatedProductIds: [],
    socialImage: "/assets/stories/womens-suffrage/01-a-declaration-becomes-a-demand-1536.webp",
    publishedDate: "2026-09-10",
    modifiedDate: "2026-09-12",
    seoTitle: "Women’s Suffrage | Spirit of 1776",
    metaDescription: "Generations of organizers forced the nation to expand the meaning of political self-government.",
    primaryImage: "/assets/stories/womens-suffrage/01-a-declaration-becomes-a-demand-1536.webp",
    imageAlt: "Elizabeth Cady Stanton reads a declaration in the Seneca Falls chapel while Lucretia Mott, Frederick Douglass, and the audience debate voting rights.",
    topics: ["women's suffrage", "voting rights", "self-government"]
  },
  {
    slug: "union-soldiers-and-emancipation",
    title: "Union Soldiers and Emancipation",
    subtitle: "A War Transformed by Freedom",
    era: "1861–1865",
    format: "Field report",
    theme: "field-report",
    readMinutes: 11,
    summary: "Enslaved people and Black soldiers helped transform a war for Union into a war that destroyed slavery.",
    merchandiseMode: "none",
    relatedProductIds: [],
    socialImage: "/assets/stories/union-soldiers-and-emancipation/01-freedom-reaches-union-lines-1536.webp",
    publishedDate: "2026-09-10",
    modifiedDate: "2026-09-12",
    seoTitle: "Union Soldiers and Emancipation | Spirit of 1776",
    metaDescription: "Enslaved people and Black soldiers helped transform a war for Union into a war that destroyed slavery.",
    primaryImage: "/assets/stories/union-soldiers-and-emancipation/01-freedom-reaches-union-lines-1536.webp",
    imageAlt: "Frank Baker, Shepard Mallory, and James Townsend stand resolutely at Fort Monroe's gate while Union officers confront their arrival.",
    topics: ["emancipation", "Civil War", "Black soldiers"]
  },
  {
    slug: "d-day-and-the-fight-against-fascism",
    title: "D-Day and the Fight Against Fascism",
    subtitle: "A Foothold for Liberation",
    era: "1944",
    format: "Mission dossier",
    theme: "dossier",
    readMinutes: 11,
    summary: "A vast coalition accepted terrible risk to open a foothold against Nazi occupation and totalitarian rule.",
    merchandiseMode: "none",
    relatedProductIds: [],
    socialImage: "/assets/stories/d-day-and-the-fight-against-fascism/01-occupation-and-resistance-1536.webp",
    publishedDate: "2026-09-10",
    modifiedDate: "2026-09-12",
    seoTitle: "D-Day and the Fight Against Fascism | Spirit of 1776",
    metaDescription: "A vast coalition accepted terrible risk to open a foothold against Nazi occupation and totalitarian rule.",
    primaryImage: "/assets/stories/d-day-and-the-fight-against-fascism/01-occupation-and-resistance-1536.webp",
    imageAlt: "In occupied Normandy, French civilians quietly listen to a hidden radio while a German patrol moves along the road outside.",
    topics: ["D-Day", "World War II", "resistance to fascism"]
  },
  {
    slug: "civil-rights-movement",
    title: "The Civil Rights Movement",
    subtitle: "Making America Honor Its Promise",
    era: "1954–1965",
    format: "Movement poster",
    theme: "movement",
    readMinutes: 11,
    summary: "Families, organizers, students, and marchers compelled America to honor promises it had long denied.",
    merchandiseMode: "none",
    relatedProductIds: [],
    socialImage: "/assets/stories/civil-rights-movement/01-families-take-segregation-to-court-1536.webp",
    publishedDate: "2026-09-10",
    modifiedDate: "2026-09-12",
    seoTitle: "The Civil Rights Movement | Spirit of 1776",
    metaDescription: "Families, organizers, students, and marchers compelled America to honor promises it had long denied.",
    primaryImage: "/assets/stories/civil-rights-movement/01-families-take-segregation-to-court-1536.webp",
    imageAlt: "Black parents, children, local organizers, and NAACP lawyers prepare case files outside a segregated school.",
    topics: ["civil rights movement", "equal protection", "voting rights"]
  },
  {
    slug: "watergate-accountability",
    title: "Watergate Accountability",
    subtitle: "No Leader Stands Above the Law",
    era: "1972–1974",
    format: "Evidence file",
    theme: "evidence",
    readMinutes: 11,
    summary: "Investigators, courts, Congress, and the public proved that no president stands beyond the reach of law.",
    merchandiseMode: "none",
    relatedProductIds: [],
    socialImage: "/assets/stories/watergate-accountability/01-a-piece-of-tape-1536.webp",
    publishedDate: "2026-09-10",
    modifiedDate: "2026-09-12",
    seoTitle: "Watergate Accountability | Spirit of 1776",
    metaDescription: "Investigators, courts, Congress, and the public proved that no president stands beyond the reach of law.",
    primaryImage: "/assets/stories/watergate-accountability/01-a-piece-of-tape-1536.webp",
    imageAlt: "Security guard Frank Wills examines tape on a Watergate door latch while plainclothes police quietly approach.",
    topics: ["Watergate", "rule of law", "presidential accountability"]
  }
].map((story) => ({
  ...story,
  ...storyDiscovery[story.slug],
  href: `/stories/${story.slug}/`,
  sourceFile: `content/stories/${story.slug}/story.md`
}));
