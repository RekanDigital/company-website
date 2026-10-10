import { test, expect } from "@playwright/test";

const FLIGHT_READY_TIMEOUT = 25_000;

const copy = {
  en: {
    base: "",
    positioning:
      "RekanMU develops businesses by combining data, technology, automation, and Indonesia’s strategic productive sectors to improve operations, strengthen decision-making, and create higher-value products.",
    stops: [
      ["General Trading & Supply Chain", "Sourcing, procurement, logistics, and distribution for business and industry.", "/businesses/general-trading-supply-chain"],
      ["Technology & Digitalization", "Digital systems, automation, AI, IoT, and infrastructure for connected operations.", "/businesses/technology-digitalization"],
      ["Data & Business Intelligence", "Turning business, operational, and spatial data into clearer decisions.", "/businesses/data-business-intelligence"],
      ["Fisheries, Seaweed & Blue Economy", "Developing marine resources from cultivation through processing and downstream value.", "/businesses/fisheries-seaweed-blue-economy"],
      ["Health & Bioscience", "Developing higher-value opportunities from herbal and biological resources.", "/businesses/health-bioscience"],
      ["Agriculture & Green Economy", "Strengthening agriculture through productivity, circular resources, and green-economy development.", "/businesses/agriculture-green-economy"],
      ["Food & Beverage", "Connecting agricultural outputs with processing, product development, and markets.", "/businesses/food-beverage"],
    ],
    intelligenceHeading: "From Intelligence to Execution",
    intelligence:
      "RekanMU turns data into decisions, decisions into systems, and systems into more efficient operations. We combine intelligence, digital technology, automation, and infrastructure to help businesses operate with greater clarity, speed, and control.",
    sourceHeading: "From Source to Market",
    source:
      "We connect sourcing, production, processing, distribution, and commercialization into a more complete path to value. The goal is not simply to move resources through the chain, but to create stronger products, more efficient operations, and greater value at every stage.",
    action: "Explore Our Businesses",
  },
  id: {
    base: "/id",
    positioning:
      "RekanMU mengembangkan bisnis dengan menggabungkan data, teknologi, otomasi, dan sektor produktif strategis Indonesia untuk meningkatkan operasional, memperkuat pengambilan keputusan, dan menciptakan produk bernilai tambah lebih tinggi.",
    stops: [
      ["General Trading & Supply Chain", "Sourcing, pengadaan, logistik, dan distribusi untuk kebutuhan bisnis dan industri.", "/businesses/general-trading-supply-chain"],
      ["Technology & Digitalization", "Sistem digital, otomasi, AI, IoT, dan infrastruktur untuk operasional yang terhubung.", "/businesses/technology-digitalization"],
      ["Data & Business Intelligence", "Mengubah data bisnis, operasional, dan spasial menjadi keputusan yang lebih jelas.", "/businesses/data-business-intelligence"],
      ["Fisheries, Seaweed & Blue Economy", "Mengembangkan sumber daya laut dari budidaya hingga pengolahan dan hilirisasi.", "/businesses/fisheries-seaweed-blue-economy"],
      ["Health & Bioscience", "Mengembangkan peluang bernilai tambah dari sumber daya herbal dan hayati.", "/businesses/health-bioscience"],
      ["Agriculture & Green Economy", "Memperkuat pertanian melalui produktivitas, sumber daya sirkular, dan pengembangan ekonomi hijau.", "/businesses/agriculture-green-economy"],
      ["Food & Beverage", "Menghubungkan hasil pertanian dengan pengolahan, pengembangan produk, dan pasar.", "/businesses/food-beverage"],
    ],
    intelligenceHeading: "Dari Intelegensi ke Eksekusi",
    intelligence:
      "RekanMU mengubah data menjadi keputusan, keputusan menjadi sistem, dan sistem menjadi operasional yang lebih efisien. Kami menggabungkan inteligensi, teknologi digital, otomasi, dan infrastruktur untuk membantu bisnis bekerja dengan lebih terarah, cepat, dan terkendali.",
    sourceHeading: "Dari Sumber ke Pasar",
    source:
      "Kami menghubungkan pengadaan, produksi, pengolahan, distribusi, dan komersialisasi dalam satu perjalanan nilai yang lebih utuh. Tujuannya bukan sekadar menggerakkan sumber daya melalui rantai bisnis, tetapi menciptakan produk yang lebih kuat, operasional yang lebih efisien, dan nilai yang lebih tinggi di setiap tahap.",
    action: "Jelajahi Bisnis Kami",
  },
} as const;

