import { expect, test } from "@playwright/test";

test.use({ hasTouch: true });

for (const base of ["", "/id"]) {
  test(`${base || "en"}: dark flight menu stays visible and responds to touch`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "desktop");
    test.setTimeout(120_000);
    await page.goto(base || "/");
    const scene = page.locator("[data-home-scene]");
    await expect(scene).toHaveAttribute("data-home-flight-ready", "true", { timeout: 40_000 });
    await page.evaluate(() => {
      const sequence = document.querySelector<HTMLElement>("[data-home-flight-sequence]")!;
      const stage = document.querySelector<HTMLElement>("[data-home-flight-stage]")!;
      window.scrollTo({ top: (sequence.offsetHeight - stage.offsetHeight) * 0.53, behavior: "instant" });
    });
    await expect(scene.locator("[data-home-flight-chapter]").nth(4)).toBeVisible({ timeout: 60_000 });
    await expect(page.locator(".site-header")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    const trigger = page.getByRole("button", { name: "Menu", exact: true });
    await expect(trigger.locator(".site-menu-toggle > span").first()).toHaveCSS("background-color", "rgb(246, 248, 250)");
    await trigger.tap();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("flight-menu.png") });
    await dialog.getByRole("link", { name: base ? "Tentang" : "About", exact: true }).tap();
    await expect(page).toHaveURL(`${base}/about`, { timeout: 30_000 });
    await expect(dialog).not.toBeVisible();
  });
}
