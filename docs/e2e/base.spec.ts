import { test, expect } from "@playwright/test";

test("the headers and footer text are there", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText("Link Shortener");
    await expect(page.locator("a:has-text('Tricities Media Group')")).toHaveAttribute("href", "https://tricitiesmediagroup.com");

    await page.goto("/getting-started");
    await expect(page.locator("h1")).toHaveText("Getting Started");
});