for (const locale of ["en", "id"] as const) {
  test(`${locale}: Home scene copy and business stops`, async ({ page }) => {
    const content = copy[locale];
    await page.goto(content.base || "/");

    const scene = page.locator("[data-home-scene]");
    await expect(scene).toHaveCount(1);
    await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: FLIGHT_READY_TIMEOUT });
    await expect(scene.locator("[data-home-flight-canvas]")).toHaveCount(1);
    await expect(page.getByRole("region", { name: locale === "en" ? "Home scene" : "Adegan Beranda" })).toHaveCount(1);
    await expect(scene.locator("h1")).toHaveCount(2);
    const headings = await scene.locator("h1").evaluateAll((nodes) => nodes.map((node) => node.textContent?.replace(/\s+/g, "").trim()));
    expect(headings).toEqual([
      locale === "en" ? "BeyondTechnology.BuildingStrategicIndustries." : "MelampauiTeknologi.MembangunIndustriStrategis.",
      locale === "en" ? "BeyondTechnology.BuildingStrategicIndustries." : "MelampauiTeknologi.MembangunIndustriStrategis.",
    ]);
    const h2Text = await scene.locator("h2").evaluateAll((nodes) => nodes.map((node) => node.textContent?.trim()));
    expect(h2Text).toEqual([
      ...content.stops.map(([name]) => name),
      content.intelligenceHeading,
      content.sourceHeading,
    ]);
    const paragraphText = await scene.locator("p").evaluateAll((nodes) => nodes.map((node) => node.textContent?.trim()));
    expect(paragraphText).toEqual([
      content.positioning,
      ...content.stops.map(([, summary]) => summary),
      content.intelligence,
      content.source,
    ]);
    const links = await scene.locator("a").evaluateAll((nodes) => nodes.map((node) => ({
      text: node.textContent?.trim(),
      href: (node as HTMLAnchorElement).getAttribute("href"),
    })));
    expect(links).toEqual([
      { text: locale === "en" ? "About RekanMU" : "Tentang RekanMU", href: `${content.base}/about` },
      ...content.stops.map(([name, , href]) => ({ text: name, href: `${content.base}${href}` })),
      { text: content.action, href: `${content.base}/businesses` },
    ]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test("the scene shell only appears on Home", async ({ page }) => {
  for (const path of ["/about", "/businesses", "/id/about", "/id/businesses"]) {
    await page.goto(path);
    await expect(page.locator("[data-home-scene]")).toHaveCount(0);
  }
});

test("Home hero CTA uses near-black ink outside the scene blend layer", async ({ page }) => {
  await page.goto("/");
  const scene = page.locator("[data-home-scene]");
  const cta = scene.locator("[data-home-flight-hero-button]");
  await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: FLIGHT_READY_TIMEOUT });
  const style = await cta.evaluate((element) => ({
    color: getComputedStyle(element).color,
    borderColor: getComputedStyle(element).borderTopColor,
    chapterBlendMode: getComputedStyle(element.parentElement!).mixBlendMode,
  }));
  expect(style.color).toBe("rgb(14, 17, 22)");
  expect(style.borderColor).toBe("rgb(14, 17, 22)");
  expect(style.chapterBlendMode).toBe("normal");
});

