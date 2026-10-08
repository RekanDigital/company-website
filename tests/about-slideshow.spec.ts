import { expect, test } from "@playwright/test";

async function scrollSlideshowTo(page: import("@playwright/test").Page, progress: number) {
  await page.evaluate((ratio) => {
    const section = document.querySelector<HTMLElement>(".aboutSlideshow")!;
    const pin = section.querySelector<HTMLElement>(".aboutSlideshowPin")!;
    const start = window.scrollY + section.getBoundingClientRect().top;
    const range = section.offsetHeight - pin.getBoundingClientRect().height;
    window.scrollTo({ top: start + range * ratio, behavior: "instant" });
  }, progress);
}

for (const locale of ["en", "id"] as const) {
  test(`About slideshow uses the responsive presentation in ${locale}`, async ({ page }) => {
    const route = locale === "en" ? "/about" : "/id/about";
    const regionName = locale === "en" ? "RekanMU moments" : "Momen RekanMU";

    await page.goto(route);
    const slideshow = page.getByRole("region", { name: regionName });
    await expect(slideshow).toBeVisible();
    await expect(slideshow.getByRole("button")).toHaveCount(0);
    expect(await slideshow.evaluate((section) => {
      const parent = section.parentElement!;
      const next = section.nextElementSibling!;
      return [
        getComputedStyle(parent).borderTopWidth,
        getComputedStyle(section).borderTopWidth,
        getComputedStyle(section).borderBottomWidth,
        getComputedStyle(next).borderTopWidth,
      ];
    })).toEqual(["0px", "0px", "0px", "0px"]);
    await expect(slideshow.locator(".aboutSlideshowSlide img")).toHaveCount(4);
    await expect(slideshow.locator(".aboutSlideshowSlide img").first()).toHaveAttribute(
      "alt",
      locale === "en"
        ? "The RekanMU team gathered around a conference table."
        : "Tim RekanMU berkumpul mengelilingi meja rapat.",
    );

    if (await page.evaluate(() => window.innerWidth <= 820)) {
      const layout = await slideshow.locator(".aboutSlideshowSlide").evaluateAll((slides) =>
        slides.map((slide) => {
          const style = getComputedStyle(slide);
          const rect = slide.getBoundingClientRect();
          return { visibility: style.visibility, position: style.position, opacity: style.opacity, top: rect.top, bottom: rect.bottom };
        }),
      );
      expect(layout).toHaveLength(4);
      expect(layout.every((slide) => slide.visibility === "visible" && slide.position === "static" && slide.opacity === "1")).toBe(true);
      expect(layout.slice(1).every((slide, index) => slide.top >= layout[index].bottom - 1)).toBe(true);
      return;
    }

    const supportsScrollTimeline = await page.evaluate(() =>
      CSS.supports("view-timeline-name", "--about-slideshow") &&
      CSS.supports("animation-timeline", "--about-slideshow") &&
      CSS.supports("animation-range", "contain 0% contain 100%"),
    );
    test.skip(!supportsScrollTimeline, "This browser uses the static scrolling fallback");

    await scrollSlideshowTo(page, 0);
    await expect(slideshow.locator(".aboutSlideshowSlide--1")).toHaveCSS("visibility", "visible");
    await scrollSlideshowTo(page, 0.35);
    await expect(slideshow.locator(".aboutSlideshowSlide--2")).toHaveCSS("visibility", "visible");
    await expect.poll(() => slideshow.locator(".aboutSlideshowSlide--2").evaluate((slide) => Number(getComputedStyle(slide).opacity))).toBeGreaterThan(0.95);
    await scrollSlideshowTo(page, 0.8);
    await expect(slideshow.locator(".aboutSlideshowSlide--4")).toHaveCSS("visibility", "visible");
  });
}

test("About slideshow remains a normal image sequence with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");

  const slideshow = page.getByRole("region", { name: "RekanMU moments" });
  const slides = slideshow.locator(".aboutSlideshowSlide");
  await expect(slideshow.getByRole("button")).toHaveCount(0);
  await expect(slides).toHaveCount(4);
  expect(await slides.evaluateAll((elements) => elements.every((slide) => getComputedStyle(slide).visibility === "visible"))).toBe(true);
});
