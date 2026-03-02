/**
 * ReportDetail — Premium magazine-quality competitor ad intelligence report.
 * Loads saved report config from DB by ID via trpc.research.getReport.
 *
 * Sections:
 *  1. Nav bar + dot-grid hero header with stat strip
 *  2. Executive Summary + Category Context
 *  3. Competitor Brand Overview (stat cards)
 *  4. Messaging Angle Landscape (horizontal bar chart + cards)
 *  5. Swipe File (ad cards with full body copy)
 *  6. Top Hooks Breakdown (scored list)
 *  7. Psychological Triggers (scored cards)
 *  8. Platform Distribution (pie + bar)
 *  9. Brand Comparison Table
 * 10. Opportunity Gaps
 * 11. Strategic Narrative
 * 12. Key Takeaways
 */

import React, { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import type { ReportConfig, WizardBrand, WizardAngle, WizardAd } from "@/contexts/ReportContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, Legend,
} from "recharts";
import type { BrandProfile, StrategicRecommendation, ExecutiveSummaryBullet, AdVolumePoint } from "@/contexts/ReportContext";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg: "#F7F5F0",
  bgAlt: "#F0EDE8",
  white: "#ffffff",
  border: "#E5E0D8",
  text: "#1A1714",
  textSub: "#4A3F36",
  textMuted: "#6B5E52",
  textFaint: "#9C8E80",
  accent: "#C2714F",
  accentLight: "#FBF5F1",
  accentBorder: "#E8D5C8",
  green: "#4A7C59",
  greenLight: "#EDF5F0",
  greenBorder: "#BBD9C6",
  blue: "#2B5BA8",
  blueLight: "#EEF3FC",
  blueBorder: "#C3D5F5",
  amber: "#B8860B",
  amberLight: "#FFF8E6",
  amberBorder: "#FDE68A",
  serif: "'DM Serif Display', Georgia, serif",
  sans: "'DM Sans', system-ui, sans-serif",
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const, delay },
  }),
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const priorityStyle = (p: string) => {
  if (p === "High") return { color: "#B91C1C", bg: "#FEF2F2", border: "#FECACA" };
  if (p === "Medium") return { color: T.amber, bg: T.amberLight, border: T.amberBorder };
  return { color: T.textMuted, bg: T.bgAlt, border: T.border };
};

const effectivenessColor = (e: string) =>
  e === "High" ? T.green : e === "Medium" ? T.accent : T.textFaint;

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-sm shadow-lg" style={{ background: T.white, border: `1px solid ${T.border}` }}>
      <p className="font-semibold mb-0.5" style={{ color: T.text }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.fill || entry.color }}>
          {entry.name}: <span className="font-bold">{entry.value}{entry.name === "Share" ? "%" : ""}</span>
        </p>
      ))}
    </div>
  );
};

// ─── SECTION DIVIDER ──────────────────────────────────────────────────────────
const Divider = () => (
  <div className="flex items-center gap-4 my-14">
    <div className="flex-1 h-px" style={{ background: T.border }} />
    <span className="text-xs" style={{ color: T.textFaint }}>✦</span>
    <div className="flex-1 h-px" style={{ background: T.border }} />
  </div>
);

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
const SectionHeader = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => (
  <div className="mb-8">
    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: T.accent }}>✦ {eyebrow}</p>
    <h2 className="text-3xl font-bold leading-tight mb-2" style={{ fontFamily: T.serif, color: T.text, letterSpacing: "-0.02em" }}>
      {title}
    </h2>
    {subtitle && <p className="text-base" style={{ color: T.textMuted }}>{subtitle}</p>}
    <div className="mt-4 h-px" style={{ background: T.border }} />
  </div>
);

// ─── FORMAT BADGE ─────────────────────────────────────────────────────────────
const FormatBadge = ({ format }: { format: string }) => {
  const isVideo = format === "Video";
  const isCarousel = format === "Carousel";
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: isVideo ? "#EEF3FC" : isCarousel ? "#EDF5F0" : "#F5F0FF",
        color: isVideo ? T.blue : isCarousel ? T.green : "#6B4FBB",
        border: `1px solid ${isVideo ? T.blueBorder : isCarousel ? T.greenBorder : "#D4C5F5"}`,
      }}
    >
      {isVideo ? (
        <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor">
          <path d="M2 2l8 4-8 4V2z" />
        </svg>
      ) : isCarousel ? (
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="2" width="4" height="8" rx="0.5" />
          <rect x="7" y="2" width="4" height="8" rx="0.5" />
        </svg>
      ) : (
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="1" width="10" height="10" rx="1" />
          <circle cx="4" cy="4" r="1" fill="currentColor" stroke="none" />
          <path d="M1 8l3-3 2 2 2-2 3 3" />
        </svg>
      )}
      {format}
    </span>
  );
};

