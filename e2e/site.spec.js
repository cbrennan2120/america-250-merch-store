import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage renders the complete launch structure without console errors", async ({ page }, testInfo) => {
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Big history.Tiny heroes.");
  await expect(page.locator(".product-card")).toHaveCount(6);
  await expect(page.getByRole("link", { name: "Explore 10 stories" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Shop chibi goods" })).toBeVisible();
  expect(errors).toEqual([]);
  if (process.env.CAPTURE_QA) {
    await page.screenshot({ path: `test-results/home-${testInfo.project.name}.png`, fullPage: true });
  }
});

test("navigation works at mobile width", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile-only interaction");
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu" });
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Timeline" })).toBeVisible();
});

test("quiz can be completed, explained, shared, and retried", async ({ page }) => {
  await page.goto("/quiz/");
  const questions = page.locator(".quiz-question");
  await expect(questions).toHaveCount(10);
  const correct = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let index = 0; index < correct.length; index += 1) {
    await questions.nth(index).locator("input").nth(correct[index]).check();
  }
  await page.getByRole("button", { name: "See my result" }).click();
  await expect(page.locator("[data-result-score]")).toHaveText("10 out of 10");
  await expect(page.locator(".quiz-feedback")).toHaveCount(10);
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.locator("[data-quiz-result]")).toBeHidden();
});

test("live products link to their product-specific Printify pages", async ({ page }) => {
  await page.goto("/shop/");
  await expect(page.locator(".product-card")).toHaveCount(6);
  await expect(page.getByText("Available now")).toHaveCount(6);
  const links = page.locator("[data-product-link]");
  await expect(links).toHaveCount(6);
  await expect(links.nth(0)).toHaveAttribute("href", "https://shop.spiritof1776.store/product/31839516");
  await expect(links.nth(1)).toHaveAttribute("href", "https://shop.spiritof1776.store/product/31839757");
  await expect(links.nth(2)).toHaveAttribute("href", "https://shop.spiritof1776.store/product/31839649");
  await expect(links.nth(3)).toHaveAttribute("href", "https://shop.spiritof1776.store/product/31839795");
  await expect(links.nth(4)).toHaveAttribute("href", "https://shop.spiritof1776.store/product/31845608");
  await expect(links.nth(5)).toHaveAttribute("href", "https://shop.spiritof1776.store/product/31839925");
});

test("analytics stays unloaded on an unapproved local hostname", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-consent-banner]")).toHaveCount(0);
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
});

test("the branded not-found page offers recovery navigation", async ({ page }) => {
  await page.goto("/404.html");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This trail goes cold.");
  await expect(page.getByRole("link", { name: "Return home" })).toBeVisible();
});

const storyRoutes = [
  "/stories/declaration-of-independence/",
  "/stories/lexington-and-concord/",
  "/stories/washington-surrenders-command/",
  "/stories/bill-of-rights/",
  "/stories/underground-railroad/",
  "/stories/union-soldiers-and-emancipation/",
  "/stories/womens-suffrage/",
  "/stories/d-day-and-the-fight-against-fascism/",
  "/stories/civil-rights-movement/",
  "/stories/watergate-accountability/"
];

test("the permanent story hub links ten complete illustrated stories", async ({ page }) => {
  await page.goto("/stories/");
  await expect(page.locator(".story-card")).toHaveCount(10);

  const themes = new Set();
  for (const route of storyRoutes) {
    await page.goto(route);
    await expect(page.locator(".story-chapter")).toHaveCount(5);
    await expect(page.locator(".story-chapter__figure")).toHaveCount(4);
    await expect(page.locator(".source-drawer")).toHaveCount(1);
    themes.add(await page.locator("body").getAttribute("class"));
    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasHorizontalOverflow).toBe(false);
  }
  expect(themes.size).toBe(10);
});

for (const route of ["/", "/stories/declaration-of-independence/", "/quiz/", "/shop/", "/stories/", "/stories/lexington-and-concord/"]) {
  test(`has no serious accessibility violations at ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(({ impact }) => ["serious", "critical"].includes(impact))).toEqual([]);
  });
}
