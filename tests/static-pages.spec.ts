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
    test.setTimeout(60_000);
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
      const [nextSlug, nextName] = businesses[(index + 1) % businesses.length];
      response = await page.goto(`${base}/businesses/${slug}`);
      expect(response?.status(), slug).toBe(200);
      await expect(page.getByRole("heading", { name: locale === "en" ? "Capabilities" : "Kapabilitas" })).toBeVisible();
      const heroViewer = page.locator(".businessDetailHeroViewer");
      await expect(heroViewer).toHaveAttribute("data-business-slug", slug);
      await expect.poll(() => heroViewer.getAttribute("data-renderer-state")).toMatch(/ready|fallback/);
      if (await heroViewer.getAttribute("data-renderer-state") === "ready") {
        const control = heroViewer.locator(".businessViewerMotionControl");
        const compact = await page.evaluate(() => matchMedia("(max-width: 1100px), (max-aspect-ratio: 1/1)").matches);
        if (compact) await expect(control).toBeHidden();
        else await expect(control).toBeVisible();
      } else {
        await expect(heroViewer.getByRole("button")).toHaveCount(0);
      }
      if ((page.viewportSize()?.width ?? 1440) <= 820) {
        const viewer = await heroViewer.boundingBox();
        const heading = await page.locator(".businessDetailHero h1").boundingBox();
        expect(viewer && heading && heading.y >= viewer.y + viewer.height, `${slug}: mobile hero heading clears viewer`).toBeTruthy();
      }
      await expect(page.locator(".businessSectionArt")).toHaveCount(0);
      await expect(page.getByRole("link", { name: new RegExp(`^${locale === "en" ? "Next:" : "Berikutnya:"} ${nextName}`) })).toBeVisible();
      const nextViewer = page.locator(".nextBusiness .businessCardViewer");
      await expect(nextViewer).toHaveAttribute("data-business-slug", nextSlug);
      await expect(nextViewer).toHaveAttribute("aria-label", locale === "en" ? `${nextName} 3D view.` : `Tampilan 3D ${nextName}.`);
      await expect(page.getByRole("link", { name: locale === "en" ? "Explore Products & Services" : "Jelajahi Produk & Layanan", exact: true })).toHaveAttribute("href", `${base}/products-services`);
      if (index === 0 && await page.evaluate(() => matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches)) {
        await nextViewer.scrollIntoViewIfNeeded();
        await nextViewer.hover();
        await expect.poll(() => nextViewer.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBeGreaterThan(1.11);
      }
      await expectNoHorizontalOverflow(page);
    }
  });
}

test("business point-view fallback keeps each page's matching specimen", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop");
  await page.addInitScript(`
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type === "webgl" || type === "experimental-webgl") return null;
      return getContext.apply(this, [type, ...args]);
    };
  `);
  await page.goto("/businesses/technology-digitalization");
  const hero = page.locator(".businessDetailHeroViewer");
  await expect(hero).toHaveAttribute("data-renderer-state", "fallback");
  await expect(hero.getByRole("button")).toHaveCount(0);
  await expect(hero.locator(".businessDetailHeroVisual")).toHaveCSS("overflow", "hidden");
  await expect(hero.locator(".businessCardViewerFallback")).not.toHaveCSS("transform", "none");

  const nextViewer = page.locator(".nextBusiness .businessCardViewer");
  await nextViewer.scrollIntoViewIfNeeded();
  await expect(nextViewer).toHaveAttribute("data-renderer-state", "fallback");
  await expect(nextViewer.locator(".businessCardViewerFallback")).not.toHaveCSS("transform", "none");
});

