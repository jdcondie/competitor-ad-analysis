// Mail Subscription Brands — Comprehensive Creative Analysis Data
// Source: Meta Ads Library research, February 27, 2026

export type BrandKey = 'lfa' | 'tfl' | 'smc' | 'tfm';

export interface Brand {
  key: BrandKey;
  name: string;
  shortName: string;
  tagline: string;
  website: string;
  color: string;
  colorClass: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  stripClass: string;
  emoji: string;
  adPresence: 'High' | 'Very High' | 'Minimal' | 'None';
  activeAds: number;
  totalResults: string;
  primaryPlatform: string;
  targetAudience: string;
  pricePoint: string;
  origin: string;
  character: string | null;
}

export interface AdCampaign {
  id: string;
  status: 'Active' | 'Inactive';
  startDate: string;
  endDate?: string;
  contentType: string;
  variations: number;
  notes: string;
}

export interface ContentTypeData {
  name: string;
  value: number;
  fill: string;
}

export interface HashtagData {
  tag: string;
  type: 'Brand' | 'Category' | 'Lifestyle' | 'Aesthetic' | 'Location' | 'Community';
  usage: 'Paid' | 'Organic' | 'Both' | 'None';
  frequency: number;
}

export interface PeakTimeData {
  period: string;
  intensity: number;
  trigger: string;
}

export interface InsightCard {
  number: string;
  title: string;
  body: string;
  icon: string;
}

// ─── BRANDS ──────────────────────────────────────────────────────────────────

export const brands: Brand[] = [
  {
    key: 'lfa',
    name: 'Letters From Afar',
    shortName: 'LFA',
    tagline: 'Travel the world by mail',
    website: 'lettersafar.com',
    color: '#C2714F',
    colorClass: 'text-[#C2714F]',
    bgClass: 'bg-[#C2714F]',
    textClass: 'text-white',
    borderClass: 'border-[#C2714F]',
    stripClass: 'brand-strip-lfa',
    emoji: '🗺',
    adPresence: 'High',
    activeAds: 5,
    totalResults: '>50,000',
    primaryPlatform: 'Facebook + Instagram + Audience Network',
    targetAudience: 'Families with children + Adult adventure enthusiasts',
    pricePoint: 'Monthly subscription (USD)',
    origin: 'United States',
    character: 'Isabelle (explorer)',
  },
  {
    key: 'tfl',
    name: 'The Flower Letters',
    shortName: 'TFL',
    tagline: 'Recreate the lost magic of real mail',
    website: 'theflowerletters.com',
    color: '#B5546A',
    colorClass: 'text-[#B5546A]',
    bgClass: 'bg-[#B5546A]',
    textClass: 'text-white',
    borderClass: 'border-[#B5546A]',
    stripClass: 'brand-strip-tfl',
    emoji: '💌',
    adPresence: 'Very High',
    activeAds: 3,
    totalResults: '>50,000',
    primaryPlatform: 'Facebook + Instagram + Messenger',
    targetAudience: 'Women 25–55 who miss letter-writing',
    pricePoint: 'Monthly subscription (USD) — heavy discounting',
    origin: 'United States',
    character: null,
  },
  {
    key: 'smc',
    name: 'Snail Mail Chronicles',
    shortName: 'SMC',
    tagline: 'Letters from extraordinary places',
    website: 'snailmailchronicles.com',
    color: '#4A6FA5',
    colorClass: 'text-[#4A6FA5]',
    bgClass: 'bg-[#4A6FA5]',
    textClass: 'text-white',
    borderClass: 'border-[#4A6FA5]',
    stripClass: 'brand-strip-smc',
    emoji: '✈️',
    adPresence: 'Minimal',
    activeAds: 0,
    totalResults: '~30',
    primaryPlatform: 'Facebook + Instagram (organic only)',
    targetAudience: 'Adventure readers & couch travelers',
    pricePoint: '€6.00 EUR/month',
    origin: 'Europe',
    character: 'Dorian (traveler)',
  },
  {
    key: 'tfm',
    name: 'Tiny Farmers Market',
    shortName: 'TFM',
    tagline: 'Creativity, connection, and community by mail',
    website: 'thetinyfarmersmarket.com',
    color: '#5A8A6A',
    colorClass: 'text-[#5A8A6A]',
    bgClass: 'bg-[#5A8A6A]',
    textClass: 'text-white',
    borderClass: 'border-[#5A8A6A]',
    stripClass: 'brand-strip-tfm',
    emoji: '🌿',
    adPresence: 'None',
    activeAds: 0,
    totalResults: '0',
    primaryPlatform: 'TikTok + Instagram (organic only)',
    targetAudience: 'Community seekers & creative individuals',
    pricePoint: 'Monthly subscription (USD + International)',
    origin: 'Austin, TX',
    character: 'Hannah (founder)',
  },
];

