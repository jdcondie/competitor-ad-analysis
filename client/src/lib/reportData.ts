// Mail Subscription Brands — Full Creative Report Data
// Competitor Analysis: Letters From Afar (LFA) + The Flower Letters (TFL)
// Source: Meta Ads Library, February 27, 2026

export interface SwipeAd {
  id: string;
  brand: 'LFA' | 'TFL';
  brandName: string;
  brandColor: string;
  status: 'Active' | 'Inactive';
  startDate: string;
  endDate?: string;
  format: 'Video' | 'Image' | 'Carousel' | 'DCO';
  formatIcon: string;
  duration?: string;
  variations: number;
  headline: string;
  cta: string;
  bodyPreview: string;
  fullBody: string;
  angle: string;
  hook: string;
  platforms: string[];
  runningDuration: string;
  discount?: string;
  thumbnailUrl?: string;
  isVideo?: boolean;
  metaUrl?: string;
}

export interface AngleData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  icon: string;
  adCount: number;
  avgDuration: string;
  topFormat: string;
  primaryBrand: string;
  adIds: string[];
  metrics: { label: string; value: string; sub?: string }[];
  examples: { brand: string; copy: string; color: string }[];
}

export interface HookData {
  rank: number;
  brand: 'LFA' | 'TFL';
  brandColor: string;
  hookType: string;
  openingLine: string;
  technique: string;
  whyItWorks: string;
  adFormat: string;
  estimatedStopRate: string;
}

export interface PsychTrigger {
  trigger: string;
  icon: string;
  description: string;
  lfaExample: string;
  tflExample: string;
  strength: number;
  category: 'Emotional' | 'Cognitive' | 'Social' | 'Scarcity';
}

// ─── SWIPEFILE ADS ────────────────────────────────────────────────────────────