test("business detail hero rotation pauses and honors reduced motion", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop");
  await page.addInitScript(`
    window.__webglDrawCount = 0;
    if (window.WebGLRenderingContext) {
      const drawArrays = WebGLRenderingContext.prototype.drawArrays;
      WebGLRenderingContext.prototype.drawArrays = function (...args) {
        window.__webglDrawCount += 1;
        return drawArrays.apply(this, args);
      };
    }
  `);
  await page.goto("/businesses/technology-digitalization");
  const hero = page.locator(".businessDetailHeroViewer");
  await expect.poll(() => hero.getAttribute("data-renderer-state")).toMatch(/ready|fallback/);
  if (await hero.getAttribute("data-renderer-state") !== "ready") test.skip(true, "WebGL is unavailable in this browser");

  const drawCount = () => page.evaluate(() => (window as unknown as Window & { __webglDrawCount: number }).__webglDrawCount);
  const firstDrawCount = await drawCount();
  await page.waitForTimeout(900);
  expect(await drawCount()).toBeGreaterThan(firstDrawCount);

  await page.getByRole("button", { name: "Pause rotation" }).hover();
  await page.getByRole("button", { name: "Pause rotation" }).click();
  await expect(page.getByRole("button", { name: "Resume rotation" })).toBeVisible();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(100);
  const pausedDrawCount = await drawCount();
  await page.waitForTimeout(500);
  expect(await drawCount()).toBe(pausedDrawCount);

  await page.getByRole("button", { name: "Resume rotation" }).click();
  await expect(page.getByRole("button", { name: "Pause rotation" })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(hero.getByRole("button")).toHaveCount(0);
  await page.waitForTimeout(100);
  const reducedDrawCount = await drawCount();
  await page.waitForTimeout(500);
  expect(await drawCount()).toBe(reducedDrawCount);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.getByRole("button", { name: "Pause rotation" })).toBeVisible();
  await expect.poll(drawCount).toBeGreaterThan(reducedDrawCount);
  const nextViewer = page.locator(".nextBusiness .businessCardViewer");
  await nextViewer.scrollIntoViewIfNeeded();
  await expect(nextViewer).toHaveAttribute("data-renderer-state", "ready");
  await page.waitForTimeout(100);
  const offscreenDrawCount = await drawCount();
  await page.waitForTimeout(500);
  expect(await drawCount()).toBe(offscreenDrawCount);
});

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

test("Home and About point figures use the proportional numeral grid", async ({ page }) => {
  const width = page.viewportSize()?.width ?? 0;
  const desktop = width >= 901;
  const expected = desktop
    ? [".04em", "max(.35px,.0065em)", "max(.5px,.01em)"]
    : [".055em", "max(.5px,.009em)", "max(.72px,.014em)"];

  for (const locale of ["en", "id"] as const) {
    const base = locale === "en" ? "" : "/id";
    await page.goto(`${base}/`);
    const home = await page.locator(".homeCatalogueCountDotted").first().evaluate((element) => {
      const style = getComputedStyle(element);
      return ["--dot-pitch", "--dot-radius", "--dot-edge"].map((name) =>
        style.getPropertyValue(name).replaceAll(" ", ""),
      );
    });
    expect(home).toEqual(expected);

    await page.goto(`${base}/about`);
    const about = await page.locator(".figureGrid .num.dots").evaluate((element) => {
      const style = getComputedStyle(element);
      return ["--dot-pitch", "--dot-radius", "--dot-edge"].map((name) =>
        style.getPropertyValue(name).replaceAll(" ", ""),
      );
    });
    expect(about).toEqual(expected);
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
  test.setTimeout(150_000);
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


test("business viewer control follows tablet layout and orientation changes", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop");
  await page.goto("/businesses/technology-digitalization");
  const viewer = page.locator(".businessDetailHeroViewer");
  await expect(viewer).toHaveAttribute("data-renderer-state", "ready", { timeout: 60_000 });
  const control = viewer.locator(".businessViewerMotionControl");
  await expect(control).toBeVisible();
  await control.click();
  await expect(control).toHaveAccessibleName("Resume rotation");
  for (const size of [{ width: 1024, height: 1366 }, { width: 1180, height: 1366 }, { width: 1100, height: 800 }]) {
    await page.setViewportSize(size);
    await expect(control).toBeHidden();
    await expect(viewer.getByRole("button")).toHaveCount(0);
  }
  await page.setViewportSize({ width: 1366, height: 1024 });
  await expect(control).toBeVisible();
  await expect(control).toHaveAccessibleName("Resume rotation");
  await control.click();
  await expect(control).toHaveAccessibleName("Pause rotation");
});
