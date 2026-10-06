import { test, expect, type Page } from "@playwright/test";

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

for (const locale of ["en", "id"] as const) {
  const base = locale === "en" ? "" : "/id";
  const close = locale === "en" ? "Close" : "Tutup";
  const headline = locale === "en" ? "Beyond Technology." : "Melampaui Teknologi.";

  test(`${locale}: shell, responsive navigation and menu focus`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    const response = await page.goto(base || "/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(headline);
    await page.evaluate(() => document.fonts.ready);
    const fonts = await page.evaluate(() => ({
      family: getComputedStyle(document.body).fontFamily,
      loaded: [...document.fonts].filter((font) => font.status === "loaded").map((font) => font.family),
    }));
    expect(fonts.family.toLowerCase()).toContain("geist");
    expect(fonts.loaded.some((family) => family.toLowerCase().includes("geist"))).toBe(true);
    await expectNoOverflow(page);
    await page.screenshot({ path: testInfo.outputPath("page.png"), fullPage: true });

    if ((page.viewportSize()?.width ?? 1440) > 820) {
      const desktopNav = page.locator(".site-header__desktop-nav");
      await expect(desktopNav).toBeVisible();
      await expect(desktopNav.getByRole("link")).toHaveText(
        locale === "en" ? ["About", "Businesses", "Products & Services"] : ["Tentang", "Bisnis", "Produk & Layanan"],
      );
      await expect(page.locator(".site-menu-button")).toBeHidden();
      expect(errors).toEqual([]);
      return;
    }

    const trigger = page.getByRole("button", { name: "Menu", exact: true });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("navigation").getByRole("link")).toHaveCount(5);
    await expectNoOverflow(page);
    const about = dialog.getByRole("link", { name: locale === "en" ? "About" : "Tentang", exact: true });
    await about.focus();
    await expect(about).toBeFocused();
    await page.screenshot({ path: testInfo.outputPath("menu.png") });
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => document.querySelector("dialog")?.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    for (let i = 0; i < 2; i++) {
      await trigger.click();
      await expect(dialog).toBeVisible();
      await dialog.getByRole("button", { name: close, exact: true }).click();
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
    }

    await trigger.click();
    await about.click();
    await expect(page).toHaveURL(`${base}/about`);
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("RekanMU");
    await expectNoOverflow(page);
    expect(errors).toEqual([]);
  });

  test(`${locale}: reduced motion, no WebGL, language keeps route and hash`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, ...args: unknown[]) {
        if (contextId.includes("webgl")) return null;
        return Reflect.apply(getContext, this, [contextId, ...args]);
      } as typeof getContext;
    });
    await page.goto(`${base}/businesses#contact`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoOverflow(page);
    const targetLocale = locale === "en" ? "id" : "en";
    const targetBase = targetLocale === "en" ? "" : "/id";
    const isMenuViewport = (page.viewportSize()?.width ?? 1440) <= 820;
    const switchLabel = locale === "en" ? "Switch language to Bahasa Indonesia" : "Ganti bahasa ke Inggris";
    let language = page.locator("header").getByRole("button", { name: switchLabel, exact: true });
    if (isMenuViewport) {
      await page.getByRole("button", { name: "Menu", exact: true }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      const transition = await page.getByRole("dialog").evaluate((element) => getComputedStyle(element).transitionDuration);
      expect(transition.split(",").every((duration) => parseFloat(duration) === 0)).toBe(true);
      await expect(page.locator("header .site-language")).not.toBeVisible();
      language = page.getByRole("dialog").getByRole("button", { name: switchLabel, exact: true });
    }
    await expect(language).toHaveText(locale.toUpperCase());
    await expect(language).toHaveAttribute("aria-pressed", String(locale === "id"));
    const languageBox = await language.boundingBox();
    expect(languageBox?.width).toBeGreaterThanOrEqual(44);
    expect(languageBox?.height).toBeGreaterThanOrEqual(44);
    const toggleStyle = await language.evaluate((element) => ({
      pill: getComputedStyle(element, "::before").backgroundColor,
      pillSize: [getComputedStyle(element, "::before").width, getComputedStyle(element, "::before").height],
      thumb: getComputedStyle(element.querySelector(".site-language__thumb")!).backgroundColor,
      thumbSize: [
        getComputedStyle(element.querySelector(".site-language__thumb")!).width,
        getComputedStyle(element.querySelector(".site-language__thumb")!).height,
      ],
    }));
    expect(toggleStyle.pill).toBe("rgb(14, 17, 22)");
    expect(toggleStyle.pillSize).toEqual(["42px", "22px"]);
    expect(toggleStyle.thumb).toBe("rgb(255, 255, 255)");
    expect(toggleStyle.thumbSize).toEqual(["18px", "18px"]);
    await language.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(`${targetBase}/businesses#contact`);
    await expect(page.locator("html")).toHaveAttribute("lang", targetLocale);
    if (isMenuViewport) {
      await expect(page.getByRole("dialog")).not.toBeVisible();
    }
    await expect(page.locator("footer a[href^='mailto:']").first()).toHaveAttribute("href", "mailto:rekanmu.digital@gmail.com");
    await expect(page.locator("footer")).toContainText("0899 9933 349");
    await expect(page.locator("footer")).not.toContainText("Have something to explore?");
  });

  test(`${locale}: component specimens and approved route foundations`, async ({ page }, testInfo) => {
    await page.goto(`${base || "/"}?components=1`);
    await page.evaluate(() => document.fonts.ready);
    await expectNoOverflow(page);
    await page.screenshot({ path: testInfo.outputPath("components.png"), fullPage: true });
    const routes = ["/about", "/businesses", "/products-services", "/businesses/technology-digitalization", "/businesses/data-business-intelligence", "/businesses/general-trading-supply-chain", "/businesses/fisheries-seaweed-blue-economy", "/businesses/health-bioscience", "/businesses/agriculture-green-economy", "/businesses/food-beverage"];
    for (const route of routes) {
      const response = await page.goto(`${base}${route}`);
      expect(response?.status(), route).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expectNoOverflow(page);
      await expect(page.locator("footer")).toContainText("2302240059465");
    }
  });
}