// ─── AD CAMPAIGNS ─────────────────────────────────────────────────────────────

export const campaigns: Record<BrandKey, AdCampaign[]> = {
  lfa: [
    { id: '1951604545399807', status: 'Active', startDate: 'Nov 19, 2025', contentType: 'Video (0:43)', variations: 8, notes: 'Adventure explorer narrative — Isabelle' },
    { id: '417849649580093', status: 'Active', startDate: 'Nov 13, 2025', contentType: 'Image + Text', variations: 4, notes: 'Child education angle — mailbox excitement' },
    { id: '1400974155079615', status: 'Active', startDate: 'Nov 13, 2025', contentType: 'Image + Text', variations: 4, notes: 'Child education angle — colorful maps' },
    { id: '1152497043722083', status: 'Active', startDate: 'Nov 19, 2025', contentType: 'Video (Field Notes)', variations: 3, notes: 'Indiana Jones / National Geographic nostalgia' },
    { id: '688166740929474', status: 'Active', startDate: 'Jan 16, 2026', contentType: 'Video Carousel', variations: 3, notes: 'New Year acquisition push' },
  ],
  tfl: [
    { id: '924513796775188', status: 'Active', startDate: 'Feb 10, 2026', contentType: 'Video', variations: 2, notes: "Valentine's Day gift push" },
    { id: '1271490417775371', status: 'Active', startDate: 'Aug 25, 2025', contentType: 'Video', variations: 6, notes: 'Summer reading tradition narrative' },
    { id: '1318074266315227', status: 'Active', startDate: 'Jul 24, 2025', contentType: 'Static Image', variations: 4, notes: 'Product photography — letter bundles' },
    { id: '827130309894834', status: 'Inactive', startDate: 'Sep 30, 2025', endDate: 'Oct 28, 2025', contentType: 'Video', variations: 55, notes: 'Largest single creative set — 55 variations' },
    { id: '25226223914113342', status: 'Inactive', startDate: 'Apr 8, 2025', endDate: 'Jan 12, 2026', contentType: 'Video', variations: 4, notes: 'Long-running baseline campaign (9 months)' },
  ],
  smc: [
    { id: '1634273720771534', status: 'Inactive', startDate: 'Dec 18, 2024', endDate: 'Jan 1, 2025', contentType: 'Static Image', variations: 10, notes: 'Brief holiday test — only campaign found' },
    { id: '2294447817645537', status: 'Inactive', startDate: 'Nov 14, 2025', endDate: 'Nov 14, 2025', contentType: 'Static Image', variations: 1, notes: 'Active only 8 hours — <100 impressions' },
  ],
  tfm: [],
};

// ─── CONTENT TYPE DISTRIBUTION ────────────────────────────────────────────────

