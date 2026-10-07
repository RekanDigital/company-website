import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

const businesses = [
  ["technology-digitalization", "Technology & Digitalization"],
  ["data-business-intelligence", "Data & Business Intelligence"],
  ["general-trading-supply-chain", "General Trading & Supply Chain"],
  ["fisheries-seaweed-blue-economy", "Fisheries, Seaweed & Blue Economy"],
  ["health-bioscience", "Health & Bioscience"],
  ["agriculture-green-economy", "Agriculture & Green Economy"],
  ["food-beverage", "Food & Beverage"],
] as const;

for (const locale of ["en", "id"] as const) {
  const base = locale === "en" ? "" : "/id";

  test(`${locale}: approved static page content and routes`, async ({ page }) => {
    let response = await page.goto(`${base}/about`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator(".worldBand + .staticStory .storyColumns p")).toHaveCount(3);
    await expect(page.locator(".worldBand + .staticStory .statement")).toBeVisible();
    await expect(page.getByText(locale === "en" ? "Business Pillars" : "Pilar Bisnis", { exact: true })).toBeVisible();
    await expect(page.locator(".figureGrid .figure .num")).toHaveCount(2);
    await expect(page.locator(".figureGrid .figure").nth(0).locator(".num.dots")).toHaveCount(0);
    await expect(page.locator(".figureGrid .figure").nth(1).locator(".num.dots")).toHaveCount(1);
    await expect(page.getByText("7", { exact: true })).toBeVisible();
    await expect(page.getByText("5", { exact: true })).toBeVisible();
    const focus = page.locator("article", { has: page.getByRole("heading", { name: locale === "en" ? "Focus" : "Fokus", exact: true }) });
    await expect(focus.locator(".num")).toHaveCount(0);
    await expect(page.getByText("AHU-0014045.AH.01.01.TAHUN 2024", { exact: true })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    response = await page.goto(`${base}/products-services`);
    expect(response?.status()).toBe(200);
    const streamLinks = page.locator(".streamBar a");
    await expect(streamLinks).toHaveCount(5);
    await expect(streamLinks.nth(0)).toHaveAttribute("href", "#digital-creative");
    await expect(streamLinks.nth(4)).toHaveAttribute("href", "#strategic-initiatives");
    await expect(page.locator(".catalogueSection .catalogueList .catalogueItem").first().locator("h3")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Digital Creative & Agency Services" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Enterprise B2B Tech & Intelligent Automation" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Enterprise System Integrator & B2G" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tech Talent & Professional Services" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Strategic Real-Sector Initiatives" })).toBeVisible();
    await expect(page.getByText("Paket A (Trial UMKM)", { exact: true })).toBeVisible();
    await expect(page.getByText("RekanAI-Enterprise (RAG KB)", { exact: true })).toBeVisible();
    await expect(page.getByText("Command Center Videotron", { exact: true })).toBeVisible();
    await expect(page.getByText("AgriMineral Soil Amendments", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: locale === "en" ? "Start a Business Inquiry" : "Mulai Diskusi Bisnis", exact: true })).toHaveAttribute("href", `${base}/businesses#contact`);
    await expectNoHorizontalOverflow(page);

    response = await page.goto(`${base}/businesses`);
    expect(response?.status()).toBe(200);
    await expect(page.locator(".businessOverviewHero .lead")).toHaveCount(0);
    await expect(page.locator(".businessOpening .lead")).toBeVisible();
    const plates = page.locator(".plate");
    await expect(plates).toHaveCount(7);
    await expect(plates.getByRole("heading", { level: 3 })).toHaveText(businesses.map(([, name]) => name));
    for (const [slug, name] of businesses) {
      await expect(plates.filter({ hasText: name }).getByRole("link")).toHaveAttribute("href", `${base}/businesses/${slug}`);
    }
    await expect(page.locator(".businessGrid.twoBusinessGrid .plate")).toHaveCount(2);
    await expect(page.locator(".businessGrid.fiveBusinessGrid .plate")).toHaveCount(5);
    await expect(page.locator("#contact")).toBeVisible();
    await expectNoHorizontalOverflow(page);

    for (let index = 0; index < businesses.length; index++) {
      const [slug] = businesses[index];
      const [, nextName] = businesses[(index + 1) % businesses.length];
      response = await page.goto(`${base}/businesses/${slug}`);
      expect(response?.status(), slug).toBe(200);
      await expect(page.getByRole("heading", { name: locale === "en" ? "Capabilities" : "Kapabilitas" })).toBeVisible();
      await expect(page.getByRole("link", { name: new RegExp(`^${locale === "en" ? "Next:" : "Berikutnya:"} ${nextName}`) })).toBeVisible();
      await expect(page.getByRole("link", { name: locale === "en" ? "Explore Products & Services" : "Jelajahi Produk & Layanan", exact: true })).toHaveAttribute("href", `${base}/products-services`);
      await expectNoHorizontalOverflow(page);
    }
  });
}

test("About keeps approved point treatments and matches its glance display size to Home", async ({ page }) => {
  for (const locale of ["en", "id"] as const) {
    const base = locale === "en" ? "" : "/id";
    await page.goto(`${base}/`);
    const homeSectionSize = await page.locator(".homeCatalogueIntro h2").evaluate((element) => getComputedStyle(element).fontSize);
    await page.goto(`${base}/about`);
    const storyPoint = locale === "en"
      ? "RekanMU continues to expand where technology can create real economic value."
      : "RekanMU terus berkembang untuk menciptakan nilai ekonomi nyata melalui teknologi.";
    const visionPoint = locale === "en"
      ? "based on Indonesia’s resources to create sustainable added value."
      : "berbasis sumber daya Indonesia untuk menciptakan nilai tambah yang berkelanjutan.";
    await expect(page.locator(".staticStory .statement .dots")).toHaveText(storyPoint);
    await expect(page.locator(".visionMission > .statement .dots")).toHaveText(visionPoint);
    await expect(page.locator(".valueItem h3 .dots")).toHaveText(
      locale === "en" ? ["Innovation", "Sustainability"] : ["Inovasi", "Keberlanjutan"],
    );

    const scales = await page.locator(".figureGrid .num").first().evaluate((element) => {
      const probe = document.createElement("span");
      probe.style.fontSize = "var(--fs-figure)";
      document.body.append(probe);
      const expected = getComputedStyle(probe).fontSize;
      probe.remove();
      return { actual: getComputedStyle(element).fontSize, expected };
    });
    expect(scales.actual).toBe(scales.expected);

    const focus = page.locator(".figureGrid .focusFigure");
    await expect(focus.locator(".num")).toHaveCount(0);
    const focusScale = await focus.locator("h3").evaluate((element) => getComputedStyle(element).fontSize);
    expect(focusScale).toBe(homeSectionSize);
    await expectNoHorizontalOverflow(page);
  }
});

test("About value titles stay clear of their descriptions across desktop widths", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop");
  for (const width of [1440, 1024, 900, 821]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ["en", "id"] as const) {
      await page.goto(`${locale === "en" ? "" : "/id"}/about`);
      const overlaps = await page.locator(".valueItem").evaluateAll((rows) => rows.flatMap((row) => {
        const heading = row.querySelector("h3");
        const description = row.querySelector("p");
        if (!heading || !description) return [];
        const range = document.createRange();
        range.selectNodeContents(heading);
        const titleBounds = range.getBoundingClientRect();
        return titleBounds.right + 4 > description.getBoundingClientRect().left
          ? [heading.textContent]
          : [];
      }));
      expect(overlaps, `${locale} at ${width}px`).toEqual([]);
      await expectNoHorizontalOverflow(page);
    }
  }
});

