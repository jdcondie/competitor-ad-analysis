/**
 * Report.tsx — Scout Creative Intelligence Report
 *
 * Design: Light editorial — matches Landing.tsx exactly
 * Palette: Off-white (#F7F5F0) bg, near-black (#1A1714) text, terracotta (#C2714F) accent
 * Typography: DM Serif Display (headings) + DM Sans (body)
 * Layout: Scout nav bar + full-width scrollable content (no sidebar)
 */

import { useState, useRef, useMemo, useCallback } from "react";
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
  brands, hashtagData, peakTimeData,
} from "@/lib/analysisData";

// ─── SHARE TOAST ─────────────────────────────────────────────────────────────
const ShareToast = ({ visible }: { visible: boolean }) => (
  <div
    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2.5 px-5 py-3 rounded-full shadow-xl transition-all duration-300"
    style={{
      background: "#1A1714",
      color: "#F7F5F0",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      fontSize: 14,
      fontWeight: 500,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(16px)",
      pointerEvents: "none",
    }}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
    Link copied to clipboard
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </div>
);

// ─── DESIGN TOKENS (match Landing.tsx) ────────────────────────────────────────
const T = {
  bg: "#F7F5F0",
  bgAlt: "#F0EDE8",
  white: "#ffffff",
  border: "#E5E0D8",
  borderStrong: "#C8BEB4",
  text: "#1A1714",
  textSub: "#4A3F36",
  textMuted: "#6B5E52",
  textFaint: "#9C8E80",
  accent: "#C2714F",
  accentLight: "#FBF5F1",
  accentBorder: "#E8D5C8",
  serif: "'DM Serif Display', Georgia, serif",
  sans: "'DM Sans', system-ui, sans-serif",
};