// ─── AD CARD ──────────────────────────────────────────────────────────────────
const AdCard = ({ ad, brands, index }: { ad: WizardAd; brands: WizardBrand[]; index: number }) => {
  const brand = brands.find(b => b.key === ad.brandKey);
  const [expanded, setExpanded] = React.useState(false);
  const isActive = ad.status === "Active";
  const cardNum = String(index + 1).padStart(2, "0");

  // Build a gradient placeholder for cards without screenshots
  const placeholderGradient = brand
    ? `linear-gradient(135deg, ${brand.color}22 0%, ${brand.color}08 100%)`
    : `linear-gradient(135deg, ${T.bgAlt} 0%, ${T.bg} 100%)`;

  return (
    <motion.div
      variants={fadeUp} custom={index * 0.05} initial="hidden" animate="visible"
      className="rounded-2xl border flex flex-col overflow-hidden"
      style={{ background: T.white, borderColor: T.border, boxShadow: "0 2px 12px rgba(26,23,20,0.08)" }}
    >
      {/* ── CARD HEADER ─────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-2">
        {/* Row 1: brand tag + format badge + card number */}
        <div className="flex items-center gap-2 mb-2">
          {brand && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${brand.color}20`, color: brand.color, border: `1px solid ${brand.color}50` }}
            >
              {brand.key}
            </span>
          )}
          <FormatBadge format={ad.format} />
          <span className="ml-auto text-xs font-bold" style={{ color: T.textFaint }}>#{cardNum}</span>
        </div>

        {/* Row 2: status + discount */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: isActive ? T.green : T.textFaint }}>
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: isActive ? T.green : T.textFaint }}
            />
            {ad.status}
          </span>
          {ad.discount && (
            <span className="text-xs font-bold" style={{ color: T.accent }}>{ad.discount}</span>
          )}
        </div>

        {/* Row 3: date · variations · duration */}
        <p className="text-xs" style={{ color: T.textFaint }}>
          {ad.startDate}
          {ad.variations > 1 && ` · ${ad.variations} variations`}
          {ad.runningDuration && ` · ${ad.runningDuration}`}
        </p>
      </div>

      {/* ── THUMBNAIL ───────────────────────────────────────────────────── */}
      <div
        className="relative mx-4 mb-0 rounded-xl overflow-hidden"
        style={{ aspectRatio: "4/3", background: placeholderGradient }}
      >
        {ad.thumbnailUrl ? (
          <img
            src={ad.thumbnailUrl}
            alt={ad.headline}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          // Styled placeholder with brand initial
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            {brand && (
              <span
                className="text-4xl font-bold opacity-20"
                style={{ fontFamily: T.serif, color: brand.color }}
              >
                {brand.name.charAt(0)}
              </span>
            )}
            <span className="text-xs font-medium opacity-30" style={{ color: T.textMuted }}>Ad Preview</span>
          </div>
        )}
        {/* Format overlay badge */}
        <div className="absolute bottom-2 right-2">
          <FormatBadge format={ad.format} />
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3 flex flex-col flex-1 gap-3">
        {/* Headline */}
        {ad.headline && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: T.textFaint }}>Headline</p>
            <h4 className="text-base font-bold leading-snug" style={{ fontFamily: T.serif, color: T.text }}>{ad.headline}</h4>
          </div>
        )}

        {/* Body copy */}
        {(ad.fullBody || ad.bodyPreview) && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: T.textFaint }}>Body Copy</p>
            <p className="text-sm leading-relaxed italic" style={{ color: T.textSub }}>
              "{expanded ? (ad.fullBody || ad.bodyPreview) : (ad.bodyPreview || ad.fullBody?.slice(0, 120))}"
            </p>
            {(ad.fullBody?.length ?? 0) > 120 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs font-medium mt-1 flex items-center gap-1"
                style={{ color: T.accent }}
              >
                <span style={{ fontSize: "10px" }}>↓</span>
                {expanded ? "Collapse" : "Read full copy"}
              </button>
            )}
          </div>
        )}

        {/* Angle / CTA / Hook row */}
        <div className="grid grid-cols-3 gap-2 pt-2" style={{ borderTop: `1px solid ${T.border}` }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: T.textFaint }}>Angle</p>
            <p className="text-xs font-medium leading-snug" style={{ color: T.text }}>{ad.angle || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: T.textFaint }}>CTA</p>
            <p className="text-xs font-medium" style={{ color: T.text }}>{ad.cta || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: T.textFaint }}>Hook Type</p>
            <p className="text-xs font-medium leading-snug" style={{ color: T.text }}>{ad.hook ? ad.hook.slice(0, 40) : "—"}</p>
          </div>
        </div>

        {/* Platform tags */}
        {ad.platforms?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {ad.platforms.map((p: string) => (
              <span
                key={p}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: T.bgAlt, color: T.textMuted, border: `1px solid ${T.border}` }}
              >
                {p}
              </span>
            ))}
          </div>
        )}

        {/* View on Meta button */}
        {ad.metaUrl ? (
          <a
            href={ad.metaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold transition-colors"
            style={{ background: T.white, color: T.text, border: `1px solid ${T.border}` }}
          >
            {/* Facebook icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            View on Meta
            <span style={{ fontSize: "10px" }}>↗</span>
          </a>
        ) : (
          <div
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold"
            style={{ background: T.bgAlt, color: T.textFaint, border: `1px solid ${T.border}` }}
          >
            {/* Facebook icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#9C8E80">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            View on Meta
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── LOADING SKELETON ─────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6 py-12">
    <div className="h-10 rounded-xl w-2/3" style={{ background: T.bgAlt }} />
    <div className="h-4 rounded-lg w-1/3" style={{ background: T.bgAlt }} />
    <div className="h-36 rounded-2xl" style={{ background: T.bgAlt }} />
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-28 rounded-2xl" style={{ background: T.bgAlt }} />)}
    </div>
  </div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ReportDetail() {
  const [, params] = useRoute("/reports/:id");
  const reportId = params?.id ? parseInt(params.id, 10) : null;
  const { user, loading: authLoading } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = trpc.research.getReport.useQuery(
    { id: reportId! },
    { enabled: !!reportId && !!user }
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: T.bg }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: T.accent }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: T.bg }}>
        <p className="text-lg font-semibold" style={{ fontFamily: T.serif, color: T.text }}>Sign in to view your reports</p>
        <a href={getLoginUrl()} className="px-6 py-3 rounded-xl text-white font-medium text-sm" style={{ background: T.accent }}>
          Sign In
        </a>
      </div>
    );
  }

  const config = data?.config as (ReportConfig & {
    strategicNarrative?: string;
    categoryContext?: string;
    psychTriggers?: any[];
    topHooks?: any[];
    platformBreakdown?: any[];
    brandComparison?: any[];
    opportunityGaps?: any[];
    brandProfiles?: BrandProfile[];
    adVolumeTimeline?: AdVolumePoint[];
    strategicRecommendations?: StrategicRecommendation[];
    executiveSummaryBullets?: ExecutiveSummaryBullet[];
  }) | null;

  return (
    <div className="min-h-screen" style={{ background: T.bg, color: T.text, fontFamily: T.sans }}>

      {/* ── NAV BAR ─────────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
        style={{ background: "rgba(247,245,240,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.border}` }}
      >
        <div className="flex items-center gap-3">
          <Link href="/"><span className="font-bold text-base cursor-pointer" style={{ fontFamily: T.serif, color: T.text }}>Scout</span></Link>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: T.accentLight, color: T.accent, border: `1px solid ${T.accentBorder}` }}>Beta</span>
          {config && <span className="text-xs hidden sm:block" style={{ color: T.textFaint }}>/ {config.clientName}</span>}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/reports">
            <button className="text-xs font-medium px-3 py-1.5 rounded-lg hidden sm:block" style={{ color: T.textMuted, border: `1px solid ${T.border}`, background: T.white }}>
              ← My Reports
            </button>
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: copied ? T.greenLight : T.white, color: copied ? T.green : T.textMuted, border: `1px solid ${copied ? T.greenBorder : T.border}` }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
            {copied ? "Copied!" : "Share"}
          </button>
          <Link href="/wizard">
            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: T.accent, color: T.white }}>
              + New Report
            </button>
          </Link>
        </div>
      </nav>

      {/* ── LOADING / ERROR ─────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="max-w-5xl mx-auto px-6"><LoadingSkeleton /></div>
      )}

      {error && (
        <div className="max-w-5xl mx-auto px-6 text-center py-24">
          <p className="text-lg font-semibold mb-2" style={{ fontFamily: T.serif, color: T.text }}>Could not load report</p>
          <p className="text-sm mb-6" style={{ color: T.textMuted }}>{error.message}</p>
          <Link href="/reports">
            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: T.accent, color: T.white }}>Back to My Reports</button>
          </Link>
        </div>
      )}

      {config && (
        <>
          {/* ── HERO HEADER ─────────────────────────────────────────────────── */}
          <div
            className="relative overflow-hidden px-6 py-16"
            style={{ background: `radial-gradient(ellipse at 60% 50%, ${T.accentLight} 0%, ${T.bg} 70%)`, borderBottom: `1px solid ${T.border}` }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: `radial-gradient(circle, ${T.accentBorder} 1px, transparent 1px)`,
              backgroundSize: "28px 28px", opacity: 0.35,
            }} />
            <div className="relative max-w-5xl mx-auto">
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: T.accent }}>✦ Competitor Creative Intelligence Report</span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={data?.isAiOnly
                      ? { color: T.textMuted, background: T.bgAlt, border: `1px solid ${T.border}` }
                      : { color: T.green, background: T.greenLight, border: `1px solid ${T.greenBorder}` }}
                  >
                    {data?.isAiOnly ? "AI Analysis" : `${data?.totalAdsAnalyzed} real ads`}
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-2" style={{ fontFamily: T.serif, color: T.text, letterSpacing: "-0.03em" }}>
                  {config.clientName}
                </h1>
                <p className="text-xl italic mb-2" style={{ color: T.accent, fontFamily: T.serif }}>{config.reportTitle}</p>
                <p className="text-sm" style={{ color: T.textMuted }}>{config.reportDate} · {config.dataSource}</p>
              </motion.div>

              {/* Stat strip */}
              <motion.div variants={fadeUp} custom={0.15} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
                {[
                  { label: "Ads Analyzed", value: String(config.ads?.length || data?.totalAdsAnalyzed || "—") },
                  { label: "Competitors", value: String(config.brands?.length || "—") },
                  { label: "Messaging Angles", value: String(config.angles?.length || "—") },
                  { label: "Key Takeaways", value: String(config.takeaways?.length || "—") },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl px-4 py-3 text-center" style={{ background: T.white, border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(26,23,20,0.05)" }}>
                    <p className="text-2xl font-bold" style={{ fontFamily: T.serif, color: T.accent }}>{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
          <div className="max-w-5xl mx-auto px-6 py-16 space-y-0">

            {/* ── 1. EXECUTIVE SUMMARY ──────────────────────────────────────── */}
            {config.executiveSummary && (
              <>
                <motion.section variants={fadeUp} custom={0.05} initial="hidden" animate="visible">
                  <SectionHeader eyebrow="Overview" title="Executive Summary" subtitle={config.categoryContext || undefined} />
                  {/* Skimmable bullet cards */}
                  {(config.executiveSummaryBullets?.length ?? 0) > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {(config.executiveSummaryBullets ?? []).map((b: ExecutiveSummaryBullet, i: number) => (
                        <motion.div key={i} variants={fadeUp} custom={i * 0.06} initial="hidden" animate="visible"
                          className="rounded-xl p-5 flex items-start gap-3"
                          style={{ background: T.white, border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(26,23,20,0.05)" }}>
                          <span className="text-xl flex-shrink-0">{b.icon}</span>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: b.color }}>{b.label}</p>
                            <p className="text-sm leading-relaxed" style={{ color: T.textSub }}>{b.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : null}
                  {/* Full narrative below bullets */}
                  <div className="rounded-2xl p-8" style={{ background: T.white, border: `1px solid ${T.border}`, boxShadow: "0 1px 6px rgba(26,23,20,0.06)" }}>
                    <p className="text-base leading-relaxed" style={{ color: T.textSub }}>{config.executiveSummary}</p>
                  </div>
                </motion.section>
                <Divider />
              </>
            )}

            {/* ── 2. COMPETITOR BRANDS ──────────────────────────────────────── */}
            {config.brands?.length > 0 && (
              <>
                <section>
                  <SectionHeader eyebrow="Competitors" title="Brands Under Analysis" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {config.brands.map((brand, i) => {
                      const comparison = config.brandComparison?.find((b: any) => b.brandKey === brand.key);
                      return (
                        <motion.div key={brand.key} variants={fadeUp} custom={i * 0.08} initial="hidden" animate="visible"
                          className="rounded-2xl p-6" style={{ background: T.white, border: `1px solid ${T.border}`, boxShadow: "0 1px 6px rgba(26,23,20,0.06)" }}>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{brand.emoji}</span>
                            <div>
                              <h3 className="text-lg font-bold" style={{ fontFamily: T.serif, color: T.text }}>{brand.name}</h3>
                              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: brand.color }}>{brand.key}</span>
                            </div>
                          </div>
                          {comparison && (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {[
                                { label: "Ads Analyzed", value: String(comparison.adCount) },
                                { label: "Avg Run Days", value: `${comparison.avgRunDays}d` },
                                { label: "Top Angle", value: comparison.topAngle },
                                { label: "Top Format", value: comparison.topFormat },
                                { label: "CTA Style", value: comparison.ctaStyle },
                                { label: "Tone", value: comparison.toneOfVoice },
                              ].map((item) => (
                                <div key={item.label} className="rounded-lg p-2.5" style={{ background: T.bgAlt }}>
                                  <p className="text-xs mb-0.5" style={{ color: T.textFaint }}>{item.label}</p>
                                  <p className="font-semibold text-xs leading-snug" style={{ color: T.text }}>{item.value}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
                <Divider />
              </>
            )}

                {/* ── 2b. BRAND PROFILES (What's Working / What's Missing) ────── */}
            {(config.brandProfiles?.length ?? 0) > 0 && (
              <>
                <section>
                  <SectionHeader eyebrow="Brand Deep Dive" title="What Each Brand Is Doing" subtitle="A breakdown of each competitor's creative strengths and gaps" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {(config.brandProfiles ?? []).map((profile: BrandProfile, i: number) => (
                      <motion.div key={profile.brandKey} variants={fadeUp} custom={i * 0.08} initial="hidden" animate="visible"
                        className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}`, boxShadow: "0 1px 6px rgba(26,23,20,0.06)" }}>
                        {/* Header */}
                        <div className="px-6 py-4 flex items-center gap-3" style={{ background: `${profile.color}12`, borderBottom: `1px solid ${profile.color}30` }}>
                          <span className="text-3xl">{profile.emoji}</span>
                          <div className="flex-1">
                            <h3 className="font-bold text-base" style={{ fontFamily: T.serif, color: T.text }}>{profile.brandName}</h3>
                            <p className="text-xs" style={{ color: T.textMuted }}>{profile.toneOfVoice} · Primary CTA: {profile.primaryCTA}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold" style={{ fontFamily: T.serif, color: profile.color }}>{profile.adCount}</p>
                            <p className="text-xs" style={{ color: T.textFaint }}>ads</p>
                          </div>
                        </div>
                        {/* Unique strength */}
                        {profile.uniqueStrength && (
                          <div className="px-6 py-3" style={{ background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
                            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: T.accent }}>Unique Strength</p>
                            <p className="text-sm italic" style={{ color: T.textSub }}>"{profile.uniqueStrength}"</p>
                          </div>
                        )}
                        <div className="p-6 grid grid-cols-1 gap-4" style={{ background: T.white }}>
                          {/* What's Working */}
                          {profile.whatsWorking?.length > 0 && (
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: T.green }}>
                                <span>✓</span> What's Working
                              </p>
                              <ul className="space-y-1.5">
                                {profile.whatsWorking.map((item: string, j: number) => (
                                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: T.textSub }}>
                                    <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs" style={{ background: T.greenLight, color: T.green }}>✓</span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {/* What's Not Working */}
                          {profile.whatsNotWorking?.length > 0 && (
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "#B91C1C" }}>
                                <span>▲</span> Gaps & Weaknesses
                              </p>
                              <ul className="space-y-1.5">
                                {profile.whatsNotWorking.map((item: string, j: number) => (
                                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: T.textSub }}>
                                    <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs" style={{ background: "#FEF2F2", color: "#B91C1C" }}>▲</span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {/* Quick stats */}
                          <div className="grid grid-cols-3 gap-2 pt-2" style={{ borderTop: `1px solid ${T.border}` }}>
                            {[
                              { label: "Avg Run", value: `${profile.avgRunDays}d` },
                              { label: "Top Angle", value: profile.topAngle },
                              { label: "Format", value: profile.dominantFormat },
                            ].map((stat) => (
                              <div key={stat.label} className="rounded-lg p-2 text-center" style={{ background: T.bgAlt }}>
                                <p className="text-xs" style={{ color: T.textFaint }}>{stat.label}</p>
                                <p className="text-xs font-semibold mt-0.5 leading-snug" style={{ color: T.text }}>{stat.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
                <Divider />
              </>
            )}

            {/* ── 3. MESSAGING ANGLES ───────────────────────────────────── */}
            {config.angles?.length > 0 && (
              <>
                <section>
                  <SectionHeader eyebrow="Messaging Strategy" title="Angle Landscape" subtitle="Distribution of creative angles across all competitor ads" />
                  <div className="rounded-2xl p-6 mb-6" style={{ background: T.white, border: `1px solid ${T.border}`, boxShadow: "0 1px 6px rgba(26,23,20,0.06)" }}>
                    <ResponsiveContainer width="100%" height={Math.max(200, config.angles.length * 42)}>
                      <BarChart data={config.angles.map((a: WizardAngle) => ({ ...a, share: a.share != null && a.share <= 1 ? Math.round(a.share * 100) : a.share }))} layout="vertical" margin={{ left: 8, right: 40, top: 8, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: T.textFaint }} />
                        <YAxis type="category" dataKey="title" width={160} tick={{ fontSize: 12, fill: T.text }} />
                        <Tooltip content={<CustomBarTooltip />} />
                        <Bar dataKey="share" name="Share" radius={[0, 6, 6, 0]}>
                          {config.angles.map((a: WizardAngle, i: number) => <Cell key={i} fill={a.color || T.accent} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {config.angles.map((angle: WizardAngle, i: number) => (
                      <motion.div key={angle.id} variants={fadeUp} custom={i * 0.06} initial="hidden" animate="visible"
                        className="rounded-xl p-5" style={{ background: T.white, border: `1px solid ${T.border}` }}>
                        <div className="flex items-start gap-3">
                          <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ background: angle.color }} />
                          <div className="flex-1">
                            <p className="font-bold text-sm mb-1" style={{ color: T.text }}>{angle.title}</p>
                            <div className="w-full h-1.5 rounded-full mb-2" style={{ background: T.bgAlt }}>
                              <div className="h-full rounded-full" style={{ width: `${angle.share != null && angle.share <= 1 ? Math.round(angle.share * 100) : angle.share}%`, background: angle.color }} />
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: T.textMuted }}>{angle.description}</p>
                          </div>
                          <span className="text-sm font-bold flex-shrink-0" style={{ color: angle.color }}>{angle.share != null && angle.share <= 1 ? Math.round(angle.share * 100) : angle.share}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
                <Divider />
              </>
            )}

            {/* ── 4. SWIPE FILE ───────────────────────────────────────────────────── */}
            {config.ads?.length > 0 && (
              <>
                <section>
                  <SectionHeader
                    eyebrow="Swipe File"
                    title="Ad Creative Library"
                    subtitle={data?.isAiOnly
                      ? `${config.ads.length} AI-reconstructed ads based on known category patterns`
                      : `${config.ads.length} top-performing ads from the Meta Ads Library`
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {config.ads.map((ad: WizardAd, i: number) => (
                      <AdCard key={ad.id} ad={ad} brands={config.brands} index={i} />
                    ))}
                  </div>
                </section>
                <Divider />
              </>
            )}

            {/* ── 5. TOP HOOKS ──────────────────────────────────────────────── */}
            {(config.topHooks?.length ?? 0) > 0 && (
              <>
                <section>
                  <SectionHeader eyebrow="Hook Analysis" title="Top Performing Hooks" subtitle="The opening lines and attention-grabbers competitors use most effectively" />
                  <div className="space-y-3">
                    {(config.topHooks ?? []).map((hook: any, i: number) => {
                      const brand = config.brands?.find((b: WizardBrand) => b.key === hook.brand);
                      return (
                        <motion.div key={i} variants={fadeUp} custom={i * 0.04} initial="hidden" animate="visible"
                          className="rounded-xl p-5 flex items-start gap-4" style={{ background: T.white, border: `1px solid ${T.border}` }}>
                          <span className="text-2xl font-bold w-8 flex-shrink-0 text-center" style={{ fontFamily: T.serif, color: T.border }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold leading-snug mb-2" style={{ color: T.text }}>"{hook.text}"</p>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: T.bgAlt, color: T.textMuted, border: `1px solid ${T.border}` }}>
                                {hook.type}
                              </span>
                              {brand && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${brand.color}18`, color: brand.color, border: `1px solid ${brand.color}40` }}>
                                  {brand.name}
                                </span>
                              )}
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                                background: hook.effectiveness === "High" ? T.greenLight : hook.effectiveness === "Medium" ? T.accentLight : T.bgAlt,
                                color: effectivenessColor(hook.effectiveness),
                                border: `1px solid ${hook.effectiveness === "High" ? T.greenBorder : hook.effectiveness === "Medium" ? T.accentBorder : T.border}`,
                              }}>
                                {hook.effectiveness} effectiveness
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="text-sm font-bold" style={{ color: T.accent }}>{hook.score}</span>
                            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: T.bgAlt }}>
                              <div className="h-full rounded-full" style={{ width: `${hook.score}%`, background: T.accent }} />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
                <Divider />
              </>
            )}

            {/* ── 6. PSYCHOLOGICAL TRIGGERS ─────────────────────────────────── */}
            {(config.psychTriggers?.length ?? 0) > 0 && (
              <>
                <section>
                  <SectionHeader eyebrow="Psychology" title="Psychological Triggers" subtitle="The emotional and cognitive levers competitors activate in their ad copy" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {(config.psychTriggers ?? []).map((trigger: any, i: number) => (
                      <motion.div key={i} variants={fadeUp} custom={i * 0.06} initial="hidden" animate="visible"
                        className="rounded-2xl p-6" style={{ background: T.white, border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(26,23,20,0.05)" }}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: trigger.color || T.accent }} />
                            <h4 className="font-bold text-sm" style={{ color: T.text }}>{trigger.trigger}</h4>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{
                            background: trigger.frequency === "High" ? T.greenLight : trigger.frequency === "Medium" ? T.accentLight : T.bgAlt,
                            color: trigger.frequency === "High" ? T.green : trigger.frequency === "Medium" ? T.accent : T.textFaint,
                            border: `1px solid ${trigger.frequency === "High" ? T.greenBorder : trigger.frequency === "Medium" ? T.accentBorder : T.border}`,
                          }}>
                            {trigger.frequency}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed mb-4" style={{ color: T.textMuted }}>{trigger.description}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: T.bgAlt }}>
                            <div className="h-full rounded-full" style={{ width: `${trigger.score}%`, background: trigger.color || T.accent }} />
                          </div>
                          <span className="text-xs font-bold w-8 text-right" style={{ color: trigger.color || T.accent }}>{trigger.score}</span>
                        </div>
                        {trigger.brands?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {trigger.brands.map((bKey: string) => {
                              const b = config.brands?.find((br: WizardBrand) => br.key === bKey);
                              return b ? (
                                <span key={bKey} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${b.color}18`, color: b.color, border: `1px solid ${b.color}40` }}>
                                  {b.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </section>
                <Divider />
              </>
            )}

            {/* ── 7. PLATFORM DISTRIBUTION ──────────────────────────────────── */}
            {(config.platformBreakdown?.length ?? 0) > 0 && (
              <>
                <section>
                  <SectionHeader eyebrow="Distribution" title="Platform Breakdown" subtitle="Where competitors are running their ads across the Meta network" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="rounded-2xl p-6" style={{ background: T.white, border: `1px solid ${T.border}` }}>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie data={(config.platformBreakdown ?? []).map((p: any) => ({ ...p, share: p.share != null && p.share <= 1 ? Math.round(p.share * 100) : p.share }))} dataKey="share" nameKey="platform" cx="50%" cy="50%" outerRadius={80}
                            label={({ platform, share }: any) => `${platform} ${share}%`} labelLine={false}>
                            {(config.platformBreakdown ?? []).map((p: any, i: number) => <Cell key={i} fill={p.color} />)}
                          </Pie>
                          <Tooltip formatter={(v: any) => [`${v}%`, "Share"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {(config.platformBreakdown ?? []).map((p: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 rounded-xl p-4" style={{ background: T.white, border: `1px solid ${T.border}` }}>
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.color }} />
                          <div className="flex-1">
                            <p className="text-sm font-semibold mb-1" style={{ color: T.text }}>{p.platform}</p>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: T.bgAlt }}>
                              <div className="h-full rounded-full" style={{ width: `${p.share != null && p.share <= 1 ? Math.round(p.share * 100) : p.share}%`, background: p.color }} />
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold" style={{ color: p.color }}>{p.share != null && p.share <= 1 ? Math.round(p.share * 100) : p.share}%</p>
                            <p className="text-xs" style={{ color: T.textFaint }}>{p.adCount} ads</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
                <Divider />
              </>
            )}

            {/* ── 8. BRAND COMPARISON TABLE ─────────────────────────────────── */}
            {(config.brandComparison?.length ?? 0) > 0 && (
              <>
                <section>
                  <SectionHeader eyebrow="Competitive Intelligence" title="Brand Comparison Matrix" subtitle="Side-by-side analysis of how each competitor approaches their creative strategy" />
                  <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}`, boxShadow: "0 1px 6px rgba(26,23,20,0.06)" }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
                          {["Brand", "Ads", "Avg Run", "Top Angle", "Top Format", "CTA Style", "Tone"].map((h) => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: T.textMuted }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(config.brandComparison ?? []).map((b: any, i: number) => {
                          const brand = config.brands?.find((br: WizardBrand) => br.key === b.brandKey);
                          return (
                            <tr key={i} style={{ background: i % 2 === 0 ? T.white : T.bg, borderBottom: `1px solid ${T.border}` }}>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  {brand && <span className="text-base">{brand.emoji}</span>}
                                  <span className="font-semibold" style={{ color: brand?.color || T.text }}>{b.brandName}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 font-bold" style={{ color: T.accent }}>{b.adCount}</td>
                              <td className="px-4 py-3" style={{ color: T.textMuted }}>{b.avgRunDays}d</td>
                              <td className="px-4 py-3" style={{ color: T.text }}>{b.topAngle}</td>
                              <td className="px-4 py-3">
                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: T.bgAlt, color: T.textMuted, border: `1px solid ${T.border}` }}>
                                  {b.topFormat}
                                </span>
                              </td>
                              <td className="px-4 py-3" style={{ color: T.textMuted }}>{b.ctaStyle}</td>
                              <td className="px-4 py-3 italic text-xs" style={{ color: T.textMuted }}>{b.toneOfVoice}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
                <Divider />
              </>
            )}

            {/* ── 9. OPPORTUNITY GAPS ───────────────────────────────────────── */}
            {(config.opportunityGaps?.length ?? 0) > 0 && (
              <>
                <section>
                  <SectionHeader eyebrow="Strategy" title="Opportunity Gaps" subtitle={`Where ${config.clientName} can differentiate from the competition`} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {(config.opportunityGaps ?? []).map((gap: any, i: number) => {
                      const s = priorityStyle(gap.priority);
                      return (
                        <motion.div key={i} variants={fadeUp} custom={i * 0.06} initial="hidden" animate="visible"
                          className="rounded-2xl p-6" style={{ background: T.white, border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(26,23,20,0.05)" }}>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h4 className="font-bold text-sm leading-snug" style={{ fontFamily: T.serif, color: T.text }}>{gap.title}</h4>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                              {gap.priority}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: T.textMuted }}>{gap.description}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
                <Divider />
              </>
            )}

            {/* ── 10. STRATEGIC NARRATIVE ───────────────────────────────────── */}
            {config.strategicNarrative && (
              <>
                <section>
                  <SectionHeader eyebrow="Deep Dive" title="Strategic Narrative" subtitle="A detailed analysis of the competitive landscape and what it means for your brand" />
                  <div className="rounded-2xl p-8 space-y-5" style={{ background: T.white, border: `1px solid ${T.border}`, boxShadow: "0 1px 6px rgba(26,23,20,0.06)" }}>
                    {config.strategicNarrative.split("\n\n").filter(Boolean).map((para: string, i: number) => (
                      <p key={i} className="text-base leading-relaxed" style={{ color: i === 0 ? T.textSub : T.textMuted }}>{para}</p>
                    ))}
                  </div>
                </section>
                <Divider />
              </>
            )}

            {/* ── 11. KEY TAKEAWAYS ─────────────────────────────────────────── */}
            {config.takeaways?.length > 0 && (
              <section>
                <SectionHeader eyebrow="Conclusions" title="Key Takeaways" subtitle={`What ${config.clientName} should know and act on from this analysis`} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {config.takeaways.map((t: any, i: number) => (
                    <motion.div key={i} variants={fadeUp} custom={i * 0.06} initial="hidden" animate="visible"
                      className="rounded-2xl p-6" style={{ background: T.white, border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(26,23,20,0.05)" }}>
                      <div className="flex items-start gap-4">
                        <span className="text-2xl flex-shrink-0">{t.icon}</span>
                        <div>
                          <h4 className="font-bold text-sm mb-2" style={{ fontFamily: T.serif, color: T.text }}>{t.title}</h4>
                          <p className="text-xs leading-relaxed" style={{ color: T.textMuted }}>{t.body}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* ── 9. AD VOLUME TIMELINE ──────────────────────────────────── */}
            {(config.adVolumeTimeline?.length ?? 0) > 0 && (
              <>
                <section>
                  <SectionHeader eyebrow="Activity" title="Ad Volume Over Time" subtitle="How many ads each competitor was running across the observed period" />
                  <div className="rounded-2xl p-6" style={{ background: T.white, border: `1px solid ${T.border}`, boxShadow: "0 1px 6px rgba(26,23,20,0.06)" }}>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={config.adVolumeTimeline ?? []} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.textFaint }} />
                        <YAxis tick={{ fontSize: 11, fill: T.textFaint }} />
                        <Tooltip contentStyle={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                        {config.brands?.map((b: WizardBrand, i: number) => (
                          <Line key={b.key} type="monotone" dataKey={b.key} name={b.name} stroke={b.color} strokeWidth={2} dot={{ r: 3, fill: b.color }} />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </section>
                <Divider />
              </>
            )}

            {/* ── 10. STRATEGIC RECOMMENDATIONS ─────────────────────────────── */}
            {(config.strategicRecommendations?.length ?? 0) > 0 && (
              <section>
                <SectionHeader eyebrow="Action Plan" title="Strategic Recommendations" subtitle="What Post Script Society should do differently based on this competitive analysis" />
                <div className="space-y-4">
                  {(config.strategicRecommendations ?? []).map((rec: StrategicRecommendation, i: number) => (
                    <motion.div key={i} variants={fadeUp} custom={i * 0.06} initial="hidden" animate="visible"
                      className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(26,23,20,0.05)" }}>
                      <div className="px-6 py-4 flex items-center gap-4" style={{ background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
                        <span className="text-2xl flex-shrink-0">{rec.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm" style={{ fontFamily: T.serif, color: T.text }}>{rec.title}</h4>
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{
                              background: rec.priority === "High" ? T.accentLight : rec.priority === "Medium" ? T.greenLight : T.bgAlt,
                              color: rec.priority === "High" ? T.accent : rec.priority === "Medium" ? T.green : T.textFaint,
                              border: `1px solid ${rec.priority === "High" ? T.accentBorder : rec.priority === "Medium" ? T.greenBorder : T.border}`,
                            }}>{rec.priority} Priority</span>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: T.bgAlt, color: T.textMuted, border: `1px solid ${T.border}` }}>Effort: {rec.effort}</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-6 py-5" style={{ background: T.white }}>
                        <p className="text-sm leading-relaxed mb-3" style={{ color: T.textSub }}>{rec.rationale}</p>
                        {rec.action && (
                          <div className="flex items-start gap-2 mt-2 p-3 rounded-lg" style={{ background: T.accentLight, border: `1px solid ${T.accentBorder}` }}>
                            <span className="text-xs font-bold uppercase tracking-wider flex-shrink-0 mt-0.5" style={{ color: T.accent }}>Action</span>
                            <p className="text-sm" style={{ color: T.text }}>{rec.action}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* ── FOOTER ────────────────────────────────────────────────────── */}
            <div className="mt-20 pt-8 flex items-center justify-between" style={{ borderTop: `1px solid ${T.border}` }}>
              <p className="text-xs" style={{ color: T.textFaint }}>
                Generated by <span style={{ fontFamily: T.serif, color: T.accent }}>Scout</span> · {config.reportDate}
              </p>
              <div className="flex items-center gap-3">
                <Link href="/reports">
                  <button className="text-xs font-medium px-4 py-2 rounded-lg" style={{ border: `1px solid ${T.border}`, color: T.textMuted, background: T.white }}>
                    ← All Reports
                  </button>
                </Link>
                <Link href="/wizard">
                  <button className="text-xs font-semibold px-4 py-2 rounded-lg" style={{ background: T.accent, color: T.white }}>
                    + New Report
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