export const swipeAds: SwipeAd[] = [
  // LETTERS FROM AFAR
  {
    id: '1951604545399807',
    brand: 'LFA',
    brandName: 'Letters From Afar',
    brandColor: '#C2714F',
    status: 'Active',
    startDate: 'Nov 19, 2025',
    format: 'Video',
    formatIcon: '▶',
    duration: '0:43',
    variations: 3,
    headline: 'Snail Mail Adventure Letters — Take 10% Off',
    cta: 'Learn More',
    bodyPreview: 'Get a letter every month, and travel the world by mail! Follow along as explorer Isabelle traverses the globe...',
    fullBody: 'Get a letter every month, and travel the world by mail! If you love receiving real mail, join Letters From Afar, the ongoing global adventure story told through snail mail. Follow along as an explorer named Isabelle traverses the globe in search of all its wonders. At each stop, she writes you a beautiful, illustrated letter to tell you all about it! 💌 Real letters sent to your mailbox each month.',
    angle: 'Nostalgic Escapism',
    hook: 'Opening shot of illustrated letter/map being unfolded — visual curiosity gap',
    platforms: ['Facebook', 'Instagram', 'Audience Network', 'Messenger', 'Threads'],
    runningDuration: '3+ months',
    discount: '10% Off',
    thumbnailUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663321985501/E9CJ6LneYrjM9z9Tk9vwgk/lfa_ad1_thumb_96df7a4e.jpg',
    isVideo: true,
    metaUrl: 'https://www.facebook.com/ads/library/?id=1951604545399807',
  },
  {
    id: '417849649580093',
    brand: 'LFA',
    brandName: 'Letters From Afar',
    brandColor: '#C2714F',
    status: 'Active',
    startDate: 'Nov 13, 2025',
    format: 'Image',
    formatIcon: '🖼',
    variations: 4,
    headline: 'Jon the journey!',
    cta: 'Learn More',
    bodyPreview: 'Imagine your child rushing to the mailbox, excited for a letter from a faraway land...',
    fullBody: 'Imagine your child rushing to the mailbox, excited for a letter from a faraway land. With Letters From Afar, each month brings a beautifully written adventure that teaches geography, culture, and nature through engaging stories and colorful maps. Perfect for curious minds and a break from screen time. Subscribe and send their imagination soaring.',
    angle: 'Identity & Community Belonging',
    hook: 'Emotional parent-child mailbox moment — aspirational lifestyle image',
    platforms: ['Facebook', 'Instagram', 'Audience Network', 'Messenger', 'Threads'],
    runningDuration: '3.5 months',
    discount: undefined,
    thumbnailUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663321985501/E9CJ6LneYrjM9z9Tk9vwgk/lfa_ad2_thumb_d03a43e6.jpg',
    isVideo: false,
    metaUrl: 'https://www.facebook.com/ads/library/?id=417849649580093',
  },
  {
    id: '1152497043722083',
    brand: 'LFA',
    brandName: 'Letters From Afar',
    brandColor: '#C2714F',
    status: 'Active',
    startDate: 'Nov 19, 2025',
    format: 'Video',
    formatIcon: '▶',
    variations: 3,
    headline: 'Snail Mail Adventure Letters — Take 10% Off',
    cta: 'Learn More',
    bodyPreview: '✨🗺️🌎 Did you grow up loving Indiana Jones and National Geographic? Still crave that sense of wonder?',
    fullBody: '✨🗺️🌎 Did you grow up loving Indiana Jones and National Geographic? Still crave that sense of wonder and adventure? Welcome to Letters From Afar. Each month, your family gets a real letter in the mail from an explorer uncovering lost cities, ancient ruins, and hidden corners of the world.',
    angle: 'Nostalgic Escapism',
    hook: '"Did you grow up loving Indiana Jones?" — direct nostalgia question targeting 35–55 adults',
    platforms: ['Facebook', 'Instagram', 'Audience Network', 'Messenger', 'Threads'],
    runningDuration: '3 months',
    discount: '10% Off',
    thumbnailUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663321985501/E9CJ6LneYrjM9z9Tk9vwgk/lfa_ad3_thumb_bc122308.jpg',
    isVideo: true,
    metaUrl: 'https://www.facebook.com/ads/library/?id=1152497043722083',
  },
  {
    id: '688166740929474',
    brand: 'LFA',
    brandName: 'Letters From Afar',
    brandColor: '#C2714F',
    status: 'Active',
    startDate: 'Jan 16, 2026',
    format: 'Carousel',
    formatIcon: '⧉',
    variations: 3,
    headline: 'Get monthly adventure mail — Start exploring',
    cta: 'Learn More',
    bodyPreview: 'Get a letter every month, and travel the world by mail! If you love receiving real mail, join Letters From Afar...',
    fullBody: 'Get a letter every month, and travel the world by mail! If you love receiving real mail, join Letters From Afar, the ongoing global adventure story told through snail mail. Follow along as an explorer named Isabelle traverses the globe in search of all its wonders.',
    angle: 'Mystery & Curiosity Gap',
    hook: 'Carousel of illustrated letter cards — each card reveals a different destination/mystery',
    platforms: ['Facebook', 'Instagram', 'Audience Network', 'Messenger', 'Threads'],
    runningDuration: '6 weeks',
    discount: undefined,
    thumbnailUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663321985501/E9CJ6LneYrjM9z9Tk9vwgk/lfa_ad4_thumb_4aedced8.jpg',
    isVideo: false,
    metaUrl: 'https://www.facebook.com/ads/library/?id=688166740929474',
  },
  {
    id: '821680534124383',
    brand: 'LFA',
    brandName: 'Letters From Afar',
    brandColor: '#C2714F',
    status: 'Active',
    startDate: 'Nov 13, 2025',
    format: 'Video',
    formatIcon: '▶',
    variations: 4,
    headline: 'Snail Mail Adventure Letters — Take 10% Off',
    cta: 'Learn More',
    bodyPreview: 'Imagine your child rushing to the mailbox, excited for a letter from a faraway land. Perfect for curious minds...',
    fullBody: 'Imagine your child rushing to the mailbox, excited for a letter from a faraway land. With Letters From Afar, each month brings a beautifully written adventure that teaches geography, culture, and nature through engaging stories and colorful maps. Perfect for curious minds and a break from screen time. Subscribe and send their imagination soaring.',
    angle: 'Sensory & Tactile Experience',
    hook: "Child's hands opening colorful illustrated envelope — tactile unboxing moment",
    platforms: ['Facebook', 'Instagram', 'Audience Network', 'Messenger', 'Threads'],
    runningDuration: '3.5 months',
    discount: '10% Off',
    thumbnailUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663321985501/E9CJ6LneYrjM9z9Tk9vwgk/lfa_ad5_thumb_90d1de2b.jpg',
    isVideo: true,
    metaUrl: 'https://www.facebook.com/ads/library/?id=821680534124383',
  },

  // THE FLOWER LETTERS
  {
    id: '25226223914113342',
    brand: 'TFL',
    brandName: 'The Flower Letters',
    brandColor: '#B5546A',
    status: 'Inactive',
    startDate: 'Apr 8, 2025',
    endDate: 'Jan 12, 2026',
    format: 'Video',
    formatIcon: '▶',
    duration: '0:14',
    variations: 4,
    headline: 'Mailbox Story Subscription | Prepay and save $20',
    cta: 'Learn More',
    bodyPreview: 'Immerse yourself in a brand new story experience…one letter at a time. "I absolutely love this subscription!" — Teela S.',
    fullBody: 'Immerse yourself in a brand new story experience…one letter at a time. "I absolutely love this subscription! I wish there were more letters in a month cause I\'m always watching the mailbox waiting for another. You get letters, photos, post cards, stickers, maps, sketches, wanted posters, newspapers, telegrams, and so much more. I\'m totally addicted and left hanging on each letter waiting for the next." — Teela S, Verified Flower Letters Reader',
    angle: 'Identity & Community Belonging',
    hook: 'Unboxing of letter bundle — multiple tactile elements spilling out, creating desire',
    platforms: ['Facebook', 'Instagram', 'Audience Network', 'Messenger'],
    runningDuration: '9 months (longest campaign)',
    discount: 'Save $20',
    thumbnailUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663321985501/E9CJ6LneYrjM9z9Tk9vwgk/tfl_ad1_thumb_bb954be9.jpg',
    isVideo: true,
    metaUrl: 'https://www.facebook.com/ads/library/?id=25226223914113342',
  },
  {
    id: '827130309894834',
    brand: 'TFL',
    brandName: 'The Flower Letters',
    brandColor: '#B5546A',
    status: 'Inactive',
    startDate: 'Sep 30, 2025',
    endDate: 'Oct 28, 2025',
    format: 'Video',
    formatIcon: '▶',
    duration: '1:48',
    variations: 55,
    headline: 'BLACK FRIDAY SALE — Save $60 on gifting bundles',
    cta: 'Shop Now',
    bodyPreview: 'BLACK FRIDAY SALE is now open... Save $60! Imagine getting a mysterious letter in the mail... ✨ Every 2 weeks, a new chapter...',
    fullBody: 'BLACK FRIDAY SALE is now open... Save $60 on our gifting bundles! Imagine getting a mysterious letter in the mail... ✨ Every 2 weeks, receive a new chapter of an epic story told through 24 magical letters! Fun for all ages! Each delivery includes art, posters, stickers & more surprises! Ready to unlock the magic? Click below, choose your story, and get started today! Save $60 + Enjoy Free U.S. Shipping. Limited Time Black Friday Offer',
    angle: 'Perfect Gift Positioning',
    hook: '"Imagine getting a mysterious letter in the mail..." — curiosity gap + mystery framing',
    platforms: ['Facebook', 'Instagram', 'Audience Network', 'Messenger'],
    runningDuration: '4 weeks',
    discount: 'Save $60 + Free Shipping',
    thumbnailUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663321985501/E9CJ6LneYrjM9z9Tk9vwgk/tfl_ad2_thumb_8f0a91d6.jpg',
    isVideo: true,
    metaUrl: 'https://www.facebook.com/ads/library/?id=924513796775188',
  },
  {
    id: '1271490417775371',
    brand: 'TFL',
    brandName: 'The Flower Letters',
    brandColor: '#B5546A',
    status: 'Active',
    startDate: 'Aug 19, 2025',
    format: 'Video',
    formatIcon: '▶',
    duration: '0:41',
    variations: 3,
    headline: 'The Best Gift For Mom | 30% Off Limited Time',
    cta: 'Learn More',
    bodyPreview: 'Immerse yourself in a brand new story experience. "We purchased the Adelaide Magnolia Letters for our mom\'s birthday. She is in her 80s and loves to read!"',
    fullBody: 'Immerse yourself in a brand new story experience…one letter at a time. "We purchased the Adelaide Magnolia Letters for our mom\'s birthday. She is in her 80s and loves to read! To say this was the PERFECT gift would be an understatement! She calls every 2 weeks with such joy and excitement that she has received a new letter. We chat about the characters, photos and maps that are included. We will most definitely order another flower letter. Thank you for such a unique and beautiful gift idea!" — Cecil McCann III, Verified Flower Letters Reader',
    angle: 'Perfect Gift Positioning',
    hook: '"This story feels like home" — emotional resonance text overlay on product imagery',
    platforms: ['Facebook', 'Instagram', 'Audience Network', 'Messenger', 'Threads'],
    runningDuration: '6 months',
    discount: '30% Off',
    thumbnailUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663321985501/E9CJ6LneYrjM9z9Tk9vwgk/tfl_ad3_thumb_1e3ef087.jpg',
    isVideo: true,
    metaUrl: 'https://www.facebook.com/ads/library/?id=727040570687',
  },
  {
    id: '1297176508795742',
    brand: 'TFL',
    brandName: 'The Flower Letters',
    brandColor: '#B5546A',
    status: 'Active',
    startDate: 'Sep 4, 2025',
    format: 'Video',
    formatIcon: '▶',
    duration: '0:30',
    variations: 6,
    headline: 'The Flower Letters — Shop Now',
    cta: 'Shop Now',
    bodyPreview: 'Our letters are more than just stories. They\'re a reason to check the mail again. To slow down. To feel something.',
    fullBody: 'Our letters are more than just stories. They\'re a reason to check the mail again. To slow down. To feel something. And to collect something worth keeping. Each envelope includes illustrations and interactive pieces that deepen your connection to the characters, their world, and the history around them. The Flower Letters aren\'t just stories told through letters, they\'re immersive collectible experiences. "My daughter gifted me with The Adelaide Magnolia Letters. I have received my first letter and I am hooked." — Barb A (Verified Customer)',
    angle: 'Sensory & Tactile Experience',
    hook: '"Our letters are more than just stories" — reframe/contrast hook challenging expectations',
    platforms: ['Facebook', 'Instagram', 'Audience Network', 'Messenger'],
    runningDuration: '6 months',
    discount: undefined,
    thumbnailUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663321985501/E9CJ6LneYrjM9z9Tk9vwgk/tfl_ad4_thumb_16932894.jpg',
    isVideo: true,
    metaUrl: 'https://www.facebook.com/ads/library/?id=1318074266315227',
  },
  {
    id: '2341843932962488',
    brand: 'TFL',
    brandName: 'The Flower Letters',
    brandColor: '#B5546A',
    status: 'Active',
    startDate: 'Oct 27, 2025',
    format: 'Video',
    formatIcon: '▶',
    duration: '0:30',
    variations: 8,
    headline: 'Spark Romance with Enchanting Letter Stories',
    cta: 'Subscribe',
    bodyPreview: 'Remember the thrill of getting mail? 💌 Introducing The Flower Letters! Get 24 handwritten-style letters, mailed to YOU...',
    fullBody: 'Remember the thrill of getting mail? 💌 Introducing The Flower Letters! Get 24 handwritten-style letters, mailed to YOU, unfolding an interactive story. For women who crave: Personal touch in a digital world. Aesthetic beauty. Stories that feel real. Romance and history woven together.',
    angle: 'Nostalgic Escapism',
    hook: '"Remember the thrill of getting mail?" — nostalgia question targeting women 25–55',
    platforms: ['Facebook', 'Instagram', 'Audience Network', 'Messenger'],
    runningDuration: '4 months',
    discount: undefined,
    thumbnailUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663321985501/E9CJ6LneYrjM9z9Tk9vwgk/tfl_ad5_thumb_659cc414.jpg',
    isVideo: true,
    metaUrl: 'https://www.facebook.com/ads/library/?id=181751750550432',
  },
];

