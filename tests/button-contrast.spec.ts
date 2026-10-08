import { test, expect } from "@playwright/test";

test("CTA foreground matches the light or dark surface", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");

  const lightCTA = page.locator(".cta:not(.closing-card .cta)").first();
  const darkCTA = page.locator(".closing-card .cta");
  await expect(lightCTA).toBeVisible();
  await expect(darkCTA).toBeVisible();

  const lightColors = await lightCTA.evaluate((element) => ({
    color: getComputedStyle(element).color,
    border: getComputedStyle(element).borderTopColor,
  }));
  const darkColors = await darkCTA.evaluate((element) => ({
    color: getComputedStyle(element).color,
    border: getComputedStyle(element).borderTopColor,
    background: getComputedStyle(element).backgroundColor,
  }));

  expect(lightColors).toEqual({
    color: "rgb(14, 17, 22)",
    border: "rgb(14, 17, 22)",
  });
  expect(darkColors).toEqual({
    color: "rgb(255, 255, 255)",
    border: "rgb(255, 255, 255)",
    background: "rgba(0, 0, 0, 0)",
  });

  await darkCTA.hover();
  const darkActiveColors = await darkCTA.evaluate((element) => ({
    fill: getComputedStyle(element.querySelector(".originButton__fill")!).backgroundColor,
    color: getComputedStyle(element).color,
    border: getComputedStyle(element).borderTopColor,
  }));
  expect(darkActiveColors).toEqual({
    fill: "rgb(255, 255, 255)",
    color: "rgb(9, 12, 17)",
    border: "rgb(255, 255, 255)",
  });
});

test("Home hero CTA fill follows the light and dark flight surface", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("[data-home-scene]")).toHaveAttribute("data-home-flight-mode", "static");
  const states = await page.evaluate(() => {
    const scene = document.querySelector<HTMLElement>("[data-home-scene]")!;
    scene.setAttribute("data-home-flight-mode", "flight");
    const hero = scene.querySelector<HTMLElement>(".homeScene__heroButton")!;
    const story = scene.querySelector<HTMLElement>(".homeScene__story .cta")!;
    const read = (element: HTMLElement) => {
      element.setAttribute("data-origin-active", "true");
      const colors = {
        fill: getComputedStyle(element.querySelector(".originButton__fill")!).backgroundColor,
        color: getComputedStyle(element).color,
        border: getComputedStyle(element).borderTopColor,
      };
      element.removeAttribute("data-origin-active");
      return colors;
    };

    hero.setAttribute("data-home-flight-dark", "false");
    const lightHero = read(hero);
    hero.setAttribute("data-home-flight-dark", "true");
    const darkHero = read(hero);
    const darkStory = read(story);
    return { lightHero, darkHero, darkStory };
  });
  expect(states.lightHero).toEqual({
    fill: "rgb(14, 17, 22)",
    color: "rgb(255, 255, 255)",
    border: "rgb(14, 17, 22)",
  });
  expect(states.darkHero).toEqual({
    fill: "rgb(255, 255, 255)",
    color: "rgb(9, 12, 17)",
    border: "rgb(255, 255, 255)",
  });
  expect(states.darkStory).toEqual(states.darkHero);
});

test("CTA links use an accessible cursor-origin theme fill", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const ctas = page.locator(".cta");
  const ctaCount = await ctas.count();
  expect(ctaCount).toBeGreaterThan(0);
  expect(await ctas.evaluateAll((elements) => elements.every((element) => element.tagName === "A"))).toBe(true);
  await expect(ctas.locator(".originButton__fill")).toHaveCount(ctaCount);

  const button = ctas.first();
  await expect(button).toHaveAttribute("href", "/about");
  await expect(button).toHaveAccessibleName("About RekanMU");
  const box = await button.boundingBox();
  expect(box).not.toBeNull();
  const pointer = { x: 18, y: 16 };
  await page.mouse.move(box!.x + pointer.x, box!.y + pointer.y);
  await expect.poll(() => button.locator(".originButton__fill").evaluate((fill) => {
    const root = fill.parentElement!.getBoundingClientRect();
    const circle = fill.getBoundingClientRect();
    return circle.left <= root.left && circle.top <= root.top && circle.right >= root.right && circle.bottom >= root.bottom;
  })).toBe(true);

  const pointerState = await button.locator(".originButton__fill").evaluate((fill) => {
    const root = fill.parentElement!;
    const style = getComputedStyle(fill);
    const rect = root.getBoundingClientRect();
    const fillRect = fill.getBoundingClientRect();
    return {
      left: Number.parseFloat(style.left),
      top: Number.parseFloat(style.top),
      diameter: Number.parseFloat(style.width),
      fill: style.backgroundColor,
      text: getComputedStyle(root).color,
      border: getComputedStyle(root).borderTopColor,
      diagonal: Math.hypot(rect.width, rect.height),
      coversPill:
        fillRect.left <= rect.left &&
        fillRect.top <= rect.top &&
        fillRect.right >= rect.right &&
        fillRect.bottom >= rect.bottom,
    };
  });

  expect(pointerState.left).toBeCloseTo(pointer.x, 0);
  expect(pointerState.top).toBeCloseTo(pointer.y, 0);
  expect(pointerState.diameter).toBeGreaterThan(pointerState.diagonal);
  expect(pointerState.coversPill).toBe(true);
  expect(pointerState.fill).toBe("rgb(14, 17, 22)");
  expect(pointerState.text).toBe("rgb(255, 255, 255)");
  expect(pointerState.border).toBe(pointerState.fill);
  const fillLuminance = pointerState.fill.match(/\d+/g)!.map(Number).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
  expect(1.05 / (fillLuminance + 0.05)).toBeGreaterThanOrEqual(4.5);

  await page.mouse.move(0, 0);
  await expect(button).not.toHaveAttribute("data-origin-active", "true");
  await button.focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(button).toBeFocused();

  const focusState = await button.locator(".originButton__fill").evaluate((fill) => ({
    left: Number.parseFloat(getComputedStyle(fill).left),
    top: Number.parseFloat(getComputedStyle(fill).top),
    rect: fill.parentElement!.getBoundingClientRect(),
    text: getComputedStyle(fill.parentElement!).color,
  }));
  expect(focusState.left).toBeCloseTo(focusState.rect.width / 2, 0);
  expect(focusState.top).toBeCloseTo(focusState.rect.height / 2, 0);
  expect(focusState.text).toBe("rgb(255, 255, 255)");
  const outline = await button.evaluate((element) => getComputedStyle(element).outlineStyle);
  expect(outline).toBe("solid");

  await button.click();
  await expect(page).toHaveURL(/\/about$/);
});

test("CTA links use the shared Origin Button on every page template and locale", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop");
  test.setTimeout(60_000);

  const routes = [
    "/",
    "/about",
    "/products-services",
    "/businesses",
    "/businesses/technology-digitalization",
    "/id",
    "/id/about",
    "/id/products-services",
    "/id/businesses",
    "/id/businesses/technology-digitalization",
  ];

  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBe(200);
    const ctas = page.locator(".cta");
    const count = await ctas.count();
    expect(count, route).toBeGreaterThan(0);
    expect(
      await ctas.evaluateAll((elements) =>
        elements.every(
          (element) =>
            element.tagName === "A" &&
            Boolean(element.getAttribute("href")) &&
            Boolean(element.querySelector(".originButton__fill")),
        ),
      ),
      route,
    ).toBe(true);
  }
});
