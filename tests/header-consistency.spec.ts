import { expect, test } from "@playwright/test";

const paths = ["/", "/about", "/businesses", "/products-services", ...[
  "technology-digitalization", "data-business-intelligence", "general-trading-supply-chain",
  "fisheries-seaweed-blue-economy", "health-bioscience", "agriculture-green-economy", "food-beverage",
].map(slug => `/businesses/${slug}`)];

for (const base of ["", "/id"]) {
  test(`${base || "en"}: page-colored header stays at the top on every route`, async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of paths) {
      await page.goto(base + (path === "/" ? "" : path) || "/");
      const header = page.locator(".site-header");
      for (const fraction of [0, 0.5, 1]) {
        await page.evaluate(fraction => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * fraction), fraction);
        await expect(header).toBeVisible();
        await expect.poll(async () => (await header.boundingBox())?.y).toBeCloseTo(0, 0);
        await expect(header).toHaveCSS("background-color", "rgb(246, 248, 250)");
      }
      if (path === "/products-services") await page.screenshot({ path: testInfo.outputPath("header-products-bottom.png") });
    }
    if (testInfo.project.name !== "desktop") {
      await page.getByRole("button", { name: "Menu", exact: true }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.getByRole("dialog").getByRole("link", { name: base ? "Tentang" : "About", exact: true }).click();
      await expect(page).toHaveURL(`${base}/about`);
      await expect.poll(async () => (await page.locator(".site-header").boundingBox())?.y).toBeCloseTo(0, 0);
    }
  });
}

test("Home header remains available before and after the flight sequence", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/", { waitUntil: "commit" });
  const header = page.locator(".site-header");
  await expect(header).toBeVisible();
  await expect(header).toHaveCSS("background-color", "rgb(246, 248, 250)");
  await expect.poll(() => header.locator(".site-brand").evaluate(element => {
    const rect = element.getBoundingClientRect();
    return element.contains(document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2));
  })).toBe(true);
  const scene = page.locator("[data-home-scene]");
  await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: 60_000 });
  await expect(scene).toHaveAttribute("data-home-loading-state", /ready|done/, { timeout: 60_000 });
  await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await page.evaluate(() => {
    const sequence = document.querySelector<HTMLElement>("[data-home-flight-sequence]")!;
    window.scrollTo(0, window.scrollY + sequence.getBoundingClientRect().bottom + 100);
  });
  await expect(header).toBeVisible();
  await expect.poll(async () => (await header.boundingBox())?.y).toBeCloseTo(0, 0);
  await expect(header).toHaveCSS("background-color", "rgb(246, 248, 250)");
  await expect(header.locator(".site-brand span")).toHaveCSS("color", "rgb(14, 17, 22)");
  await page.evaluate(() => {
    const sequence = document.querySelector<HTMLElement>("[data-home-flight-sequence]")!;
    const stage = document.querySelector<HTMLElement>("[data-home-flight-stage]")!;
    window.scrollTo(0, window.scrollY + sequence.getBoundingClientRect().top + (sequence.offsetHeight - stage.offsetHeight) * 0.53);
  });
  await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(header.locator(".site-brand span")).toHaveCSS("color", "rgb(246, 248, 250)");
  await page.evaluate(() => {
    const sequence = document.querySelector<HTMLElement>("[data-home-flight-sequence]")!;
    window.scrollTo(0, window.scrollY + sequence.getBoundingClientRect().bottom + 100);
  });
  await expect(header).toHaveCSS("background-color", "rgb(246, 248, 250)");
  await expect(header.locator(".site-brand span")).toHaveCSS("color", "rgb(14, 17, 22)");
});