export const contentTypeData: Record<BrandKey, ContentTypeData[]> = {
  lfa: [
    { name: 'Video', value: 70, fill: '#C2714F' },
    { name: 'Static Image', value: 25, fill: '#D4956A' },
    { name: 'Carousel', value: 5, fill: '#E8C4A0' },
  ],
  tfl: [
    { name: 'Video', value: 75, fill: '#B5546A' },
    { name: 'Static Image', value: 20, fill: '#CC7A8F' },
    { name: 'Carousel', value: 5, fill: '#E0A8B8' },
  ],
  smc: [
    { name: 'Static Image', value: 100, fill: '#4A6FA5' },
  ],
  tfm: [
    { name: 'Short-Form Video', value: 80, fill: '#5A8A6A' },
    { name: 'Static Image', value: 20, fill: '#8AB89A' },
  ],
};

// ─── HASHTAG DATA ─────────────────────────────────────────────────────────────

export const hashtagData: Record<BrandKey, HashtagData[]> = {
  lfa: [
    { tag: '#snailmail', type: 'Category', usage: 'Organic', frequency: 85 },
    { tag: '#lettersubscription', type: 'Category', usage: 'Organic', frequency: 70 },
    { tag: '#adventureletters', type: 'Brand', usage: 'Organic', frequency: 65 },
    { tag: '#lettersafar', type: 'Brand', usage: 'Organic', frequency: 90 },
    { tag: '💌 (emoji)', type: 'Aesthetic', usage: 'Paid', frequency: 100 },
    { tag: '🗺 (emoji)', type: 'Aesthetic', usage: 'Paid', frequency: 95 },
    { tag: '✨ (emoji)', type: 'Aesthetic', usage: 'Paid', frequency: 90 },
    { tag: '🌎 (emoji)', type: 'Aesthetic', usage: 'Paid', frequency: 85 },
  ],
  tfl: [
    { tag: '#flowerletters', type: 'Brand', usage: 'Organic', frequency: 95 },
    { tag: '#snailmail', type: 'Category', usage: 'Organic', frequency: 80 },
    { tag: '#letterwriting', type: 'Category', usage: 'Organic', frequency: 75 },
    { tag: '#penpal', type: 'Community', usage: 'Organic', frequency: 60 },
    { tag: '💌 (emoji)', type: 'Aesthetic', usage: 'Paid', frequency: 100 },
    { tag: '📪 (emoji)', type: 'Aesthetic', usage: 'Paid', frequency: 90 },
  ],
  smc: [
    { tag: '#snailmailchronicles', type: 'Brand', usage: 'Organic', frequency: 100 },
    { tag: '#snailmail', type: 'Category', usage: 'Organic', frequency: 90 },
    { tag: '#lettersubscription', type: 'Category', usage: 'Organic', frequency: 75 },
  ],
  tfm: [
    { tag: '#tinyfarmersmarket', type: 'Brand', usage: 'Organic', frequency: 100 },
    { tag: '#tinypost', type: 'Brand', usage: 'Organic', frequency: 95 },
    { tag: '#tinyproject', type: 'Brand', usage: 'Organic', frequency: 85 },
    { tag: '#snailmail', type: 'Category', usage: 'Organic', frequency: 80 },
    { tag: '#community', type: 'Lifestyle', usage: 'Organic', frequency: 75 },
    { tag: '#creativity', type: 'Lifestyle', usage: 'Organic', frequency: 70 },
    { tag: '#wholesome', type: 'Aesthetic', usage: 'Organic', frequency: 65 },
    { tag: '#penpals', type: 'Community', usage: 'Organic', frequency: 60 },
    { tag: '#smallbusiness', type: 'Community', usage: 'Organic', frequency: 55 },
    { tag: '#atx', type: 'Location', usage: 'Organic', frequency: 50 },
  ],
};

// ─── PEAK POSTING TIMES ───────────────────────────────────────────────────────

