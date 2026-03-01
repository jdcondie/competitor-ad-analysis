/**
 * ReportDetail.tsx — Single Report Preview Page (/reports/:id)
 *
 * Loads a saved report from the database and renders the full AI-generated
 * competitor analysis: executive summary, brands, messaging angles,
 * swipe-file ads, and key takeaways.
 *
 * Design: Light editorial — matches Landing.tsx and Reports.tsx exactly.
 * Palette: Off-white (#F7F5F0) bg, near-black (#1A1714) text, terracotta (#C2714F) accent
 * Typography: DM Serif Display (headings) + DM Sans (body)
 */

import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import type { ReportConfig, WizardBrand, WizardAngle, WizardAd } from "@/contexts/ReportContext";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  }),
};

// ─── SECTION DIVIDER ──────────────────────────────────────────────────────────
const Divider = () => (
  <div className="flex items-center gap-4 my-10">
    <div className="flex-1 h-px" style={{ background: T.border }} />
    <span className="text-xs" style={{ color: T.textFaint }}>✦</span>
    <div className="flex-1 h-px" style={{ background: T.border }} />
  </div>
);

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
const SectionHeader = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <div className="mb-8">
    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: T.accent }}>
      ✦ {eyebrow}
    </p>
    <h2 className="text-2xl font-bold leading-tight" style={{ fontFamily: T.serif, color: T.text, letterSpacing: "-0.02em" }}>
      {title}
    </h2>
  </div>
);

// ─── BRAND CHIP ───────────────────────────────────────────────────────────────
const BrandChip = ({ brand }: { brand: WizardBrand }) => (
  <div
    className="flex items-center gap-2.5 px-4 py-3 rounded-xl border"
    style={{ background: T.white, borderColor: T.border, boxShadow: "0 1px 4px rgba(26,23,20,0.05)" }}
  >
    <span className="text-2xl">{brand.emoji}</span>
    <div>
      <p className="text-sm font-semibold leading-tight" style={{ color: T.text }}>{brand.name}</p>
      <p className="text-xs" style={{ color: T.textFaint }}>Competitor</p>
    </div>
    <div
      className="ml-auto w-3 h-3 rounded-full shrink-0"
      style={{ background: brand.color }}
    />
  </div>
);

// ─── ANGLE CARD ───────────────────────────────────────────────────────────────
const AngleCard = ({ angle, index }: { angle: WizardAngle; index: number }) => (
  <motion.div
    variants={fadeUp}
    custom={index * 0.07}
    initial="hidden"
    animate="visible"
    className="rounded-2xl border p-6"
    style={{ background: T.white, borderColor: T.border, boxShadow: "0 1px 4px rgba(26,23,20,0.06)" }}
  >
    <div className="flex items-start justify-between gap-4 mb-3">
      <h3 className="text-lg font-bold leading-tight" style={{ fontFamily: T.serif, color: T.text, letterSpacing: "-0.02em" }}>
        {angle.title}
      </h3>
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: angle.color }} />
        <span className="text-sm font-semibold tabular-nums" style={{ color: T.textMuted }}>{angle.share}%</span>
      </div>
    </div>
    {/* Share bar */}
    <div className="w-full h-1.5 rounded-full mb-4" style={{ background: T.bgAlt }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${angle.share}%`, background: angle.color }}
      />
    </div>
    <p className="text-sm leading-relaxed" style={{ color: T.textMuted }}>{angle.description}</p>
  </motion.div>
);

// ─── AD CARD ──────────────────────────────────────────────────────────────────
const AdCard = ({ ad, brands, index }: { ad: WizardAd; brands: WizardBrand[]; index: number }) => {
  const brand = brands.find(b => b.key === ad.brandKey);
  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.05}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border p-5"
      style={{ background: T.white, borderColor: T.border, boxShadow: "0 1px 4px rgba(26,23,20,0.06)" }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {brand && (
            <span
              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: brand.color + "18", color: brand.color, border: `1px solid ${brand.color}40` }}
            >
              {brand.emoji} {brand.name}
            </span>
          )}
          <span
            className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border"
            style={{ color: T.textMuted, borderColor: T.border, background: T.bgAlt }}
          >
            {ad.format}
          </span>
          <span
            className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              background: ad.status === "Active" ? "#E8F5E9" : T.bgAlt,
              color: ad.status === "Active" ? "#2E7D32" : T.textFaint,
              border: `1px solid ${ad.status === "Active" ? "#A5D6A7" : T.border}`,
            }}
          >
            {ad.status}
          </span>
        </div>
        {ad.startDate && (
          <span className="text-xs shrink-0" style={{ color: T.textFaint }}>{ad.startDate}</span>
        )}
      </div>

      {/* Headline */}
      {ad.headline && (
        <h4 className="text-base font-semibold mb-2 leading-snug" style={{ fontFamily: T.serif, color: T.text }}>
          {ad.headline}
        </h4>
      )}

      {/* Body */}
      {ad.bodyPreview && (
        <p className="text-sm leading-relaxed mb-3" style={{ color: T.textMuted }}>
          {ad.bodyPreview}
        </p>
      )}

      {/* Angle / Hook / CTA chips */}
      <div className="flex flex-wrap gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${T.border}` }}>
        {ad.angle && (
          <span className="text-xs px-2 py-1 rounded-lg" style={{ background: T.accentLight, color: T.accent, border: `1px solid ${T.accentBorder}` }}>
            Angle: {ad.angle}
          </span>
        )}
        {ad.hook && (
          <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "#F0F4FF", color: "#4A6FA5", border: "1px solid #C8D8F0" }}>
            Hook: {ad.hook}
          </span>
        )}
        {ad.cta && (
          <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "#F4F0FF", color: "#6B4FA5", border: "1px solid #D8C8F0" }}>
            CTA: {ad.cta}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// ─── TAKEAWAY CARD ────────────────────────────────────────────────────────────