// ─── FADE-UP ANIMATION (same as Landing.tsx) ──────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  }),
};

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border px-3 py-2 shadow-xl text-sm" style={{ background: T.white, borderColor: T.border }}>
        <p className="font-semibold mb-1" style={{ color: T.text, fontFamily: T.serif }}>{label}</p>
        {payload.map((entry: any, i: number) => (
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
  <section id={id} className="scroll-mt-20 mb-20">
    {children}
  </section>
);

// ─── EDITORIAL SECTION HEADER ─────────────────────────────────────────────────
const SectionHeader = ({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) => (
  <motion.div
    variants={fadeUp}
    custom={0}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="mb-10"
  >
    <p
      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border mb-4"
      style={{ color: T.accent, borderColor: T.accentBorder, background: T.accentLight }}
    >
      {eyebrow}
    </p>
    <h2
      className="text-3xl md:text-4xl font-bold leading-tight mb-2"
      style={{ fontFamily: T.serif, letterSpacing: "-0.02em", color: T.text }}
    >
      {title}
    </h2>
    {sub && <p className="text-base leading-relaxed" style={{ color: T.textSub }}>{sub}</p>}
  </motion.div>
);

// ─── EDITORIAL DIVIDER ────────────────────────────────────────────────────────
const Divider = () => (
  <div className="flex items-center gap-4 my-16">
    <div className="flex-1 h-px" style={{ background: T.border }} />
    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: T.textFaint }}>✦</span>
    <div className="flex-1 h-px" style={{ background: T.border }} />
  </div>
);

// ─── WHITE CARD ───────────────────────────────────────────────────────────────
const Card = ({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div
    className={`rounded-2xl border ${className}`}
    style={{ background: T.white, borderColor: T.border, boxShadow: "0 1px 4px rgba(26,23,20,0.06)", ...style }}
  >
    {children}
  </div>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ value, label, sub, color }: { value: string; label: string; sub?: string; color?: string }) => (
  <motion.div
    variants={fadeUp}
    custom={0.05}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="flex flex-col items-center px-4 py-5 rounded-2xl border text-center"
    style={{ background: T.white, borderColor: T.border }}
  >
    <span
      className="text-3xl font-bold mb-1"
      style={{ fontFamily: T.serif, color: color || T.accent }}
    >
      {value}
    </span>
    <span className="text-xs leading-tight" style={{ color: T.textMuted }}>{label}</span>
    {sub && <span className="text-xs mt-0.5" style={{ color: T.textFaint }}>{sub}</span>}
  </motion.div>
);

// ─── AD CARD ─────────────────────────────────────────────────────────────────
const AdCard = ({ ad, index }: { ad: SwipeAd; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const formatBadgeColor: Record<string, string> = {
    Video: "#4A6FA5",
    Image: "#5A8A6A",
    Carousel: "#8B6FA5",
    DCO: T.accent,
  };
  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.04}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-2xl border overflow-hidden transition-all hover:shadow-md"
      style={{ background: T.white, borderColor: T.border, boxShadow: "0 1px 4px rgba(26,23,20,0.06)" }}
    >
      {/* Card header */}
      <div
        className="px-5 py-4 border-b"
        style={{ borderColor: T.border, borderLeftColor: ad.brandColor, borderLeftWidth: 4 }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: ad.brandColor }}
              >
                {ad.brand}
              </span>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: formatBadgeColor[ad.format] || "#888" }}
              >
                {ad.formatIcon} {ad.format}{ad.duration && ` · ${ad.duration}`}
              </span>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={
                  ad.status === "Active"
                    ? { background: "#E8F5EE", color: "#2D7A4F" }
                    : { background: T.bgAlt, color: T.textMuted }
                }
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1"
                  style={{ background: ad.status === "Active" ? "#2D7A4F" : "#9C8E80" }}
                />
                {ad.status}
              </span>
              {ad.discount && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: T.accentLight, color: T.accent }}
                >
                  {ad.discount}
                </span>
              )}
            </div>
            <p className="text-xs" style={{ color: T.textMuted }}>
              {ad.startDate}{ad.endDate ? ` → ${ad.endDate}` : ""} · {ad.variations} variation{ad.variations !== 1 ? "s" : ""} · {ad.runningDuration}
            </p>
          </div>
          <span className="text-xs font-bold" style={{ fontFamily: T.serif, color: T.textMuted }}>
            #{String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Creative preview */}
        <div
          className="mb-4 rounded-xl overflow-hidden relative"
          style={{ minHeight: 160, background: T.bgAlt }}
        >
          {ad.thumbnailUrl && !imgLoaded && !imgError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 animate-pulse">
              <div className="w-10 h-10 rounded-full" style={{ background: T.border }} />
              <div className="h-2 w-24 rounded" style={{ background: T.border }} />
              <p className="text-xs" style={{ color: T.textMuted }}>Loading creative…</p>
            </div>
          )}
          {ad.thumbnailUrl && !imgError && (
            <img
              src={ad.thumbnailUrl}
              alt={`${ad.brandName || ad.brand} ad creative`}
              className={`w-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              style={{ maxHeight: 240, objectPosition: "top" }}
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(false); }}
            />
          )}
          {(!ad.thumbnailUrl || imgError) && (
            <div className="flex flex-col items-center justify-center gap-3 py-8 px-4 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${ad.brandColor}20` }}
              >
                {ad.format === "Video" ? "🎬" : ad.format === "Carousel" ? "⧉" : "🖼"}
              </div>
              <p className="text-xs font-medium" style={{ color: T.textSub }}>{ad.format} Ad Creative</p>
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
                  {ad.isVideo ? "🎬 Video" : ad.format === "Carousel" ? "⧉ Carousel" : "🖼 Image"}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="mb-3">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: T.textFaint }}
          >
            Headline
          </p>
          <p className="text-sm font-semibold" style={{ color: T.text }}>{ad.headline}</p>
        </div>
        <div className="mb-3">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: T.textFaint }}
          >
            Body Copy
          </p>
          <p className="text-sm leading-relaxed italic" style={{ color: T.textSub }}>
            "{expanded ? ad.fullBody : ad.bodyPreview}"
          </p>
          {ad.fullBody !== ad.bodyPreview && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs mt-1 font-medium"
              style={{ color: ad.brandColor }}
            >
              {expanded ? "↑ Show less" : "↓ Read full copy"}
            </button>
          )}
        </div>

        <div
          className="grid grid-cols-3 gap-3 pt-3 border-t"
          style={{ borderColor: T.border }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: T.textFaint }}>Angle</p>
            <p className="text-xs font-medium" style={{ color: T.text }}>{ad.angle}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: T.textFaint }}>CTA</p>
            <p className="text-xs font-medium" style={{ color: T.text }}>{ad.cta}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: T.textFaint }}>Hook Type</p>
            <p className="text-xs font-medium leading-tight" style={{ color: T.text }}>{ad.hook.split(" — ")[0]}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex flex-wrap gap-1">
            {ad.platforms.map((p) => (
              <span
                key={p}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ background: T.bgAlt, color: T.textSub }}
              >
                {p}
              </span>
            ))}
          </div>
          {ad.metaUrl && (
            <a
              href={ad.metaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 hover:shadow-sm flex-shrink-0"
              style={{
                borderColor: ad.brandColor,
                backgroundColor: `${ad.brandColor}10`,
                color: ad.brandColor,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = `${ad.brandColor}20`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = `${ad.brandColor}10`;
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
              </svg>
              View on Meta
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
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
  const relatedAds = swipeAds.filter((a) => angle.adIds.includes(a.id));

  return (
    <motion.div
      variants={fadeUp}
      custom={0}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-2xl border overflow-hidden mb-4 transition-all hover:shadow-md"
      style={{ background: T.white, borderColor: T.border, boxShadow: "0 1px 4px rgba(26,23,20,0.06)" }}
    >
      <button
        className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 transition-colors hover:bg-[#F7F5F0]"
        onClick={() => setOpen(!open)}
        style={{ borderLeftColor: angle.color, borderLeftWidth: 4 }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">{angle.icon}</span>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: angle.color }}
            >
              {angle.primaryBrand}
            </p>
            <h3
              className="text-xl font-bold"
              style={{ fontFamily: T.serif, color: T.text, letterSpacing: "-0.02em" }}
            >
              {angle.title}
            </h3>
            <p className="text-sm mt-0.5 italic" style={{ color: T.textMuted }}>{angle.subtitle}</p>
          </div>
        </div>
        <span className="text-lg mt-1 flex-shrink-0" style={{ color: T.textFaint }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6" style={{ borderTop: `1px solid ${T.border}` }}>
              <p className="text-sm leading-relaxed mt-4 mb-5" style={{ color: T.textSub }}>
                {angle.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {angle.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl p-3 border"
                    style={{ background: T.bg, borderColor: T.border }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: T.textFaint }}>
                      {m.label}
                    </p>
                    <p
                      className="text-lg font-bold"
                      style={{ fontFamily: T.serif, color: angle.color, letterSpacing: "-0.02em" }}
                    >
                      {m.value}
                    </p>
                    {m.sub && <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>{m.sub}</p>}
                  </div>
                ))}
              </div>
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: T.textFaint }}>
                  Copy Examples
                </p>
                <div className="space-y-2">
                  {angle.examples.map((ex, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded text-white flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: ex.color }}
                      >
                        {ex.brand}
                      </span>
                      <p className="text-sm italic leading-relaxed" style={{ color: T.textSub }}>
                        "{ex.copy}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {relatedAds.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: T.textFaint }}>
                    Related SwipeFile Ads
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {relatedAds.map((ad) => (
                      <div
                        key={ad.id}
                        className="rounded-xl p-3 text-xs border"
                        style={{ background: T.bg, borderColor: T.border, borderLeft: `3px solid ${ad.brandColor}` }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold" style={{ color: ad.brandColor }}>{ad.brand}</span>
                          <span style={{ color: T.textMuted }}>{ad.format} · {ad.variations} variations</span>
                        </div>
                        <p className="font-medium" style={{ color: T.text }}>{ad.headline}</p>
                        <p className="mt-0.5" style={{ color: T.textMuted }}>{ad.startDate} · {ad.runningDuration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── HOOK CARD ────────────────────────────────────────────────────────────────
const HookCard = ({ hook }: { hook: typeof topHooks[0] }) => {
  const stopRateColor: Record<string, string> = {
    "Very High": "#5A8A6A",
    "High": T.accent,
    "Medium-High": "#4A6FA5",
    "Medium": "#888",
  };
  return (
    <motion.div
      variants={fadeUp}
      custom={hook.rank * 0.06}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-2xl border p-5 transition-all hover:shadow-md"
      style={{ background: T.white, borderColor: T.border, boxShadow: "0 1px 4px rgba(26,23,20,0.06)" }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
          style={{ backgroundColor: hook.brandColor, fontFamily: T.serif }}
        >
          {hook.rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: hook.brandColor }}
            >
              {hook.brand}
            </span>
            <span className="text-xs font-medium" style={{ color: T.textSub }}>{hook.hookType}</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white ml-auto"
              style={{ backgroundColor: stopRateColor[hook.estimatedStopRate] || "#888" }}
            >
              {hook.estimatedStopRate} Stop Rate
            </span>
          </div>
          <blockquote
            className="text-base font-bold mb-2 leading-snug"
            style={{ fontFamily: T.serif, color: T.text, letterSpacing: "-0.02em" }}
          >
            {hook.openingLine}
          </blockquote>
          <p className="text-xs mb-1" style={{ color: T.textSub }}>
            <span className="font-semibold" style={{ color: T.accent }}>Technique:</span> {hook.technique}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: T.textSub }}>{hook.whyItWorks}</p>
          <p className="text-xs mt-2" style={{ color: T.textMuted }}>Format: {hook.adFormat}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── PSYCH TRIGGER CARD ───────────────────────────────────────────────────────
const PsychCard = ({ trigger }: { trigger: typeof psychTriggers[0] }) => {
  const categoryColors: Record<string, string> = {
    Emotional: T.accent,
    Cognitive: "#4A6FA5",
    Social: "#B5546A",
    Scarcity: "#5A8A6A",
  };
  return (
    <motion.div
      variants={fadeUp}
      custom={0}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-2xl border p-5 transition-all hover:shadow-md"
      style={{ background: T.white, borderColor: T.border, boxShadow: "0 1px 4px rgba(26,23,20,0.06)" }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{trigger.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className="font-semibold"
              style={{ fontFamily: T.serif, color: T.text, letterSpacing: "-0.01em" }}
            >
              {trigger.trigger}
            </h4>
            <span
              className="text-xs px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: categoryColors[trigger.category] }}
            >
              {trigger.category}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: T.border }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: categoryColors[trigger.category] }}
              initial={{ width: 0 }}
              whileInView={{ width: `${trigger.strength}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            />
          </div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: T.textSub }}>{trigger.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3" style={{ borderTop: `1px solid ${T.border}` }}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: T.accent }}>LFA Example</p>
          <p className="text-xs italic leading-relaxed" style={{ color: T.textSub }}>"{trigger.lfaExample}"</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#B5546A" }}>TFL Example</p>
          <p className="text-xs italic leading-relaxed" style={{ color: T.textSub }}>"{trigger.tflExample}"</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN REPORT PAGE ─────────────────────────────────────────────────────────
export default function Report() {
  const [swipeFilter, setSwipeFilter] = useState<string>("All");
  const { config: wizardConfig, isCustomReport, clearConfig } = useReport();

  // ── Dynamic data: use wizard config when available, else fall back to demo data ──
  const activeAds = useMemo(() => {
    if (!isCustomReport || !wizardConfig) return swipeAds;
    return wizardConfig.ads.map((ad) => {
      const brand = wizardConfig.brands.find((b) => b.key === ad.brandKey);
      return {
        id: ad.id,
        brand: ad.brandKey as any,
        brandName: brand?.name || ad.brandKey,
        brandColor: brand?.color || "#888",
        status: ad.status,
        startDate: ad.startDate,
        endDate: ad.endDate,
        format: ad.format,
        formatIcon: ad.format === "Video" ? "▶" : ad.format === "Carousel" ? "⧉" : "🖼",
        variations: ad.variations,
        headline: ad.headline,
        cta: ad.cta,
        bodyPreview: ad.bodyPreview,
        fullBody: ad.fullBody,
        angle: ad.angle,
        hook: ad.hook,
        platforms: ad.platforms,
        runningDuration: ad.startDate && ad.endDate ? `${ad.startDate} – ${ad.endDate}` : ad.startDate ? `Since ${ad.startDate}` : "Unknown",
        discount: ad.discount,
        thumbnailUrl: ad.thumbnailUrl,
        isVideo: ad.isVideo,
        metaUrl: ad.metaUrl,
      } as SwipeAd;
    });
  }, [isCustomReport, wizardConfig]);

  const activeBrandKeys = useMemo(() => {
    if (!isCustomReport || !wizardConfig) return ["LFA", "TFL"];
    return wizardConfig.brands.map((b) => b.key);
  }, [isCustomReport, wizardConfig]);

  const activeOverview = useMemo(() => {
    if (!isCustomReport || !wizardConfig) return reportOverview;
    const totalVariations = wizardConfig.ads.reduce((sum, a) => sum + (a.variations || 1), 0);
    return {
      ...reportOverview,
      date: wizardConfig.reportDate,
      source: wizardConfig.dataSource,
      competitorBrands: wizardConfig.brands.map((b) => b.name),
      executiveSummary: wizardConfig.executiveSummary || reportOverview.executiveSummary,
      keyNumbers: [
        { value: String(wizardConfig.ads.length), label: "Ads Analyzed", sub: wizardConfig.brands.map((b) => b.key).join(" + ") },
        { value: String(totalVariations), label: "Total Variations", sub: "across all campaigns" },
        { value: String(wizardConfig.angles.length), label: "Messaging Angles", sub: "identified in category" },
        { value: String(wizardConfig.brands.length), label: "Brands Analyzed", sub: "competitor brands" },
        { value: String(wizardConfig.ads.filter((a) => a.status === "Active").length), label: "Active Ads", sub: "still running" },
        {
          value: `${Math.round((wizardConfig.ads.filter((a) => a.format === "Video").length / Math.max(wizardConfig.ads.length, 1)) * 100)}%`,
          label: "Video Share",
          sub: "of all paid creative",
        },
      ],
    };
  }, [isCustomReport, wizardConfig]);

  const activeAngleLandscape = useMemo(() => {
    if (!isCustomReport || !wizardConfig) return angleLandscape;
    return {
      intro: angleLandscape.intro,
      angles: wizardConfig.angles.map((a) => ({ name: a.title, share: a.share, color: a.color, description: a.description })),
    };
  }, [isCustomReport, wizardConfig]);

  const activeTakeaways = useMemo(() => {
    if (!isCustomReport || !wizardConfig) return keyTakeaways;
    return wizardConfig.takeaways.map((t, i) => ({
      number: String(i + 1).padStart(2, "0"),
      title: t.title,
      body: t.body,
      icon: t.icon,
      color: t.color,
    }));
  }, [isCustomReport, wizardConfig]);

  const filteredAds = swipeFilter === "All" ? activeAds : activeAds.filter((a) => a.brand === swipeFilter);

  const angleBarData = activeAngleLandscape.angles.map((a) => ({
    name: a.name.split(" ").slice(0, 2).join(" "),
    share: a.share,
    fill: a.color,
  }));

  const radarData = psychTriggers.map((t) => ({
    trigger: t.trigger.split(" ")[0],
    strength: t.strength,
  }));

  // ── Share handler ──
  const [shareToastVisible, setShareToastVisible] = useState(false);
  const shareTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShareToastVisible(true);
      if (shareTimeoutRef.current) clearTimeout(shareTimeoutRef.current);
      shareTimeoutRef.current = setTimeout(() => setShareToastVisible(false), 2800);
    }).catch(() => {
      // Fallback: select a temporary input
      const el = document.createElement("input");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setShareToastVisible(true);
      if (shareTimeoutRef.current) clearTimeout(shareTimeoutRef.current);
      shareTimeoutRef.current = setTimeout(() => setShareToastVisible(false), 2800);
    });
  }, []);

  return (
    <div
      className="landing-page min-h-screen"
      style={{ background: T.bg, fontFamily: T.sans, color: T.text }}
    >
      {/* ── NAV (matches Landing.tsx exactly) ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{
          background: "rgba(247,245,240,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div className="flex items-center gap-3">
          <Link href="/">
            <span
              className="text-lg font-bold cursor-pointer"
              style={{ fontFamily: T.serif }}
            >
              Scout
            </span>
          </Link>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "#EDE8E1", color: T.textSub }}
          >
            Beta
          </span>
          <span
            className="hidden md:inline text-xs px-2 py-0.5 rounded-full font-medium border"
            style={{ background: T.accentLight, color: T.accent, borderColor: T.accentBorder }}
          >
            Creative Intelligence Report
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isCustomReport && wizardConfig && (
            <span className="text-xs hidden md:block" style={{ color: T.textMuted }}>
              {wizardConfig.brands.length} brands · {wizardConfig.ads.length} ads
            </span>
          )}
          {isCustomReport && (
            <button
              onClick={() => clearConfig()}
              className="text-xs transition-colors"
              style={{ color: T.textMuted }}
            >
              ← Demo report
            </button>
          )}
          {/* Share Report button */}
          <button
            onClick={handleShare}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all hover:bg-[#EDE8E1]"
            style={{
              color: T.textSub,
              borderColor: T.border,
              background: "transparent",
              fontFamily: T.sans,
            }}
            title="Copy shareable link"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Share
          </button>
          <Link href="/wizard">
            <button
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: T.accent }}
            >
              {isCustomReport ? "✎ Edit Report" : "+ New Report"}
            </button>
          </Link>
        </div>
      </nav>

      {/* ── SHARE TOAST ── */}
      <ShareToast visible={shareToastVisible} />

      {/* ── HERO HEADER ── */}
      <section
        className="relative px-6 md:px-12 pt-16 pb-12 overflow-hidden"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        {/* Dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${T.accent}18 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
          >
            <p
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border mb-5"
              style={{ color: T.accent, borderColor: T.accentBorder, background: T.accentLight }}
            >
              ✦ {activeOverview.source}
            </p>
            <h1
              className="text-4xl md:text-5xl font-bold leading-tight mb-2"
              style={{ fontFamily: T.serif, letterSpacing: "-0.02em", color: T.text }}
            >
              {isCustomReport && wizardConfig ? wizardConfig.clientName : "Post Script Society"} —
            </h1>
            <p
              className="text-3xl md:text-4xl font-bold leading-tight mb-4"
              style={{ fontFamily: T.serif, fontStyle: "italic", color: T.accent }}
            >
              {isCustomReport && wizardConfig ? wizardConfig.reportTitle : "Competitor Creative Analysis"}
            </p>
            <p className="text-base mb-2" style={{ color: T.textMuted }}>
              {activeOverview.date} · Competitor brands:{" "}
              {activeOverview.competitorBrands.map((name, i) => (
                <span key={name}>
                  <span className="font-medium" style={{ color: T.text }}>{name}</span>
                  {i < activeOverview.competitorBrands.length - 1 && (
                    <span style={{ color: T.textMuted }}> + </span>
                  )}
                </span>
              ))}
            </p>
          </motion.div>

          {/* Key stats strip */}
          <motion.div
            variants={fadeUp}
            custom={0.15}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-8"
          >
            {activeOverview.keyNumbers.map((n) => (
              <div
                key={n.label}
                className="flex flex-col items-center px-3 py-4 rounded-2xl border text-center"
                style={{ background: T.white, borderColor: T.border }}
              >
                <span
                  className="text-2xl font-bold mb-0.5"
                  style={{ fontFamily: T.serif, color: T.text, letterSpacing: "-0.03em" }}
                >
                  {n.value}
                </span>
                <span className="text-xs leading-tight" style={{ color: T.textMuted }}>{n.label}</span>
                {n.sub && <span className="text-xs mt-0.5" style={{ color: T.textFaint }}>{n.sub}</span>}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="px-6 md:px-12 py-16 max-w-5xl mx-auto">

        {/* ── SECTION 1: EXECUTIVE SUMMARY ── */}
        <Section id="overview">
          <SectionHeader
            eyebrow="Report Overview"
            title="Executive Summary"
            sub="A strategic overview of the competitor creative landscape."
          />
          <Card className="p-8">
            {activeOverview.executiveSummary.split("\n\n").map((para, i) => (
              <p key={i} className="text-base leading-relaxed mb-4 last:mb-0" style={{ color: T.textSub }}>
                {para}
              </p>
            ))}
          </Card>
        </Section>

        <Divider />

        {/* ── SECTION 2: SWIPEFILE ── */}
        <Section id="swipefile">
          <SectionHeader
            eyebrow="Part 2 — SwipeFile"
            title="Selected Ads from Meta Ads Library"
            sub="A curated selection of competitor ads — mix of Video, Image, Carousel, and DCO formats."
          />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Ads", value: String(activeAds.length), sub: activeBrandKeys.join(" + "), color: T.text },
              { label: "Total Variations", value: String(activeAds.reduce((s, a) => s + (a.variations || 1), 0)), sub: "across all campaigns", color: T.accent },
              { label: "Video Ads", value: String(activeAds.filter((a) => a.format === "Video").length), sub: `${Math.round((activeAds.filter((a) => a.format === "Video").length / Math.max(activeAds.length, 1)) * 100)}% of SwipeFile`, color: "#4A6FA5" },
              { label: "Active Campaigns", value: String(activeAds.filter((a) => a.status === "Active").length), sub: "still running", color: "#5A8A6A" },
            ].map((s) => (
              <StatCard key={s.label} value={s.value} label={s.label} sub={s.sub} color={s.color} />
            ))}
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(["All", ...activeBrandKeys] as string[]).map((f) => {
              const brand = isCustomReport && wizardConfig ? wizardConfig.brands.find((b) => b.key === f) : null;
              const label = f === "All" ? `All ${activeAds.length} Ads` : brand ? `${brand.emoji} ${brand.name}` : f;
              const color = f === "All" ? T.text : brand?.color || T.accent;
              return (
                <button
                  key={f}
                  onClick={() => setSwipeFilter(f)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={
                    swipeFilter === f
                      ? { backgroundColor: color, color: "#F7F5F0" }
                      : { background: T.white, color: T.textMuted, border: `1px solid ${T.border}` }
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="wait">
              {filteredAds.map((ad, i) => <AdCard key={ad.id} ad={ad} index={i} />)}
            </AnimatePresence>
          </div>
        </Section>

        <Divider />

        {/* ── SECTION 3: ANGLE LANDSCAPE ── */}
        <Section id="angle-landscape">
          <SectionHeader
            eyebrow="Part 3 — Angle Landscape"
            title="Top Messaging Angles in the Category"
            sub="Five dominant creative angles identified across the mail subscription category."
          />
          <Card className="p-6 mb-6">
            {activeAngleLandscape.intro.split("\n\n").map((para, i) => (
              <p key={i} className="text-base leading-relaxed mb-3 last:mb-0" style={{ color: T.textSub }}>{para}</p>
            ))}
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="p-5">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: T.textFaint }}>
                Angle Prevalence (% of ads using angle)
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={angleBarData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={T.border} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="share" name="% of Ads" radius={[0, 4, 4, 0]}>
                    {angleBarData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: T.textFaint }}>
                Angle Descriptions
              </p>
              <div className="space-y-3">
                {activeAngleLandscape.angles.map((a) => (
                  <div key={a.name} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: a.color }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: T.text }}>{a.name}</p>
                      <p className="text-xs" style={{ color: T.textMuted }}>{a.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Section>

        <Divider />

        {/* ── SECTION 4: ANGLE DEEP DIVES ── */}
        <Section id="angles">
          <SectionHeader
            eyebrow="Creative Metrics by Angle"
            title="Five Angle Deep Dives"
            sub="Click any angle to expand its metrics, copy examples, and related SwipeFile ads."
          />
          {angles.map((angle) => <AngleCard key={angle.id} angle={angle} />)}
        </Section>

        <Divider />

        {/* ── SECTION 5: TOP HOOKS ── */}
        <Section id="hooks">
          <SectionHeader
            eyebrow="Part 4 — Top Hooks (Video Only)"
            title="Scroll-Stopping Opening 3 Seconds"
            sub="Analysis of the opening hook techniques used across video ads in the SwipeFile."
          />
          <Card className="p-6 mb-6">
            <p className="text-base leading-relaxed" style={{ color: T.textSub }}>
              In a social feed where the average viewer decides whether to stop scrolling within 1.7 seconds, the opening hook is the single most important creative element. The analysis below ranks the six most effective hooks identified in the SwipeFile by estimated scroll-stop rate, technique type, and psychological mechanism.
            </p>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {topHooks.map((hook) => <HookCard key={hook.rank} hook={hook} />)}
          </div>
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: T.textFaint }}>
              Hook Type Distribution
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { type: "Nostalgia Question", count: 2, color: T.accent, brands: "LFA + TFL" },
                { type: "Curiosity Gap", count: 1, color: "#4A6FA5", brands: "TFL" },
                { type: "Reframe / Contrast", count: 1, color: "#B5546A", brands: "TFL" },
                { type: "Aspirational Scene", count: 1, color: "#5A8A6A", brands: "LFA" },
                { type: "Visual Curiosity", count: 1, color: "#8B6FA5", brands: "LFA" },
              ].map((h) => (
                <div key={h.type} className="rounded-xl p-3 border" style={{ background: T.bg, borderColor: T.border }}>
                  <p className="text-xl font-bold mb-0.5" style={{ fontFamily: T.serif, color: h.color }}>{h.count}</p>
                  <p className="text-xs font-medium" style={{ color: T.text }}>{h.type}</p>
                  <p className="text-xs" style={{ color: T.textMuted }}>{h.brands}</p>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <Divider />

        {/* ── SECTION 6: PSYCHOLOGICAL TRIGGERS ── */}
        <Section id="psych-triggers">
          <SectionHeader
            eyebrow="Part 5 — Psychological Trigger Analysis"
            title="Key Conversion Triggers Across Creative"
            sub="Eight psychological mechanisms driving purchase decisions in the mail subscription category."
          />
          <Card className="p-5 mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: T.textFaint }}>
              Trigger Strength Across Category
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={T.border} />
                <PolarAngleAxis dataKey="trigger" tick={{ fontSize: 11, fill: T.textMuted }} />
                <Radar name="Strength" dataKey="strength" stroke={T.accent} fill={T.accent} fillOpacity={0.15} strokeWidth={2} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {psychTriggers.map((trigger) => <PsychCard key={trigger.trigger} trigger={trigger} />)}
          </div>
        </Section>

        <Divider />

        {/* ── SECTION 7: CROSS-BRAND ANALYSIS ── */}
        <Section id="cross-brand">
          <SectionHeader
            eyebrow="Cross-Brand Analysis"
            title="All Four Brands — Comparative Intelligence"
            sub="Multi-dimensional comparison across ad volume, organic reach, social proof, and messaging strategy."
          />

          {/* Peak time comparison */}
          <Card className="p-5 mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: T.textFaint }}>
              Peak Posting Activity — All Brands (Monthly)
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, i) => ({
                  month,
                  LFA: peakTimeData.lfa[i].intensity,
                  TFL: peakTimeData.tfl[i].intensity,
                  SMC: peakTimeData.smc[i].intensity,
                  TFM: peakTimeData.tfm[i].intensity,
                }))}
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.textSub }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.textSub }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine x="Nov" stroke={T.borderStrong} strokeDasharray="4 4" label={{ value: "Holiday Peak", fontSize: 10, fill: T.textMuted }} />
                <Line type="monotone" dataKey="LFA" stroke={T.accent} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="TFL" stroke="#B5546A" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="SMC" stroke="#4A6FA5" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="TFM" stroke="#5A8A6A" strokeWidth={2} dot={false} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Hashtag comparison */}
          <Card className="p-5 mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: T.textFaint }}>
              Hashtag Strategy Comparison
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brands.map((brand) => (
                <div key={brand.key}>
                  <div className="flex items-center gap-2 mb-3">
                    <span>{brand.emoji}</span>
                    <span className="text-sm font-semibold" style={{ color: T.text }}>{brand.shortName}</span>
                    <span className="text-xs" style={{ color: T.textMuted }}>— {hashtagData[brand.key].length} tags/emojis</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {hashtagData[brand.key].slice(0, 6).map((tag) => (
                      <span
                        key={tag.tag}
                        className="text-xs px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: brand.color, opacity: 0.6 + tag.frequency / 300 }}
                      >
                        {tag.tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Messaging pillars comparison table */}
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b" style={{ borderColor: T.border }}>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: T.textFaint }}>
                Messaging Pillars by Brand
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: T.bg }}>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: T.textMuted }}>Dimension</th>
                    {brands.map((b) => (
                      <th key={b.key} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: b.color }}>{b.shortName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Primary Emotion", values: ["Wonder & Adventure", "Nostalgia & Romance", "Curiosity & Discovery", "Connection & Warmth"] },
                    { label: "Core Hook", values: ["Explorer narrative", '"Lost magic" of mail', "Couch travel fantasy", "Care package from friend"] },
                    { label: "Anti-Digital Angle", values: ["Screen-free for kids", "Anti-digital world", "Airport-free travel", "Slow down from digital"] },
                    { label: "Paid Hashtags", values: ["None (emoji-only)", "None (emoji-only)", "N/A (no paid ads)", "N/A (no paid ads)"] },
                    { label: "Social Proof", values: ["Absent", "Testimonials (named)", "Absent", "Community milestones"] },
                    { label: "Discount Strategy", values: ["10% Off", "$55–$70 Off", "None found", "HOLIDAY20 code"] },
                  ].map((row, i) => (
                    <tr key={row.label} style={{ background: i % 2 === 0 ? T.bg : T.white }}>
                      <td className="px-4 py-3 font-medium text-xs" style={{ color: T.text }}>{row.label}</td>
                      {row.values.map((v, j) => (
                        <td key={j} className="px-4 py-3 text-xs" style={{ color: T.textSub }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Section>

        <Divider />

        {/* ── SECTION 8: KEY TAKEAWAYS ── */}
        <Section id="takeaways">
          <SectionHeader
            eyebrow="Key Takeaways & Category Insights"
            title="Strategic Insights for Creative Strategists"
            sub="Actionable findings from the competitor creative analysis."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {activeTakeaways.map((t, i) => (
              <motion.div
                key={t.number}
                variants={fadeUp}
                custom={i * 0.07}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-2xl border p-6 transition-all hover:shadow-md"
                style={{
                  background: T.white,
                  borderColor: T.border,
                  borderLeftColor: t.color,
                  borderLeftWidth: 4,
                  boxShadow: "0 1px 4px rgba(26,23,20,0.06)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div>
                    <span
                      className="text-3xl block mb-2"
                      style={{ fontFamily: T.serif, color: T.accent }}
                    >
                      {t.number}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{t.icon}</span>
                      <h3
                        className="text-base font-semibold"
                        style={{ fontFamily: T.serif, color: T.text }}
                      >
                        {t.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: T.textSub }}>{t.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Final comparison table */}
          <Card className="overflow-hidden mb-8">
            <div className="px-5 py-4 border-b" style={{ borderColor: T.border }}>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: T.textFaint }}>
                LFA vs. TFL — Strategic Comparison
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: T.bg }}>
                    {["Dimension", "🗺 Letters From Afar", "💌 The Flower Letters"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: T.textMuted }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Creative Testing", "Moderate (3–4 variations)", "Aggressive (up to 55 variations)"],
                    ["Primary Angle", "Nostalgic Adventure", "Nostalgia + Gift Positioning"],
                    ["Discount Strategy", "10% Off (soft)", "$30–$70 Off (aggressive)"],
                    ["Social Proof", "Absent in paid ads", "Named testimonials in every ad"],
                    ["Hook Style", "Nostalgia question + visual", "Nostalgia + curiosity gap + reframe"],
                    ["Campaign Longevity", "3–3.5 months avg.", "5–9 months avg."],
                    ["Paid Media Maturity", "Established, consistent", "Advanced, DCO-ready"],
                    ["Ad Formats Used", "Video, Image, Carousel", "Video (dominant), DCO"],
                  ].map(([dim, lfa, tfl], i) => (
                    <tr key={dim} style={{ background: i % 2 === 0 ? T.bg : T.white }}>
                      <td className="px-4 py-3 font-medium text-xs" style={{ color: T.text }}>{dim}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: T.textSub }}>{lfa}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: T.textSub }}>{tfl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Footer */}
          <div
            className="text-center text-xs py-6 border-t"
            style={{ borderColor: T.border, color: T.textMuted }}
          >
            <p>Analysis conducted {activeOverview.date} · Data sourced from {activeOverview.source} · {activeAds.length} ads analyzed across {activeOverview.competitorBrands.length} competitor brands</p>
            <p className="mt-1">All ad copy reproduced for competitive analysis purposes only</p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <Link href="/">
                <span className="cursor-pointer font-semibold" style={{ color: T.accent }}>← Back to Scout</span>
              </Link>
              <Link href="/wizard">
                <span className="cursor-pointer font-semibold" style={{ color: T.accent }}>+ New Report →</span>
              </Link>
            </div>
          </div>
        </Section>

      </main>
    </div>
  );
}
