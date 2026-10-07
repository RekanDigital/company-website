import { expect, test } from "@playwright/test";

const businesses = [
  "technology-digitalization",
  "data-business-intelligence",
  "general-trading-supply-chain",
  "fisheries-seaweed-blue-economy",
  "health-bioscience",
  "agriculture-green-economy",
  "food-beverage",
] as const;

for (const locale of ["en", "id"] as const) {
  const base = locale === "en" ? "" : "/id";

  test(`${locale}: business detail hierarchy, dotted headings, and art masks`, async ({ page }, testInfo) => {
    for (const slug of businesses) {
      await page.goto(`${base}/businesses/${slug}`);
      await expect(page.locator(".overviewSection .statement")).toBeVisible();
      await expect(page.locator(".detailSectionHeading h2 .dots")).toBeVisible();
      await expect(page.locator(".detailInquiry h2 .dots")).toHaveCount(slug === "food-beverage" ? 0 : 1);
      await expect(page.locator(".nextBusiness .dots")).toBeVisible();
      await expect(page.locator(".businessHeroArt")).toHaveCSS("mask-image", /radial-gradient/);
      await expect(page.locator(".businessSectionArt")).toHaveCSS("mask-image", /radial-gradient/);
      await expect(page.locator(".nextSpecimen")).toHaveCSS("mask-image", /radial-gradient/);
      await expect(page.locator(".businessHeroArt")).toHaveCSS("mix-blend-mode", "normal");
      await expect(page.locator(".businessSectionArt")).toHaveCSS("mix-blend-mode", "normal");
      await expect(page.locator(".nextSpecimen img")).toHaveCSS("mix-blend-mode", "normal");

      const sectionHeading = page.locator(".detailSectionHeading h2").first();
      await expect(sectionHeading).toContainText(locale === "en" ? "Capabilities" : "Kapabilitas");
      await expect(page.locator(".detailSectionHeading h2")).not.toContainText(/Source-Supported Focus|Current Agricultural Focus|From Data to Decisions|Digital Delivery Experience/);

      if (testInfo.project.name === "desktop") {
        const overlaps = await page.locator(".detailSection").evaluateAll((sections) => sections.flatMap((section) => {
          const heading = section.querySelector(".detailSectionHeading h2");
          const content = [...section.children].find((child) => !child.classList.contains("detailSectionHeading"));
          if (!heading || !content) return [];
          const range = document.createRange();
          range.selectNodeContents(heading);
          const contentRect = content.getBoundingClientRect();
          return [...range.getClientRects()].some((rect) => rect.bottom > contentRect.top && rect.top < contentRect.bottom && rect.right > contentRect.left + 1);
        }));
        expect(overlaps, `${locale}/${slug} detail heading overlaps its content`).not.toContain(true);
      }

      if (slug === "food-beverage") {
        const lastDetail = page.locator(".detailSection").last();
        await expect(lastDetail.getByRole("link", { name: locale === "en" ? "Start a Business Inquiry" : "Mulai Diskusi Bisnis" })).toBeVisible();
        await expect(page.locator(".businessDetail > .sec:not(.detailSection) > .detailActions")).toHaveCount(0);
      }
    }
  });
}

test("display dots stay proportional and product stream links meet touch target size", async ({ page }) => {
  await page.goto("/products-services");
  const pitch = await page.locator(".catalogueHeading .dots").first().evaluate((element) => getComputedStyle(element).getPropertyValue("--dot-pitch").trim());
  expect(pitch).toMatch(/^(?:0)?\.055em$/);
  for (const link of await page.locator(".streamTag").all()) {
    expect(await link.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  }
});

test("technology overview displays a short statement and keeps the remainder as support copy", async ({ page }) => {
  await page.goto("/businesses/technology-digitalization");
  await expect(page.locator(".overviewSection .statement")).toHaveText("Technology is one of RekanMU's core capabilities and a foundation for automation and operational efficiency.");
  await expect(page.locator(".overviewSection .staticCopy")).toContainText("Our work spans websites and business applications");
  await expect(page.locator(".overviewSection .staticCopy")).toContainText("These capabilities support both external clients");
});