test("reduced-motion Home hero CTA keeps near-black ink on the light ground", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const scene = page.locator("[data-home-scene]");
  await expect(scene).toHaveAttribute("data-home-flight-mode", "static");
  const cta = scene.locator("[data-home-flight-hero-button]");
  await expect(cta).toHaveCSS("color", "rgb(14, 17, 22)");
  await expect(cta).toHaveCSS("border-top-color", "rgb(14, 17, 22)");
});

test("desktop flight chapter copy sits left-middle; tablet and mobile keep their placement", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/");
  const scene = page.locator("[data-home-scene]");
  await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: FLIGHT_READY_TIMEOUT });
  await scrollToFlightProgress(page, 46);
  await expect.poll(async () => Number(await scene.getAttribute("data-home-flight-frame")), { timeout: 30_000 })
    .toBeGreaterThanOrEqual(45);
  const viewport = page.viewportSize()!;
  const placement = await scene.locator("[data-home-flight-chapter]").evaluateAll((chapters) => {
    const node = chapters.find((chapter) => Number(getComputedStyle(chapter).opacity) > 0.8);
    if (!node) return null;
    const style = getComputedStyle(node);
    const bounds = node.getBoundingClientRect();
    return { top: style.top, bottom: style.bottom, translate: style.translate, centerY: (bounds.top + bounds.bottom) / 2 };
  });
  expect(placement).not.toBeNull();

  if (viewport.width >= 901) {
    expect(Math.abs(placement!.centerY - viewport.height / 2)).toBeLessThanOrEqual(8);
  } else {
    expect(Number.parseFloat(placement!.top)).toBeCloseTo(Math.min(120, Math.max(84, viewport.height * 0.12)), 0);
    expect(placement!.translate).toBe("none");
  }
});

test("the point flight keeps its approved scroll stage and device density", async ({ page }, testInfo) => {
  await page.goto("/");
  const scene = page.locator("[data-home-scene]");
  await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: FLIGHT_READY_TIMEOUT });
  const sequenceHeight = await scene.locator("[data-home-flight-sequence]").evaluate((node) => Number.parseFloat(getComputedStyle(node).height));
  const expectedHeight = await page.evaluate(() => window.innerHeight * 20);
  expect(sequenceHeight).toBeCloseTo(expectedHeight, 0);
  await expect(scene.locator("[data-home-flight-stage]")).toHaveCSS("position", "sticky");
  const viewport = page.viewportSize();
  const lowMemory = (viewport ? Math.min(viewport.width, viewport.height) < 700 : false) ||
    await page.evaluate(() => "deviceMemory" in navigator && Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory) <= 4);
  await expect(scene).toHaveAttribute("data-home-point-count", lowMemory ? "376041" : "672052");
  await expect(scene).toHaveAttribute("data-home-point-source", "worker");
  const header = page.locator(".site-header--home");
  await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(header.locator(".site-brand span")).toHaveAttribute("data-home-flight-dark", "false");
  await expect(header.locator(".site-brand img")).toHaveCSS("mix-blend-mode", "normal");
});

