import { Page } from "@playwright/test";

// Capture a screenshot only when SCREENSHOT_DIR is set (the validate script sets it
// for `--update-screenshots` runs). In normal validation / CI it is a no-op, so CI
// never rewrites committed screenshots — refreshing them is an explicit local action.
export async function shot(page: Page, name: string): Promise<void> {
  const dir = process.env.SCREENSHOT_DIR;
  if (!dir) return;
  await page.screenshot({ path: `${dir}/${name}.png` });
}
