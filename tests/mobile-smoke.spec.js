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

  // The auth tabs and the submit button both say "Log in"; scope to the form.
  await page.locator("form").getByRole("button", { name: "Log in" }).click();
  await expect(page.getByText("Enter both an email and a password.")).toBeVisible();
});

test("create-account tab reveals the display-name field", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Display name (what classmates will see)")).toBeVisible();
  await expect(page.getByPlaceholder("e.g. Aditya")).toBeVisible();
  await expect(page.locator("form").getByRole("button", { name: "Create account" })).toBeVisible();
});

test("account creation validates missing display name without calling Supabase", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByPlaceholder("you@example.com").fill("student@example.com");
  await page.getByPlaceholder("At least 6 characters").fill("example-password");
  await page.locator("form").getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("Enter a name your classmates will recognize.")).toBeVisible();
});

test("login screen fits a desktop viewport too", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Cahier de vocabulaire" })).toBeVisible();
  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasHorizontalOverflow, "page should not overflow horizontally on desktop").toBe(false);
});
