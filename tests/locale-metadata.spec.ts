import { test, expect } from "@playwright/test";

import { homeSceneCopy } from "../src/content/home";
import { pageHeroes, pagePaths } from "../src/content/pages";
import { localizeHref } from "../src/content/site";

for (const locale of ["en", "id"] as const) {
  test(`${locale}: every static route has localized metadata`, async ({ page }) => {
    expect(pagePaths).toHaveLength(11);

    for (const path of pagePaths) {
      const response = await page.goto(localizeHref(path, locale));
      expect(response?.status(), `${locale} ${path}`).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);

      const hero = pageHeroes[path][locale];
      const heading = `${hero.title.solid} ${hero.title.point}`;
      const expectedTitle = heading.endsWith("RekanMU") ? heading : `${heading} | RekanMU`;
      await expect(page).toHaveTitle(expectedTitle);

      const description = path === "/" ? homeSceneCopy[locale].positioning : hero.lead;
      const descriptionTag = page.locator('meta[name="description"]');
      if (description) {
        await expect(descriptionTag).toHaveAttribute("content", description);
      } else {
        await expect(descriptionTag).toHaveCount(0);
      }

      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, nofollow",
      );
    }
  });
}
