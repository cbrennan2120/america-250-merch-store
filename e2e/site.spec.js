import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage renders the complete launch structure without console errors", async ({ page }, testInfo) => {
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Freedom is a story");
  await expect(page.locator(".product-card")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "Read the stories" })).toBeVisible();
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
  const correct = [0, 1, 1, 1, 2, 0, 1, 2, 2, 0];
  for (let index = 0; index < correct.length; index += 1) {
    await questions.nth(index).locator("input").nth(correct[index]).check();
  }
  await page.getByRole("button", { name: "See my result" }).click();
  await expect(page.locator("[data-result-score]")).toHaveText("10 out of 10");
  await expect(page.locator(".quiz-feedback")).toHaveCount(10);
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.locator("[data-quiz-result]")).toBeHidden();
});

test("prelaunch products are transparent and link to the real Printify storefront", async ({ page }) => {
  await page.goto("/shop/");
  await expect(page.locator(".product-card")).toHaveCount(3);
  await expect(page.getByText("Store setup in progress")).toHaveCount(3);
  const links = page.locator("[data-product-link]");
  await expect(links).toHaveCount(3);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("href", "https://the-spirit-of-1776.printify.me/");
  }
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

for (const route of ["/", "/stories/declaration/", "/quiz/", "/shop/"]) {
  test(`has no serious accessibility violations at ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(({ impact }) => ["serious", "critical"].includes(impact))).toEqual([]);
  });
}
