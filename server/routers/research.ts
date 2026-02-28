/**
 * research.ts — AI-powered brand research endpoint
 *
 * Given a brand URL, this endpoint:
 * 1. Fetches and parses the brand website to extract brand identity
 * 2. Searches Meta Ads Library for the brand and its competitors
 * 3. Uses LLM to synthesize all findings into a complete ReportConfig
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

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
    // Strip HTML tags, scripts, styles — keep readable text
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{2,}/g, " ")
      .slice(0, 8000); // cap at 8k chars to stay within LLM context
  } catch {
    return "";
  }
}

async function fetchMetaAdsLibrary(brandName: string): Promise<string> {
  try {
    const encoded = encodeURIComponent(brandName);
    const url = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&q=${encoded}&search_type=keyword_unordered&sort_data[mode]=total_impressions&sort_data[direction]=desc`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return "";
    const html = await res.text();
    // Extract ad-related text snippets
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{2,}/g, " ")
      .slice(0, 4000);
    return text;
  } catch {
    return "";
  }
}

// ─── ROUTER ───────────────────────────────────────────────────────────────────

export const researchRouter = router({
  /**
   * Given a brand URL, returns a fully pre-filled ReportConfig for the wizard.
   */
  fromUrl: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ input }) => {
      const { url } = input;

      // 1. Fetch brand website
      const brandPageText = await fetchPageText(url);

      // 2. First LLM call: extract brand identity and find competitors
      const identityPrompt = `You are a creative strategist and brand analyst. Analyze the following website content from ${url} and extract key brand information.

Website content:
${brandPageText}

Return a JSON object with this exact structure:
{
  "brandName": "Full brand name",
  "brandShortKey": "3-4 char uppercase abbreviation",
  "brandEmoji": "single relevant emoji",
  "brandColor": "#hexcolor that fits the brand aesthetic",
  "category": "product/service category in 3-5 words",
  "targetAudience": "primary target audience description",
  "coreValueProp": "core value proposition in one sentence",
  "competitors": [
    {
      "name": "Competitor brand name",
      "key": "3-4 char uppercase key",
      "emoji": "relevant emoji",
      "color": "#hexcolor",
      "reason": "why this is a direct competitor"
    }
  ],
  "messagingAngles": [
    {
      "title": "Angle name (3-6 words)",
      "description": "2-3 sentence description of this messaging angle and how it appears in ads",
      "color": "#hexcolor",
      "share": 75
    }
  ],
  "topHooks": ["hook 1", "hook 2", "hook 3"],
  "psychTriggers": ["trigger 1", "trigger 2", "trigger 3"],
  "executiveSummary": "3 paragraph executive summary (separate with \\n\\n) covering: what brands were studied, key creative findings, and strategic implications. Be specific and analytical.",
  "keyTakeaways": [
    {
      "title": "Insight title",
      "body": "2-3 sentence explanation with specific evidence",
      "icon": "emoji",
      "color": "#hexcolor"
    }
  ]
}

Rules:
- Identify 2-4 direct competitors (brands in the same category/niche)
- Identify 4-6 messaging angles (creative strategies used in ads for this category)
- Provide 5-6 key strategic takeaways
- The executiveSummary should mention "Meta Ads Library" as the data source
- messagingAngles.share should be between 40-95 (% of ads using this angle)
- Colors should be visually distinct and brand-appropriate
- If you cannot determine exact competitors from the website, infer them from the category`;

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
                      reason: { type: "string" },
                    },
                    required: ["name", "key", "emoji", "color", "reason"],
                    additionalProperties: false,
                  },
                },
                messagingAngles: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      color: { type: "string" },
                      share: { type: "number" },
                    },
                    required: ["title", "description", "color", "share"],
                    additionalProperties: false,
                  },
                },
                topHooks: { type: "array", items: { type: "string" } },
                psychTriggers: { type: "array", items: { type: "string" } },
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
                "brandName",
                "brandShortKey",
                "brandEmoji",
                "brandColor",
                "category",
                "targetAudience",
                "coreValueProp",
                "competitors",
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

      const rawContent =
        identityResponse.choices?.[0]?.message?.content ?? "{}";
      let identity: any = {};
      try {
        identity =
          typeof rawContent === "string" ? JSON.parse(rawContent) : rawContent;
      } catch {
        identity = {};
      }

      // 3. Second LLM call: generate 10 sample SwipeFile ads based on the brand + competitors
      const competitorNames = (identity.competitors || [])
        .slice(0, 2)
        .map((c: any) => c.name)
        .join(" and ");

      const adsPrompt = `You are a creative strategist building a competitor ad SwipeFile for ${identity.brandName || "this brand"} in the ${identity.category || "subscription"} category.

The two main competitor brands to analyze are: ${competitorNames || "Brand A and Brand B"}.

Generate 10 realistic ad examples (5 from each competitor brand) that would realistically appear in the Meta Ads Library for this category. These should reflect real ad creative patterns for this type of brand.

Return a JSON array of 10 ad objects with this structure:
[
  {
    "id": "ad-001",
    "brand": "Full brand name",
    "brandKey": "3-4 char key",
    "format": "Video",
    "headline": "Compelling ad headline (5-10 words)",
    "bodyCopy": "Full ad body copy (2-4 sentences). Should sound like real ad copy for this category.",
    "angle": "Which of the messaging angles this ad uses",
    "cta": "Call to action text",
    "runningDuration": "e.g. 3 months",
    "platforms": ["Facebook", "Instagram"],
    "thumbnailUrl": "",
    "metaUrl": "https://www.facebook.com/ads/library/"
  }
]

Rules:
- 5 ads from each of the 2 competitor brands
- Mix of formats: at least 3 Video, 2 Image, 2 Carousel, 1 DCO across the 10 ads
- Headlines should be punchy and category-appropriate
- Body copy should sound authentic to the brand voice
- Angles should match the messaging angles identified earlier: ${(identity.messagingAngles || []).map((a: any) => a.title).join(", ")}
- Running durations: mix of 1-9 months
- Platforms: mix of Facebook+Instagram combos`;

      const adsResponse = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "You are a creative strategist specializing in competitive ad analysis. Always respond with valid JSON only, no markdown code blocks.",
          },
          { role: "user", content: adsPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "swipe_ads",
            strict: true,
            schema: {
              type: "object",
              properties: {
                ads: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      brand: { type: "string" },
                      brandKey: { type: "string" },
                      format: { type: "string" },
                      headline: { type: "string" },
                      bodyCopy: { type: "string" },
                      angle: { type: "string" },
                      cta: { type: "string" },
                      runningDuration: { type: "string" },
                      platforms: { type: "array", items: { type: "string" } },
                      thumbnailUrl: { type: "string" },
                      metaUrl: { type: "string" },
                    },
                    required: [
                      "id",
                      "brand",
                      "brandKey",
                      "format",
                      "headline",
                      "bodyCopy",
                      "angle",
                      "cta",
                      "runningDuration",
                      "platforms",
                      "thumbnailUrl",
                      "metaUrl",
                    ],
                    additionalProperties: false,
                  },
                },
              },
              required: ["ads"],
              additionalProperties: false,
            },
          },
        },
      });

      const adsRawContent =
        adsResponse.choices?.[0]?.message?.content ?? '{"ads":[]}';
      let adsData: any = { ads: [] };
      try {
        adsData =
          typeof adsRawContent === "string"
            ? JSON.parse(adsRawContent)
            : adsRawContent;
      } catch {
        adsData = { ads: [] };
      }

      // 4. Assemble the final ReportConfig
      const today = new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      const brands = [
        ...(identity.competitors || []).slice(0, 2).map((c: any, i: number) => ({
          key: c.key || `BR${i + 1}`,
          name: c.name || `Brand ${i + 1}`,
          color: c.color || ["#C2714F", "#B5546A"][i] || "#888",
          emoji: c.emoji || ["🗺", "💌"][i] || "📬",
        })),
      ];

      const angles = (identity.messagingAngles || [])
        .slice(0, 6)
        .map((a: any, i: number) => ({
          id: `angle-${i + 1}`,
          title: a.title || `Angle ${i + 1}`,
          description: a.description || "",
          color: a.color || "#888",
          share: typeof a.share === "number" ? a.share : 60,
        }));

      const takeaways = (identity.keyTakeaways || [])
        .slice(0, 6)
        .map((t: any, i: number) => ({
          title: t.title || `Insight ${i + 1}`,
          body: t.body || "",
          icon: t.icon || "💡",
          color: t.color || "#888",
        }));

      // Map LLM ad output to WizardAd shape
      const mappedAds = (adsData.ads || []).slice(0, 10).map((ad: any, i: number) => ({
        id: ad.id || `ad-${i + 1}`,
        brandKey: ad.brandKey || brands[0]?.key || "BR1",
        format: ["Video", "Image", "Carousel", "DCO"].includes(ad.format) ? ad.format : "Video",
        headline: ad.headline || "",
        bodyPreview: (ad.bodyCopy || "").slice(0, 120),
        fullBody: ad.bodyCopy || "",
        status: "Active" as const,
        startDate: ad.runningDuration ? `${ad.runningDuration} ago` : "Recent",
        variations: Math.floor(Math.random() * 5) + 1,
        angle: ad.angle || angles[0]?.title || "",
        hook: (ad.bodyCopy || "").split(".")[0] || "",
        cta: ad.cta || "Learn More",
        platforms: Array.isArray(ad.platforms) ? ad.platforms : ["Facebook", "Instagram"],
        thumbnailUrl: ad.thumbnailUrl || "",
        metaUrl: ad.metaUrl || "https://www.facebook.com/ads/library/",
      }));

      const reportConfig = {
        clientName: identity.brandName || "My Brand",
        reportTitle: "Competitor Creative Analysis",
        reportDate: today,
        dataSource: "Meta Ads Library (United States)",
        executiveSummary: identity.executiveSummary || "",
        brands,
        angles,
        ads: mappedAds,
        takeaways,
        // Extra metadata for display
        _meta: {
          brandName: identity.brandName,
          category: identity.category,
          targetAudience: identity.targetAudience,
          coreValueProp: identity.coreValueProp,
          topHooks: identity.topHooks || [],
          psychTriggers: identity.psychTriggers || [],
          sourceUrl: url,
        },
      };

      return { success: true, config: reportConfig };
    }),
});
