/**
 * Mail Subscription Brands — Creative Intelligence Report Page
 * Design: Intelligence Dashboard — Warm Editorial (matches Home.tsx)
 * Sections: Overview, SwipeFile, Angle Landscape, 5 Angle Metrics, Top Hooks, Psych Triggers, Takeaways
 */

import { useState, useRef, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useReport } from "@/contexts/ReportContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell,
  LineChart, Line, Legend, ReferenceLine,
} from "recharts";
import {
  swipeAds, angles, topHooks, psychTriggers, reportOverview, angleLandscape, keyTakeaways,
  type SwipeAd,
} from "@/lib/reportData";
import {
  brands, hashtagData, peakTimeData, radarData,
} from "@/lib/analysisData";

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

const reportNav = [
  { id: 'overview', label: 'Report Overview', icon: '◈' },
  { id: 'swipefile', label: 'SwipeFile', icon: '📌' },
  { id: 'angle-landscape', label: 'Angle Landscape', icon: '🧭' },
  { id: 'angles', label: 'Angle Deep Dives', icon: '🔬' },
  { id: 'hooks', label: 'Top Hooks', icon: '🎣' },
  { id: 'psych-triggers', label: 'Psych Triggers', icon: '🧠' },
  { id: 'cross-brand', label: 'Cross-Brand Analysis', icon: '◉' },
  { id: 'takeaways', label: 'Key Takeaways', icon: '◆' },
];

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[oklch(0.14_0_0)] border border-[oklch(0.22_0_0)] rounded-lg p-3 shadow-xl text-sm">        <p className="font-semibold text-white mb-1">{label}</p>      {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color || entry.fill }} className="text-xs">
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── SECTION WRAPPER ──────────────────────────────────────────────────────────

const Section = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <section id={id} className="mb-12 scroll-mt-16">
    {children}
  </section>
);

const SectionTitle = ({ label, title, sub }: { label: string; title: string; sub?: string }) => (
  <div className="mb-6">
    <p className="section-label mb-2" style={{ color: 'oklch(0.72 0.15 55)' }}>{label}</p>
    <h2 className="text-3xl font-bold leading-tight" style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.97 0 0)', letterSpacing: '-0.03em' }}>
      {title}
    </h2>
    {sub && <p className="text-sm mt-1" style={{ color: 'oklch(0.45 0 0)' }}>{sub}</p>}
  </div>
);

// ─── AD CARD ─────────────────────────────────────────────────────────────────

