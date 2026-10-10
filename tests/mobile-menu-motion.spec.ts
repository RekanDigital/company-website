import { expect, test } from "@playwright/test";

for (const locale of ["en", "id"] as const) {
  test(`${locale}: mobile menu animates open, closed, and reopened`, async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) > 820);
    await page.goto(locale === "en" ? "/" : "/id");
    await page.evaluate(() => document.fonts.ready);

    const trigger = page.getByRole("button", { name: "Menu", exact: true });
    const dialog = page.locator("#site-menu");
    const panel = dialog.locator(".site-menu__panel");
    const close = dialog.getByRole("button", { name: locale === "en" ? "Close" : "Tutup" });

    await trigger.click();
    await expect(dialog).toBeVisible();
    await expect.poll(() => panel.evaluate((element) => element.getBoundingClientRect().left)).toBe(0);
    expect(await panel.evaluate((element) => getComputedStyle(element).transitionDuration)).toContain("0.76s");

    await close.click();
    await expect(dialog).toHaveClass(/is-closing/);
    await expect(dialog).toHaveAttribute("open", "");
    await expect(dialog).not.toBeVisible({ timeout: 2_000 });
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(dialog).toBeVisible();
    await expect.poll(() => panel.evaluate((element) => element.getBoundingClientRect().left)).toBe(0);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveClass(/is-closing/);
    await expect(dialog).not.toBeVisible({ timeout: 2_000 });
    await expect(trigger).toBeFocused();
  });
}

test("mobile menu still closes if the closing transition cannot emit transitionend", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) > 820);
  await page.goto("/");
  await page.addStyleTag({ content: "@media (max-width: 820px) { .site-menu__panel { transition: opacity .62s !important; } }" });

  const trigger = page.getByRole("button", { name: "Menu", exact: true });
  const dialog = page.locator("#site-menu");
  await trigger.click();
  await expect(dialog).toHaveClass(/is-visible/);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveClass(/is-closing/);
  await expect(dialog).not.toHaveAttribute("open", "", { timeout: 1_000 });
});

test("mobile menu closes immediately with reduced motion", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) > 820);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Menu", exact: true });
  const dialog = page.locator("#site-menu");

  await trigger.click();
  await expect(dialog).toBeVisible();
  expect(await dialog.locator(".site-menu__panel").evaluate((element) => getComputedStyle(element).transitionDuration)).toBe("0s");
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
