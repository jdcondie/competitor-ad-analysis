/**
 * screenshotService.ts
 * Captures screenshots of Meta Ads Library ad snapshot pages using Playwright.
 * Uploads the captured image to S3 CDN and returns a public URL.
 */

import { chromium } from "playwright-core";
import { storagePut } from "./storage";

const CHROMIUM_PATH = "/usr/bin/chromium-browser";

/**
 * Captures a screenshot of a Meta Ads Library ad snapshot URL.
 * Waits for the ad creative to render, then crops to the ad card area.
 * Returns a CDN URL for the uploaded screenshot.
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
      ],
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      locale: "en-US",
    });

    const page = await context.newPage();

    // Block unnecessary resources to speed up load
    await page.route("**/*.{woff,woff2,ttf,otf}", (route) => route.abort());

    await page.goto(snapshotUrl, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    // Wait for the ad creative container to appear
    // Meta Ads Library snapshot pages render the ad inside an iframe or a specific div
    await page.waitForTimeout(3000);

    // Try to find the ad creative element — Meta uses different selectors
    let screenshotBuffer: Buffer | null = null;

    // Strategy 1: Look for the main ad card container
    const adCardSelectors = [
      '[data-testid="ad-archive-preview"]',
      ".x1lliihq", // Meta's ad preview class
      "._8jh2",
      "._7jyr",
      '[role="main"]',
    ];

    for (const selector of adCardSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const box = await element.boundingBox();
          if (box && box.width > 100 && box.height > 100) {
            screenshotBuffer = await element.screenshot({
              type: "jpeg",
              quality: 85,
            }) as Buffer;
            break;
          }
        }
      } catch {
        // Try next selector
      }
    }

    // Strategy 2: Screenshot the full page viewport if no specific element found
    if (!screenshotBuffer) {
      // Scroll to top and take a viewport screenshot
      await page.evaluate(() => window.scrollTo(0, 0));
      screenshotBuffer = await page.screenshot({
        type: "jpeg",
        quality: 85,
        clip: { x: 0, y: 0, width: 600, height: 700 },
      }) as Buffer;
    }

    if (!screenshotBuffer || screenshotBuffer.length < 5000) {
      // Screenshot too small — likely a blank/error page
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
      await browser.close();
    }
  }
}

/**
 * Captures screenshots for multiple ads in parallel (max 3 concurrent).
 * Returns a map of adId -> CDN URL (or null if capture failed).
 */
export async function captureAdScreenshots(
  ads: Array<{ id: string; snapshotUrl: string }>
): Promise<Record<string, string | null>> {
  const results: Record<string, string | null> = {};

  // Process in batches of 3 to avoid overwhelming the server
  const batchSize = 3;
  for (let i = 0; i < ads.length; i += batchSize) {
    const batch = ads.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (ad) => {
        const url = await captureAdSnapshot(ad.snapshotUrl, ad.id);
        return { id: ad.id, url };
      })
    );
    for (const { id, url } of batchResults) {
      results[id] = url;
    }
  }

  return results;
}
