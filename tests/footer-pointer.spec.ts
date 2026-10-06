import { expect, test } from "@playwright/test";

test("footer spotlight tracks the cursor horizontally while staying anchored to the RekanMU wordmark", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 820);
  await page.goto("/businesses");

  const footer = page.locator(".site-footer");
  const button = footer.locator(".cta");
  const spot = footer.locator(".site-footer__points--spot");
  await footer.scrollIntoViewIfNeeded();

  const footerBox = await footer.boundingBox();
  const buttonBox = await button.boundingBox();
  expect(footerBox).not.toBeNull();
  expect(buttonBox).not.toBeNull();

  await page.mouse.move(buttonBox!.x + buttonBox!.width / 2, buttonBox!.y + buttonBox!.height / 2);
  await expect(footer).toHaveAttribute("data-footer-spot-active", "");
  await expect.poll(() => spot.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");

  const wordmarkAnchor = await footer.evaluate((element) => {
    const footerBox = element.getBoundingClientRect();
    const wordmarkBox = element.querySelector(".site-footer__wordmark")!.getBoundingClientRect();
    return ((wordmarkBox.top + wordmarkBox.height / 2 - footerBox.top) / footerBox.height) * 100;
  });

  await page.mouse.move(footerBox!.x + footerBox!.width * 0.8, footerBox!.y + footerBox!.height * 0.62, { steps: 12 });
  await expect(footer).toHaveAttribute("data-footer-spot-active", "");
  await expect.poll(() => spot.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");

  const firstPosition = await footer.evaluate((element) => {
    const spotStyle = getComputedStyle(element.querySelector(".site-footer__points--spot")!);
    return {
      y: Number.parseFloat(getComputedStyle(element).getPropertyValue("--footer-y")),
      transition: getComputedStyle(element).transition,
      opacityTransition: spotStyle.transition,
      mask: spotStyle.maskImage,
      size: spotStyle.maskSize,
      clip: spotStyle.clipPath,
    };
  });

  await page.mouse.move(footerBox!.x + footerBox!.width * 0.2, footerBox!.y + footerBox!.height - 1, { steps: 12 });
  await expect.poll(() => footer.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).getPropertyValue("--footer-x")),
  )).toBeLessThan(30);
  const secondPosition = await footer.evaluate((element) => ({
    x: Number.parseFloat(getComputedStyle(element).getPropertyValue("--footer-x")),
    y: Number.parseFloat(getComputedStyle(element).getPropertyValue("--footer-y")),
  }));

  expect(firstPosition.y).toBeCloseTo(wordmarkAnchor, 0);
  expect(secondPosition.y).toBeCloseTo(wordmarkAnchor, 0);
  expect(firstPosition.y).toBeCloseTo(secondPosition.y, 2);
  expect(secondPosition.x).toBeLessThan(30);
  expect(firstPosition.transition).toContain("0.3s");
  expect(firstPosition.opacityTransition).toContain("0.3s");
  expect(firstPosition.mask).toContain("radial-gradient(46% 72% at");
  expect(firstPosition.size).toBe("100% 100%");
  expect(firstPosition.clip).toBe("none");
});

test("mobile footer shares the desktop surface and keeps its spotlight on the wordmark", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) > 560);
  await page.goto("/");

  const footer = page.locator(".site-footer");
  await footer.scrollIntoViewIfNeeded();
  const button = footer.locator(".cta");
  const footerBox = await footer.boundingBox();
  const buttonBox = await button.boundingBox();
  expect(footerBox).not.toBeNull();
  expect(buttonBox).not.toBeNull();

  const appearance = await footer.evaluate((element) => {
    const footerBox = element.getBoundingClientRect();
    const wordmarkBox = element.querySelector(".site-footer__wordmark")!.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      x: footerBox.x,
      width: footerBox.width,
      background: style.backgroundColor,
      borderWidth: style.borderTopWidth,
      borderRadius: style.borderTopLeftRadius,
      columns: getComputedStyle(element.querySelector(".site-footer__content")!).gridTemplateColumns,
      dotPitch: Number.parseFloat(getComputedStyle(element.querySelector(".site-footer__points--base")!).backgroundSize),
      dotImage: getComputedStyle(element.querySelector(".site-footer__points--base")!).backgroundImage,
      wordmarkY: ((wordmarkBox.top + wordmarkBox.height / 2 - footerBox.top) / footerBox.height) * 100,
    };
  });

  await page.mouse.move(buttonBox!.x + buttonBox!.width / 2, buttonBox!.y + buttonBox!.height / 2);
  const firstY = await footer.evaluate((element) => Number.parseFloat((element as HTMLElement).style.getPropertyValue("--footer-y")));
  await page.mouse.move(footerBox!.x + footerBox!.width / 2, footerBox!.y + footerBox!.height - 1);
  const secondY = await footer.evaluate((element) => Number.parseFloat((element as HTMLElement).style.getPropertyValue("--footer-y")));

  expect(appearance.x).toBe(0);
  expect(appearance.width).toBe(page.viewportSize()!.width);
  expect(appearance.background).toBe("rgba(0, 0, 0, 0)");
  expect(appearance.borderWidth).toBe("0px");
  expect(appearance.borderRadius).toBe("0px");
  expect(appearance.columns.trim().split(/\s+/)).toHaveLength(1);
  expect(appearance.dotPitch).toBeGreaterThanOrEqual(2);
  expect(appearance.dotImage).toContain("0.5px");
  expect(firstY).toBeCloseTo(appearance.wordmarkY, 0);
  expect(secondY).toBeCloseTo(appearance.wordmarkY, 0);
});
