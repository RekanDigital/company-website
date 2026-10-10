import { expect, test } from "@playwright/test";

for (const path of ["/about", "/id/about"]) {
  for (const motion of ["no-preference", "reduce"] as const) {
    test(`${path}: first photo fills the portrait view with ${motion} motion`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name === "desktop");
      await page.emulateMedia({ reducedMotion: motion });
      await page.goto(path);
      const backdrop = page.locator(".aboutStoryBackdrop");
      const image = backdrop.locator("img");
      await image.evaluate(async (node: HTMLImageElement) => node.decode());
      const bounds = await backdrop.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        const imageRect = node.querySelector("img")!.getBoundingClientRect();
        return { left: rect.left, right: rect.right, height: rect.height,
          width: rect.width, imageHeight: imageRect.height, viewportWidth: innerWidth, viewportHeight: innerHeight };
      });
      expect(bounds.left).toBeCloseTo(0, 0);
      expect(bounds.right).toBeCloseTo(bounds.viewportWidth, 0);
      expect(bounds.height).toBeCloseTo(bounds.viewportHeight, 0);
      expect(bounds.imageHeight).toBeGreaterThanOrEqual(bounds.height);
      await expect(image).toHaveCSS("object-fit", "cover");
      await expect(page.locator(".aboutStoryPhoto img")).toHaveCount(3);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.evaluate(() => {
        const node = document.querySelector(".aboutStoryScene")!;
        window.scrollTo({ top: node.getBoundingClientRect().top + scrollY, behavior: "instant" });
      });
      await expect.poll(() => backdrop.evaluate((node) => Math.round(node.getBoundingClientRect().top))).toBe(0);
      await page.screenshot({ path: testInfo.outputPath("first-photo.png") });
    });
  }
}