const AdCard = ({ ad, index }: { ad: SwipeAd; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const formatBadgeColor: Record<string, string> = {
    Video: '#4A6FA5',
    Image: '#5A8A6A',
    Carousel: '#8B6FA5',
    DCO: '#C2714F',
  };
  return (
    <motion.div
      className="paper-card rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <div className="px-5 py-4 border-b border-[oklch(0.18_0_0)]" style={{ borderLeftColor: ad.brandColor, borderLeftWidth: 4 }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: ad.brandColor }}>
                {ad.brand}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: formatBadgeColor[ad.format] || '#888' }}>
                {ad.formatIcon} {ad.format}{ad.duration && ` · ${ad.duration}`}
              </span>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={ad.status === 'Active'
                  ? { background: 'oklch(0.72 0.15 145 / 0.12)', color: 'oklch(0.72 0.15 145)' }
                  : { background: 'oklch(0.18 0 0)', color: 'oklch(0.5 0 0)' }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1"
                  style={{ background: ad.status === 'Active' ? 'oklch(0.72 0.15 145)' : 'oklch(0.4 0 0)' }}
                />
                {ad.status}
              </span>
              {ad.discount && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'oklch(0.72 0.15 55 / 0.12)', color: 'oklch(0.72 0.15 55)' }}>{ad.discount}</span>
              )}
            </div>
            <p className="text-xs text-[oklch(0.5_0_0)]">
              {ad.startDate}{ad.endDate ? ` → ${ad.endDate}` : ''} · {ad.variations} variation{ad.variations !== 1 ? 's' : ''} · {ad.runningDuration}
            </p>
          </div>
          <span className="text-xs font-bold text-[oklch(0.55_0_0)]" style={{ fontFamily: 'var(--font-display)' }}>
            #{String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Creative Preview */}
        <div className="mb-4 rounded-lg overflow-hidden relative bg-[oklch(0.14_0_0)]" style={{ minHeight: 160 }}>
          {/* Loading skeleton */}
          {ad.thumbnailUrl && !imgLoaded && !imgError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 animate-pulse">
              <div className="w-10 h-10 rounded-full" style={{ background: 'oklch(0.2 0 0)' }} />
              <div className="h-2 w-24 rounded" style={{ background: 'oklch(0.2 0 0)' }} />
              <div className="h-2 w-16 rounded" style={{ background: 'oklch(0.2 0 0)' }} />
              <p className="text-xs text-[oklch(0.45_0_0)] mt-1">Loading creative…</p>
            </div>
          )}
          {/* Real screenshot */}
          {ad.thumbnailUrl && !imgError && (
            <img
              src={ad.thumbnailUrl}
              alt={`${ad.brandName || ad.brand} ad creative`}
              className={`w-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ maxHeight: 240, objectPosition: 'top' }}
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(false); }}
            />
          )}
          {/* Fallback: no thumbnail or image failed */}
          {(!ad.thumbnailUrl || imgError) && (
            <div className="flex flex-col items-center justify-center gap-3 py-8 px-4 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: `${ad.brandColor}20` }}>
                {ad.format === 'Video' ? '🎬' : ad.format === 'Carousel' ? '⧉' : '🖼'}
              </div>
              <p className="text-xs text-[oklch(0.55_0.015_60)] font-medium">{ad.format} Ad Creative</p>
              {ad.metaUrl && (
                <a
                  href={ad.metaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  style={{ backgroundColor: `${ad.brandColor}15`, color: ad.brandColor }}
                >
                  📸 View Ad Creative on Meta ↗
                </a>
              )}
            </div>
          )}
          {/* Format badge overlay (only when image loaded) */}
          {ad.thumbnailUrl && imgLoaded && !imgError && (
            <>
              {ad.isVideo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white text-xl ml-1">▶</span>
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 right-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white bg-black/60 backdrop-blur-sm">
                  {ad.isVideo ? '🎬 Video' : ad.format === 'Carousel' ? '⧉ Carousel' : '🖼 Image'}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="mb-3">
          <p className="section-label mb-1">Headline</p>
          <p className="text-sm font-semibold text-[oklch(0.97_0_0)]">{ad.headline}</p>
        </div>
        <div className="mb-3">
          <p className="section-label mb-1">Body Copy</p>
          <p className="text-sm text-[oklch(0.7_0_0)] leading-relaxed italic">
            "{expanded ? ad.fullBody : ad.bodyPreview}"
          </p>
          {ad.fullBody !== ad.bodyPreview && (
            <button onClick={() => setExpanded(!expanded)} className="text-xs mt-1 font-medium" style={{ color: ad.brandColor }}>
              {expanded ? '↑ Show less' : '↓ Read full copy'}
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[oklch(0.18_0_0)]">
          <div>
            <p className="section-label mb-0.5">Angle</p>
            <p className="text-xs text-[oklch(0.85_0_0)] font-medium">{ad.angle}</p>
          </div>
          <div>
            <p className="section-label mb-0.5">CTA</p>
            <p className="text-xs text-[oklch(0.85_0_0)] font-medium">{ad.cta}</p>
          </div>
          <div>
            <p className="section-label mb-0.5">Hook Type</p>
            <p className="text-xs text-[oklch(0.85_0_0)] font-medium leading-tight">{ad.hook.split(' — ')[0]}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex flex-wrap gap-1">
            {ad.platforms.map(p => (
              <span key={p} className="text-xs px-1.5 py-0.5 bg-[oklch(0.14_0_0)] text-[oklch(0.55_0_0)] rounded">{p}</span>
            ))}
          </div>
          {ad.metaUrl && (
            <a
              href={ad.metaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 hover:shadow-sm flex-shrink-0"
              style={{
                color: ad.brandColor,
                borderColor: ad.brandColor,
                backgroundColor: `${ad.brandColor}10`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = `${ad.brandColor}20`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = `${ad.brandColor}10`;
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
              </svg>
              View on Meta
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── ANGLE CARD ───────────────────────────────────────────────────────────────

const AngleCard = ({ angle }: { angle: typeof angles[0] }) => {
  const [open, setOpen] = useState(false);
  const relatedAds = swipeAds.filter(a => angle.adIds.includes(a.id));

  return (
    <div className="paper-card rounded-xl overflow-hidden mb-4">
      <button
        className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 transition-colors hover:bg-[oklch(0.14_0_0)]"
        onClick={() => setOpen(!open)}
        style={{ borderLeftColor: angle.color, borderLeftWidth: 4 }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">{angle.icon}</span>
          <div>
            <p className="section-label mb-1" style={{ color: angle.color }}>{angle.primaryBrand}</p>
            <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.97 0 0)', letterSpacing: '-0.02em' }}>{angle.title}</h3>
            <p className="text-sm mt-0.5 italic" style={{ color: 'oklch(0.45 0 0)' }}>{angle.subtitle}</p>
          </div>
        </div>
          <span className="text-lg mt-1 flex-shrink-0" style={{ color: 'oklch(0.35 0 0)' }}>{open ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6" style={{ borderTop: '1px solid oklch(0.18 0 0)' }}>
              <p className="text-sm leading-relaxed mt-4 mb-5" style={{ color: 'oklch(0.6 0 0)' }}>{angle.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {angle.metrics.map(m => (
                  <div key={m.label} className="rounded-lg p-3" style={{ background: 'oklch(0.13 0 0)', border: '1px solid oklch(0.18 0 0)' }}>
                    <p className="section-label mb-1">{m.label}</p>
                    <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: angle.color, letterSpacing: '-0.02em' }}>{m.value}</p>
                    {m.sub && <p className="text-xs mt-0.5" style={{ color: 'oklch(0.42 0 0)' }}>{m.sub}</p>}
                  </div>
                ))}
              </div>
              <div className="mb-5">
                <p className="section-label mb-3">Copy Examples</p>
                <div className="space-y-2">
                  {angle.examples.map((ex, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded text-white flex-shrink-0 mt-0.5" style={{ backgroundColor: ex.color }}>{ex.brand}</span>
                      <p className="text-sm italic leading-relaxed" style={{ color: 'oklch(0.6 0 0)' }}>"{ex.copy}"</p>
                    </div>
                  ))}
                </div>
              </div>
              {relatedAds.length > 0 && (
                <div>
                  <p className="section-label mb-3">Related SwipeFile Ads</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {relatedAds.map(ad => (
                      <div key={ad.id} className="rounded-lg p-3 text-xs" style={{ background: 'oklch(0.13 0 0)', border: `1px solid oklch(0.18 0 0)`, borderLeft: `3px solid ${ad.brandColor}` }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold" style={{ color: ad.brandColor }}>{ad.brand}</span>
                          <span style={{ color: 'oklch(0.45 0 0)' }}>{ad.format} · {ad.variations} variations</span>
                        </div>
                        <p className="font-medium" style={{ color: 'oklch(0.85 0 0)' }}>{ad.headline}</p>
                        <p className="mt-0.5" style={{ color: 'oklch(0.45 0 0)' }}>{ad.startDate} · {ad.runningDuration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── HOOK CARD ────────────────────────────────────────────────────────────────

const HookCard = ({ hook }: { hook: typeof topHooks[0] }) => {
  const stopRateColor: Record<string, string> = {
    'Very High': '#5A8A6A',
    'High': '#C2714F',
    'Medium-High': '#4A6FA5',
    'Medium': '#888',
  };
  return (
    <motion.div
        className="paper-card rounded-xl p-5 hover:border-[oklch(0.25_0_0)] transition-colors"
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: hook.rank * 0.06 }}
      viewport={{ once: true }}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: hook.brandColor, fontFamily: 'var(--font-display)' }}>
          {hook.rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: hook.brandColor }}>{hook.brand}</span>
            <span className="text-xs text-[oklch(0.55_0_0)] font-medium">{hook.hookType}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white ml-auto" style={{ backgroundColor: stopRateColor[hook.estimatedStopRate] || '#888' }}>
              {hook.estimatedStopRate} Stop Rate
            </span>
          </div>
          <blockquote className="text-base font-bold mb-2 leading-snug" style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.97 0 0)', letterSpacing: '-0.02em' }}>
            {hook.openingLine}
          </blockquote>
          <p className="text-xs mb-1" style={{ color: 'oklch(0.55 0 0)' }}><span className="font-semibold" style={{ color: 'oklch(0.72 0.15 55)' }}>Technique:</span> {hook.technique}</p>
          <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.6 0 0)' }}>{hook.whyItWorks}</p>
          <p className="text-xs mt-2" style={{ color: 'oklch(0.4 0 0)' }}>Format: {hook.adFormat}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── PSYCH TRIGGER CARD ───────────────────────────────────────────────────────

const PsychCard = ({ trigger }: { trigger: typeof psychTriggers[0] }) => {
  const categoryColors: Record<string, string> = {
    Emotional: '#C2714F',
    Cognitive: '#4A6FA5',
    Social: '#B5546A',
    Scarcity: '#5A8A6A',
  };
  return (
    <motion.div
      className="paper-card rounded-xl p-5"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      viewport={{ once: true }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{trigger.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.97 0 0)', letterSpacing: '-0.01em' }}>{trigger.trigger}</h4>
            <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: categoryColors[trigger.category] }}>{trigger.category}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'oklch(0.18 0 0)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: categoryColors[trigger.category] }}
              initial={{ width: 0 }}
              whileInView={{ width: `${trigger.strength}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            />
          </div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'oklch(0.6 0 0)' }}>{trigger.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3" style={{ borderTop: '1px solid oklch(0.18 0 0)' }}>
        <div>
          <p className="section-label mb-1 text-[#C2714F]">LFA Example</p>
          <p className="text-xs italic leading-relaxed" style={{ color: 'oklch(0.6 0 0)' }}>"{trigger.lfaExample}"</p>
        </div>
        <div>
          <p className="section-label mb-1 text-[#B5546A]">TFL Example</p>
          <p className="text-xs italic leading-relaxed" style={{ color: 'oklch(0.6 0 0)' }}>"{trigger.tflExample}"</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN REPORT PAGE ─────────────────────────────────────────────────────────

export default function Report() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [swipeFilter, setSwipeFilter] = useState<string>('All');
  const mainRef = useRef<HTMLDivElement>(null);
  const { config: wizardConfig, isCustomReport, clearConfig } = useReport();

  // ── Dynamic data: use wizard config when available, else fall back to demo data ──
  const activeAds = useMemo(() => {
    if (!isCustomReport || !wizardConfig) return swipeAds;
    return wizardConfig.ads.map(ad => {
      const brand = wizardConfig.brands.find(b => b.key === ad.brandKey);
      return {
        id: ad.id,
        brand: ad.brandKey as any,
        brandName: brand?.name || ad.brandKey,
        brandColor: brand?.color || '#888',
        status: ad.status,
        startDate: ad.startDate,
        endDate: ad.endDate,
        format: ad.format,
        formatIcon: ad.format === 'Video' ? '▶' : ad.format === 'Carousel' ? '⧉' : '🖼',
        variations: ad.variations,
        headline: ad.headline,
        cta: ad.cta,
        bodyPreview: ad.bodyPreview,
        fullBody: ad.fullBody,
        angle: ad.angle,
        hook: ad.hook,
        platforms: ad.platforms,
        runningDuration: ad.startDate && ad.endDate ? `${ad.startDate} – ${ad.endDate}` : ad.startDate ? `Since ${ad.startDate}` : 'Unknown',
        discount: ad.discount,
        thumbnailUrl: ad.thumbnailUrl,
        isVideo: ad.isVideo,
        metaUrl: ad.metaUrl,
      } as SwipeAd;
    });
  }, [isCustomReport, wizardConfig]);

  const activeBrandKeys = useMemo(() => {
    if (!isCustomReport || !wizardConfig) return ['LFA', 'TFL'];
    return wizardConfig.brands.map(b => b.key);
  }, [isCustomReport, wizardConfig]);

  const activeOverview = useMemo(() => {
    if (!isCustomReport || !wizardConfig) return reportOverview;
    const totalVariations = wizardConfig.ads.reduce((sum, a) => sum + (a.variations || 1), 0);
    return {
      ...reportOverview,
      date: wizardConfig.reportDate,
      source: wizardConfig.dataSource,
      competitorBrands: wizardConfig.brands.map(b => b.name),
      executiveSummary: wizardConfig.executiveSummary || reportOverview.executiveSummary,
      keyNumbers: [
        { value: String(wizardConfig.ads.length), label: 'Ads Analyzed', sub: wizardConfig.brands.map(b => b.key).join(' + ') },
        { value: String(totalVariations), label: 'Total Variations', sub: 'across all campaigns' },
        { value: String(wizardConfig.angles.length), label: 'Messaging Angles', sub: 'identified in category' },
        { value: String(wizardConfig.brands.length), label: 'Brands Analyzed', sub: 'competitor brands' },
        { value: String(wizardConfig.ads.filter(a => a.status === 'Active').length), label: 'Active Ads', sub: 'still running' },
        { value: `${Math.round((wizardConfig.ads.filter(a => a.format === 'Video').length / Math.max(wizardConfig.ads.length, 1)) * 100)}%`, label: 'Video Share', sub: 'of all paid creative' },
      ],
    };
  }, [isCustomReport, wizardConfig]);

  const activeAngleLandscape = useMemo(() => {
    if (!isCustomReport || !wizardConfig) return angleLandscape;
    return {
      intro: angleLandscape.intro,
      angles: wizardConfig.angles.map(a => ({ name: a.title, share: a.share, color: a.color, description: a.description })),
    };
  }, [isCustomReport, wizardConfig]);

  const activeTakeaways = useMemo(() => {
    if (!isCustomReport || !wizardConfig) return keyTakeaways;
    return wizardConfig.takeaways.map((t, i) => ({
      number: String(i + 1).padStart(2, '0'),
      title: t.title,
      body: t.body,
      icon: t.icon,
      color: t.color,
    }));
  }, [isCustomReport, wizardConfig]);

  const filteredAds = swipeFilter === 'All' ? activeAds : activeAds.filter(a => a.brand === swipeFilter);

  const angleBarData = activeAngleLandscape.angles.map(a => ({
    name: a.name.split(' ').slice(0, 2).join(' '),
    share: a.share,
    fill: a.color,
  }));

  const radarData = psychTriggers.map(t => ({
    trigger: t.trigger.split(' ')[0],
    strength: t.strength,
  }));

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    if (mainRef.current) {
      const el = mainRef.current.querySelector(`#${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'oklch(0.08 0 0)' }}>
      {/* Sidebar */}
      <aside className={`flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-14'} flex flex-col overflow-hidden`} style={{ background: 'oklch(0.06 0 0)', borderRight: '1px solid oklch(0.15 0 0)' }}>
        {/* Sidebar header */}
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid oklch(0.15 0 0)' }}>
          {sidebarOpen && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'oklch(0.72 0.15 55)' }}>Creative Report</p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: 'oklch(0.97 0 0)', letterSpacing: '-0.01em' }}>Competitor Analysis</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:text-white transition-colors p-1 rounded" style={{ color: 'oklch(0.4 0 0)' }}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto custom-scroll">
          {reportNav.map(section => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${isActive ? 'text-white' : 'hover:text-white'}`}
              style={isActive ? { background: 'oklch(0.14 0 0)', color: 'white' } : { color: 'oklch(0.5 0 0)' }}
              >
                <span className="text-base flex-shrink-0">{section.icon}</span>
                {sidebarOpen && <span className="text-sm truncate">{section.label}</span>}
                {sidebarOpen && isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'oklch(0.72 0.15 55)' }} />}
              </button>
            );
          })}
        </nav>

        {/* Back to dashboard */}
        <div className="px-3 pb-3 pt-3" style={{ borderTop: '1px solid oklch(0.15 0 0)' }}>
          <Link href="/dashboard">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all hover:text-white" style={{ background: 'oklch(0.13 0 0)', color: 'oklch(0.6 0 0)', border: '1px solid oklch(0.18 0 0)' }}>
              <span className="text-base flex-shrink-0">📊</span>
              {sidebarOpen && <span className="text-sm truncate font-medium">Brand Dashboard</span>}
            </button>
          </Link>
        </div>

        {/* New Report / Edit Report buttons */}
        <div className="px-3 pb-2">
          <Link href="/wizard">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all text-white" style={{ background: 'oklch(0.72 0.15 55)', color: 'oklch(0.08 0 0)', fontWeight: 600 }}>
              <span className="text-base flex-shrink-0">✦</span>
              {sidebarOpen && <span className="text-sm truncate font-semibold">{isCustomReport ? 'Edit Report' : 'New Report'}</span>}
            </button>
          </Link>
          {isCustomReport && sidebarOpen && (
            <button
              onClick={() => clearConfig()}
              className="w-full mt-1.5 text-xs text-[oklch(0.5_0.01_80)] hover:text-[#e8a090] transition-colors px-3 py-1.5 text-left"
            >
              ← Back to demo report
            </button>
          )}
        </div>

        {sidebarOpen && (
          <div className="p-4 border-t border-[oklch(0.28_0.015_50)]">
            <p className="text-xs text-[oklch(0.45_0.01_80)]">{isCustomReport && wizardConfig ? wizardConfig.reportDate : 'Feb 27, 2026'}</p>
            <p className="text-xs text-[oklch(0.45_0.01_80)]">
              {isCustomReport && wizardConfig
                ? `${wizardConfig.brands.map(b => b.key).join(' + ')} · ${wizardConfig.ads.length} Ads`
                : 'LFA + TFL · 10 Ads'}
            </p>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main ref={mainRef} className="flex-1 overflow-y-auto custom-scroll">
        {/* Top bar */}
        <div className="sticky top-0 z-10 px-6 py-3 flex items-center justify-between" style={{ background: 'oklch(0.08 0 0 / 0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid oklch(0.15 0 0)' }}>
          <div>
            <h1 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.97 0 0)', letterSpacing: '-0.02em' }}>
              Creative Intelligence Report
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isCustomReport && wizardConfig ? (
              <span className="text-xs text-[oklch(0.5_0_0)] hidden md:block">
                {wizardConfig.brands.length} brands · {wizardConfig.ads.length} ads · {wizardConfig.dataSource}
              </span>
            ) : (
              <span className="text-xs text-[oklch(0.5_0_0)] hidden md:block">2 brands · 10 ads · Meta Ads Library · Feb 2026</span>
            )}
            <div className="flex gap-1">
              {(isCustomReport && wizardConfig
                ? wizardConfig.brands.map(b => ({ color: b.color, label: b.key, emoji: b.emoji }))
                : [{ color: '#C2714F', label: 'LFA', emoji: '🗺' }, { color: '#B5546A', label: 'TFL', emoji: '💌' }]
              ).map(b => (
                <div key={b.label} className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center" style={{ backgroundColor: b.color }} title={b.label}>
                  {b.emoji}
                </div>
              ))}
            </div>
            <Link href="/wizard">
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" style={{ background: 'oklch(0.72 0.15 55)', color: 'oklch(0.08 0 0)' }}>
                {isCustomReport ? '✎ Edit Report' : '+ New Report'}
              </button>
            </Link>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6 max-w-5xl mx-auto">

          {/* ── SECTION 1: REPORT OVERVIEW ── */}
          <Section id="overview">
            <div className="paper-card rounded-xl overflow-hidden mb-6">
              <div className="p-8 text-white" style={{ background: 'linear-gradient(135deg, oklch(0.10 0 0) 0%, oklch(0.13 0.02 50) 100%)', borderBottom: '1px solid oklch(0.18 0 0)' }}>
                <p className="section-label mb-3" style={{ color: 'oklch(0.72 0.15 55)' }}>Report Overview</p>
                <h1 className="text-4xl md:text-5xl font-normal mb-3 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  {isCustomReport && wizardConfig ? wizardConfig.clientName : 'Post Script Society'} —<br />
                  <span style={{ color: '#e8a090' }}>{isCustomReport && wizardConfig ? wizardConfig.reportTitle : 'Competitor Creative Analysis'}</span>
                </h1>
                <p className="text-sm mb-1" style={{ color: 'oklch(0.45 0 0)' }}>{activeOverview.date} · {activeOverview.source}</p>
                <p className="text-[oklch(0.5_0_0)] text-sm">
                  Competitor brands: {activeOverview.competitorBrands.map((name, i) => (
                    <span key={name}>
                      <span className="text-white font-medium">{name}</span>
                      {i < activeOverview.competitorBrands.length - 1 && <span className="text-[oklch(0.5_0_0)]"> + </span>}
                    </span>
                  ))}
                </p>
              </div>
                  <div className="grid grid-cols-3 md:grid-cols-6" style={{ borderTop: '1px solid oklch(0.18 0 0)' }}>
                {activeOverview.keyNumbers.map(n => (
                  <div key={n.label} className="p-4 text-center" style={{ borderRight: '1px solid oklch(0.18 0 0)' }}>
                    <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.97 0 0)', letterSpacing: '-0.03em' }}>{n.value}</p>
                    <p className="text-xs mt-0.5 leading-tight" style={{ color: 'oklch(0.45 0 0)' }}>{n.label}</p>
                    {n.sub && <p className="text-xs text-[oklch(0.5_0_0)] mt-0.5">{n.sub}</p>}
                  </div>
                ))}
              </div>
            </div>
            <div className="paper-card rounded-xl p-6">
              <p className="section-label mb-3" style={{ color: 'oklch(0.72 0.15 55)' }}>Executive Summary</p>
              {activeOverview.executiveSummary.split('\n\n').map((para, i) => (
                <p key={i} className="text-sm leading-relaxed mb-3 last:mb-0" style={{ color: 'oklch(0.6 0 0)' }}>{para}</p>
              ))}
            </div>
          </Section>

          {/* ── SECTION 2: SWIPEFILE ── */}
          <Section id="swipefile">
            <SectionTitle
              label="Part 2: SwipeFile"
              title="10 Selected Ads from Meta Ads Library"
              sub="5 ads from Letters From Afar + 5 ads from The Flower Letters — mix of Video, Image, Carousel, and DCO formats"
            />
            <div className="flex flex-wrap gap-2 mb-6">
              {(['All', ...activeBrandKeys] as string[]).map(f => {
                const brand = isCustomReport && wizardConfig ? wizardConfig.brands.find(b => b.key === f) : null;
                const label = f === 'All' ? `All ${activeAds.length} Ads` : brand ? `${brand.emoji} ${brand.name}` : f;
                const color = f === 'All' ? '#2D2D2D' : brand?.color || '#C2714F';
                return (
                  <button
                    key={f}
                    onClick={() => setSwipeFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      swipeFilter === f ? 'text-white shadow-sm' : 'bg-[oklch(0.14_0_0)] text-[oklch(0.55_0_0)] hover:bg-[oklch(0.17_0_0)]'
                    }`}
                    style={swipeFilter === f ? { backgroundColor: color, color: 'oklch(0.08 0 0)' } : { background: 'oklch(0.14 0 0)', color: 'oklch(0.5 0 0)', border: '1px solid oklch(0.22 0 0)' }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Total Ads', value: '10', sub: '5 LFA + 5 TFL', color: '#2D2D2D' },
                { label: 'Total Variations', value: '93', sub: 'across all campaigns', color: '#C2714F' },
                { label: 'Video Ads', value: '8', sub: '80% of SwipeFile', color: '#B5546A' },
                { label: 'Active Campaigns', value: '7', sub: 'still running Feb 2026', color: '#5A8A6A' },
              ].map(s => (
                <div key={s.label} className="paper-card rounded-xl p-4">
                  <p className="section-label mb-1">{s.label}</p>
                  <p className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</p>
                  <p className="text-xs text-[oklch(0.5_0_0)] mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="wait">
                {filteredAds.map((ad, i) => <AdCard key={ad.id} ad={ad} index={i} />)}
              </AnimatePresence>
            </div>
          </Section>

          {/* ── SECTION 3: ANGLE LANDSCAPE ── */}
          <Section id="angle-landscape">
            <SectionTitle
              label="Part 3: Angle Landscape"
              title="Top Messaging Angles in the Category"
              sub="Five dominant creative angles identified across the mail subscription category"
            />
            <div className="paper-card rounded-xl p-6 mb-6">
              {activeAngleLandscape.intro.split('\n\n').map((para, i) => (
                <p key={i} className="text-sm text-[oklch(0.7_0_0)] leading-relaxed mb-3 last:mb-0">{para}</p>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="paper-card rounded-xl p-5">
                <p className="section-label mb-4">Angle Prevalence (% of ads using angle)</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={angleBarData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="oklch(0.18 0 0)" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: 'oklch(0.52 0.015 60)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'oklch(0.35 0.015 50)' }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="share" name="% of Ads" radius={[0, 3, 3, 0]}>
                      {angleBarData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="paper-card rounded-xl p-5">
                <p className="section-label mb-4">Angle Descriptions</p>
                <div className="space-y-3">
                  {activeAngleLandscape.angles.map(a => (
                    <div key={a.name} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: a.color }} />
                      <div>
                        <p className="text-sm font-medium text-[oklch(0.97_0_0)]">{a.name}</p>
                        <p className="text-xs text-[oklch(0.5_0_0)]">{a.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* ── SECTIONS 4–8: ANGLE DEEP DIVES ── */}
          <Section id="angles">
            <SectionTitle
              label="Creative Metrics by Angle"
              title="Five Angle Deep Dives"
              sub="Click any angle to expand its metrics, copy examples, and related SwipeFile ads"
            />
            {angles.map(angle => <AngleCard key={angle.id} angle={angle} />)}
          </Section>

          {/* ── SECTION 9: TOP HOOKS ── */}
          <Section id="hooks">
            <SectionTitle
              label="Part 4: Top Hooks (Video Only)"
              title="Scroll-Stopping Opening 3 Seconds"
              sub="Analysis of the opening hook techniques used across video ads in the SwipeFile"
            />
            <div className="paper-card rounded-xl p-5 mb-6">
              <p className="text-sm text-[oklch(0.7_0_0)] leading-relaxed">
                In a social feed where the average viewer decides whether to stop scrolling within 1.7 seconds, the opening hook is the single most important creative element. The analysis below ranks the six most effective hooks identified in the SwipeFile by estimated scroll-stop rate, technique type, and psychological mechanism.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topHooks.map(hook => <HookCard key={hook.rank} hook={hook} />)}
            </div>
            <div className="paper-card rounded-xl p-5 mt-4">
              <p className="section-label mb-4">Hook Type Distribution</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { type: 'Nostalgia Question', count: 2, color: '#C2714F', brands: 'LFA + TFL' },
                  { type: 'Curiosity Gap', count: 1, color: '#4A6FA5', brands: 'TFL' },
                  { type: 'Reframe / Contrast', count: 1, color: '#B5546A', brands: 'TFL' },
                  { type: 'Aspirational Scene', count: 1, color: '#5A8A6A', brands: 'LFA' },
                  { type: 'Visual Curiosity', count: 1, color: '#8B6FA5', brands: 'LFA' },
                ].map(h => (
                  <div key={h.type} className="bg-[oklch(0.13_0_0)] rounded-lg p-3">
                    <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)', color: h.color }}>{h.count}</p>
                    <p className="text-xs font-medium text-[oklch(0.85_0_0)] mt-0.5">{h.type}</p>
                    <p className="text-xs text-[oklch(0.5_0_0)]">{h.brands}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ── SECTION 10: PSYCHOLOGICAL TRIGGERS ── */}
          <Section id="psych-triggers">
            <SectionTitle
              label="Part 5: Psychological Trigger Analysis"
              title="Key Conversion Triggers Across Creative"
              sub="Eight psychological mechanisms driving purchase decisions in the mail subscription category"
            />
            <div className="paper-card rounded-xl p-5 mb-6">
              <p className="section-label mb-4">Trigger Strength Across Category</p>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="oklch(0.18 0 0)" />
                  <PolarAngleAxis dataKey="trigger" tick={{ fontSize: 11, fill: 'oklch(0.35 0.015 50)' }} />
                  <Radar name="Strength" dataKey="strength" stroke="#C2714F" fill="#C2714F" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {psychTriggers.map(trigger => <PsychCard key={trigger.trigger} trigger={trigger} />)}
            </div>
          </Section>

           {/* ── SECTION 7: CROSS-BRAND ANALYSIS ── */}
          <Section id="cross-brand">
            <SectionTitle
              label="Cross-Brand Analysis"
              title="All Four Brands — Comparative Intelligence"
              sub="Multi-dimensional comparison across ad volume, organic reach, social proof, and messaging strategy"
            />

            {/* Peak time comparison */}
            <div className="paper-card rounded-xl p-5 mb-6">
              <p className="section-label mb-4">Peak Posting Activity — All Brands (Monthly)</p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month, i) => ({
                    month,
                    LFA: peakTimeData.lfa[i].intensity,
                    TFL: peakTimeData.tfl[i].intensity,
                    SMC: peakTimeData.smc[i].intensity,
                    TFM: peakTimeData.tfm[i].intensity,
                  }))}
                  margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.18 0 0)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'oklch(0.52 0.015 60)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'oklch(0.52 0.015 60)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine x="Nov" stroke="oklch(0.35 0 0)" strokeDasharray="4 4" label={{ value: 'Holiday Peak', fontSize: 10, fill: 'oklch(0.45 0 0)' }} />
                  <Line type="monotone" dataKey="LFA" stroke="#C2714F" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="TFL" stroke="#B5546A" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="SMC" stroke="#4A6FA5" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="TFM" stroke="#5A8A6A" strokeWidth={2} dot={false} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Hashtag comparison */}
            <div className="paper-card rounded-xl p-5 mb-6">
              <p className="section-label mb-4">Hashtag Strategy Comparison</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {brands.map(brand => (
                  <div key={brand.key}>
                    <div className="flex items-center gap-2 mb-3">
                      <span>{brand.emoji}</span>
                      <span className="text-sm font-semibold text-[oklch(0.85_0_0)]">{brand.shortName}</span>
                      <span className="text-xs text-[oklch(0.5_0_0)]">— {hashtagData[brand.key].length} tags/emojis</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {hashtagData[brand.key].slice(0, 6).map(tag => (
                        <span key={tag.tag} className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: brand.color, opacity: 0.6 + (tag.frequency / 300) }}>
                          {tag.tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messaging pillars comparison table */}
            <div className="paper-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[oklch(0.18_0_0)]">
                <p className="section-label">Messaging Pillars by Brand</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'oklch(0.13 0 0)' }}>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'oklch(0.45 0 0)' }}>Dimension</th>
                      {brands.map(b => (
                        <th key={b.key} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: b.color }}>{b.shortName}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Primary Emotion', values: ['Wonder & Adventure', 'Nostalgia & Romance', 'Curiosity & Discovery', 'Connection & Warmth'] },
                      { label: 'Core Hook', values: ['Explorer narrative', '"Lost magic" of mail', 'Couch travel fantasy', 'Care package from friend'] },
                      { label: 'Anti-Digital Angle', values: ['Screen-free for kids', 'Anti-digital world', 'Airport-free travel', 'Slow down from digital'] },
                      { label: 'Paid Hashtags', values: ['None (emoji-only)', 'None (emoji-only)', 'N/A (no paid ads)', 'N/A (no paid ads)'] },
                      { label: 'Social Proof', values: ['Absent', 'Testimonials (named)', 'Absent', 'Community milestones'] },
                      { label: 'Discount Strategy', values: ['10% Off', '$55–$70 Off', 'None found', 'HOLIDAY20 code'] },
                    ].map((row, i) => (
                      <tr key={row.label} style={{ background: i % 2 === 0 ? 'oklch(0.1 0 0)' : 'oklch(0.12 0 0)' }}>
                        <td className="px-4 py-3 font-medium text-[oklch(0.85_0_0)] text-xs">{row.label}</td>
                        {row.values.map((v, j) => (
                          <td key={j} className="px-4 py-3 text-xs text-[oklch(0.55_0_0)]">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          {/* ── SECTION 8: KEY TAKEAWAYS ── */}
          <Section id="takeaways">
            <SectionTitle
              label="Key Takeaways & Category Insights"
              title="Strategic Insights for Creative Strategists"
              sub="Six actionable findings from the competitor creative analysis"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {activeTakeaways.map((t, i) => (
                <motion.div
                  key={t.number}
                  className="paper-card rounded-xl p-6"
                  style={{ borderLeftColor: t.color, borderLeftWidth: 4 }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start gap-4">
                    <div>
                      <span className="text-3xl block mb-2" style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.3 0 0)' }}>{t.number}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{t.icon}</span>
                        <h3 className="text-base font-medium text-[oklch(0.97_0_0)]" style={{ fontFamily: 'var(--font-display)' }}>{t.title}</h3>
                      </div>
                      <p className="text-sm text-[oklch(0.7_0_0)] leading-relaxed">{t.body}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Final comparison table */}
            <div className="paper-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[oklch(0.18_0_0)]">
                <p className="section-label">LFA vs. TFL — Strategic Comparison</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                      <tr style={{ background: 'oklch(0.13 0 0)' }}>
                      {['Dimension', '🗺 Letters From Afar', '💌 The Flower Letters'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'oklch(0.45 0 0)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Creative Testing', 'Moderate (3–4 variations)', 'Aggressive (up to 55 variations)'],
                      ['Primary Angle', 'Nostalgic Adventure', 'Nostalgia + Gift Positioning'],
                      ['Discount Strategy', '10% Off (soft)', '$30–$70 Off (aggressive)'],
                      ['Social Proof', 'Absent in paid ads', 'Named testimonials in every ad'],
                      ['Hook Style', 'Nostalgia question + visual', 'Nostalgia + curiosity gap + reframe'],
                      ['Campaign Longevity', '3–3.5 months avg.', '5–9 months avg.'],
                      ['Paid Media Maturity', 'Established, consistent', 'Advanced, DCO-ready'],
                      ['Ad Formats Used', 'Video, Image, Carousel', 'Video (dominant), DCO'],
                    ].map(([dim, lfa, tfl], i) => (
                      <tr key={dim} style={{ background: i % 2 === 0 ? 'oklch(0.1 0 0)' : 'oklch(0.12 0 0)' }}>
                        <td className="px-4 py-3 font-medium text-[oklch(0.85_0_0)] text-xs">{dim}</td>
                        <td className="px-4 py-3 text-xs text-[oklch(0.55_0_0)]">{lfa}</td>
                        <td className="px-4 py-3 text-xs text-[oklch(0.55_0_0)]">{tfl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[oklch(0.18_0_0)] text-center text-xs text-[oklch(0.5_0_0)]">
              <p>Analysis conducted February 27, 2026 · Data sourced from Meta Ads Library (US) · 10 ads analyzed across 2 competitor brands</p>
              <p className="mt-1">All ad copy reproduced for competitive analysis purposes only</p>
            </div>
          </Section>

        </div>
      </main>
    </div>
  );
}
