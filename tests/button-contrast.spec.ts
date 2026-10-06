import { test, expect } from "@playwright/test";

test("button hover and keyboard focus use the approved accessible sweep blue", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const button = page.locator(".cta").first();
  for (const state of ["hover", "focus"] as const) {
    if (state === "hover") await button.hover();
    else {
      await page.mouse.move(0, 0);
      await button.focus();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      await expect(button).toBeFocused();
    }
    const colors = await button.evaluate((element) => ({
      text: getComputedStyle(element).color,
      sweep: getComputedStyle(element, "::before").backgroundColor,
      border: getComputedStyle(element).borderTopColor,
      brand: getComputedStyle(element).getPropertyValue("--blue").trim(),
    }));
    expect(colors.sweep, state).toBe("rgb(48, 119, 199)");
    expect(colors.border, state).toBe(colors.sweep);
    expect(colors.text, state).toBe("rgb(255, 255, 255)");
    expect(colors.brand.toLowerCase()).toBe("#3179cb");
    const luminance = colors.sweep.match(/\d+/g)!.map(Number).map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
    expect(1.05 / (luminance + 0.05), state).toBeGreaterThanOrEqual(4.5);
  }
});
