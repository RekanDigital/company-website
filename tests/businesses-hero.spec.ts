import { expect, test, type Page } from "@playwright/test";

const titles = {
  en: "A Portfolio Built to Work Together.",
  id: "Portofolio yang Dibangun untuk Bekerja Bersama.",
} as const;

async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

function visiblePoint(bounds: { x: number; y: number; width: number; height: number }, page: Page) {
  const viewport = page.viewportSize();
  return {
    x: bounds.x + bounds.width - 12,
    y: Math.min(bounds.y + bounds.height - 12, (viewport?.height ?? bounds.y + bounds.height) - 12),
  };
}

for (const locale of ["en", "id"] as const) {
  const base = locale === "en" ? "" : "/id";

  test(`${locale}: Businesses hero draws one point world and keeps page content`, async ({ page }) => {
    const pointDataRequests: string[] = [];
    const errors: string[] = [];
    page.on("request", (request) => {
      if (request.url().endsWith("/assets/point-data/businesses.bin")) pointDataRequests.push(request.url());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto(`${base}/businesses`);
    const hero = page.getByRole("region", { name: titles[locale] });
    await expect(hero.getByRole("heading", { level: 1, name: titles[locale] })).toBeVisible();
    await expect(hero).toHaveAttribute("data-renderer-state", "ready");
    await expect(hero).toHaveAttribute("data-point-count", "109768");
    await expect(hero.locator("canvas[aria-hidden='true']")).toHaveCount(2);
    await expect(page.getByRole("link", { name: /view business|lihat bisnis/i })).toHaveCount(7);
    await expectNoHorizontalOverflow(page);
    expect(pointDataRequests).toHaveLength(1);
    expect(errors).toEqual([]);
  });
}

test("Businesses pointer interaction forms the world, focuses one business, and backs out", async ({ page }) => {
  await page.goto("/businesses");
  const hero = page.locator(".businessesHero");
  await expect(hero).toHaveAttribute("data-renderer-state", "ready");

  const canvas = hero.locator("canvas.businessesHeroCanvas");
  const bounds = await canvas.boundingBox();
  expect(bounds).not.toBeNull();
  const point = visiblePoint(bounds!, page);
  await page.mouse.move(point.x, point.y);
  await expect(hero).toHaveAttribute("data-hero-state", "world");

  const labels = hero.locator(".businessesHeroLabel");
  let selected = "";
  let target = { x: 0, y: 0 };
  for (let business = 0; business < await labels.count() && !selected; business++) {
    const box = await labels.nth(business).boundingBox();
    if (!box) continue;
    for (const offset of [45, 65, 85]) {
      target = { x: box.x + box.width / 2, y: box.y + box.height + offset };
      await page.mouse.move(target.x, target.y);
      await page.waitForTimeout(50);
      selected = (await hero.getAttribute("data-highlighted-business")) ?? "";
      if (selected) break;
    }
  }
  expect(selected).not.toBe("");
  await expect(hero.locator(".businessesHeroLabel.is-visible")).toHaveCount(1);
  await page.mouse.click(target.x, target.y);
  await expect(hero).toHaveAttribute("data-hero-state", "focus");
  await expect(hero.locator(".businessesHeroLabel.is-visible")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(hero).toHaveAttribute("data-hero-state", "world");
  await page.keyboard.press("Escape");
  await expect(hero).toHaveAttribute("data-hero-state", "words");
});

test("Businesses hero pauses offscreen and resumes when visible", async ({ page }) => {
  await page.goto("/businesses");
  const hero = page.locator(".businessesHero");
  await expect(hero).toHaveAttribute("data-renderer-state", "ready");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(hero).toHaveAttribute("data-renderer-state", "paused");
  await page.locator(".businessesHero").scrollIntoViewIfNeeded();
  await expect(hero).toHaveAttribute("data-renderer-state", "ready");
});

test("Businesses hero stays interactive with reduced motion and skips auto-alternation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/businesses");
  const hero = page.locator(".businessesHero");
  await expect(hero).toHaveAttribute("data-renderer-state", "ready");
  await page.waitForTimeout(8200);
  await expect(hero).toHaveAttribute("data-hero-state", "words");

  const bounds = await hero.locator("canvas.businessesHeroCanvas").boundingBox();
  expect(bounds).not.toBeNull();
  const point = visiblePoint(bounds!, page);
  await page.mouse.move(point.x, point.y);
  await expect(hero).toHaveAttribute("data-hero-state", "world");
  await expect(hero).toHaveAttribute("data-renderer-state", "ready");
  await expectNoHorizontalOverflow(page);
});

test("Businesses hero retains readable content when WebGL is unavailable", async ({ page }) => {
  const pointDataRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith("/assets/point-data/businesses.bin")) pointDataRequests.push(request.url());
  });
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, ...args: unknown[]) {
      if (contextId === "webgl" || contextId === "experimental-webgl") return null;
      return getContext.call(this, contextId, ...args as []);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto("/businesses");
  const hero = page.locator(".businessesHero");
  await expect(hero).toHaveAttribute("data-renderer-state", "fallback");
  await expect(page.getByRole("heading", { level: 1, name: titles.en })).toBeVisible();
  await expect(page.getByRole("link", { name: /view business/i })).toHaveCount(7);
  await expectNoHorizontalOverflow(page);
  expect(pointDataRequests).toHaveLength(0);
});

test("Businesses hero touch taps reveal and focus one business", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/businesses");
  const hero = page.locator(".businessesHero");
  await expect(hero).toHaveAttribute("data-renderer-state", "ready");
  const canvas = hero.locator("canvas.businessesHeroCanvas");
  const bounds = await canvas.boundingBox();
  expect(bounds).not.toBeNull();
  const point = visiblePoint(bounds!, page);
  await page.touchscreen.tap(point.x, point.y);
  await expect(hero).toHaveAttribute("data-hero-state", "world");
  const labels = hero.locator(".businessesHeroLabel");
  let selected = "";
  for (let business = 0; business < await labels.count() && !selected; business++) {
    const box = await labels.nth(business).boundingBox();
    if (!box) continue;
    for (const offset of [35, 55, 75, 95]) {
      const candidate = { x: box.x + box.width / 2, y: box.y + box.height + offset };
      await page.touchscreen.tap(candidate.x, candidate.y);
      await page.waitForTimeout(50);
      selected = (await hero.getAttribute("data-highlighted-business")) ?? "";
      if (selected) {
        await page.touchscreen.tap(candidate.x, candidate.y);
        break;
      }
    }
  }
  expect(selected).not.toBe("");
  await expect(hero).toHaveAttribute("data-hero-state", "focus");
  await expect(hero.locator(".businessesHeroLabel.is-visible")).toHaveCount(1);
  await expectNoHorizontalOverflow(page);
});
