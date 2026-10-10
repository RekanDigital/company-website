import { expect, test } from "@playwright/test";

for (const locale of ["en", "id"]) {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`${locale}: sticky category masks outgoing text (${reducedMotion})`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name === "desktop");
      await page.emulateMedia({ reducedMotion });
      await page.goto(`${locale === "id" ? "/id" : ""}/products-services`);
      const sections = page.locator(".productsPage .catalogueSection");
      await expect(sections).toHaveCount(5);
      for (let index = 0; index < 5; index++) {
        const section = sections.nth(index);
        const heading = section.locator("h2");
        await section.evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top + element.getBoundingClientRect().height / 2));
        await expect.poll(async () => (await heading.boundingBox())?.y).toBeCloseTo(64, 0);
        const mask = await heading.evaluate(element => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element, "::before");
          return { content: style.content, height: parseFloat(style.height), top: rect.bottom - parseFloat(style.height), left: rect.left + parseFloat(style.left), right: rect.right - parseFloat(style.right), background: style.backgroundColor };
        });
        expect(mask.content).toBe('""');
        expect(mask.top).toBeLessThanOrEqual(1);
        expect(mask.left).toBeLessThanOrEqual(1);
        expect(mask.right).toBeGreaterThanOrEqual(page.viewportSize()!.width - 1);
        expect(mask.background).toBe("rgb(246, 248, 250)");
        await page.screenshot({ path: testInfo.outputPath(`category-${index}.png`) });
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
    });
  }
}