test("captures the 19 approved flight reference poses", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "reference renders are 1280x720");
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  const scene = page.locator("[data-home-scene]");
  const sequence = scene.locator("[data-home-flight-sequence]");
  await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: FLIGHT_READY_TIMEOUT });

  for (const frame of [2, 8, 14, 20, 26, 29, 32, 35, 39, 46, 53, 60, 66, 73, 80, 86, 90, 95, 100]) {
    await page.evaluate((progress) => {
      const sequenceNode = document.querySelector<HTMLElement>("[data-home-flight-sequence]");
      const stageNode = document.querySelector<HTMLElement>("[data-home-flight-stage]");
      if (!sequenceNode || !stageNode) throw new Error("Home flight stage is missing");
      const total = sequenceNode.offsetHeight - stageNode.offsetHeight;
      const sequenceTop = sequenceNode.getBoundingClientRect().top + window.scrollY;
      const targetProgress = progress / 100;
      window.scrollTo({ top: sequenceTop + targetProgress * total, behavior: "instant" });
      // Correct for scroll rounding using the same raw progress calculation as HomeScene.
      const actualProgress = -sequenceNode.getBoundingClientRect().top / total;
      if (Math.round(actualProgress * 100) !== progress) {
        window.scrollBy({ top: (targetProgress - actualProgress) * total, behavior: "instant" });
      }
    }, frame);
    await expect.poll(async () => page.evaluate(() => {
      const sequenceNode = document.querySelector<HTMLElement>("[data-home-flight-sequence]");
      const stageNode = document.querySelector<HTMLElement>("[data-home-flight-stage]");
      if (!sequenceNode || !stageNode) return -1;
      return Math.round(-sequenceNode.getBoundingClientRect().top / (sequenceNode.offsetHeight - stageNode.offsetHeight) * 100);
    }), { timeout: 10_000 }).toBe(frame);
    await expect.poll(async () => Number(await scene.getAttribute("data-home-flight-frame")), { timeout: 10_000 }).toBe(frame);
    await page.screenshot({ path: testInfo.outputPath(`frame-${String(frame).padStart(3, "0")}.png`) });
  }
});

async function expectStaticFlow(scene: import("@playwright/test").Locator, viewportHeight: number) {
  const flow = await scene.evaluate((root) => {
    const sequence = root.querySelector<HTMLElement>("[data-home-flight-sequence]");
    const chapters = [...root.querySelectorAll<HTMLElement>("[data-home-flight-chapter]")];
    const heroButton = root.querySelector<HTMLElement>("[data-home-flight-hero-button]");
    const ordered = chapters.flatMap((chapter, index) => index === 0 && heroButton ? [chapter, heroButton] : [chapter]);
    return {
      inlineHeight: sequence?.style.height,
      sequenceHeight: sequence?.offsetHeight ?? 0,
      chapterPositions: ordered.map((item) => {
        const rect = item.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom };
      }),
      chaptersPosition: getComputedStyle(root.querySelector<HTMLElement>(".homeScene__chapters")!).position,
    };
  });
  expect(flow.inlineHeight).toBe("auto");
  expect(flow.sequenceHeight).toBeGreaterThan(viewportHeight);
  expect(flow.chaptersPosition).toBe("relative");
  expect(flow.chapterPositions).toHaveLength(12);
  for (const [index, current] of flow.chapterPositions.entries()) {
    if (index > 0) expect(current.top).toBeGreaterThanOrEqual(flow.chapterPositions[index - 1].bottom - 1);
    expect(current.bottom).toBeGreaterThan(current.top);
  }
}

async function scrollToFlightProgress(page: import("@playwright/test").Page, progress: number) {
  await page.evaluate((percentage) => {
    const sequence = document.querySelector<HTMLElement>("[data-home-flight-sequence]");
    const stage = document.querySelector<HTMLElement>("[data-home-flight-stage]");
    if (!sequence || !stage) throw new Error("Home flight stage is missing");
    const total = sequence.offsetHeight - stage.offsetHeight;
    const target = percentage / 100;
    const sequenceTop = sequence.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: sequenceTop + target * total, behavior: "instant" });
    const actual = -sequence.getBoundingClientRect().top / total;
    if (Math.round(actual * 100) !== percentage) {
      window.scrollBy({ top: (target - actual) * total, behavior: "instant" });
    }
  }, progress);
}