export const peakTimeData: Record<BrandKey, PeakTimeData[]> = {
  lfa: [
    { period: 'Jan', intensity: 65, trigger: 'New Year acquisition push' },
    { period: 'Feb', intensity: 50, trigger: "Valentine's Day gifts" },
    { period: 'Mar', intensity: 40, trigger: 'Spring baseline' },
    { period: 'Apr', intensity: 45, trigger: 'Spring campaigns' },
    { period: 'May', intensity: 50, trigger: "Mother's Day gifts" },
    { period: 'Jun', intensity: 55, trigger: 'Summer reading season' },
    { period: 'Jul', intensity: 60, trigger: 'Summer peak' },
    { period: 'Aug', intensity: 55, trigger: 'Back to school' },
    { period: 'Sep', intensity: 50, trigger: 'Fall baseline' },
    { period: 'Oct', intensity: 60, trigger: 'Pre-holiday ramp-up' },
    { period: 'Nov', intensity: 100, trigger: 'Pre-holiday peak (multiple campaigns launched Nov 13 & 19)' },
    { period: 'Dec', intensity: 80, trigger: 'Holiday gift season' },
  ],
  tfl: [
    { period: 'Jan', intensity: 50, trigger: 'New Year baseline' },
    { period: 'Feb', intensity: 80, trigger: "Valentine's Day push (new campaign Feb 10, 2026)" },
    { period: 'Mar', intensity: 45, trigger: 'Spring baseline' },
    { period: 'Apr', intensity: 60, trigger: 'Spring campaign launch (Apr 8, 2025)' },
    { period: 'May', intensity: 55, trigger: "Mother's Day gifts" },
    { period: 'Jun', intensity: 65, trigger: 'Summer reading ramp-up' },
    { period: 'Jul', intensity: 85, trigger: 'Summer peak (Jul 24 campaign launch)' },
    { period: 'Aug', intensity: 90, trigger: 'Summer peak (Aug 25 campaign launch)' },
    { period: 'Sep', intensity: 75, trigger: 'Fall campaign (Sep 30 launch)' },
    { period: 'Oct', intensity: 70, trigger: 'Fall sustained' },
    { period: 'Nov', intensity: 100, trigger: 'Black Friday peak — 55 ad variations' },
    { period: 'Dec', intensity: 85, trigger: 'Holiday gift season' },
  ],
  smc: [
    { period: 'Jan', intensity: 30, trigger: 'Monthly dispatch (1st of month)' },
    { period: 'Feb', intensity: 30, trigger: 'Monthly dispatch' },
    { period: 'Mar', intensity: 30, trigger: 'Monthly dispatch' },
    { period: 'Apr', intensity: 30, trigger: 'Monthly dispatch' },
    { period: 'May', intensity: 30, trigger: 'Monthly dispatch' },
    { period: 'Jun', intensity: 30, trigger: 'Monthly dispatch' },
    { period: 'Jul', intensity: 30, trigger: 'Monthly dispatch' },
    { period: 'Aug', intensity: 30, trigger: 'Monthly dispatch' },
    { period: 'Sep', intensity: 30, trigger: 'Monthly dispatch' },
    { period: 'Oct', intensity: 30, trigger: 'Monthly dispatch' },
    { period: 'Nov', intensity: 45, trigger: 'Brief paid test (8 hours only)' },
    { period: 'Dec', intensity: 60, trigger: 'Holiday test campaign (Dec 18 – Jan 1)' },
  ],
  tfm: [
    { period: 'Jan', intensity: 55, trigger: 'Monthly send-off day + market days' },
    { period: 'Feb', intensity: 65, trigger: 'Monthly send-off + Valentine market' },
    { period: 'Mar', intensity: 60, trigger: 'Monthly send-off + spring market' },
    { period: 'Apr', intensity: 65, trigger: 'Monthly send-off + spring market' },
    { period: 'May', intensity: 70, trigger: 'Monthly send-off + spring market peak' },
    { period: 'Jun', intensity: 65, trigger: 'Monthly send-off + summer market' },
    { period: 'Jul', intensity: 60, trigger: 'Monthly send-off + summer market' },
    { period: 'Aug', intensity: 60, trigger: 'Monthly send-off + summer market' },
    { period: 'Sep', intensity: 65, trigger: 'Monthly send-off + fall market' },
    { period: 'Oct', intensity: 70, trigger: 'Monthly send-off + fall market peak' },
    { period: 'Nov', intensity: 85, trigger: 'Holiday subscription push (HOLIDAY20 code)' },
    { period: 'Dec', intensity: 90, trigger: 'Holiday peak — gift subscriptions' },
  ],
};