test("non-home page display scales match Home across locales and breakpoints", async ({ page }) => {
  test.setTimeout(90_000);
  const routes = [
    {
      path: "/about",
      hero: ".foundationHero h1",
      sections: [".missionBlock h2", ".corporateSection h2", ".valueItem h3", ".figureGrid .focusFigure h3"],
    },
    {
      path: "/products-services",
      hero: ".foundationHero h1",
      sections: [".catalogueHeading h2", ".inquirySection > h2"],
    },
    {
      path: "/businesses",
      hero: ".businessesHeroTitle h1",
      sections: [".businessGroupHeading h2"],
    },
    {
      path: "/businesses/technology-digitalization",
      hero: ".businessDetailHero h1",
      sections: [".nextBusiness .disp2"],
    },
  ] as const;
  const widths = test.info().project.name === "desktop"
    ? [1440, 1024, 901, 900, 821]
    : [page.viewportSize()?.width ?? 390];

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ["en", "id"] as const) {
      const base = locale === "en" ? "" : "/id";
      await page.goto(`${base}/`);
      const homeHeroSize = await page.locator(".homeHero h1").evaluate((element) => getComputedStyle(element).fontSize);
      const homeSectionSize = await page.locator(".homeCatalogueIntro h2").evaluate((element) => getComputedStyle(element).fontSize);

      for (const route of routes) {
        await page.goto(`${base}${route.path}`);
        const hero = page.locator(route.hero);
        await expect(hero).toBeVisible();
        await expect.poll(() => hero.evaluate((element) => getComputedStyle(element).fontSize)).toBe(homeHeroSize);
        for (const selector of route.sections) {
          const headings = page.locator(selector);
          await expect(headings.first()).toBeVisible();
          await expect.poll(() => headings.evaluateAll((elements) => [...new Set(elements.map((element) => getComputedStyle(element).fontSize))])).toEqual([homeSectionSize]);
        }
        if (route.path === "/businesses/technology-digitalization") {
          await expect.poll(() => page.locator(".detailSectionHeading h2").evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeLessThan(parseFloat(homeSectionSize));
          await expect.poll(() => page.locator(".detailInquiry h2").evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeLessThan(parseFloat(homeSectionSize));
        }
        await expectNoHorizontalOverflow(page);
      }
    }
  }
});
