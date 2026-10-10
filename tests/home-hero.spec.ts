import { expect, test } from "@playwright/test";

for (const [locale, path] of [["English", "/"], ["Indonesian", "/id"]] as const) {
  test(`desktop ${locale} Home hero fits beside the square at the approved scale`, async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) <= 900);
    await page.goto(path);
    await expect(page.locator("[data-home-scene]")).toHaveAttribute("data-home-flight-ready", "true", { timeout: 40_000 });

    await page.locator("[data-home-flight-hero-button]").evaluate((button) => Promise.all(button.getAnimations().map((animation) => animation.finished)));

    const layout = await page.locator(".foundationHero").evaluate((hero) => {
      const heading = hero.querySelector("h1")!;
      const headingStyle = getComputedStyle(heading);
      const headingRect = heading.getBoundingClientRect();
      const squareSide = Math.min(innerHeight * 0.4, innerWidth * 0.3);
      const squareLeft = innerWidth * 0.68 - squareSide / 2;
      const gutter = parseFloat(getComputedStyle(hero).left);
      const dots = heading.querySelector(".dots")!;

      return {
        fontSize: parseFloat(headingStyle.fontSize),
        expectedFontSize: Math.min(innerWidth * 0.092, innerHeight * 0.134),
        width: headingRect.width,
        expectedWidth: squareLeft - gutter,
        lines: Math.round(headingRect.height / parseFloat(headingStyle.lineHeight)),
        ctaBottom: document.querySelector<HTMLElement>("[data-home-flight-hero-button]")!.getBoundingClientRect().bottom,
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

test("Home hero keeps its arrangement as the window opens into the dark scene", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/");
  const scene = page.locator("[data-home-scene]");
  await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: 40_000 });

  await scene.locator("[data-home-flight-hero-button]").evaluate((button) => Promise.all(button.getAnimations().map((animation) => animation.finished)));

  const measure = () => page.evaluate(() => {
    const foreground = document.querySelector<HTMLElement>(".homeScene__hero h1")!;
    const background = document.querySelector<HTMLElement>(".homeScene__back h1")!;
    const readHeading = (heading: HTMLElement) => {
      const rect = heading.getBoundingClientRect();
      const style = getComputedStyle(heading);
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        fontSize: parseFloat(style.fontSize),
        lineHeight: parseFloat(style.lineHeight),
        dotPitch: parseFloat(getComputedStyle(heading.querySelector<HTMLElement>(".dots")!).backgroundSize),
      };
    };
    const cta = document.querySelector<HTMLElement>("[data-home-flight-hero-button]")!.getBoundingClientRect();
    return {
      foreground: readHeading(foreground),
      background: readHeading(background),
      foregroundOpacity: Number(getComputedStyle(foreground.parentElement!).opacity),
      backgroundOpacity: Number(getComputedStyle(document.querySelector<HTMLElement>(".homeScene__back")!).opacity),
      cta: { x: cta.x, y: cta.y, width: cta.width, height: cta.height },
    };
  });

  const initial = await measure();
  await page.evaluate(() => {
    const sequence = document.querySelector<HTMLElement>("[data-home-flight-sequence]")!;
    const stage = document.querySelector<HTMLElement>("[data-home-flight-stage]")!;
    const total = sequence.offsetHeight - stage.offsetHeight;
    window.scrollTo({ top: sequence.getBoundingClientRect().top + window.scrollY + 0.075 * total, behavior: "instant" });
  });
  await expect.poll(async () => Number(await scene.getAttribute("data-home-flight-frame")), { timeout: 20_000 }).toBeGreaterThanOrEqual(7);
  const dark = await measure();

  expect(initial.foregroundOpacity).toBeGreaterThan(0.9);
  expect(dark.foregroundOpacity).toBeLessThan(0.1);
  expect(dark.backgroundOpacity).toBeGreaterThan(0.9);
  for (const key of ["x", "y", "width", "height", "fontSize", "lineHeight", "dotPitch"] as const) {
    expect(dark.background[key], `dark hero ${key} matches the opening hero`).toBeCloseTo(initial.foreground[key], 1);
  }
  for (const key of ["x", "y", "width", "height"] as const) {
    expect(dark.cta[key], `CTA ${key} stays in the opening position`).toBeCloseTo(initial.cta[key], 1);
  }
});
