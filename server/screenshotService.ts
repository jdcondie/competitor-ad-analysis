/**
 * screenshotService.ts
 * Captures screenshots of Meta Ads Library ad snapshot pages using Playwright.
 * Targets the actual ad creative image/video thumbnail, not the full page.
 * Uploads the captured image to S3 CDN and returns a public URL.
 */

import { chromium } from "playwright-core";
import { storagePut } from "./storage";

const CHROMIUM_PATH = "/usr/bin/chromium-browser";

/**
 * Captures a screenshot of a Meta Ads Library ad snapshot URL.
 * Specifically targets the ad creative image/video element for a clean thumbnail.
 * Returns a CDN URL for the uploaded screenshot, or null on failure.
 */
export async function captureAdSnapshot(
  snapshotUrl: string,
  adId: string
): Promise<string | null> {
  let browser = null;
  try {
    browser = await chromium.launch({
      executablePath: CHROMIUM_PATH,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-extensions",
        "--disable-background-networking",
        "--disable-default-apps",
      ],
    });

    const context = await browser.newContext({
      viewport: { width: 500, height: 800 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      locale: "en-US",
    });

    const page = await context.newPage();

    // Block fonts and tracking to speed up load
    await page.route("**/*.{woff,woff2,ttf,otf}", (route) => route.abort());
    await page.route("**/analytics*", (route) => route.abort());
    await page.route("**/pixel*", (route) => route.abort());

    await page.goto(snapshotUrl, {
      waitUntil: "domcontentloaded",
      timeout: 25000,
    });

    // Wait for images to load
    await page.waitForTimeout(4000);

    let screenshotBuffer: Buffer | null = null;

    // Strategy 1: Find the actual ad creative image element
    // Meta renders the ad creative in an img tag inside the ad preview container
    const creativeImageSelectors = [
      // Direct image inside the ad preview
      "img[src*='fbcdn.net']",
      "img[src*='fbsbx.com']",
      "img[src*='cdninstagram.com']",
      // Meta ad preview containers
      '[data-testid="ad-archive-preview"] img',
      '[data-testid="ad-archive-preview"]',
      // Video thumbnail
      "video",
      // Fallback containers
      "._7jyr img",
      "._8jh2 img",
      ".x1lliihq img",
    ];

    for (const selector of creativeImageSelectors) {
      try {
        const elements = await page.$$(selector);
        for (const element of elements) {
          const box = await element.boundingBox();
          if (box && box.width >= 200 && box.height >= 150) {
            screenshotBuffer = (await element.screenshot({
              type: "jpeg",
              quality: 90,
            })) as Buffer;
            if (screenshotBuffer && screenshotBuffer.length > 10000) {
              break;
            }
            screenshotBuffer = null;
          }
        }
        if (screenshotBuffer) break;
      } catch {
        // Try next selector
      }
    }

    // Strategy 2: Screenshot the ad preview area (top portion of page where creative appears)
    if (!screenshotBuffer) {
      try {
        // The ad creative typically appears in the top 500px of the snapshot page
        screenshotBuffer = (await page.screenshot({
          type: "jpeg",
          quality: 88,
          clip: { x: 0, y: 0, width: 500, height: 500 },
        })) as Buffer;
      } catch {
        // ignore
      }
    }

    // Strategy 3: Full page screenshot as last resort
    if (!screenshotBuffer || screenshotBuffer.length < 8000) {
      await page.evaluate(() => window.scrollTo(0, 0));
      screenshotBuffer = (await page.screenshot({
        type: "jpeg",
        quality: 85,
        clip: { x: 0, y: 0, width: 500, height: 600 },
      })) as Buffer;
    }

    if (!screenshotBuffer || screenshotBuffer.length < 5000) {
      return null;
    }

    // Upload to S3 CDN
    const fileKey = `ad-screenshots/${adId}-${Date.now()}.jpg`;
    const { url } = await storagePut(fileKey, screenshotBuffer, "image/jpeg");

    return url;
  } catch (error) {
    console.error(`[Screenshot] Failed to capture ${snapshotUrl}:`, error);
    return null;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

/**
 * Captures screenshots for multiple ads sequentially (to avoid memory issues).
 * Returns a map of adId -> CDN URL (or null if capture failed).
 */
export async function captureAdScreenshots(
  ads: Array<{ id: string; snapshotUrl: string }>
): Promise<Record<string, string | null>> {
  const results: Record<string, string | null> = {};

  // Process sequentially to avoid memory pressure from multiple Chromium instances
  for (const ad of ads) {
    try {
      const url = await captureAdSnapshot(ad.snapshotUrl, ad.id);
      results[ad.id] = url;
    } catch {
      results[ad.id] = null;
    }
  }

  return results;
}