async function getBlueFrameBounds(page: import("@playwright/test").Page) {
  const screenshot = await page.screenshot();
  return page.evaluate(async (png) => {
    const image = new Image();
    image.src = `data:image/png;base64,${png}`;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Screenshot canvas is unavailable");
    context.drawImage(image, 0, 0);
    const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
    const rows = new Uint16Array(height);
    const columns = new Uint16Array(width);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const offset = (y * width + x) * 4;
        const red = data[offset];
        const green = data[offset + 1];
        const blue = data[offset + 2];
        if (red > 30 && red < 80 && green > 90 && green < 160 && blue > 150 && blue > green * 1.3 && green > red * 1.3) {
          rows[y]++;
          columns[x]++;
        }
      }
    }
    const linePixels = Math.min(width * 0.4, height * 0.25);
    const horizontal = [...rows.keys()].filter((y) => rows[y] > linePixels);
    const vertical = [...columns.keys()].filter((x) => columns[x] > linePixels);
    if (!horizontal.length || !vertical.length) throw new Error("Business focus frame was not visible in the screenshot");
    return {
      left: vertical[0],
      right: vertical.at(-1)!,
      top: horizontal[0],
      bottom: horizontal.at(-1)!,
      scale: width / window.innerWidth,
    };
  }, Buffer.from(screenshot).toString("base64"));
}

test("portrait business focus frames stay tight and clear of chapter text", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "desktop");
  test.setTimeout(180_000);
  const viewport = testInfo.project.name === "tablet" ? [768, 1024] : [390, 844];
  await page.setViewportSize({ width: viewport[0], height: viewport[1] });
  await page.goto("/");

  const scene = page.locator("[data-home-scene]");
  await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: FLIGHT_READY_TIMEOUT });
  for (const progress of [40, 46, 53, 60, 66, 73, 79]) {
    await scrollToFlightProgress(page, progress);
    await expect.poll(async () => Number(await scene.getAttribute("data-home-flight-frame")), { timeout: 30_000 })
      .toBeGreaterThanOrEqual(progress - 1);
    await expect.poll(() => scene.locator("[data-home-flight-chapter]").evaluateAll((chapters) =>
      chapters.some((chapter) => Number(getComputedStyle(chapter).opacity) > 0.8))).toBe(true);

    const subtitleBottom = await scene.locator("[data-home-flight-chapter]").evaluateAll((chapters) => {
      const active = chapters.find((chapter) => Number(getComputedStyle(chapter).opacity) > 0.8);
      return active?.querySelector("p")?.getBoundingClientRect().bottom ?? -1;
    });
    const frame = await getBlueFrameBounds(page);
    const frameTop = frame.top / frame.scale;
    const frameBottom = frame.bottom / frame.scale;
    const frameWidth = (frame.right - frame.left + 1) / frame.scale;
    const label = await scene.locator("[data-home-flight-target]").evaluate((node) => {
      const range = document.createRange();
      range.selectNodeContents(node);
      const bounds = range.getBoundingClientRect();
      return {
        text: node.textContent,
        opacity: Number(getComputedStyle(node).opacity),
        left: bounds.left,
        right: bounds.right,
        top: bounds.top,
        bottom: bounds.bottom,
      };
    });
    expect(frameTop - subtitleBottom).toBeGreaterThanOrEqual(40);
    expect(frameWidth).toBeGreaterThanOrEqual(viewport[0] * 0.63);
    expect(frameWidth).toBeLessThanOrEqual(viewport[0] * 0.7);
    expect(frameBottom).toBeLessThanOrEqual(viewport[1]);
    expect(label.text).toMatch(/^00[1-7]\s+[A-Z]/);
    expect(label.opacity).toBeGreaterThan(0);
    expect(label.top).toBeGreaterThanOrEqual(0);
    expect(label.right).toBeLessThanOrEqual(viewport[0]);
    expect(label.top - subtitleBottom).toBeGreaterThanOrEqual(48);
    expect(frameTop - label.bottom).toBeGreaterThanOrEqual(0);
    expect(frameTop - label.bottom).toBeLessThanOrEqual(32);
  }
});