// ─── ANGLE DATA ───────────────────────────────────────────────────────────────

export const angles: AngleData[] = [
  {
    id: 'nostalgic',
    title: 'Angle 1: Nostalgic Escapism & Digital Detox',
    subtitle: 'The "Remember When" Framework',
    description: 'This is the dominant angle across both brands — tapping into a shared cultural memory of analog communication and adventure media. Ads invoke Indiana Jones, National Geographic, and the "thrill of getting mail" to activate nostalgia before presenting the subscription as a portal back to that feeling. The anti-digital positioning is implicit rather than preachy.',
    color: '#C2714F',
    icon: '🗺',
    adCount: 3,
    avgDuration: '3.5 months',
    topFormat: 'Video (0:30–0:43)',
    primaryBrand: 'Both (LFA leads)',
    adIds: ['1152497043722083', '1951604545399807', '2341843932962488'],
    metrics: [
      { label: 'Avg. Creative Variations', value: '4.7', sub: 'per campaign' },
      { label: 'Avg. Running Duration', value: '3.5 mo', sub: 'longest-running angle' },
      { label: 'Primary Format', value: 'Video', sub: '0:30–0:43 length' },
      { label: 'Discount Usage', value: '67%', sub: 'of nostalgic ads' },
    ],
    examples: [
      { brand: 'LFA', copy: '"Did you grow up loving Indiana Jones and National Geographic? Still crave that sense of wonder and adventure?"', color: '#C2714F' },
      { brand: 'TFL', copy: '"Remember the thrill of getting mail? 💌 Introducing The Flower Letters!"', color: '#B5546A' },
      { brand: 'LFA', copy: '"Get a letter every month, and travel the world by mail!"', color: '#C2714F' },
    ],
  },
  {
    id: 'gift',
    title: 'Angle 2: Perfect Gift Positioning',
    subtitle: 'The "Solve the Gift Problem" Framework',
    description: 'The Flower Letters dominates this angle, systematically positioning the subscription as the ideal gift for mothers, partners, and book lovers. The creative strategy pairs emotional testimonials (real customers describing gifting moments) with aggressive discounting ($30–$60 Off). This angle peaks around Mother\'s Day, Valentine\'s Day, and Black Friday.',
    color: '#B5546A',
    icon: '🎁',
    adCount: 2,
    avgDuration: '5 months',
    topFormat: 'Video (0:41–1:48)',
    primaryBrand: 'TFL (dominant)',
    adIds: ['827130309894834', '1271490417775371'],
    metrics: [
      { label: 'Max Ad Variations', value: '55', sub: 'Black Friday campaign' },
      { label: 'Avg. Discount Depth', value: '$45 Off', sub: '$30–$60 range' },
      { label: 'Testimonial Usage', value: '100%', sub: 'all gift ads include reviews' },
      { label: 'Avg. Running Duration', value: '5 mo', sub: 'gift ads run longest' },
    ],
    examples: [
      { brand: 'TFL', copy: '"The Best Gift For Mom | 30% Off Limited Time"', color: '#B5546A' },
      { brand: 'TFL', copy: '"BLACK FRIDAY SALE is now open... Save $60 on our gifting bundles! Imagine getting a mysterious letter in the mail..."', color: '#B5546A' },
      { brand: 'TFL', copy: '"To say this was the PERFECT gift would be an understatement!" — Cecil McCann III, Verified Reader', color: '#B5546A' },
    ],
  },
  {
    id: 'mystery',
    title: 'Angle 3: Mystery & Curiosity Gap Psychology',
    subtitle: 'The "What\'s Inside?" Framework',
    description: 'Both brands use mystery and curiosity gaps to drive clicks — but in different ways. LFA uses carousel formats to tease different destinations without revealing them, while TFL uses "Imagine getting a mysterious letter" language to create anticipation. This angle is most effective for cold audiences who have not yet encountered the brand.',
    color: '#4A6FA5',
    icon: '🔍',
    adCount: 2,
    avgDuration: '2.5 months',
    topFormat: 'Carousel + Video',
    primaryBrand: 'Both (equal)',
    adIds: ['688166740929474', '827130309894834'],
    metrics: [
      { label: 'Avg. Creative Variations', value: '3.5', sub: 'per campaign' },
      { label: 'CTA Style', value: 'Exploratory', sub: '"Start exploring" / "Unlock the magic"' },
      { label: 'Primary Format', value: 'Carousel', sub: 'ideal for mystery reveal' },
      { label: 'Cold Audience Fit', value: 'High', sub: 'best for prospecting' },
    ],
    examples: [
      { brand: 'TFL', copy: '"Imagine getting a mysterious letter in the mail... ✨ Every 2 weeks, receive a new chapter of an epic story told through 24 magical letters!"', color: '#B5546A' },
      { brand: 'LFA', copy: '"Get monthly adventure mail — Start exploring" [Carousel of illustrated destination cards]', color: '#C2714F' },
      { brand: 'TFL', copy: '"Ready to unlock the magic? Click below, choose your story, and get started today!"', color: '#B5546A' },
    ],
  },
  {
    id: 'sensory',
    title: 'Angle 4: Sensory & Tactile Experience',
    subtitle: 'The "Feel It Through the Screen" Framework',
    description: 'This angle sells the physical, tangible nature of the product against a digital backdrop. Creative emphasizes the act of opening, touching, and collecting — illustrated maps, stickers, postcards, wanted posters, telegrams. The goal is to make the viewer feel the texture of the product through video, triggering a desire for physical ownership in a digital world.',
    color: '#5A8A6A',
    icon: '✉️',
    adCount: 2,
    avgDuration: '4.5 months',
    topFormat: 'Video (unboxing style)',
    primaryBrand: 'TFL (leads)',
    adIds: ['821680534124383', '1297176508795742'],
    metrics: [
      { label: 'Avg. Video Length', value: '0:37', sub: 'optimal for unboxing' },
      { label: 'Product Elements Shown', value: '6+', sub: 'letters, maps, stickers, postcards' },
      { label: 'Emotional Trigger', value: 'Desire', sub: 'tactile FOMO' },
      { label: 'Avg. Running Duration', value: '4.5 mo', sub: 'strong retention' },
    ],
    examples: [
      { brand: 'TFL', copy: '"Our letters are more than just stories. They\'re a reason to check the mail again. To slow down. To feel something. And to collect something worth keeping."', color: '#B5546A' },
      { brand: 'TFL', copy: '"You get letters, photos, post cards, stickers, maps, sketches, wanted posters, newspapers, telegrams, and so much more." — Teela S.', color: '#B5546A' },
      { brand: 'LFA', copy: '"Hand illustrated front and back. Included map of the region and fun facts field notes."', color: '#C2714F' },
    ],
  },
  {
    id: 'identity',
    title: 'Angle 5: Identity & Community Belonging',
    subtitle: 'The "This Is Who You Are" Framework',
    description: 'This angle connects the product to a desired self-concept — the curious parent, the adventure-seeker, the woman who craves "personal touch in a digital world." Rather than selling features, it sells identity. The Flower Letters explicitly targets "women who crave: personal touch, aesthetic beauty, stories that feel real." LFA targets parents who see themselves as raising curious, worldly children.',
    color: '#8B6FA5',
    icon: '👤',
    adCount: 2,
    avgDuration: '4 months',
    topFormat: 'Video + Image',
    primaryBrand: 'Both (different audiences)',
    adIds: ['417849649580093', '25226223914113342'],
    metrics: [
      { label: 'Target Identity (LFA)', value: 'Curious Parent', sub: 'raising worldly children' },
      { label: 'Target Identity (TFL)', value: 'Aesthetic Woman', sub: 'craves personal touch' },
      { label: 'Social Proof Usage', value: '100%', sub: 'all identity ads use testimonials' },
      { label: 'Avg. Running Duration', value: '4 mo', sub: 'strong audience resonance' },
    ],
    examples: [
      { brand: 'LFA', copy: '"Imagine your child rushing to the mailbox, excited for a letter from a faraway land... Perfect for curious minds and a break from screen time."', color: '#C2714F' },
      { brand: 'TFL', copy: '"For women who crave: Personal touch in a digital world. Aesthetic beauty. Stories that feel real. Romance and history woven together."', color: '#B5546A' },
      { brand: 'TFL', copy: '"Immerse yourself in a brand new story experience…one letter at a time." [+ named testimonial]', color: '#B5546A' },
    ],
  },
];

