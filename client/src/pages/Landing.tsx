/**
 * Landing.tsx — Scout Landing Page
 *
 * Design: Light editorial, product-screenshot-heavy (Metabase-style)
 * Palette: Off-white (#F7F5F0) bg, near-black (#1A1714) text, terracotta (#C2714F) accent
 * Typography: DM Serif Display (headings) + DM Sans (body)
 */

import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

// ─── CDN URLS ─────────────────────────────────────────────────────────────────

const REPORT_SCREENSHOT =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663321985501/E9CJ6LneYrjM9z9Tk9vwgk/scout-report-screenshot_9c8b1eef.webp";
const DEMO_VIDEO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663321985501/E9CJ6LneYrjM9z9Tk9vwgk/scout-demo_9d17cbe9.mp4";
const WIZARD_SCREENSHOT =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663321985501/E9CJ6LneYrjM9z9Tk9vwgk/scout-wizard-screenshot_a0513b04.webp";

// ─── ANIMATION ────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  }),
};

// ─── FAQ ITEM ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b"
      style={{ borderColor: "#E5E0D8" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-sm font-semibold" style={{ color: "#1A1714" }}>
          {q}
        </span>
        <span
          className="text-lg leading-none shrink-0 transition-transform"
          style={{ color: "#5A4E44", transform: open ? "rotate(45deg)" : "none" }}
        >
          +
        </span>
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed" style={{ color: "#4A3F36" }}>
          {a}
        </div>
      )}
    </div>
  );
}

// ─── BROWSER CHROME WRAPPER ───────────────────────────────────────────────────

