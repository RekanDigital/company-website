import { expect, test } from "@playwright/test";

for (const [locale, path] of [["English", "/"], ["Indonesian", "/id"]] as const) {
  test(`desktop ${locale} Home hero fits beside the square at the approved scale`, async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) <= 900);
    await page.goto(path);

    const layout = await page.locator(".foundationHero").evaluate((hero) => {
      const heading = hero.querySelector("h1")!;
      const headingStyle = getComputedStyle(heading);
      const headingRect = heading.getBoundingClientRect();
      const squareSide = Math.min(innerHeight * 0.4, innerWidth * 0.3);
      const squareLeft = innerWidth * 0.68 - squareSide / 2;
      const gutter = parseFloat(getComputedStyle(hero).paddingLeft);
      const dots = heading.querySelector(".dots")!;

      return {
        fontSize: parseFloat(headingStyle.fontSize),
        expectedFontSize: Math.min(innerWidth * 0.092, innerHeight * 0.134),
        width: headingRect.width,
        expectedWidth: squareLeft - gutter,
        lines: Math.round(headingRect.height / parseFloat(headingStyle.lineHeight)),
        ctaBottom: hero.querySelector(".foundationHeroActions")!.getBoundingClientRect().bottom,
        dotPitch: parseFloat(getComputedStyle(dots).backgroundSize),
      };
    });

    expect(layout.fontSize).toBeCloseTo(layout.expectedFontSize, 1);
    expect(layout.width).toBeCloseTo(layout.expectedWidth, 1);
    expect(layout.lines).toBe(5);
    expect(layout.ctaBottom).toBeLessThanOrEqual(page.viewportSize()!.height);
    expect(layout.dotPitch).toBeCloseTo(layout.fontSize * 0.055, 1);
  });
}

test("tablet and mobile Home hero keep their existing proportional type", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) > 900);
  await page.goto("/");

  const layout = await page.locator(".foundationHero h1").evaluate((heading) => {
    const style = getComputedStyle(heading);
    const dots = heading.querySelector(".dots")!;
    return {
      fontSize: parseFloat(style.fontSize),
      expectedFontSize: Math.max(52, Math.min(innerWidth * 0.11, 164)),
      dotPitch: parseFloat(getComputedStyle(dots).backgroundSize),
    };
  });

  expect(layout.fontSize).toBeCloseTo(layout.expectedFontSize, 1);
  expect(layout.dotPitch).toBeCloseTo(layout.fontSize * 0.055, 1);
});
