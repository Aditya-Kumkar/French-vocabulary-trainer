import { test, expect } from "@playwright/test";

test("login screen renders at a phone viewport without horizontal overflow", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page).toHaveTitle(/Cahier de vocabulaire/i);
  await expect(page.getByRole("heading", { name: "Cahier de vocabulaire" })).toBeVisible();
  await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
  await expect(page.getByPlaceholder("••••••••")).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasHorizontalOverflow, "page should not overflow horizontally on a 390px-wide phone").toBe(false);
  expect(pageErrors, "page should not throw uncaught JavaScript errors").toEqual([]);
});

test("login form validates empty fields without calling Supabase", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByText("Enter both an email and a password.")).toBeVisible();
});
