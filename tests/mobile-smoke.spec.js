import { test, expect } from "@playwright/test";

test("vocabulary trainer loads at a phone viewport without horizontal overflow", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page).toHaveTitle(/Cahier de vocabulaire/i);
  await expect(page.locator("#root")).not.toBeEmpty();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasHorizontalOverflow, "page should not overflow horizontally on a 390px-wide phone").toBe(false);
  expect(pageErrors, "page should not throw uncaught JavaScript errors").toEqual([]);
});