test("landscape tablet business focus frames stay clear of chapter text", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "tablet");
  test.setTimeout(120_000);
  const viewport = [1024, 768];
  await page.setViewportSize({ width: viewport[0], height: viewport[1] });
  await page.goto("/");

  const scene = page.locator("[data-home-scene]");
  await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: FLIGHT_READY_TIMEOUT });
  for (const progress of [40, 46, 53, 60, 66, 73, 79]) {
    await scrollToFlightProgress(page, progress);
    await expect.poll(async () => Number(await scene.getAttribute("data-home-flight-frame")), { timeout: 30_000 })
      .toBeGreaterThanOrEqual(progress - 1);
    const textRight = await scene.locator("[data-home-flight-chapter]").evaluateAll((chapters) => {
      const active = chapters.find((chapter) => Number(getComputedStyle(chapter).opacity) > 0.8);
      return active?.getBoundingClientRect().right ?? -1;
    });
    const frame = await getBlueFrameBounds(page);
    const frameLeft = frame.left / frame.scale;
    const frameWidth = (frame.right - frame.left + 1) / frame.scale;
    const frameBottom = frame.bottom / frame.scale;
    expect(frameLeft - textRight).toBeGreaterThanOrEqual(40);
    expect(frameWidth).toBeLessThanOrEqual(viewport[1] * 0.5);
    expect(frameBottom).toBeLessThanOrEqual(viewport[1]);
  }
});

test("portrait Home hero CTA clears the square and stays anchored as it collapses", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "desktop");
  test.setTimeout(60_000);
  const viewport = testInfo.project.name === "tablet" ? [768, 1024] : [390, 844];
  await page.setViewportSize({ width: viewport[0], height: viewport[1] });
  await page.goto("/");

  const scene = page.locator("[data-home-scene]");
  await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: FLIGHT_READY_TIMEOUT });
  await expect(scene).toHaveAttribute("data-home-flight-frame", "0");
  const initial = await page.evaluate(() => {
    const button = document.querySelector<HTMLElement>("[data-home-flight-hero-button]")!;
    const square = document.querySelector<HTMLElement>(".homeScene__windowFrame")!;
    const buttonBounds = button.getBoundingClientRect();
    const squareBounds = square.getBoundingClientRect();
    return { buttonTop: buttonBounds.top, buttonBottom: buttonBounds.bottom, squareBottom: squareBounds.bottom };
  });
  expect(initial.buttonTop).toBeGreaterThanOrEqual(initial.squareBottom + 20);
  expect(initial.buttonBottom).toBeLessThanOrEqual(viewport[1]);

  for (const progress of [1, 6]) {
    await scrollToFlightProgress(page, progress);
    await expect.poll(async () => Number(await scene.getAttribute("data-home-flight-frame")), { timeout: 10_000 })
      .toBeGreaterThanOrEqual(progress - 1);
    const button = await page.locator("[data-home-flight-hero-button]").boundingBox();
    expect(button).not.toBeNull();
    expect(button!.y).toBeCloseTo(initial.buttonTop, 0);
    expect(button!.y + button!.height).toBeLessThanOrEqual(viewport[1]);
  }
});

test("the active flight chapter remains visible and its link can receive focus", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  const scene = page.locator("[data-home-scene]");
  await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: FLIGHT_READY_TIMEOUT });
  await scrollToFlightProgress(page, 37);
  await expect.poll(async () => Number(await scene.getAttribute("data-home-flight-frame")), { timeout: 10_000 }).toBe(37);
  const activeStop = scene.locator("[data-home-flight-chapter]").nth(2);
  const activeLink = activeStop.getByRole("link", { name: "General Trading & Supply Chain" });
  await expect(activeStop).toBeVisible();
  await expect(activeLink).toBeVisible();
  await expect(page.locator(".site-header--home .site-brand span")).toHaveCSS("color", "rgb(246, 248, 250)");
  await expect(page.locator(".site-header--home .site-header__link").first()).toHaveCSS("color", "rgb(246, 248, 250)");
  await activeLink.focus();
  await expect(activeLink).toBeFocused();
});

test("reduced motion keeps the complete Home copy in static flow and keyboard reachable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const scene = page.locator("[data-home-scene]");
  await expect(scene).toHaveAttribute("data-home-flight-mode", "static");
  await expectStaticFlow(scene, page.viewportSize()!.height);
  await expect(scene.getByRole("link").filter({ hasText: "General Trading & Supply Chain" })).toBeVisible();
  await expect(scene.getByRole("link", { name: "Explore Our Businesses" })).toBeVisible();
  await scene.getByRole("link", { name: "Explore Our Businesses" }).focus();
  await expect(scene.getByRole("link", { name: "Explore Our Businesses" })).toBeFocused();
});