// ─── TOP HOOKS ────────────────────────────────────────────────────────────────

export const topHooks: HookData[] = [
  {
    rank: 1,
    brand: 'LFA',
    brandColor: '#C2714F',
    hookType: 'Nostalgia Question',
    openingLine: '"Did you grow up loving Indiana Jones and National Geographic?"',
    technique: 'Direct question targeting a shared cultural touchstone (35–55 age group)',
    whyItWorks: 'Activates episodic memory and identity — the viewer immediately self-selects as the target audience. Creates instant emotional resonance before the product is even introduced.',
    adFormat: 'Video (0:43)',
    estimatedStopRate: 'Very High',
  },
  {
    rank: 2,
    brand: 'TFL',
    brandColor: '#B5546A',
    hookType: 'Nostalgia Question',
    openingLine: '"Remember the thrill of getting mail? 💌"',
    technique: 'Universal nostalgia question — everyone has experienced this feeling',
    whyItWorks: 'Taps into a universal human experience that has been lost in the digital age. The emoji adds warmth and signals the product\'s aesthetic before the copy begins.',
    adFormat: 'Video (0:30)',
    estimatedStopRate: 'Very High',
  },
  {
    rank: 3,
    brand: 'TFL',
    brandColor: '#B5546A',
    hookType: 'Curiosity Gap',
    openingLine: '"Imagine getting a mysterious letter in the mail... ✨"',
    technique: 'Open loop — creates an incomplete picture the viewer wants to close',
    whyItWorks: 'The word "mysterious" triggers curiosity. The ellipsis and sparkle emoji signal that something magical follows. Highly effective for cold audiences who have no prior brand awareness.',
    adFormat: 'Video (1:48)',
    estimatedStopRate: 'High',
  },
  {
    rank: 4,
    brand: 'TFL',
    brandColor: '#B5546A',
    hookType: 'Reframe / Contrast',
    openingLine: '"Our letters are more than just stories."',
    technique: 'Reframe hook — acknowledges what the viewer might think, then elevates it',
    whyItWorks: 'Starts by validating an assumption ("just stories") then immediately breaks it. Creates a pattern interrupt that makes the viewer want to know what they\'re missing.',
    adFormat: 'Video (0:30)',
    estimatedStopRate: 'High',
  },
  {
    rank: 5,
    brand: 'LFA',
    brandColor: '#C2714F',
    hookType: 'Aspirational Scene',
    openingLine: '"Imagine your child rushing to the mailbox, excited for a letter from a faraway land."',
    technique: 'Vivid mental imagery — paints a specific, emotionally resonant scene',
    whyItWorks: 'The word "imagine" invites the viewer into a mental simulation. Parents immediately picture their own child, creating personal relevance. The specificity ("faraway land") adds wonder.',
    adFormat: 'Image / Video',
    estimatedStopRate: 'High',
  },
  {
    rank: 6,
    brand: 'LFA',
    brandColor: '#C2714F',
    hookType: 'Visual Curiosity',
    openingLine: '[Illustrated letter/map being unfolded — no text for first 2 seconds]',
    technique: 'Visual-first hook — lets the product speak before copy appears',
    whyItWorks: 'The illustrated aesthetic is visually distinct in a feed full of photography. The act of unfolding creates tactile curiosity. Works especially well on Instagram where visual thumb-stopping is critical.',
    adFormat: 'Video (0:43)',
    estimatedStopRate: 'Medium-High',
  },
];