const TakeawayCard = ({ takeaway, index }: { takeaway: { title: string; body: string; icon: string; color: string }; index: number }) => (
  <motion.div
    variants={fadeUp}
    custom={index * 0.07}
    initial="hidden"
    animate="visible"
    className="rounded-2xl border p-6"
    style={{ background: T.white, borderColor: T.border, boxShadow: "0 1px 4px rgba(26,23,20,0.06)" }}
  >
    <div className="flex items-center gap-3 mb-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: takeaway.color + "18", border: `1px solid ${takeaway.color}40` }}
      >
        {takeaway.icon}
      </div>
      <h3 className="text-base font-semibold leading-snug" style={{ fontFamily: T.serif, color: T.text }}>
        {takeaway.title}
      </h3>
    </div>
    <p className="text-sm leading-relaxed" style={{ color: T.textMuted }}>{takeaway.body}</p>
  </motion.div>
);

// ─── LOADING SKELETON ─────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 rounded-xl w-2/3" style={{ background: T.bgAlt }} />
    <div className="h-4 rounded-lg w-1/3" style={{ background: T.bgAlt }} />
    <div className="h-32 rounded-2xl" style={{ background: T.bgAlt }} />
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-28 rounded-2xl" style={{ background: T.bgAlt }} />
      ))}
    </div>
  </div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ReportDetail() {
  const [, params] = useRoute("/reports/:id");
  const reportId = params?.id ? parseInt(params.id, 10) : null;
  const { user, loading: authLoading } = useAuth();

  const { data, isLoading, error } = trpc.research.getReport.useQuery(
    { id: reportId! },
    { enabled: !!reportId && !!user }
  );

  // Auth guard
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
        <a
          href={getLoginUrl()}
          className="px-6 py-3 rounded-xl text-white font-medium text-sm"
          style={{ background: T.accent }}
        >
          Sign In
        </a>
      </div>
    );
  }

  const config: ReportConfig | null = data?.config ?? null;

  return (
    <div className="landing-page min-h-screen" style={{ background: T.bg, color: T.text, fontFamily: T.sans }}>
      {/* ── NAV ── */}
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(247,245,240,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.border}` }}
      >
        <div className="flex items-center gap-3">
          <Link href="/">
            <span className="text-base font-bold cursor-pointer" style={{ fontFamily: T.serif, color: T.text, letterSpacing: "-0.02em" }}>
              Scout
            </span>
          </Link>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full border" style={{ color: T.textMuted, borderColor: T.border, background: T.bgAlt }}>
            Beta
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: T.accent, background: T.accentLight, border: `1px solid ${T.accentBorder}` }}>
            Report Preview
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/reports">
            <span className="text-sm font-medium cursor-pointer transition-colors" style={{ color: T.textMuted }}>
              ← My Reports
            </span>
          </Link>
          <Link href="/wizard">
            <span
              className="text-sm font-medium px-4 py-2 rounded-xl cursor-pointer"
              style={{ background: T.accent, color: "#fff" }}
            >
              + New Report
            </span>
          </Link>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {isLoading && <LoadingSkeleton />}

        {error && (
          <div className="text-center py-24">
            <p className="text-lg font-semibold mb-2" style={{ fontFamily: T.serif, color: T.text }}>
              Could not load report
            </p>
            <p className="text-sm mb-6" style={{ color: T.textMuted }}>{error.message}</p>
            <Link href="/reports">
              <span className="text-sm font-medium px-4 py-2 rounded-xl cursor-pointer" style={{ background: T.accent, color: "#fff" }}>
                Back to My Reports
              </span>
            </Link>
          </div>
        )}

        {config && (
          <>
            {/* ── HERO HEADER ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-10">
              {/* Data source badge */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border"
                  style={
                    data?.isAiOnly
                      ? { color: T.textMuted, borderColor: T.border, background: T.bgAlt }
                      : { color: T.accent, borderColor: T.accentBorder, background: T.accentLight }
                  }
                >
                  {data?.isAiOnly ? (
                    <>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                      AI Analysis
                    </>
                  ) : (
                    <>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      {data?.totalAdsAnalyzed} real ads · Meta Ads Library
                    </>
                  )}
                </span>
                <span className="text-xs" style={{ color: T.textFaint }}>
                  {data?.createdAt ? new Date(data.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
                </span>
              </div>

              <h1
                className="text-4xl font-bold leading-tight mb-2"
                style={{ fontFamily: T.serif, color: T.text, letterSpacing: "-0.03em" }}
              >
                {config.clientName}
              </h1>
              <p className="text-lg italic mb-1" style={{ color: T.accent, fontFamily: T.serif }}>
                {config.reportTitle}
              </p>
              <p className="text-sm" style={{ color: T.textMuted }}>
                {config.reportDate} · {config.dataSource}
              </p>
            </motion.div>

            {/* ── EXECUTIVE SUMMARY ── */}
            {config.executiveSummary && (
              <>
                <motion.div
                  variants={fadeUp}
                  custom={0.1}
                  initial="hidden"
                  animate="visible"
                  className="rounded-2xl border p-7"
                  style={{ background: T.white, borderColor: T.border, boxShadow: "0 1px 4px rgba(26,23,20,0.06)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: T.accent }}>
                    ✦ Executive Summary
                  </p>
                  <p className="text-base leading-relaxed" style={{ color: T.textSub }}>
                    {config.executiveSummary}
                  </p>
                </motion.div>
                <Divider />
              </>
            )}

            {/* ── COMPETITOR BRANDS ── */}
            {config.brands && config.brands.length > 0 && (
              <>
                <SectionHeader eyebrow="Competitor Brands" title="Who We're Watching" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                  {config.brands.map((brand, i) => (
                    <motion.div key={brand.key} variants={fadeUp} custom={i * 0.07} initial="hidden" animate="visible">
                      <BrandChip brand={brand} />
                    </motion.div>
                  ))}
                </div>
                <Divider />
              </>
            )}

            {/* ── MESSAGING ANGLES ── */}
            {config.angles && config.angles.length > 0 && (
              <>
                <SectionHeader eyebrow="Messaging Angles" title="How They're Positioning" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-2">
                  {config.angles.map((angle, i) => (
                    <AngleCard key={angle.id} angle={angle} index={i} />
                  ))}
                </div>
                <Divider />
              </>
            )}

            {/* ── SWIPE FILE ADS ── */}
            {config.ads && config.ads.length > 0 && (
              <>
                <SectionHeader eyebrow="Swipe File" title={`${config.ads.length} Ads Worth Studying`} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-2">
                  {config.ads.map((ad, i) => (
                    <AdCard key={ad.id} ad={ad} brands={config.brands} index={i} />
                  ))}
                </div>
                <Divider />
              </>
            )}

            {/* ── KEY TAKEAWAYS ── */}
            {config.takeaways && config.takeaways.length > 0 && (
              <>
                <SectionHeader eyebrow="Key Takeaways" title="What This Means for You" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {config.takeaways.map((t, i) => (
                    <TakeawayCard key={i} takeaway={t} index={i} />
                  ))}
                </div>
              </>
            )}

            {/* ── FOOTER ── */}
            <div className="mt-16 pt-8 flex items-center justify-between" style={{ borderTop: `1px solid ${T.border}` }}>
              <p className="text-xs" style={{ color: T.textFaint }}>
                Generated by Scout · {config.dataSource}
              </p>
              <Link href="/reports">
                <span className="text-sm font-medium cursor-pointer" style={{ color: T.accent }}>
                  ← Back to My Reports
                </span>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