// ─── ENGAGEMENT PROXY DATA ────────────────────────────────────────────────────

export const engagementData = [
  { brand: 'LFA', creativeVariations: 22, adLongevity: 90, socialProof: 0, estimatedScore: 72, color: '#C2714F' },
  { brand: 'TFL', creativeVariations: 71, adLongevity: 270, socialProof: 100, estimatedScore: 95, color: '#B5546A' },
  { brand: 'SMC', creativeVariations: 11, adLongevity: 14, socialProof: 0, estimatedScore: 18, color: '#4A6FA5' },
  { brand: 'TFM', creativeVariations: 0, adLongevity: 0, socialProof: 80, estimatedScore: 62, color: '#5A8A6A' },
];

// ─── SOCIAL STATS ─────────────────────────────────────────────────────────────

export const socialStats: Record<BrandKey, { platform: string; followers: string; metric: string; metricLabel: string }[]> = {
  lfa: [
    { platform: 'Facebook', followers: 'Active page', metric: '>50K', metricLabel: 'Ad results' },
    { platform: 'Instagram', followers: 'Active', metric: '5+', metricLabel: 'Active campaigns' },
  ],
  tfl: [
    { platform: 'Facebook', followers: 'Active page', metric: '>50K', metricLabel: 'Ad results' },
    { platform: 'Instagram', followers: 'Active', metric: '55', metricLabel: 'Max ad variations' },
    { platform: 'Messenger', followers: 'Active', metric: '9mo+', metricLabel: 'Longest campaign' },
  ],
  smc: [
    { platform: 'Facebook', followers: '263', metric: '0', metricLabel: 'Active ads' },
    { platform: 'Instagram', followers: '708', metric: '<100', metricLabel: 'Peak impressions' },
    { platform: 'Twitter/X', followers: 'Active', metric: '€6', metricLabel: 'Price/month' },
  ],
  tfm: [
    { platform: 'TikTok', followers: '32,300', metric: '522K', metricLabel: 'Total likes' },
    { platform: 'Instagram', followers: 'Active', metric: '4,000+', metricLabel: 'Monthly letters' },
    { platform: 'Physical Market', followers: 'Austin, TX', metric: '16:1', metricLabel: 'Like/follower ratio' },
  ],
};

// ─── KEY INSIGHTS ─────────────────────────────────────────────────────────────

export const keyInsights: InsightCard[] = [
  {
    number: '01',
    title: 'The Anti-Digital Narrative is Universal',
    body: 'All four brands share a foundational positioning against digital communication. Whether framed as "screen-free" (LFA), "lost magic" (TFL), "no airport security" (SMC), or "slow you down" (TFM), the anti-digital narrative is the category\'s defining creative hook.',
    icon: '📵',
  },
  {
    number: '02',
    title: 'Video Dominates Paid; Short-Form Dominates Organic',
    body: 'Among paid advertisers, video represents 70–75% of creative output. For organic-only brands, short-form vertical video (TikTok/Reels) is the primary growth engine. TFM\'s 16:1 TikTok like-to-follower ratio demonstrates the power of authentic community content.',
    icon: '🎥',
  },
  {
    number: '03',
    title: 'Hashtag Avoidance in Paid Ads is a Premium Signal',
    body: 'Neither LFA nor TFL use hashtags in paid ad copy — a deliberate editorial choice. These brands instead use emojis (💌 📪 🗺 ✨ 🌎) as visual rhythm markers that maintain a warm, personal tone without diluting the copy quality.',
    icon: '#️⃣',
  },
  {
    number: '04',
    title: 'Aggressive Discounting Drives TFL\'s Scale',
    body: 'The Flower Letters\' strategy is heavily discount-driven, with offers ranging from 35% Off to $70 Off. This suggests a CAC model relying on front-loaded discounts to drive trial, with retention and LTV justifying initial margin compression.',
    icon: '💰',
  },
  {
    number: '05',
    title: 'Social Proof is a Differentiator',
    body: 'The Flower Letters is the only brand to systematically incorporate detailed customer testimonials in ad copy. Multi-sentence, named reviews from "Verified Flower Letters Readers" serve as powerful trust signals for a subscription product.',
    icon: '⭐',
  },
  {
    number: '06',
    title: 'Community-First Brands Can Scale Without Paid Ads',
    body: 'Tiny Farmers Market grew to 4,000+ monthly letters without any paid advertising — demonstrating the viability of a community-first, organic content strategy. Authentic behind-the-scenes content and genuine community celebration can rival paid acquisition.',
    icon: '🌱',
  },
];