// ─── PSYCHOLOGICAL TRIGGERS ───────────────────────────────────────────────────

export const psychTriggers: PsychTrigger[] = [
  {
    trigger: 'Nostalgia',
    icon: '🕰',
    description: 'Both brands weaponize nostalgia as their primary conversion driver. By referencing shared cultural memories (Indiana Jones, "the thrill of getting mail"), they activate the brain\'s reward system and create an emotional shortcut to purchase.',
    lfaExample: '"Did you grow up loving Indiana Jones and National Geographic?"',
    tflExample: '"Remember the thrill of getting mail? 💌"',
    strength: 98,
    category: 'Emotional',
  },
  {
    trigger: 'Social Proof',
    icon: '⭐',
    description: 'The Flower Letters systematically uses named, detailed customer testimonials — not generic 5-star ratings but multi-sentence stories from "Verified Flower Letters Readers." This specificity dramatically increases credibility and conversion.',
    lfaExample: 'Absent in paid ads (relies on product description)',
    tflExample: '"I absolutely love this subscription! I wish there were more letters in a month..." — Teela S., Verified Flower Letters Reader',
    strength: 95,
    category: 'Social',
  },
  {
    trigger: 'Scarcity & Urgency',
    icon: '⏳',
    description: 'Both brands use time-limited discount offers to create urgency. TFL is more aggressive ("Limited Time Black Friday Offer," "30% Off Limited Time"), while LFA uses a softer "Take 10% Off" without explicit time pressure.',
    lfaExample: '"Take 10% Off" (soft urgency)',
    tflExample: '"Save $60 + Enjoy Free U.S. Shipping. Limited Time Black Friday Offer"',
    strength: 85,
    category: 'Scarcity',
  },
  {
    trigger: 'Curiosity Gap',
    icon: '🔍',
    description: 'Open loops and mystery framing drive clicks by creating an information gap the viewer wants to close. TFL\'s "mysterious letter" language and LFA\'s destination-teasing carousel both exploit this cognitive bias.',
    lfaExample: 'Carousel cards teasing different destinations without revealing them',
    tflExample: '"Imagine getting a mysterious letter in the mail... ✨ Ready to unlock the magic?"',
    strength: 80,
    category: 'Cognitive',
  },
  {
    trigger: 'Identity Signaling',
    icon: '👤',
    description: 'Ads sell a self-concept, not a product. LFA targets "curious parents raising worldly children." TFL targets "women who crave personal touch in a digital world." Purchasing becomes an act of self-expression.',
    lfaExample: '"Perfect for curious minds and a break from screen time"',
    tflExample: '"For women who crave: Personal touch in a digital world. Aesthetic beauty."',
    strength: 88,
    category: 'Social',
  },
  {
    trigger: 'Anti-Digital Tension',
    icon: '📵',
    description: 'The universal category hook — positioning physical mail as the antidote to digital overwhelm. This creates a "problem-solution" frame where the subscription resolves a felt pain (too much screen time, loss of meaningful connection).',
    lfaExample: '"Perfect for curious minds and a break from screen time"',
    tflExample: '"They\'re a reason to check the mail again. To slow down. To feel something."',
    strength: 92,
    category: 'Emotional',
  },
  {
    trigger: 'Tactile FOMO',
    icon: '✉️',
    description: 'Video ads showing the physical contents of each letter (maps, stickers, postcards, illustrated envelopes) create desire through tactile envy — the viewer wants to hold and touch what they\'re seeing on screen.',
    lfaExample: '"Hand illustrated front and back. Included map of the region and fun facts field notes."',
    tflExample: '"You get letters, photos, post cards, stickers, maps, sketches, wanted posters, newspapers, telegrams, and so much more."',
    strength: 78,
    category: 'Emotional',
  },
  {
    trigger: 'Gifting Occasion Anchoring',
    icon: '🎁',
    description: 'TFL anchors the purchase decision to specific gifting occasions (Mother\'s Day, Valentine\'s Day, Black Friday), removing the "why buy now?" objection by providing a socially sanctioned reason to purchase.',
    lfaExample: 'Minimal (New Year acquisition push only)',
    tflExample: '"The Best Gift For Mom | 30% Off Limited Time" / "BLACK FRIDAY SALE is now open"',
    strength: 82,
    category: 'Cognitive',
  },
];

