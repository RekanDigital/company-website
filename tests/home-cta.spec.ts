import { test, expect } from "@playwright/test";

test.use({ hasTouch: true });

const flightLinks = [
  { progress: 0, selector: "[data-home-flight-hero-button]", href: "/about" },
  { progress: 40, chapter: 2, href: "/businesses/general-trading-supply-chain" },
  { progress: 46, chapter: 3, href: "/businesses/technology-digitalization" },
  { progress: 53, chapter: 4, href: "/businesses/data-business-intelligence" },
  { progress: 60, chapter: 5, href: "/businesses/fisheries-seaweed-blue-economy" },
  { progress: 66, chapter: 6, href: "/businesses/health-bioscience" },
  { progress: 73, chapter: 7, href: "/businesses/agriculture-green-economy" },
  { progress: 79, chapter: 8, href: "/businesses/food-beverage" },
  { progress: 95, chapter: 10, href: "/businesses" },
];

for (const locale of ["", "/id"]) {
  for (const stop of flightLinks) {
    test(`flight CTA navigates to ${locale}${stop.href}`, async ({ page }, testInfo) => {
      test.setTimeout(120_000);
      await page.goto(locale || "/");
      const scene = page.locator("[data-home-scene]");
      await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: 40_000 });
      await page.evaluate((progress) => {
        const sequence = document.querySelector<HTMLElement>("[data-home-flight-sequence]")!;
        const stage = document.querySelector<HTMLElement>("[data-home-flight-stage]")!;
        window.scrollTo({ top: sequence.getBoundingClientRect().top + window.scrollY +
          (sequence.offsetHeight - stage.offsetHeight) * progress / 100, behavior: "instant" });
      }, stop.progress);
      const link = stop.selector ? scene.locator(stop.selector) :
        scene.locator("[data-home-flight-chapter]").nth(stop.chapter!).getByRole("link");
      await expect(link).toBeVisible({ timeout: 60_000 });
      await expect(link).toHaveAttribute("href", `${locale}${stop.href}`);
      // Hit testing catches invisible overlays without forcing the interaction through them.
      await expect.poll(() => link.evaluate((node) => {
        return [...node.getClientRects()].some(rect =>
          node.contains(document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)));
      }), { timeout: 60_000 }).toBe(true);
      await page.screenshot({ path: testInfo.outputPath("flight-link.png") });
      if (testInfo.project.name !== "desktop") await link.tap();
      else await link.click();
      await expect(page).toHaveURL(`${locale}${stop.href}`, { timeout: 30_000 });
      await expect(page.locator("[data-home-scene]")).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}