// ─── MESSAGING PILLARS ────────────────────────────────────────────────────────

export const messagingPillars: Record<BrandKey, { pillar: string; example: string; strength: number }[]> = {
  lfa: [
    { pillar: 'Adventure & Wonder', example: '"Did you grow up loving Indiana Jones and National Geographic?"', strength: 95 },
    { pillar: 'Educational Value', example: '"Teaches geography, culture, and nature through engaging stories"', strength: 85 },
    { pillar: 'Screen-Free Living', example: '"Perfect for curious minds and a break from screen time"', strength: 80 },
    { pillar: 'Family Bonding', example: '"Imagine your child rushing to the mailbox"', strength: 75 },
    { pillar: 'Promotional Offer', example: '"Take 10% Off"', strength: 60 },
  ],
  tfl: [
    { pillar: 'Nostalgia & Lost Magic', example: '"Remember when getting mail was actually exciting?"', strength: 100 },
    { pillar: 'Anti-Digital Positioning', example: '"Recreate those special moments of anticipation we\'ve lost"', strength: 95 },
    { pillar: 'Social Proof', example: '"I absolutely love this subscription!" — Teela S., Verified Reader', strength: 90 },
    { pillar: 'Gift Positioning', example: '"Make Any Day Special: Gift a Story That Unfolds All Year"', strength: 85 },
    { pillar: 'Aggressive Discounting', example: '"$55 Off + Free Shipping" / "Up to $70 Off"', strength: 100 },
  ],
  smc: [
    { pillar: 'Couch Travel Fantasy', example: '"Live adventures from your couch without airport security"', strength: 90 },
    { pillar: 'Educational Content', example: '"History Fun Fact" posts (e.g., The Ban on Tomatoes)', strength: 75 },
    { pillar: 'Mystery & Discovery', example: '"Blind Letters" — mystery destination subscription', strength: 70 },
    { pillar: 'Character Narrative', example: '"Follow Dorian as he travels to unique places"', strength: 80 },
  ],
  tfm: [
    { pillar: 'Connection & Community', example: '"Connection is the most important thing"', strength: 100 },
    { pillar: 'Slow Living', example: '"Slow you down, give you a break from the digital age"', strength: 95 },
    { pillar: 'Care Package Framing', example: '"A care package from a friend"', strength: 90 },
    { pillar: 'Creative Expression', example: '"Creativity, connection, and community"', strength: 85 },
    { pillar: 'Founder Authenticity', example: 'Behind-the-scenes send-off day content by Hannah', strength: 80 },
  ],
};

// ─── COMPARISON RADAR DATA ────────────────────────────────────────────────────

export const radarData = [
  { metric: 'Ad Volume', lfa: 80, tfl: 100, smc: 10, tfm: 0 },
  { metric: 'Creative Testing', lfa: 75, tfl: 100, smc: 15, tfm: 0 },
  { metric: 'Organic Reach', lfa: 50, tfl: 45, smc: 30, tfm: 95 },
  { metric: 'Social Proof', lfa: 20, tfl: 95, smc: 10, tfm: 70 },
  { metric: 'Hashtag Strategy', lfa: 30, tfl: 25, smc: 60, tfm: 90 },
  { metric: 'Community', lfa: 40, tfl: 35, smc: 25, tfm: 100 },
];
