import { expect, test, type Page } from "@playwright/test";

const streams = [
  "Digital Creative & Agency Services",
  "Enterprise B2B Tech & Intelligent Automation",
  "Enterprise System Integrator & B2G",
  "Tech Talent & Professional Services",
  "Strategic Real-Sector Initiatives",
] as const;

const HOME_READY_TIMEOUT = 25_000;

async function waitForHomeReady(page: Page) {
  await expect(page.locator("[data-home-scene]")).toHaveAttribute(
    "data-home-loading-state",
    /^(ready|done)$/,
    { timeout: HOME_READY_TIMEOUT },
  );
}

async function gotoStaticHomeContent(page: Page, path: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  await waitForHomeReady(page);
}

async function focusCataloguePanelByKeyboard(page: Page, index = 0) {
  await page.locator(".homeCatalogueIntroCopy .cta").focus();
  for (let tab = 0; tab <= index; tab += 1) await page.keyboard.press("Tab");
  const panel = page.locator(".homeCataloguePanel").nth(index);
  await expect(panel).toBeFocused();
  return panel;
}

async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

for (const locale of ["en", "id"] as const) {
  const base = locale === "en" ? "" : "/id";

  test(`${locale}: Home catalogue, derived counts, and partners`, async ({ page }) => {
    await gotoStaticHomeContent(page, `${base}/`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);

    const catalogue = page.getByRole("region", { name: locale === "en" ? "Products & Services" : "Produk & Layanan" });
    await expect(catalogue.getByRole("link", { name: locale === "en" ? "Explore Products & Services" : "Jelajahi Produk & Layanan" })).toHaveAttribute("href", `${base}/products-services`);
    const panels = catalogue.locator(".homeCataloguePanel");
    await expect(panels).toHaveCount(5);
    await expect(panels.getByRole("heading", { level: 3 })).toHaveText(streams);

    const productsPage = await page.context().newPage();
    await productsPage.goto(`${base}/products-services`);
    const counts = await productsPage.locator(".catalogueSection").evaluateAll((sections) =>
      sections.map((section) => section.querySelectorAll(".catalogueItem").length),
    );
    const accessibleCounts = await panels.locator(".homeCatalogueCount").evaluateAll((items) =>
      items.map((item) => item.getAttribute("aria-label")),
    );
    expect(accessibleCounts).toEqual(counts.map((count) => `${count} ${locale === "en" ? "catalogue items" : "item katalog"}`));
    const panelCounts = await panels.evaluateAll((items) => items.map((item) => Number(item.getAttribute("data-count"))));
    expect(panelCounts).toEqual(counts);
    await productsPage.close();

    const partners = page.getByRole("region", { name: locale === "en" ? "Built Through Collaboration" : "Dibangun Melalui Kolaborasi" });
    await expect(partners.locator(".partnerLogoSet:not([aria-hidden='true']) [role='img']")).toHaveCount(11);
    await expect(partners.locator(".partnerLogo img").first()).toHaveAttribute("src", /partners-ed-business-consulting\./);
    const partnerLine = await partners.locator(".partnerLogoSet").first().evaluate((set) => {
      const logo = set.querySelector<HTMLElement>(".partnerLogo")!;
      const styles = getComputedStyle(set);
      return { gap: Number.parseFloat(styles.gap), width: logo.getBoundingClientRect().width };
    });
    expect(partnerLine.width).toBeGreaterThanOrEqual(164);
    expect(partnerLine.gap / partnerLine.width).toBeLessThan(0.3);
    if ((page.viewportSize()?.width ?? 0) <= 820) {
      const dotMetrics = await partners.locator(".dots").evaluate((dots) => {
        const styles = getComputedStyle(dots);
        return {
          pitch: styles.getPropertyValue("--dot-pitch").replaceAll(" ", ""),
          radius: styles.getPropertyValue("--dot-radius").replaceAll(" ", ""),
          edge: styles.getPropertyValue("--dot-edge").replaceAll(" ", ""),
          backgroundImage: styles.backgroundImage,
          backgroundSize: styles.backgroundSize,
        };
      });
      expect(dotMetrics.pitch).toBe("max(2.4px,.055em)");
      expect(dotMetrics.radius).toBe("max(.4px,.009em)");
      expect(dotMetrics.edge).toBe("max(.6px,.014em)");
      expect(dotMetrics.backgroundSize).toContain("2.4px");
      expect(dotMetrics.backgroundImage).toContain("0.4px");
      expect(dotMetrics.backgroundImage).toContain("0.6px");
    }
    await expectNoHorizontalOverflow(page);
  });
}

