import { test, expect } from "@playwright/test";

test("Home animates its logo loader before handing off to the flight scene", async ({ page }) => {
  test.setTimeout(45_000);
  await page.addInitScript(() => {
    const workerProgress: number[] = [];
    Object.defineProperty(window, "__homeWorkerProgress", { value: workerProgress });
    const readyObserver = new MutationObserver(() => {
      const root = document.querySelector<HTMLElement>("[data-home-scene]");
      if (root?.dataset.homeFlightReady !== "true") return;
      readyObserver.disconnect();
      const opacity = (selector: string) => Number.parseFloat(getComputedStyle(root.querySelector<HTMLElement>(selector)!).opacity);
      Reflect.set(window, "__homeHandoffStart", {
        logo: opacity("[data-home-flight-logo]"),
        background: opacity("[data-home-flight-background]"),
        frame: opacity("[data-home-flight-frame]"),
      });
    });
    readyObserver.observe(document, { subtree: true, attributes: true, attributeFilter: ["data-home-flight-ready"] });
    const NativeWorker = window.Worker;
    window.Worker = class extends NativeWorker {
      constructor(scriptURL: string | URL, options?: WorkerOptions) {
        super(scriptURL, options);
        this.addEventListener("message", (event: MessageEvent) => {
          if (typeof event.data?.progress === "number") workerProgress.push(event.data.progress);
        });
      }
    };
  });
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrated|server rendered html/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });
  await page.goto("/", { waitUntil: "commit" });

  const scene = page.locator("[data-home-scene]");
  const loading = scene.locator("[data-home-loading]");
  const canvas = loading.locator("canvas");

  await expect(scene).toHaveAttribute("data-home-flight-mode", "loading");
  await expect(loading).toBeVisible();
  await expect(page.locator(".site-header--home")).toHaveCSS("visibility", "hidden");
  await expect(page.locator(".site-footer")).toHaveCSS("visibility", "hidden");
  await expect(page.locator(".homeCatalogue")).toHaveCSS("visibility", "hidden");
  const viewport = page.viewportSize()!;
  const square = await scene.locator("[data-home-loading-square]").boundingBox();
  expect(square).not.toBeNull();
  const portrait = viewport.width <= 900 || viewport.width / viewport.height <= 0.8;
  const side = portrait
    ? Math.min(viewport.width * 0.56, viewport.height * 0.34)
    : Math.min(viewport.height * 0.4, viewport.width * 0.3);
  expect(square!.width).toBeCloseTo(side, 0);
  expect(square!.x + square!.width / 2).toBeCloseTo(viewport.width * (portrait ? 0.5 : 0.68), 0);
  expect(square!.y + square!.height / 2).toBeCloseTo(viewport.height * (portrait ? 0.64 : 0.63), 0);
  await expect.poll(() => canvas.evaluate((element) => {
    const context = (element as HTMLCanvasElement).getContext("2d");
    if (!context) return 0;
    const { data, width, height } = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    let paintedPixels = 0;
    for (let y = 0; y < height; y += 8) {
      for (let x = 0; x < width; x += 8) {
        if (data[(y * width + x) * 4 + 3] > 0) paintedPixels++;
      }
    }
    return paintedPixels;
  }), { timeout: 10_000 }).toBeGreaterThan(20);

  await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: 25_000 });
  const workerProgress = await page.evaluate(() => Reflect.get(window, "__homeWorkerProgress") as number[]);
  expect(workerProgress.length).toBeGreaterThan(10);
  const progressSteps = workerProgress.slice(1).map((progress, index) => progress - workerProgress[index]);
  expect(progressSteps.every((step) => step >= 0 && step <= 0.003)).toBe(true);
  await expect(scene).toHaveAttribute("data-home-flight-mode", "flight");
  await expect.poll(() => page.evaluate(() => Reflect.get(window, "__homeHandoffStart"))).toBeTruthy();
  const handoff = await page.evaluate(async () => {
    const root = document.querySelector("[data-home-scene]");
    const opacity = (selector: string) => Number.parseFloat(getComputedStyle(root?.querySelector<HTMLElement>(selector)!).opacity);
    const samples = [Reflect.get(window, "__homeHandoffStart") as { logo: number; background: number; frame: number }];
    for (let index = 0; index < 9; index++) {
      await new Promise<void>((resolve) => setTimeout(resolve, 80));
      samples.push({
        logo: opacity("[data-home-flight-logo]"),
        background: opacity("[data-home-flight-background]"),
        frame: opacity("[data-home-flight-frame]"),
      });
    }
    return samples;
  });
  expect(handoff[0].logo).toBeGreaterThan(handoff.at(-1)!.logo);
  expect(handoff[0].background).toBeLessThan(handoff.at(-1)!.background);
  expect(handoff[0].frame).toBeLessThan(handoff.at(-1)!.frame);
  expect(handoff.every((sample, index) => index === 0 || sample.logo <= handoff[index - 1].logo + 0.01)).toBe(true);
  expect(handoff.every((sample, index) => index === 0 || sample.background >= handoff[index - 1].background - 0.01)).toBe(true);
  expect(handoff.every((sample, index) => index === 0 || sample.frame >= handoff[index - 1].frame - 0.01)).toBe(true);
  await expect(page.locator(".site-header--home")).toHaveCSS("visibility", "visible");
  await expect(page.locator(".site-footer")).toHaveCSS("visibility", "visible");
  await expect(loading).toBeHidden({ timeout: 10_000 });
  expect(hydrationErrors).toEqual([]);
});