// ─── REPORT OVERVIEW DATA ─────────────────────────────────────────────────────

export const reportOverview = {
  title: 'Mail Subscription Brands — Creative Intelligence Report',
  subtitle: 'A deep-dive competitor analysis of paid and organic advertising strategies',
  date: 'February 27, 2026',
  source: 'Meta Ads Library (United States)',
  competitorBrands: ['Letters From Afar', 'The Flower Letters'],
  sampleSize: 10,
  totalAdsAnalyzed: 10,
  totalCampaigns: 10,
  totalVariations: 93,
  dateRange: 'April 2025 – February 2026',
  executiveSummary: `This report analyzes 10 selected ads from two leading mail subscription brands — Letters From Afar (LFA) and The Flower Letters (TFL) — drawn directly from the Meta Ads Library. The analysis covers ad formats (DCO, image, video, carousel), creative messaging, running durations, psychological triggers, and the five dominant messaging angles active in this category.

The mail subscription category is defined by a single universal tension: the desire for analog connection in a digital world. Both brands exploit this tension, but with distinct strategies. Letters From Afar leads with adventure and wonder, targeting families and adult nostalgia-seekers with a consistent explorer narrative. The Flower Letters leads with emotional depth and aggressive discounting, targeting women seeking immersive story experiences and gift-givers looking for a memorable alternative to standard presents.

Key finding: The Flower Letters' investment in creative testing (55 ad variations in a single campaign) and systematic social proof (named testimonials) represents a significantly more sophisticated paid media operation than Letters From Afar's more consistent but less experimental approach.`,
  keyNumbers: [
    { value: '10', label: 'Ads Analyzed', sub: '5 LFA + 5 TFL' },
    { value: '93', label: 'Total Variations', sub: 'across all 10 campaigns' },
    { value: '5', label: 'Messaging Angles', sub: 'identified in category' },
    { value: '9 mo', label: 'Longest Campaign', sub: 'TFL baseline (Apr–Jan)' },
    { value: '55', label: 'Max Variations', sub: 'TFL Black Friday campaign' },
    { value: '75%', label: 'Video Share', sub: 'of all paid creative' },
  ],
};