test("desktop Home panels follow scroll linearly and stop with the scroll", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 820);
  await page.goto("/");
  await waitForHomeReady(page);

  const section = page.locator(".homeCatalogue");
  const track = page.locator(".homeCatalogueTrack");
  const geometry = await section.evaluate((node) => {
    const element = node as HTMLElement;
    return { top: element.getBoundingClientRect().top + window.scrollY, height: element.offsetHeight };
  });
  const viewportHeight = page.viewportSize()?.height ?? 0;
  // The keyframe's -100% is based on the track's own box; child card transforms
  // inflate scrollWidth while the cards are rising and rotating.
  const travel = await track.evaluate((element) => element.getBoundingClientRect().width - window.innerWidth);
  const readX = () => track.evaluate((element) => {
    const transform = getComputedStyle(element).transform;
    return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m41;
  });
  await page.evaluate((top) => window.scrollTo(0, top), geometry.top);
  await expect.poll(readX).toBeCloseTo(0, 0);
  await page.evaluate((top) => window.scrollTo(0, top), geometry.top + (geometry.height - viewportHeight) / 2);
  await expect.poll(readX).toBeCloseTo(-travel / 2, 0);
  const middle = await readX();
  expect(Math.abs(middle + travel / 2)).toBeLessThan(10);
  await page.waitForTimeout(150);
  expect(Math.abs((await readX()) - middle)).toBeLessThan(1);
  await page.evaluate((top) => window.scrollTo(0, top), geometry.top + geometry.height - viewportHeight);
  await expect.poll(readX).toBeCloseTo(-travel, 0);
});

test("touch Home catalogue keeps descriptions open", async ({ page }) => {
  const width = page.viewportSize()?.width ?? 0;
  test.skip(width > 820);
  await gotoStaticHomeContent(page, "/");
  const panel = page.locator(".homeCataloguePanel").first();
  await expect(panel.locator(".homeCatalogueDescription")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("mobile and tablet Home category panels keep type proportional and fit their content", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) > 820);
  const sizes = (page.viewportSize()?.width ?? 0) <= 480
    ? [[320, 740], [390, 844]] as const
    : [[768, 1024]] as const;

  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    for (const locale of ["en", "id"] as const) {
      await gotoStaticHomeContent(page, locale === "en" ? "/" : "/id");
      await page.evaluate(() => document.fonts.ready);
      const panels = await page.locator(".homeCataloguePanel").evaluateAll((elements) => elements.map((element) => {
        const panel = element as HTMLElement;
        const count = panel.querySelector(".homeCatalogueCount")!;
        const title = panel.querySelector(".homeCatalogueStreamName")!;
        const description = panel.querySelector(".homeCatalogueDescription")!;
        const copy = panel.querySelector(".homeCataloguePanelCopy")!;
        const bounds = panel.getBoundingClientRect();
        const countBounds = count.getBoundingClientRect();
        const titleBounds = title.getBoundingClientRect();
        const descriptionBounds = description.getBoundingClientRect();
        const copyBounds = copy.getBoundingClientRect();
        const style = getComputedStyle(panel);
        const pixels = (value: string) => Number.parseFloat(value);
        const contentHeight = countBounds.height + pixels(style.rowGap) + copyBounds.height
          + pixels(style.paddingTop) + pixels(style.paddingBottom)
          + pixels(style.borderTopWidth) + pixels(style.borderBottomWidth);

        return {
          countPosition: getComputedStyle(count).position,
          countToTitleRatio: Number.parseFloat(getComputedStyle(count).fontSize)
            / Number.parseFloat(getComputedStyle(title).fontSize),
          titleSize: Number.parseFloat(getComputedStyle(title).fontSize),
          descriptionSize: Number.parseFloat(getComputedStyle(description).fontSize),
          countTitleGap: titleBounds.top - countBounds.bottom,
          titleDescriptionGap: descriptionBounds.top - titleBounds.bottom,
          unusedPanelHeight: bounds.height - contentHeight,
          horizontalOverflow: panel.scrollWidth - panel.clientWidth,
          contentBottom: descriptionBounds.bottom - bounds.top,
          panelHeight: bounds.height,
          paddingBottom: pixels(style.paddingBottom),
        };
      }));

      expect(panels).toHaveLength(5);
      for (const panel of panels) {
        expect(panel.countPosition).not.toBe("absolute");
        expect(panel.countToTitleRatio).toBeCloseTo(3.75, 2);
        expect(panel.titleSize).toBeGreaterThanOrEqual(28);
        expect(panel.titleSize).toBeLessThanOrEqual(36);
        expect(panel.descriptionSize).toBeGreaterThanOrEqual(16);
        expect(panel.countTitleGap).toBeGreaterThanOrEqual(16);
        expect(panel.countTitleGap).toBeLessThanOrEqual(20);
        expect(panel.titleDescriptionGap).toBeGreaterThan(0);
        expect(panel.titleDescriptionGap).toBeLessThanOrEqual(12);
        expect(panel.unusedPanelHeight).toBeLessThanOrEqual(2);
        expect(panel.horizontalOverflow).toBeLessThanOrEqual(0);
        expect(panel.contentBottom).toBeLessThanOrEqual(panel.panelHeight - panel.paddingBottom + 1);
      }
      await expectNoHorizontalOverflow(page);
    }
  }
});

