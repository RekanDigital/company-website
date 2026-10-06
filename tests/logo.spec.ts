import { test, expect } from "@playwright/test";

test("Home header preserves the original blue logo without ancestor blending", async ({ page }) => {
  await page.goto("/");
  const logo = page.locator("header .site-brand img");
  await expect(logo).toBeVisible();
  const blendModes = await logo.evaluate((element) => {
    const modes: string[] = [];
    for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
      modes.push(getComputedStyle(ancestor).mixBlendMode);
    }
    return modes;
  });
  expect(blendModes.every((mode) => mode === "normal")).toBe(true);
});
