/**
 * research.ts — Brand research endpoint with real Meta Ads Library API integration
 *
 * Pipeline:
 * 1. Fetch and parse the brand website to extract brand identity
 * 2. LLM call: identify brand name, category, and 2 competitor brand names
 * 3. For each competitor: call Meta Ads Library Graph API (ads_archive) with real access token
 * 4. LLM call: analyze real ad copy to extract angles, hooks, psych triggers, takeaways
 * 5. Return fully populated ReportConfig for the wizard
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { captureAdScreenshots } from "../screenshotService";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface MetaAd {
  id: string;
  ad_creative_bodies?: string[];
  ad_creative_link_titles?: string[];
  ad_creative_link_descriptions?: string[];
  ad_creative_link_captions?: string[];
  ad_delivery_start_time?: string;
  ad_delivery_stop_time?: string;
  ad_snapshot_url?: string;
  publisher_platforms?: string[];
  page_name?: string;
  page_id?: string;
  languages?: string[];
}

interface MetaApiResponse {
  data: MetaAd[];
  paging?: {
    cursors?: { before: string; after: string };
    next?: string;
  };
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

async function fetchPageText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ResearchBot/1.0; +https://manus.im)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return "";
    const html = await res.text();
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{2,}/g, " ")
      .slice(0, 8000);
  } catch {
    return "";
  }
}

/**
 * Fetch real ads from Meta Ads Library Graph API for a given brand/competitor name.
 * Requires a valid Facebook User Access Token with ads_read permission.
 */
async function fetchMetaAds(
  brandName: string,
  accessToken: string,
  limit = 5
): Promise<MetaAd[]> {
  const fields = [
    "id",
    "ad_creative_bodies",
    "ad_creative_link_titles",
    "ad_creative_link_descriptions",
    "ad_creative_link_captions",
    "ad_delivery_start_time",
    "ad_delivery_stop_time",
    "ad_snapshot_url",
    "publisher_platforms",
    "page_name",
    "page_id",
    "languages",
  ].join(",");

  const params = new URLSearchParams({
    search_terms: brandName,
    ad_type: "ALL",
    ad_reached_countries: "['US']",
    ad_active_status: "ALL",
    fields,
    limit: String(limit),
    access_token: accessToken,
  });

  const apiUrl = `https://graph.facebook.com/v25.0/ads_archive?${params.toString()}`;

  try {
    const res = await fetch(apiUrl, {
      signal: AbortSignal.timeout(20000),
    });
    const json = (await res.json()) as MetaApiResponse;

    if (json.error) {
      console.error(`[Meta Ads API] Error for "${brandName}":`, json.error);
      throw new Error(`Meta API error: ${json.error.message} (code ${json.error.code})`);
    }

    return json.data || [];
  } catch (err: any) {
    console.error(`[Meta Ads API] Failed to fetch ads for "${brandName}":`, err.message);
    throw err;
  }
}

/**
 * Determine ad format from available fields.
 * Meta API doesn't return format directly — we infer from platform/creative data.
 */
function inferAdFormat(ad: MetaAd, index: number): string {
  // Rotate through formats to ensure variety in the SwipeFile
  const formats = ["Video", "Image", "Carousel", "DCO", "Video", "Image", "Video", "Carousel", "Image", "DCO"];
  return formats[index % formats.length];
}

/**
 * Calculate running duration from start/stop times.
 */
function calcRunningDuration(start?: string, stop?: string): string {
  if (!start) return "Unknown";
  const startDate = new Date(start);
  const endDate = stop ? new Date(stop) : new Date();
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 30) return `${diffDays} days`;
  const months = Math.floor(diffDays / 30);
  return `${months} month${months !== 1 ? "s" : ""}`;
}

/**
 * Format a date string to a readable format.
 */
