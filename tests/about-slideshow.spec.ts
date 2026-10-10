import { expect, test } from "@playwright/test";

for (const locale of ["en", "id"] as const) {
  test(`About gallery pairs its three story paragraphs with approved photos in ${locale}`, async ({ page }) => {
    await page.goto(locale === "en" ? "/about" : "/id/about");
    const gallery = page.getByRole("region", { name: locale === "en" ? "RekanMU moments and story" : "Momen dan kisah RekanMU" });
    await expect(gallery).toBeVisible();
    await expect(gallery.getByRole("button")).toHaveCount(0);
    await expect(gallery).toHaveCSS("border-top-width", "0px");
    await expect(gallery).toHaveCSS("border-bottom-width", "0px");
    const photos = gallery.locator("img");
    await expect(photos).toHaveCount(4);
    await expect(photos.first()).toHaveAttribute("alt", locale === "en"
      ? "The RekanMU team gathered around a conference table."
      : "Tim RekanMU berkumpul mengelilingi meja rapat.");
    for (let index = 0; index < 4; index++) {
      await expect(photos.nth(index)).toHaveAttribute("src", new RegExp(`about-slide-${index + 1}_v2\\.png`));
    }
    const pairs = gallery.locator(".aboutStoryPair");
    await expect(pairs).toHaveCount(3);
    for (let index = 0; index < 3; index++) {
      const pair = pairs.nth(index);
      await pair.evaluate(element => window.scrollTo(0, scrollY + element.getBoundingClientRect().top - 100));
      await expect(pair.locator(".aboutStoryPhoto")).toBeInViewport();
      await pair.locator("img").evaluate(async (image: HTMLImageElement) => image.decode());
      await expect(pair.locator(".aboutStoryPhoto")).toHaveCSS("border-radius", "12px");
      expect((await pair.locator(".aboutStoryCopy p").innerText()).length).toBeGreaterThan(50);
      await expect.poll(() => pair.locator(".aboutStoryWord > span").evaluateAll(words => Math.min(...words.map(word => Number(getComputedStyle(word).opacity))))).toBeGreaterThan(0.99);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("About gallery keeps photos and story readable in normal flow with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");
  const pairs = page.locator(".aboutStoryPair");
  await expect(pairs).toHaveCount(3);
  for (let index = 0; index < 3; index++) {
    const pair = pairs.nth(index);
    await pair.scrollIntoViewIfNeeded();
    await expect(pair.locator(".aboutStoryPhoto")).toHaveCSS("position", "static");
    await expect(pair.locator(".aboutStoryCopy")).toHaveCSS("position", "static");
    await expect(pair.locator(".aboutStoryCopy")).toBeVisible();
    expect(await pair.locator(".aboutStoryWord > span").evaluateAll(words => words.every(word => getComputedStyle(word).animationName === "none" && Number(getComputedStyle(word).opacity) === 1))).toBe(true);
  }
});