test("desktop Home catalogue opens descriptions on keyboard focus", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 820);
  await gotoStaticHomeContent(page, "/");
  const panel = await focusCataloguePanelByKeyboard(page);
  await expect(panel.locator(".homeCatalogueDescription")).toBeVisible();
});

test("desktop Home catalogue type scales from its roughly 100px reference title", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 820);
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoStaticHomeContent(page, "/");

  const ratios = await page.evaluate(() => {
    const size = (selector: string) => Number.parseFloat(getComputedStyle(document.querySelector(selector)!).fontSize);
    const title = size(".homeCatalogueIntro h2");
    return {
      title,
      titleToHero: title / size(".homeHero h1"),
      countToTitle: size(".homeCatalogueCount") / title,
      streamToTitle: size(".homeCatalogueStreamName") / title,
      introCopyToTitle: size(".homeCatalogueIntroCopy .lead") / title,
      descriptionToTitle: size(".homeCatalogueDescription") / title,
    };
  });

  expect(ratios.title).toBeCloseTo(100, 0);
  expect(ratios.titleToHero).toBeCloseTo(0.83, 2);
  expect(ratios.countToTitle).toBeCloseTo(3.75, 2);
  expect(ratios.streamToTitle).toBeCloseTo(0.568, 2);
  expect(ratios.introCopyToTitle).toBeCloseTo(0.243, 2);
  expect(ratios.descriptionToTitle).toBeCloseTo(0.18, 2);
});