test("WebGL context loss restores all scene links to static reading flow", async ({ page }) => {
  await page.goto("/");
  const scene = page.locator("[data-home-scene]");
  await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: FLIGHT_READY_TIMEOUT });
  await scene.locator("[data-home-flight-canvas]").dispatchEvent("webglcontextlost", { cancelable: true });
  await expect(scene).toHaveAttribute("data-home-flight-mode", "static");
  await expect(scene.getByRole("link").filter({ hasText: "General Trading & Supply Chain" })).toBeVisible();
});

test("unavailable WebGL restores the complete static Home shell", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "__homeWorkerStarts", { value: 0, writable: true });
    const NativeWorker = window.Worker;
    window.Worker = class extends NativeWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        Reflect.set(window, "__homeWorkerStarts", Number(Reflect.get(window, "__homeWorkerStarts")) + 1);
        super(url, options);
      }
    };
    const getContext = HTMLCanvasElement.prototype.getContext as (this: HTMLCanvasElement, contextId: string) => RenderingContext | null;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string) {
      if (contextId.startsWith("webgl")) return null;
      return getContext.call(this, contextId);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto("/");
  const scene = page.locator("[data-home-scene]");
  await expect(scene).toHaveAttribute("data-home-flight-mode", "static", { timeout: FLIGHT_READY_TIMEOUT });
  expect(await page.evaluate(() => Reflect.get(window, "__homeWorkerStarts"))).toBe(0);
  await expectStaticFlow(scene, page.viewportSize()!.height);
  await expect(scene.getByRole("link").filter({ hasText: "General Trading & Supply Chain" })).toBeVisible();
});

test("worker failure restores the complete static Home shell", async ({ page }) => {
  await page.addInitScript(() => {
    const NativeWorker = window.Worker;
    window.Worker = class extends NativeWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        super(url, options);
        setTimeout(() => this.dispatchEvent(new ErrorEvent("error", { message: "synthetic Worker failure" })), 500);
      }
    };
  });
  await page.goto("/");
  const scene = page.locator("[data-home-scene]");
  await expect(scene).toHaveAttribute("data-home-flight-mode", "loading");
  const loadingFlow = await scene.evaluate((root) => ({
    positions: [...root.querySelectorAll<HTMLElement>(".homeScene__chapters")].map((chapters) => getComputedStyle(chapters).position),
    chapterTops: [...root.querySelectorAll<HTMLElement>("[data-home-flight-chapter]")].map((chapter) => chapter.getBoundingClientRect().top),
  }));
  expect(loadingFlow.positions).toEqual(["relative", "relative"]);
  expect(loadingFlow.chapterTops.every((top, index) => index === 0 || top > loadingFlow.chapterTops[index - 1])).toBe(true);
  await expect(scene).toHaveAttribute("data-home-flight-mode", "static");
  await expect(scene.locator("[data-home-flight-hero-button]")).toHaveCSS("color", "rgb(14, 17, 22)");
  await expectStaticFlow(scene, page.viewportSize()!.height);
  await expect(scene.getByRole("link").filter({ hasText: "General Trading & Supply Chain" })).toBeVisible();
});

test("route navigation removes the Home flight and releases its pinned header", async ({ page }) => {
  await page.goto("/");
  const scene = page.locator("[data-home-scene]");
  await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: FLIGHT_READY_TIMEOUT });
  await page.goto("/about");
  await expect(page.locator("[data-home-scene]")).toHaveCount(0);
  await expect(page.locator(".site-header")).toHaveCount(1);
  await expect(page.locator(".site-header")).not.toHaveAttribute("data-home-flight-header");
});

test("the Home flight fits a 320px viewport without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