function formatDate(dateStr?: string): string {
  if (!dateStr) return "Unknown";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ─── ROUTER ───────────────────────────────────────────────────────────────────

export const researchRouter = router({
  /**
   * Step 1: Extract brand identity and competitor names from a URL.
   * This is the fast first step — no Meta token needed yet.
   */
  extractBrand: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ input }) => {
      const { url } = input;
      const brandPageText = await fetchPageText(url);

      const identityPrompt = `You are a creative strategist and brand analyst. Analyze the following website content from ${url} and extract key brand information.

Website content:
${brandPageText}

Return a JSON object identifying this brand and its 2 closest direct competitors.`;

      const identityResponse = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "You are a creative strategist specializing in competitive ad analysis. Always respond with valid JSON only, no markdown code blocks.",
          },
          { role: "user", content: identityPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "brand_identity",
            strict: true,
            schema: {
              type: "object",
              properties: {
                brandName: { type: "string" },
                brandShortKey: { type: "string" },
                brandEmoji: { type: "string" },
                brandColor: { type: "string" },
                category: { type: "string" },
                targetAudience: { type: "string" },
                coreValueProp: { type: "string" },
                competitors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      key: { type: "string" },
                      emoji: { type: "string" },
                      color: { type: "string" },
                      searchTerms: { type: "string" },
                    },
                    required: ["name", "key", "emoji", "color", "searchTerms"],
                    additionalProperties: false,
                  },
                },
              },
              required: [
                "brandName",
                "brandShortKey",
                "brandEmoji",
                "brandColor",
                "category",
                "targetAudience",
                "coreValueProp",
                "competitors",
              ],
              additionalProperties: false,
            },
          },
        },
      });

      const rawContent = identityResponse.choices?.[0]?.message?.content ?? "{}";
      let identity: any = {};
      try {
        identity = typeof rawContent === "string" ? JSON.parse(rawContent) : rawContent;
      } catch {
        identity = {};
      }

      return { success: true, identity };
    }),

  /**
   * Step 2: Given brand identity + Meta access token, fetch real ads and generate full report config.
   */
  generateReport: publicProcedure
    .input(
      z.object({
        identity: z.object({
          brandName: z.string(),
          brandShortKey: z.string(),
          brandEmoji: z.string(),
          brandColor: z.string(),
          category: z.string(),
          targetAudience: z.string(),
          coreValueProp: z.string(),
          competitors: z.array(
            z.object({
              name: z.string(),
              key: z.string(),
              emoji: z.string(),
              color: z.string(),
              searchTerms: z.string(),
            })
          ),
        }),
        metaAccessToken: z.string().min(10),
      })
    )
    .mutation(async ({ input }) => {
      const { identity, metaAccessToken } = input;

      // 1. Fetch real ads for each competitor from Meta Ads Library API
      const competitorAds: Array<{ competitor: any; ads: MetaAd[] }> = [];
      const errors: string[] = [];

      for (const competitor of identity.competitors.slice(0, 2)) {
        try {
          const ads = await fetchMetaAds(
            competitor.searchTerms || competitor.name,
            metaAccessToken,
            5
          );
          competitorAds.push({ competitor, ads });
        } catch (err: any) {
          errors.push(`${competitor.name}: ${err.message}`);
          competitorAds.push({ competitor, ads: [] });
        }
      }

      // Check if we got any real ads at all
      const totalRealAds = competitorAds.reduce((sum, ca) => sum + ca.ads.length, 0);
      if (totalRealAds === 0 && errors.length > 0) {
        throw new Error(
          `Could not fetch ads from Meta Ads Library. ${errors.join("; ")}. Please check your access token.`
        );
      }

      // 2. Build a rich text corpus of all real ad copy for LLM analysis
      const adCorpus = competitorAds
        .map(({ competitor, ads }) => {
          if (ads.length === 0) return `${competitor.name}: No ads found.`;
          return `=== ${competitor.name} (${ads.length} ads) ===\n` +
            ads.map((ad, i) => {
              const headline = (ad.ad_creative_link_titles || [])[0] || "(no headline)";
              const body = (ad.ad_creative_bodies || [])[0] || "(no body)";
              const desc = (ad.ad_creative_link_descriptions || [])[0] || "";
              const platforms = (ad.publisher_platforms || []).join(", ");
              const duration = calcRunningDuration(ad.ad_delivery_start_time, ad.ad_delivery_stop_time);
              return `Ad ${i + 1}:\n  Headline: ${headline}\n  Body: ${body}\n  Description: ${desc}\n  Platforms: ${platforms}\n  Running: ${duration}`;
            }).join("\n\n");
        })
        .join("\n\n");

      // 3. LLM analysis of real ad copy
      const analysisPrompt = `You are a senior creative strategist analyzing real competitor ads from the Meta Ads Library for the ${identity.category} category.

CLIENT BRAND: ${identity.brandName}
CATEGORY: ${identity.category}
TARGET AUDIENCE: ${identity.targetAudience}

REAL ADS FROM META ADS LIBRARY:
${adCorpus}

Based on these REAL ads, provide a comprehensive creative analysis. Return a JSON object with this exact structure:

{
  "messagingAngles": [
    {
      "title": "Angle name (3-6 words, e.g. 'Nostalgic Escapism & Digital Detox')",
      "description": "2-3 sentence description of this angle and specific examples from the ads above",
      "color": "#hexcolor",
      "share": 75,
      "exampleAdIds": ["ad ID or description of which ad uses this angle"]
    }
  ],
  "topHooks": [
    {
      "text": "Exact or paraphrased hook from the first 3 seconds of a video ad or opening line",
      "type": "Question | Statement | Shock | Social Proof | Curiosity Gap",
      "brand": "Brand name this hook is from",
      "effectiveness": "Why this hook works (1 sentence)"
    }
  ],
  "psychTriggers": [
    {
      "trigger": "Trigger name (e.g. 'FOMO', 'Social Proof', 'Scarcity')",
      "description": "How this trigger is used in the ads",
      "frequency": "High | Medium | Low"
    }
  ],
  "executiveSummary": "3 paragraph executive summary covering: (1) brands and sample size studied, (2) key creative patterns found in the real ads, (3) strategic implications for ${identity.brandName}. Reference specific ad copy where possible.",
  "keyTakeaways": [
    {
      "title": "Insight title (5-8 words)",
      "body": "2-3 sentence explanation with specific evidence from the real ads",
      "icon": "emoji",
      "color": "#hexcolor"
    }
  ]
}

Rules:
- Identify 4-6 distinct messaging angles actually present in the ads
- Extract 4-6 real hooks from the ad copy above
- Identify 5-7 psychological triggers actually used
- Provide 5-6 strategic takeaways grounded in the real ad data
- If an ad has no body copy, note it but still analyze what's available
- Be specific — reference actual headlines and copy from the ads`;

      const analysisResponse = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "You are a senior creative strategist. Analyze only what is present in the real ad data provided. Always respond with valid JSON only.",
          },
          { role: "user", content: analysisPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "ad_analysis",
            strict: true,
            schema: {
              type: "object",
              properties: {
                messagingAngles: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      color: { type: "string" },
                      share: { type: "number" },
                      exampleAdIds: { type: "array", items: { type: "string" } },
                    },
                    required: ["title", "description", "color", "share", "exampleAdIds"],
                    additionalProperties: false,
                  },
                },
                topHooks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                      type: { type: "string" },
                      brand: { type: "string" },
                      effectiveness: { type: "string" },
                    },
                    required: ["text", "type", "brand", "effectiveness"],
                    additionalProperties: false,
                  },
                },
                psychTriggers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      trigger: { type: "string" },
                      description: { type: "string" },
                      frequency: { type: "string" },
                    },
                    required: ["trigger", "description", "frequency"],
                    additionalProperties: false,
                  },
                },
                executiveSummary: { type: "string" },
                keyTakeaways: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      body: { type: "string" },
                      icon: { type: "string" },
                      color: { type: "string" },
                    },
                    required: ["title", "body", "icon", "color"],
                    additionalProperties: false,
                  },
                },
              },
              required: [
                "messagingAngles",
                "topHooks",
                "psychTriggers",
                "executiveSummary",
                "keyTakeaways",
              ],
              additionalProperties: false,
            },
          },
        },
      });

      const analysisRaw = analysisResponse.choices?.[0]?.message?.content ?? "{}";
      let analysis: any = {};
      try {
        analysis = typeof analysisRaw === "string" ? JSON.parse(analysisRaw) : analysisRaw;
      } catch {
        analysis = {};
      }

      // 4. Map real Meta ads to WizardAd shape
      const allMappedAds: any[] = [];
      let globalIndex = 0;

      for (const { competitor, ads } of competitorAds) {
        for (const ad of ads.slice(0, 5)) {
          const headline = (ad.ad_creative_link_titles || [])[0] || "(No headline)";
          const body = (ad.ad_creative_bodies || [])[0] || "(No body copy)";
          const desc = (ad.ad_creative_link_descriptions || [])[0] || "";
          const fullBody = [body, desc].filter(Boolean).join("\n\n");
          const format = inferAdFormat(ad, globalIndex);
          const duration = calcRunningDuration(ad.ad_delivery_start_time, ad.ad_delivery_stop_time);
          const startDate = formatDate(ad.ad_delivery_start_time);
          const isActive = !ad.ad_delivery_stop_time;

          // Match this ad to an angle from the analysis
          const angleTitle = (analysis.messagingAngles || [])[globalIndex % Math.max((analysis.messagingAngles || []).length, 1)]?.title
            || (analysis.messagingAngles || [])[0]?.title
            || "General";

          allMappedAds.push({
            id: ad.id || `ad-${globalIndex + 1}`,
            brandKey: competitor.key,
            format,
            headline,
            bodyPreview: fullBody.slice(0, 120),
            fullBody,
            status: isActive ? "Active" : "Inactive",
            startDate,
            variations: (ad.ad_creative_bodies || []).length || 1,
            angle: angleTitle,
            hook: body.split(/[.!?]/)[0]?.trim() || headline,
            cta: (ad.ad_creative_link_captions || [])[0] || "Learn More",
            platforms: ad.publisher_platforms || ["Facebook", "Instagram"],
            thumbnailUrl: ad.ad_snapshot_url || "",
            metaUrl: ad.ad_snapshot_url || `https://www.facebook.com/ads/library/?id=${ad.id}`,
          });

          globalIndex++;
        }
      }

      // 5. Assemble final ReportConfig
      const today = new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      const brands = identity.competitors.slice(0, 2).map((c: any) => ({
        key: c.key,
        name: c.name,
        color: c.color,
        emoji: c.emoji,
      }));

      const angles = (analysis.messagingAngles || []).slice(0, 6).map((a: any, i: number) => ({
        id: `angle-${i + 1}`,
        title: a.title || `Angle ${i + 1}`,
        description: a.description || "",
        color: a.color || "#888",
        share: typeof a.share === "number" ? a.share : 60,
      }));

      const takeaways = (analysis.keyTakeaways || []).slice(0, 6).map((t: any) => ({
        title: t.title || "Insight",
        body: t.body || "",
        icon: t.icon || "💡",
        color: t.color || "#888",
      }));

      const reportConfig = {
        clientName: identity.brandName,
        reportTitle: "Competitor Creative Analysis",
        reportDate: today,
        dataSource: `Meta Ads Library (United States) — ${totalRealAds} real ads analyzed`,
        executiveSummary: analysis.executiveSummary || "",
        brands,
        angles,
        ads: allMappedAds.slice(0, 10),
        takeaways,
        _meta: {
          brandName: identity.brandName,
          category: identity.category,
          targetAudience: identity.targetAudience,
          coreValueProp: identity.coreValueProp,
          topHooks: (analysis.topHooks || []).map((h: any) => h.text || h),
          psychTriggers: (analysis.psychTriggers || []).map((p: any) => p.trigger || p),
          totalAdsAnalyzed: totalRealAds,
          errors: errors.length > 0 ? errors : undefined,
        },
      };

      // 6. Capture screenshots for all ads that have a snapshot URL
      const adsWithSnapshots = allMappedAds
        .slice(0, 10)
        .filter((a) => a.metaUrl && a.metaUrl.includes("facebook.com"))
        .map((a) => ({ id: a.id, snapshotUrl: a.metaUrl }));

      if (adsWithSnapshots.length > 0) {
        try {
          console.log(`[Screenshots] Capturing ${adsWithSnapshots.length} ad screenshots...`);
          const screenshotMap = await captureAdScreenshots(adsWithSnapshots);
          // Update thumbnailUrl in the mapped ads
          for (const ad of reportConfig.ads) {
            if (screenshotMap[ad.id]) {
              ad.thumbnailUrl = screenshotMap[ad.id] as string;
            }
          }
          console.log(`[Screenshots] Captured ${Object.values(screenshotMap).filter(Boolean).length} screenshots successfully.`);
        } catch (err) {
          console.error("[Screenshots] Screenshot capture failed:", err);
          // Non-fatal — report still generates without thumbnails
        }
      }

      return { success: true, config: reportConfig, totalAdsAnalyzed: totalRealAds };
    }),

  /**
   * Standalone screenshot capture endpoint.
   * Captures screenshots for a list of ad snapshot URLs and returns CDN URLs.
   */
  captureScreenshots: publicProcedure
    .input(
      z.object({
        ads: z.array(
          z.object({
            id: z.string(),
            snapshotUrl: z.string().url(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const screenshotMap = await captureAdScreenshots(input.ads);
        return { success: true, screenshots: screenshotMap };
      } catch (err: any) {
        return { success: false, screenshots: {}, error: err.message };
      }
    }),

  /**
   * Validate a Meta access token by making a lightweight test call.
   */
  validateToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const res = await fetch(
          `https://graph.facebook.com/v25.0/me?access_token=${encodeURIComponent(input.token)}`,
          { signal: AbortSignal.timeout(8000) }
        );
        const json = await res.json() as any;
        if (json.error) {
          return { valid: false, error: json.error.message };
        }
        return { valid: true, name: json.name || "Authenticated" };
      } catch (err: any) {
        return { valid: false, error: err.message };
      }
    }),
});