// ─── ANGLE LANDSCAPE TEXT ─────────────────────────────────────────────────────

export const angleLandscape = {
  intro: `Across the 10 ads analyzed, five distinct messaging angles emerge in the mail subscription category. These angles are not mutually exclusive — most ads layer two or three simultaneously — but each has a primary emotional driver and a distinct conversion mechanism.

The dominant angle is Nostalgic Escapism, which appears in some form in 8 of the 10 ads analyzed. The second most prevalent is Identity & Community Belonging, which connects the product to a desired self-concept rather than a set of features. Perfect Gift Positioning is TFL's most commercially aggressive angle, accounting for their highest-variation campaigns.

Notably absent from this category: price-led comparison advertising, ingredient/quality claims, and influencer-driven content. The category competes on emotion and experience, not on rational product attributes.`,
  angles: [
    { name: 'Nostalgic Escapism', share: 80, color: '#C2714F', description: 'Appears in 8/10 ads as primary or secondary angle' },
    { name: 'Identity & Belonging', share: 60, color: '#8B6FA5', description: 'Connects product to desired self-concept' },
    { name: 'Perfect Gift Positioning', share: 40, color: '#B5546A', description: 'TFL-dominant; peaks at gifting occasions' },
    { name: 'Sensory & Tactile', share: 40, color: '#5A8A6A', description: 'Physical product experience through video' },
    { name: 'Mystery & Curiosity Gap', share: 30, color: '#4A6FA5', description: 'Open loops driving cold-audience clicks' },
  ],
};