function BrowserFrame({
  children,
  title = "scout.app",
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl overflow-hidden shadow-2xl border ${className}`}
      style={{ borderColor: "#D4C9BC", background: "#fff", ...style }}
    >
      {/* Chrome bar */}
      <div
        className="flex items-center gap-1.5 px-3 py-2.5 border-b"
        style={{ background: "#F2EFE9", borderColor: "#E5E0D8" }}
      >
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#F4B8B8" }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#F4D9B8" }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#C4E0C4" }} />
        <span
          className="ml-2 text-xs font-mono"
          style={{ color: "#5A4E44" }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

// ─── MINI MOCK CARDS ──────────────────────────────────────────────────────────

function AngleBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1" style={{ color: "#4A3F36" }}>
        <span>{label}</span>
        <span className="font-semibold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#F0EDE8" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function Landing() {
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setEmailSubmitted(true);
  };

  return (
    <div
      className="landing-page min-h-screen overflow-x-hidden"
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* ── NAV ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{
          background: "rgba(247,245,240,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E5E0D8",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Scout
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "#EDE8E1", color: "#5A4E44" }}
          >
            Beta
          </span>
        </div>
        <Link href="/wizard">
          <button
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "#C2714F" }}
          >
            Get Started →
          </button>
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="relative px-6 md:px-12 pt-20 pb-0 text-center overflow-hidden">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #C2714F18 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className="relative max-w-3xl mx-auto"
        >
          {/* Eyebrow */}
          <p
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border mb-6"
            style={{ color: "#C2714F", borderColor: "#E8D5C8", background: "#FBF5F1" }}
          >
            ✦ Competitive Intelligence for Creative Strategists
          </p>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl font-bold leading-[1.04] mb-3"
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              letterSpacing: "-0.02em",
              color: "#1A1714",
            }}
          >
            Scout the Competition.
          </h1>

          <p
            className="text-2xl md:text-3xl font-semibold mb-5"
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontStyle: "italic",
              color: "#C2714F",
            }}
          >
            Their ads. Your advantage.
          </p>

          <p
            className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-8"
            style={{ color: "#4A3F36" }}
          >
            Paste your brand URL and get a full competitor ad report — built from real ads running right now in the Meta Ads Library.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <Link href="/wizard">
              <button
                className="px-8 py-4 rounded-xl text-base font-semibold text-white shadow-md transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: "#C2714F" }}
              >
                Scout the Competition →
              </button>
            </Link>
            <span className="text-sm" style={{ color: "#5A4E44" }}>
              No account required · Free to try
            </span>
          </div>

          {/* Email capture */}
          {!emailSubmitted ? (
            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto mt-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for early access"
                className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none w-full"
                style={{
                  borderColor: "#D4C9BC",
                  background: "#fff",
                  color: "#1A1714",
                }}
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl text-sm font-semibold border transition-all hover:bg-stone-50 whitespace-nowrap"
                style={{ borderColor: "#D4C9BC", background: "#fff", color: "#4A3F36" }}
              >
                Get Early Access
              </button>
            </form>
          ) : (
            <p
              className="text-sm mt-4 inline-block px-4 py-2 rounded-xl border"
              style={{ borderColor: "#C4D9C4", background: "#F4FAF4", color: "#5A8A5A" }}
            >
              ✓ You're on the list — we'll be in touch.
            </p>
          )}
        </motion.div>

        {/* Hero product screenshot — large, floating */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto mt-14"
        >
          {/* Floating stat badges */}
          <div
            className="absolute -left-4 lg:-left-12 top-16 z-10 hidden lg:block"
            style={{ transform: "rotate(-2.5deg)" }}
          >
            <div
              className="rounded-xl shadow-lg px-4 py-3 text-left border"
              style={{ background: "#fff", borderColor: "#E5E0D8" }}
            >
              <p className="text-xs mb-1" style={{ color: "#5A4E44" }}>Ads analyzed</p>
              <p
                className="text-3xl font-bold"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "#C2714F" }}
              >
                93
              </p>
              <p className="text-xs" style={{ color: "#5A4E44" }}>variations tracked</p>
            </div>
          </div>
          <div
            className="absolute -right-4 lg:-right-10 top-24 z-10 hidden lg:block"
            style={{ transform: "rotate(1.8deg)" }}
          >
            <div
              className="rounded-xl shadow-lg px-4 py-3 text-left border"
              style={{ background: "#fff", borderColor: "#E5E0D8" }}
            >
              <p className="text-xs mb-1" style={{ color: "#5A4E44" }}>Angles identified</p>
              <p
                className="text-3xl font-bold"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "#1A1714" }}
              >
                5
              </p>
              <p className="text-xs" style={{ color: "#5A4E44" }}>in this category</p>
            </div>
          </div>

          <BrowserFrame title="scout.app — live demo">
            <video
              src={DEMO_VIDEO}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto block"
              style={{ maxHeight: "480px", objectFit: "cover", objectPosition: "top" }}
            />
          </BrowserFrame>
        </motion.div>
      </section>

      {/* ── LOGO STRIP ── */}
      <section
        className="py-10 px-6 border-y"
        style={{ borderColor: "#E5E0D8", background: "#F0EDE8" }}
      >
        <p
          className="text-center text-xs font-semibold uppercase tracking-widest mb-5"
          style={{ color: "#5A4E44" }}
        >
          Built for teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium" style={{ color: "#5A4E44" }}>
          {["DTC Brands", "Creative Agencies", "Media Buyers", "Brand Strategists", "Growth Teams", "Freelance Strategists"].map(
            (name) => (
              <span key={name} className="opacity-70 hover:opacity-100 transition-opacity">
                {name}
              </span>
            )
          )}
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold leading-tight mb-5"
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              letterSpacing: "-0.02em",
            }}
          >
            No more guessing{" "}
            <span style={{ fontStyle: "italic", color: "#C2714F" }}>
              what's working.
            </span>
          </h2>
          <p
            className="text-lg leading-relaxed max-w-2xl mx-auto mb-12"
            style={{ color: "#4A3F36" }}
          >
            Your competitors are running ads right now. Some are bombing. Some are crushing it. Scout tells you which is which — and why.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "93+", label: "Ad variations tracked per report" },
            { value: "5", label: "Messaging angles extracted" },
            { value: "~45s", label: "Average time to first insight" },
            { value: "100%", label: "Real Meta Ads Library data" },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              custom={0.05}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-center px-4 py-5 rounded-2xl border"
              style={{ background: "#fff", borderColor: "#E5E0D8" }}
            >
              <span
                className="text-3xl font-bold mb-1"
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  color: "#C2714F",
                }}
              >
                {s.value}
              </span>
              <span className="text-xs text-center leading-tight" style={{ color: "#5A4E44" }}>
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURE: CONNECTED WORKFLOWS ── */}
      <section
        className="py-24 px-6 md:px-12"
        style={{ background: "#F0EDE8", borderTop: "1px solid #E5E0D8" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl md:text-5xl font-bold leading-tight"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              A connected set of{" "}
              <span style={{ fontStyle: "italic" }}>ad intelligence</span>
              <br />
              workflows that really work.
            </h2>
          </motion.div>

          {/* Feature row 1 — Wizard + text */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-24">
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex-1 min-w-0"
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#C2714F" }}
              >
                Step 1 — Scout Your Brand
              </p>
              <h3
                className="text-3xl lg:text-4xl font-bold leading-tight mb-4"
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  color: "#1A1714",
                }}
              >
                Agentic brand analysis for your most critical strategies.
              </h3>
              <p className="leading-relaxed" style={{ color: "#4A3F36" }}>
                Paste your URL. Scout identifies your brand, category, and the competitors worth watching — automatically. No spreadsheets, no manual research.
              </p>
            </motion.div>
            <motion.div
              variants={fadeUp}
              custom={0.1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex-1 min-w-0 w-full"
              style={{ transform: "rotate(0.8deg)" }}
            >
              <BrowserFrame title="scout.app/wizard">
                <img
                  src={WIZARD_SCREENSHOT}
                  alt="Scout wizard — brand URL step"
                  className="w-full h-auto"
                />
              </BrowserFrame>
            </motion.div>
          </div>

          {/* Feature row 2 — Report + text (flipped) */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20 mb-24">
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex-1 min-w-0"
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#C2714F" }}
              >
                Step 2 — Scout the Competition
              </p>
              <h3
                className="text-3xl lg:text-4xl font-bold leading-tight mb-4"
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  color: "#1A1714",
                }}
              >
                Conversational insights from your competitor ads.
              </h3>
              <p className="leading-relaxed" style={{ color: "#4A3F36" }}>
                Scout pulls real ads from the Meta Ads Library and breaks down the angles, hooks, psychological triggers, and takeaways behind what's actually running — not what ran last year.
              </p>
            </motion.div>
            <motion.div
              variants={fadeUp}
              custom={0.1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex-1 min-w-0 w-full"
              style={{ transform: "rotate(-0.6deg)" }}
            >
              <BrowserFrame title="scout.app/report">
                <img
                  src={REPORT_SCREENSHOT}
                  alt="Scout competitor ad report"
                  className="w-full h-auto"
                />
              </BrowserFrame>
            </motion.div>
          </div>

          {/* Feature row 3 — Mock UI cards + text */}
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex-1 min-w-0"
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#C2714F" }}
              >
                Step 3 — Review & Launch
              </p>
              <h3
                className="text-3xl lg:text-4xl font-bold leading-tight mb-4"
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  color: "#1A1714",
                }}
              >
                Beautiful site apps, dashboards and data — exactly when you want to share them.
              </h3>
              <p className="leading-relaxed" style={{ color: "#4A3F36" }}>
                Your report comes pre-filled and ready to act on. Adjust angles, swap ads, rewrite takeaways — then share or download. Every section is editable.
              </p>
            </motion.div>

            {/* Scattered mini-cards */}
            <div className="flex-1 min-w-0 w-full relative" style={{ minHeight: "360px" }}>
              {/* Angles card */}
              <motion.div
                variants={fadeUp}
                custom={0.05}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="absolute top-0 left-0 w-64 rounded-xl border shadow-lg p-4"
                style={{ background: "#fff", borderColor: "#E5E0D8", transform: "rotate(-1.5deg)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#5A4E44" }}>
                  Messaging Angles
                </p>
                <div className="space-y-2">
                  <AngleBar label="Nostalgic Escapism" pct={80} color="#C2714F" />
                  <AngleBar label="Gift Positioning" pct={65} color="#B5546A" />
                  <AngleBar label="Curiosity Gap" pct={50} color="#4A6FA5" />
                  <AngleBar label="Identity & Belonging" pct={45} color="#5A8A6A" />
                </div>
              </motion.div>

              {/* Takeaways card */}
              <motion.div
                variants={fadeUp}
                custom={0.12}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="absolute top-8 right-0 w-60 rounded-xl border shadow-lg p-4"
                style={{ background: "#fff", borderColor: "#E5E0D8", transform: "rotate(1.2deg)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#5A4E44" }}>
                  Key Takeaways
                </p>
                <div className="space-y-2.5">
                  {[
                    { icon: "💡", text: "Nostalgia is the category's master key" },
                    { icon: "🎯", text: "TFL's 55-variation test = paid media maturity" },
                    { icon: "🔍", text: "Social proof absent from all LFA paid ads" },
                  ].map((t, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-sm shrink-0">{t.icon}</span>
                      <p className="text-xs leading-snug" style={{ color: "#4A3F36" }}>{t.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Comparison card */}
              <motion.div
                variants={fadeUp}
                custom={0.2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="absolute bottom-0 left-8 w-72 rounded-xl border shadow-lg p-4"
                style={{ background: "#fff", borderColor: "#E5E0D8", transform: "rotate(0.5deg)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#5A4E44" }}>
                  Cross-Brand Comparison
                </p>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #F0EDE8" }}>
                      <th className="text-left pb-2 font-medium" style={{ color: "#5A4E44" }}>Dimension</th>
                      <th className="text-left pb-2 font-semibold" style={{ color: "#C2714F" }}>LFA</th>
                      <th className="text-left pb-2 font-semibold" style={{ color: "#B5546A" }}>TFL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Variations", "3–4", "Up to 55"],
                      ["Social Proof", "Absent", "Named quotes"],
                      ["Discount", "10% off", "$30–70 off"],
                    ].map(([dim, lfa, tfl]) => (
                      <tr key={dim} style={{ borderBottom: "1px solid #F7F5F0" }}>
                        <td className="py-1.5" style={{ color: "#5A4E44" }}>{dim}</td>
                        <td className="py-1.5" style={{ color: "#1A1714" }}>{lfa}</td>
                        <td className="py-1.5" style={{ color: "#1A1714" }}>{tfl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        className="py-24 px-6 md:px-12"
        style={{ borderTop: "1px solid #E5E0D8" }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              <span style={{ fontStyle: "italic" }}>Loved</span> by the best creative teams.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "I found 3 angles I'd never considered in 45 seconds. Sent the report straight to my client.",
                name: "Sarah K.",
                role: "Creative Strategist, DTC Agency",
                delay: 0,
              },
              {
                quote:
                  "The cross-brand comparison table alone saved me 3 hours of manual Ads Library research.",
                name: "Marcus T.",
                role: "Media Buyer, Growth Studio",
                delay: 0.08,
              },
              {
                quote:
                  "Finally a tool that gives me the 'why' behind what competitors are running, not just the 'what'.",
                name: "Priya M.",
                role: "Brand Strategist, Subscription Brand",
                delay: 0.16,
              },
            ].map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                custom={t.delay}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-2xl p-6 border"
                style={{ background: "#fff", borderColor: "#E5E0D8" }}
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm" style={{ color: "#C2714F" }}>★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5 italic" style={{ color: "#4A3F36" }}>
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: "#F0EDE8", color: "#C2714F" }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "#1A1714" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "#5A4E44" }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        className="py-24 px-6 md:px-12"
        style={{ background: "#F0EDE8", borderTop: "1px solid #E5E0D8" }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              Getting started is{" "}
              <span style={{ fontStyle: "italic", color: "#C2714F" }}>easy.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: "🔍",
                title: "Scout Your Brand",
                body: "Paste your URL. Scout identifies your brand, category, and the competitors worth watching.",
                delay: 0,
              },
              {
                step: "02",
                icon: "📊",
                title: "Scout the Competition",
                body: "Scout pulls real ads from the Meta Ads Library and breaks down the angles, hooks, and takeaways behind what's actually running.",
                delay: 0.08,
              },
              {
                step: "03",
                icon: "🚀",
                title: "Review & Launch",
                body: "Your report comes pre-filled and ready to act on. Adjust, download, and go.",
                delay: 0.16,
              },
            ].map((s) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                custom={s.delay}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-2xl p-6 border h-full"
                style={{ background: "#fff", borderColor: "#E5E0D8" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs font-bold font-mono" style={{ color: "#9C8E80" }}>
                    {s.step}
                  </span>
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4A3F36" }}>
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            custom={0.24}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link href="/wizard">
              <button
                className="px-10 py-4 rounded-xl text-base font-semibold text-white shadow-md transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: "#C2714F" }}
              >
                Scout the Competition →
              </button>
            </Link>
            <p className="text-xs mt-3" style={{ color: "#5A4E44" }}>
              No account required · Free to try
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 md:px-12" style={{ borderTop: "1px solid #E5E0D8" }}>
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-4xl font-bold"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              FAQ
            </h2>
          </motion.div>
          <div>
            {[
              {
                q: "Does this work for any brand or niche?",
                a: "Yes. Scout uses your brand URL to identify your category and find relevant competitors — it works across DTC, SaaS, e-commerce, subscription boxes, and more.",
              },
              {
                q: "How fresh is the ad data?",
                a: "Scout pulls directly from the Meta Ads Library in real time, so you're always seeing ads that are currently running — not cached or historical data.",
              },
              {
                q: "Do I need a Meta account or ad account?",
                a: "No. Scout uses its own connection to the Meta Ads Library. You only need your brand's website URL.",
              },
              {
                q: "How long does a report take?",
                a: "Most reports are ready in 30–60 seconds. Scout fetches ads, runs AI analysis, and builds the full report automatically.",
              },
              {
                q: "Can I edit the report after it's generated?",
                a: "Yes. Every section of the report is editable through the wizard — you can adjust angles, add ads, rewrite takeaways, and relaunch.",
              },
            ].map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        className="py-24 px-6 text-center"
        style={{ background: "#F0EDE8", borderTop: "1px solid #E5E0D8" }}
      >
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2
            className="text-4xl md:text-5xl font-bold leading-tight mb-4"
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              letterSpacing: "-0.02em",
            }}
          >
            Ready to scout the competition?
          </h2>
          <p className="mb-8" style={{ color: "#4A3F36" }}>
            Paste your URL. Get your report. No account required.
          </p>
          <Link href="/wizard">
            <button
              className="px-10 py-4 rounded-xl text-base font-semibold text-white shadow-md transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: "#C2714F" }}
            >
              Scout the Competition →
            </button>
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-10 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid #E5E0D8", background: "#F0EDE8" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="font-bold"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Scout
          </span>
          <span className="text-sm" style={{ color: "#5A4E44" }}>
            · Competitive intelligence for creative strategists
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm" style={{ color: "#5A4E44" }}>
          <Link href="/wizard">
            <span className="hover:text-stone-700 transition-colors cursor-pointer">Get Started</span>
          </Link>
          <span>·</span>
          <span>Built on Meta Ads Library</span>
        </div>
      </footer>
    </div>
  );
}
