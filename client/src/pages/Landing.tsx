/**
 * Landing.tsx — Scout product landing page
 * Design: Dark premium, editorial, high-converting
 * Palette: Near-black bg, white text, terracotta (#C2714F) CTA accent
 * Typography: DM Serif Display (headings) + Inter (body)
 */

import { Link } from "wouter";
import { motion } from "framer-motion";

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const, delay },
  }),
};

// ─── NOISE TEXTURE SVG (subtle grain) ─────────────────────────────────────────

const NoiseBg = () => (
  <svg
    className="pointer-events-none fixed inset-0 w-full h-full opacity-[0.025] z-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

// ─── STEP CARD ────────────────────────────────────────────────────────────────

function StepCard({
  number,
  title,
  body,
  delay,
}: {
  number: string;
  title: string;
  body: string;
  delay: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="relative flex flex-col gap-4 rounded-2xl p-7"
      style={{
        background: "oklch(0.11 0 0)",
        border: "1px solid oklch(0.18 0 0)",
      }}
    >
      {/* Step number badge */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
        style={{ background: "oklch(0.17 0 0)", color: "#C2714F", border: "1px solid oklch(0.22 0 0)" }}
      >
        {number}
      </div>

      {/* Connector line (not on last) */}
      <div className="flex-1">
        <h3
          className="text-lg font-semibold mb-2 leading-snug"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "oklch(0.97 0 0)" }}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "oklch(0.55 0 0)" }}>
          {body}
        </p>
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: "oklch(0.08 0 0)", color: "oklch(0.97 0 0)" }}
    >
      <NoiseBg />

      {/* ── NAV ── */}
      <nav
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5"
        style={{ borderBottom: "1px solid oklch(0.13 0 0)" }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "oklch(0.97 0 0)" }}
          >
            Scout
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "oklch(0.17 0 0)", color: "#C2714F", border: "1px solid oklch(0.22 0 0)" }}
          >
            Beta
          </span>
        </div>
        <Link href="/wizard">
          <button
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: "#C2714F", color: "#fff" }}
          >
            Get Started →
          </button>
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-28 md:pt-32 md:pb-36">
        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "oklch(0.55 0.12 55 / 0.12)" }}
        />

        {/* Eyebrow */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2 mb-6"
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full"
            style={{
              background: "oklch(0.14 0 0)",
              color: "#C2714F",
              border: "1px solid oklch(0.22 0 0)",
              letterSpacing: "0.12em",
            }}
          >
            ✦ Competitive Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          custom={0.08}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.02] tracking-tight mb-5"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          Scout the{" "}
          <span
            className="italic"
            style={{
              background: "linear-gradient(135deg, #C2714F 0%, oklch(0.78 0.18 60) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Competition.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={fadeUp}
          custom={0.16}
          initial="hidden"
          animate="visible"
          className="text-2xl md:text-3xl font-medium mb-6"
          style={{ color: "oklch(0.65 0 0)", fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic" }}
        >
          Their ads. Your advantage.
        </motion.p>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          custom={0.24}
          initial="hidden"
          animate="visible"
          className="text-base md:text-lg max-w-xl leading-relaxed mb-10"
          style={{ color: "oklch(0.5 0 0)" }}
        >
          Paste your brand URL and get a full competitor ad report — built from real ads running right now in the Meta Ads Library.
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          custom={0.32}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/wizard">
            <button
              className="group px-8 py-4 rounded-2xl text-base font-semibold transition-all hover:opacity-90 active:scale-95 flex items-center gap-2.5 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #C2714F 0%, oklch(0.62 0.18 45) 100%)",
                color: "#fff",
                boxShadow: "0 0 40px oklch(0.55 0.15 55 / 0.25)",
              }}
            >
              Scout the Competition
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </Link>
          <p className="text-xs" style={{ color: "oklch(0.38 0 0)" }}>
            No account required · Free to try
          </p>
        </motion.div>

        {/* Hero visual — mock report card */}
        <motion.div
          variants={fadeUp}
          custom={0.44}
          initial="hidden"
          animate="visible"
          className="mt-16 w-full max-w-2xl rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.11 0 0)",
            border: "1px solid oklch(0.18 0 0)",
            boxShadow: "0 40px 80px oklch(0 0 0 / 0.5)",
          }}
        >
          {/* Mock toolbar */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: "1px solid oklch(0.15 0 0)", background: "oklch(0.09 0 0)" }}
          >
            <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.65 0.18 25 / 0.6)" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.72 0.15 80 / 0.6)" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.72 0.15 145 / 0.6)" }} />
            <div
              className="ml-3 flex-1 rounded-md px-3 py-1 text-xs font-mono"
              style={{ background: "oklch(0.14 0 0)", color: "oklch(0.38 0 0)" }}
            >
              scout.app/report/your-brand
            </div>
          </div>

          {/* Mock report content */}
          <div className="p-6 text-left">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{ background: "oklch(0.72 0.15 55 / 0.15)", color: "#C2714F" }}
              >
                ✦
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "oklch(0.85 0 0)" }}>
                  Competitor Ad Report
                </p>
                <p className="text-xs" style={{ color: "oklch(0.42 0 0)" }}>
                  3 competitors · 14 ads analyzed · 5 angles identified
                </p>
              </div>
              <div
                className="ml-auto text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "oklch(0.72 0.15 145 / 0.12)", color: "oklch(0.72 0.15 145)" }}
              >
                Live data
              </div>
            </div>

            {/* Mock angle pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {["Nostalgia & Escapism", "Community Belonging", "Slow Living", "Artisan Quality", "Gift-Worthy"].map(
                (angle) => (
                  <span
                    key={angle}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: "oklch(0.14 0 0)", color: "oklch(0.6 0 0)", border: "1px solid oklch(0.2 0 0)" }}
                  >
                    {angle}
                  </span>
                )
              )}
            </div>

            {/* Mock ad rows */}
            <div className="space-y-2">
              {[
                { brand: "Competitor A", hook: "\"Slow down. The world can wait.\"", angle: "Nostalgia" },
                { brand: "Competitor B", hook: "\"Join 40,000 readers who unplug every month.\"", angle: "Community" },
                { brand: "Competitor C", hook: "\"Handwritten. Handpicked. Handcrafted.\"", angle: "Artisan Quality" },
              ].map((row) => (
                <div
                  key={row.brand}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "oklch(0.13 0 0)" }}
                >
                  <div
                    className="w-6 h-6 rounded-md shrink-0"
                    style={{ background: "oklch(0.18 0 0)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: "oklch(0.75 0 0)" }}>
                      {row.hook}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: "oklch(0.72 0.15 55 / 0.1)", color: "#C2714F" }}
                  >
                    {row.angle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── PROBLEM SECTION ── */}
      <section
        className="relative z-10 px-6 md:px-12 py-24 md:py-32"
        style={{ borderTop: "1px solid oklch(0.13 0 0)" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            {/* Left: headline */}
            <div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: "#C2714F", letterSpacing: "0.12em" }}
              >
                The Problem
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold leading-tight"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                No more guessing what's working.
              </h2>
            </div>

            {/* Right: body */}
            <div>
              <p className="text-lg leading-relaxed" style={{ color: "oklch(0.55 0 0)" }}>
                Your competitors are running ads right now. Some are bombing. Some are crushing it.
              </p>
              <p className="text-lg leading-relaxed mt-4" style={{ color: "oklch(0.55 0 0)" }}>
                Scout tells you which is which — and why.
              </p>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-3 mt-8">
                {[
                  { value: "Real ads", label: "from Meta Ads Library" },
                  { value: "AI analysis", label: "of angles & hooks" },
                  { value: "< 60 sec", label: "to full report" },
                ].map((stat) => (
                  <div
                    key={stat.value}
                    className="rounded-xl px-4 py-3"
                    style={{ background: "oklch(0.11 0 0)", border: "1px solid oklch(0.18 0 0)" }}
                  >
                    <p className="text-sm font-semibold" style={{ color: "oklch(0.9 0 0)" }}>
                      {stat.value}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "oklch(0.45 0 0)" }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        className="relative z-10 px-6 md:px-12 py-24 md:py-32"
        style={{ borderTop: "1px solid oklch(0.13 0 0)" }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "#C2714F", letterSpacing: "0.12em" }}
            >
              How It Works
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Three steps. One unfair advantage.
            </h2>
          </motion.div>

          {/* Steps grid */}
          <div className="grid md:grid-cols-3 gap-5">
            <StepCard
              number="01"
              title="Scout Your Brand"
              body="Paste your URL. Scout identifies your brand, category, and the competitors worth watching."
              delay={0}
            />
            <StepCard
              number="02"
              title="Scout the Competition"
              body="Scout pulls real ads from the Meta Ads Library and breaks down the angles, hooks, and takeaways behind what's actually running."
              delay={0.08}
            />
            <StepCard
              number="03"
              title="Review & Launch"
              body="Your report comes pre-filled and ready to act on. Adjust, download, and go."
              delay={0.16}
            />
          </div>

          {/* Bottom CTA */}
          <motion.div
            variants={fadeUp}
            custom={0.24}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-16 text-center"
          >
            <Link href="/wizard">
              <button
                className="group px-10 py-4 rounded-2xl text-base font-semibold transition-all hover:opacity-90 active:scale-95 inline-flex items-center gap-2.5"
                style={{
                  background: "linear-gradient(135deg, #C2714F 0%, oklch(0.62 0.18 45) 100%)",
                  color: "#fff",
                  boxShadow: "0 0 40px oklch(0.55 0.15 55 / 0.2)",
                }}
              >
                Scout the Competition
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </Link>
            <p className="text-xs mt-3" style={{ color: "oklch(0.35 0 0)" }}>
              No account required · Free to try
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="relative z-10 px-6 md:px-12 py-8 flex items-center justify-between"
        style={{ borderTop: "1px solid oklch(0.13 0 0)" }}
      >
        <p
          className="text-sm font-semibold"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "oklch(0.4 0 0)" }}
        >
          Scout
        </p>
        <p className="text-xs" style={{ color: "oklch(0.3 0 0)" }}>
          Built on real Meta Ads Library data
        </p>
      </footer>
    </div>
  );
}
