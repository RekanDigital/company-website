import { expect, test, type Page } from "@playwright/test";

test.use({ hasTouch: true });

const locales = ["en", "id"] as const;
const menuRoutes = [
  { en: "Home", id: "Beranda", path: "/" },
  { en: "About", id: "Tentang", path: "/about" },
  { en: "Businesses", id: "Bisnis", path: "/businesses" },
  { en: "Products & Services", id: "Produk & Layanan", path: "/products-services" },
  { en: "Contact", id: "Kontak", path: "/businesses#contact" },
] as const;
const businessSlugs = [
  "technology-digitalization",
  "data-business-intelligence",
  "general-trading-supply-chain",
  "fisheries-seaweed-blue-economy",
  "health-bioscience",
  "agriculture-green-economy",
  "food-beverage",
] as const;

function routeFor(locale: "en" | "id", path: string) {
  if (locale === "en") return path;
  const [pathname, hash] = path.split("#");
  return `${pathname === "/" ? "/id" : `/id${pathname}`}${hash ? `#${hash}` : ""}`;
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(dimensions.document, `horizontal overflow: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.viewport + 1);
}

for (const locale of locales) {
  test(`${locale}: touch menu opens, closes, reopens, traps focus, and reaches all five routes`, async ({ page }, testInfo) => {
    test.skip((page.viewportSize()?.width ?? 0) > 820, "mobile and tablet coverage only");
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

    await page.goto(routeFor(locale, "/about"));
    const trigger = page.locator(".site-menu-button");
    const dialog = page.getByRole("dialog", { name: "Menu" });
    const close = dialog.getByRole("button", { name: locale === "en" ? "Close" : "Tutup" });

    await trigger.tap();
    await expect(dialog).toBeVisible();
    await expect(close).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect.poll(() => dialog.locator(".site-menu__panel").evaluate((panel) => panel.getBoundingClientRect().left)).toBe(0);
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: testInfo.outputPath("menu-open.png") });

    // Tab at each boundary must wrap inside the modal dialog.
    const lastFocusable = (page.viewportSize()?.width ?? 0) <= 640
      ? dialog.locator(".site-menu__bottom .site-language")
      : dialog.locator(".site-menu__bottom > a");
    await page.keyboard.press("Shift+Tab");
    await expect(lastFocusable).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();

    await close.tap();
    await expect(dialog).not.toBeVisible({ timeout: 2_000 });
    await expect(trigger).toBeFocused();
    await trigger.tap();
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible({ timeout: 2_000 });
    await expect(trigger).toBeFocused();

    // Drive every documented menu destination using touch input and reopen from each route.
    for (const route of menuRoutes) {
      await trigger.tap();
      await expect(dialog).toBeVisible();
      await dialog.locator(".site-menu__nav").getByRole("link", { name: route[locale], exact: true }).tap();
      await expect(page).toHaveURL(routeFor(locale, route.path));
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      if (route.path.endsWith("#contact")) await expect(page.locator("#contact")).toBeInViewport();
      await expectNoHorizontalOverflow(page);
    }

    expect(errors, `${locale} menu flow browser errors`).toEqual([]);
  });

  test(`${locale}: menu language switch preserves each route and the contact hash`, async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) > 820, "mobile and tablet coverage only");
    test.setTimeout(360_000);
    const routes = [
      "/", "/about", "/businesses", "/products-services", "/businesses#contact",
      ...businessSlugs.map((slug) => `/businesses/${slug}`),
    ];
    for (const path of routes) {
      await page.goto(routeFor(locale, path));
      const trigger = page.locator(".site-menu-button");
      await trigger.tap();
      const dialog = page.getByRole("dialog", { name: "Menu" });
      await expect(dialog).toBeVisible();
      const switchLabel = locale === "en" ? "Switch language to Bahasa Indonesia" : "Ganti bahasa ke Inggris";
      await dialog.getByRole("button", { name: switchLabel }).tap();
      const targetLocale = locale === "en" ? "id" : "en";
      await expect(page).toHaveURL(routeFor(targetLocale, path));
      await expect(dialog).not.toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", targetLocale);
      await expectNoHorizontalOverflow(page);
    }
  });
}

for (const locale of locales) {
  for (const slug of businessSlugs) {
    test(`mobile/tablet ${locale}: ${slug} point viewer has no rotation button`, async ({ page }, testInfo) => {
      test.skip((page.viewportSize()?.width ?? 0) > 820, "mobile and tablet coverage only");
      test.setTimeout(90_000);
      await page.goto(routeFor(locale, `/businesses/${slug}`));
      const viewer = page.locator(`.businessDetailHeroViewer[data-business-slug="${slug}"]`);
      await expect(viewer).toHaveAttribute("data-renderer-state", "ready", { timeout: 60_000 });
      await expect(viewer.locator(".businessViewerMotionControl")).toBeHidden();
      await expect(viewer.getByRole("button")).toHaveCount(0);
      if (slug === businessSlugs[0]) await page.screenshot({ path: testInfo.outputPath("viewer-no-control.png") });
      await expectNoHorizontalOverflow(page);
    });
  }
}

for (const locale of locales) {
  test(`${locale}: reduced motion hides point viewer rotation controls on every business detail`, async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) > 820, "mobile and tablet coverage only");
    test.setTimeout(180_000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const slug of businessSlugs) {
      await page.goto(routeFor(locale, `/businesses/${slug}`));
      const viewer = page.locator(`.businessDetailHeroViewer[data-business-slug="${slug}"]`);
      await expect(viewer).toHaveAttribute("data-rotating", "true");
      await expect(viewer).toHaveAttribute("data-renderer-state", /ready|fallback/, { timeout: 60_000 });
      await expect(viewer.getByRole("button")).toHaveCount(0);
      await expectNoHorizontalOverflow(page);
    }
  });
}