test("desktop Home catalogue counts and labels stay inside compact panel bounds", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 820);
  test.setTimeout(90_000);

  for (const locale of ["en", "id"] as const) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(locale === "en" ? "/" : "/id");
    await waitForHomeReady(page);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({
      content: `
        .homeCatalogueDescription { transition: none !important; }
        .homeCataloguePanel { animation: none !important; transform: none !important; clip-path: none !important; }
      `,
    });

    for (const [width, height] of [[1440, 900], [1280, 720], [1024, 600], [901, 500]]) {
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      await page.setViewportSize({ width, height });
      await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
      const panelMetrics = await page.locator(".homeCataloguePanel").evaluateAll((panels) => {
        const box = (element: Element) => {
          const { top, right, bottom, left, width, height } = element.getBoundingClientRect();
          return { top, right, bottom, left, width, height };
        };

        return panels.map((panel) => {
          const bounds = box(panel);
          const dotted = box(panel.querySelector(".homeCatalogueCountDotted")!);
          const label = box(panel.querySelector(".homeCatalogueStreamName")!);
          const copy = panel.querySelector(".homeCataloguePanelCopy") as HTMLElement;
          const style = getComputedStyle(panel);
          return {
            countTop: dotted.top - bounds.top,
            countBottom: dotted.bottom - bounds.top,
            countLeft: dotted.left - bounds.left,
            countRight: dotted.right - bounds.left,
            labelTop: label.top - bounds.top,
            labelBottom: label.bottom - bounds.top,
            labelLeft: label.left - bounds.left,
            labelRight: label.right - bounds.left,
            gap: label.top - dotted.bottom,
            panelHeight: bounds.height,
            panelWidth: bounds.width,
            paddingLeft: Number.parseFloat(style.paddingLeft),
            paddingRight: Number.parseFloat(style.paddingRight),
            copyOverflow: copy.scrollWidth - copy.clientWidth,
          };
        });
      });
      const headerHeight = await page.locator(".site-header").evaluate((header) => header.getBoundingClientRect().height);

      expect(panelMetrics).toHaveLength(5);
      for (const panel of panelMetrics) {
        expect(panel.countTop).toBeGreaterThanOrEqual(headerHeight + 10);
        expect(panel.countBottom).toBeLessThan(panel.panelHeight - 24);
        expect(panel.countLeft).toBeGreaterThanOrEqual(0);
        expect(panel.countRight).toBeLessThanOrEqual(panel.panelWidth);
        expect(panel.gap).toBeGreaterThanOrEqual(20);
        expect(panel.gap).toBeLessThanOrEqual(32);
        expect(panel.labelTop).toBeGreaterThan(panel.countBottom);
        expect(panel.labelBottom).toBeLessThan(panel.panelHeight - 12);
        expect(panel.labelLeft).toBeGreaterThanOrEqual(panel.paddingLeft - 1);
        expect(panel.labelRight).toBeLessThanOrEqual(panel.panelWidth - panel.paddingRight + 1);
        expect(panel.copyOverflow).toBeLessThanOrEqual(0);
      }

      for (let index = 0; index < 5; index += 1) {
        const panel = await focusCataloguePanelByKeyboard(page, index);
        const expanded = await panel.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          const count = element.querySelector(".homeCatalogueCountDotted")!.getBoundingClientRect();
          const title = element.querySelector(".homeCatalogueStreamName")!.getBoundingClientRect();
          const description = element.querySelector(".homeCatalogueDescription") as HTMLElement;
          const descriptionBounds = description.getBoundingClientRect();
          const paddingBottom = Number.parseFloat(getComputedStyle(element).paddingBottom);
          return {
            countTop: count.top - bounds.top,
            countBottom: count.bottom - bounds.top,
            titleTop: title.top - bounds.top,
            titleBottom: title.bottom - bounds.top,
            descriptionTop: descriptionBounds.top - bounds.top,
            descriptionBottom: descriptionBounds.bottom - bounds.top,
            descriptionLeft: descriptionBounds.left - bounds.left,
            descriptionRight: descriptionBounds.right - bounds.left,
            panelHeight: bounds.height,
            panelWidth: bounds.width,
            paddingLeft: Number.parseFloat(getComputedStyle(element).paddingLeft),
            paddingRight: Number.parseFloat(getComputedStyle(element).paddingRight),
            paddingBottom,
            descriptionScrollHeight: description.scrollHeight,
            descriptionClientHeight: description.clientHeight,
          };
        });

        expect(expanded.countTop).toBeGreaterThanOrEqual(headerHeight + 10);
        expect(expanded.titleTop - expanded.countBottom).toBeGreaterThanOrEqual(20);
        expect(expanded.titleTop - expanded.countBottom).toBeLessThanOrEqual(32);
        expect(expanded.descriptionTop).toBeGreaterThan(expanded.titleBottom);
        expect(expanded.descriptionBottom).toBeLessThan(expanded.panelHeight - expanded.paddingBottom + 1);
        expect(expanded.descriptionLeft).toBeGreaterThanOrEqual(expanded.paddingLeft - 1);
        expect(expanded.descriptionRight).toBeLessThanOrEqual(expanded.panelWidth - expanded.paddingRight + 1);
        expect(expanded.descriptionScrollHeight).toBeLessThanOrEqual(expanded.descriptionClientHeight);
        await panel.evaluate((element) => element.blur());
      }
    }
  }
});

test("partner line keeps moving on hover and reduced motion removes continuous movement", async ({ page }) => {
  await page.goto("/");
  await waitForHomeReady(page);
  const marquee = page.locator(".partnerMarquee");
  const track = page.locator(".partnerTrack");
  await expect(track).toHaveCSS("animation-play-state", "running");
  await marquee.hover();
  await expect(track).toHaveCSS("animation-play-state", "running");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await waitForHomeReady(page);
  await expect(page.locator(".partnerTrack")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".homeCataloguePanel .homeCatalogueDescription").first()).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