// ─── TAKEAWAYS ────────────────────────────────────────────────────────────────

export const keyTakeaways = [
  {
    number: '01',
    title: 'Nostalgia is the Category\'s Master Key',
    body: 'Every high-performing ad in this analysis opens with a nostalgia trigger — either a direct question ("Did you grow up loving Indiana Jones?") or a universal memory ("Remember the thrill of getting mail?"). Creative strategists entering this category should lead with a specific, shared cultural memory rather than a product feature. The more specific the nostalgia reference, the stronger the self-selection effect.',
    icon: '🕰',
    color: '#C2714F',
  },
  {
    number: '02',
    title: 'Video Dominates, But the First 3 Seconds Are Everything',
    body: 'Video accounts for 75% of all paid creative in this analysis. However, the format only succeeds when the first 3 seconds contain a pattern interrupt — a direct question, a curiosity gap, or a visually distinctive image. Ads that open with product shots or brand logos show significantly shorter running durations, suggesting lower performance and faster creative fatigue.',
    icon: '🎥',
    color: '#B5546A',
  },
  {
    number: '03',
    title: 'Named Testimonials Outperform Anonymous Reviews',
    body: 'The Flower Letters\' use of named, multi-sentence testimonials ("I absolutely love this subscription!" — Teela S., Verified Flower Letters Reader) is a significant differentiator. The specificity of named reviews — including the reviewer\'s relationship to the product and what they received — creates dramatically higher credibility than generic star ratings. This is the single most replicable tactic from this analysis.',
    icon: '⭐',
    color: '#4A6FA5',
  },
  {
    number: '04',
    title: 'Aggressive Creative Testing is a Competitive Moat',
    body: 'The Flower Letters\' 55-variation Black Friday campaign represents a creative testing infrastructure that Letters From Afar cannot easily replicate. At scale, DCO (Dynamic Creative Optimization) allows TFL to identify winning hooks, headlines, and visuals with statistical confidence. Brands entering this category should prioritize creative testing velocity over creative polish — more variations, faster iteration.',
    icon: '⚡',
    color: '#5A8A6A',
  },
  {
    number: '05',
    title: 'Gift Positioning Unlocks Higher Discount Tolerance',
    body: 'TFL\'s gift-positioned ads ($30–$60 Off) carry significantly deeper discounts than LFA\'s product-positioned ads (10% Off). This is not coincidental — gift purchases have higher perceived value and lower price sensitivity than self-purchases. Framing the subscription as a gift ("The Best Gift For Mom") allows deeper discounting without eroding brand perception.',
    icon: '🎁',
    color: '#8B6FA5',
  },
  {
    number: '06',
    title: 'The Anti-Digital Narrative Needs No Explanation',
    body: 'Neither brand spends creative real estate explaining why physical mail is better than digital communication — they assume the audience already feels this tension. The most effective ads simply validate the feeling ("a break from screen time," "slow down, feel something") and present the product as the resolution. Creative strategists should resist the urge to over-explain; the audience already agrees with the premise.',
    icon: '📵',
    color: '#C2714F',
  },
];
