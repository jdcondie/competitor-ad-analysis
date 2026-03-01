/**
 * Landing.tsx — Scout Landing Page
 *
 * Design: Light editorial, product-screenshot-heavy (Metabase-style)
 * Palette: Off-white (#F7F5F0) bg, near-black (#1A1714) text, terracotta (#C2714F) accent
 * Typography: DM Serif Display (headings) + DM Sans (body)
 */

import { useState, useEffect } from "react";
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

// ─── WIZARD MOCKUP ──────────────────────────────────────────────────────────────

const MOCK_COMPETITORS = [
  { emoji: '\u{1F338}', name: 'The Flower Letters', color: '#B5546A' },
  { emoji: '\u{1F40C}', name: 'Snail Mail Chronicles', color: '#5A8A6A' },
  { emoji: '\u{1F33F}', name: 'Tiny Farmers Market', color: '#6B8A3A' },
];

// ─── HERO JOURNEY MOCKUP ──────────────────────────────────────────────────────
// Full journey animation: URL typing → brand ID → competitors → loading → report

const HERO_URL = 'postscriptsociety.com';

const HERO_ANGLES = [
  { label: 'Nostalgia & Connection', pct: 82, color: '#C2714F' },
  { label: 'Gift-Worthy Framing', pct: 67, color: '#D4956A' },
  { label: 'Subscription Value', pct: 54, color: '#E8B48A' },
  { label: 'Social Proof', pct: 38, color: '#6B8A3A' },
  { label: 'Urgency / Limited', pct: 21, color: '#5A8A6A' },
];

const HERO_ADS = [
  { brand: 'Letters From Afar', hook: '"The letter you\'ve been waiting for"', angle: 'Nostalgia', color: '#C2714F' },
  { brand: 'The Flower Letters', hook: '"55 variations. One winner."', angle: 'Social Proof', color: '#6B8A3A' },
  { brand: 'Snail Mail Chronicles', hook: '"Slow down. Connect deeper."', angle: 'Connection', color: '#5A8A6A' },
];

const HERO_COMPETITORS = [
  { name: 'Letters From Afar', color: '#C2714F' },
  { name: 'The Flower Letters', color: '#6B8A3A' },
  { name: 'Snail Mail Chronicles', color: '#5A8A6A' },
];

const LOADING_STEPS = [
  'Fetching competitor ads...',
  'Analyzing messaging angles...',
  'Extracting hooks & triggers...',
  'Building your report...',
];

// Scene IDs: 0=typing, 1=scanning, 2=brand+competitors, 3=loading, 4=report
function HeroJourneyMockup() {
  const [scene, setScene] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [visibleCompetitors, setVisibleCompetitors] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingPct, setLoadingPct] = useState(0);
  const [visibleAngles, setVisibleAngles] = useState(0);
  const [visibleAds, setVisibleAds] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;

    if (scene === 0) {
      // Typing
      if (charCount < HERO_URL.length) {
        t = setTimeout(() => setCharCount(c => c + 1), 55);
      } else {
        t = setTimeout(() => setScene(1), 400);
      }
    } else if (scene === 1) {
      // Scanning
      t = setTimeout(() => setScene(2), 900);
    } else if (scene === 2) {
      // Show competitors one by one
      if (visibleCompetitors < HERO_COMPETITORS.length) {
        t = setTimeout(() => setVisibleCompetitors(v => v + 1), 280);
      } else {
        t = setTimeout(() => setScene(3), 1000);
      }
    } else if (scene === 3) {
      // Loading steps
      if (loadingStep < LOADING_STEPS.length) {
        t = setTimeout(() => {
          setLoadingStep(s => s + 1);
          setLoadingPct(p => Math.min(100, p + 25));
        }, 500);
      } else {
        t = setTimeout(() => setScene(4), 600);
      }
    } else if (scene === 4) {
      // Show report angles then ads
      if (visibleAngles < HERO_ANGLES.length) {
        t = setTimeout(() => setVisibleAngles(a => a + 1), 220);
      } else if (visibleAds < HERO_ADS.length) {
        t = setTimeout(() => setVisibleAds(a => a + 1), 300);
      } else {
        // Pause then reset
        t = setTimeout(() => {
          setScene(0);
          setCharCount(0);
          setVisibleCompetitors(0);
          setLoadingStep(0);
          setLoadingPct(0);
          setVisibleAngles(0);
          setVisibleAds(0);
        }, 2800);
      }
    }

    return () => clearTimeout(t);
  }, [scene, charCount, visibleCompetitors, loadingStep, visibleAngles, visibleAds]);

  const displayedUrl = HERO_URL.slice(0, charCount);

  return (
    <div style={{ background: '#F7F5F0', fontFamily: "'DM Sans', sans-serif", minHeight: 420, position: 'relative', overflow: 'hidden' }}>

      {/* ── SCENE 0 & 1 & 2: Wizard step 1 ── */}
      <div
        style={{
          position: 'absolute', inset: 0, padding: '24px 24px 16px',
          opacity: scene <= 2 ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }}
      >
        {/* Progress steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
          {['URL', 'Identity', 'Competitors', 'Angles', 'Ads', 'Takeaways'].map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i === 0 ? '#C2714F' : '#E5E0D8',
                color: i === 0 ? '#fff' : '#9C8E80',
                fontSize: 9, fontWeight: 700, flexShrink: 0,
              }}>{i + 1}</div>
              {i < 5 && <div style={{ width: 14, height: 2, background: '#E5E0D8', borderRadius: 2 }} />}
            </div>
          ))}
        </div>

        {/* Step label */}
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: '#C2714F', textTransform: 'uppercase', marginBottom: 3 }}>Step 1 — Scout Your Brand</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#1A1714', fontFamily: "'DM Serif Display', Georgia, serif", marginBottom: 3, letterSpacing: '-0.02em' }}>What's your brand URL?</p>
        <p style={{ fontSize: 11, color: '#6B5E52', marginBottom: 14 }}>Paste your website URL and Scout will identify your brand and top competitors.</p>

        {/* URL input */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <div style={{
            flex: 1, background: '#fff',
            border: `2px solid ${scene === 1 ? '#E8A87C' : '#C2714F'}`,
            borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#1A1714',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'border-color 0.3s',
          }}>
            <span style={{ color: '#9C8E80', fontSize: 11 }}>🔗</span>
            <span style={{ fontFamily: 'monospace', color: '#1A1714' }}>{displayedUrl}</span>
            {scene === 0 && <span style={{ width: 1.5, height: 14, background: '#C2714F', borderRadius: 1, animation: 'blink 1s step-end infinite', display: 'inline-block' }} />}
            {scene === 1 && <span style={{ marginLeft: 4, fontSize: 10, color: '#C2714F', fontWeight: 600 }}>Scanning...</span>}
          </div>
          <div style={{ background: '#C2714F', color: '#fff', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>Scout →</div>
        </div>

        {/* Brand card */}
        <div style={{
          background: '#fff', border: '1px solid #E5E0D8', borderRadius: 10, padding: '12px 14px', marginBottom: 10,
          opacity: scene >= 2 ? 1 : 0,
          transform: scene >= 2 ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, background: '#F0EDE8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✉️</div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1A1714', margin: 0 }}>Post Script Society</p>
              <p style={{ fontSize: 10, color: '#6B5E52', margin: 0 }}>Mail subscription · DTC · Gifting</p>
            </div>
            <div style={{ marginLeft: 'auto', background: '#E8F5EE', color: '#2D7A4F', borderRadius: 5, padding: '2px 7px', fontSize: 9, fontWeight: 700 }}>✓ Identified</div>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {['Nostalgic Gifting', 'Subscription Box', 'Pen Pal Culture'].map(tag => (
              <span key={tag} style={{ background: '#FBF5F1', border: '1px solid #E8D5C8', borderRadius: 5, padding: '2px 7px', fontSize: 9, color: '#C2714F', fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Competitors */}
        <div style={{
          background: '#FBF5F1', border: '1px solid #E8D5C8', borderRadius: 8, padding: '8px 12px',
          opacity: scene >= 2 ? 1 : 0,
          transform: scene >= 2 ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s',
        }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: '#C2714F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Competitors Found</p>
          <div style={{ display: 'flex', gap: 6 }}>
            {HERO_COMPETITORS.map((c, idx) => (
              <div key={c.name} style={{
                flex: 1, background: '#fff', border: `1px solid ${c.color}30`, borderRadius: 6, padding: '6px 8px', textAlign: 'center',
                opacity: idx < visibleCompetitors ? 1 : 0,
                transform: idx < visibleCompetitors ? 'scale(1)' : 'scale(0.85)',
                transition: 'opacity 0.25s ease, transform 0.25s ease',
              }}>
                <p style={{ fontSize: 8, fontWeight: 700, color: c.color, lineHeight: 1.3, margin: 0 }}>{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SCENE 3: Loading overlay ── */}
      <div
        style={{
          position: 'absolute', inset: 0, padding: '24px',
          background: '#F7F5F0',
          opacity: scene === 3 ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* Pulsing icon */}
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, #C2714F, #E8A87C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, marginBottom: 14,
          boxShadow: '0 0 0 8px rgba(194,113,79,0.12)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>🔍</div>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1714', marginBottom: 4, fontFamily: "'DM Serif Display', Georgia, serif" }}>Scouting the competition...</p>
        <p style={{ fontSize: 11, color: '#6B5E52', marginBottom: 20 }}>Pulling real ads from the Meta Ads Library</p>

        {/* Progress bar */}
        <div style={{ width: '80%', height: 4, background: '#E5E0D8', borderRadius: 4, marginBottom: 16, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4,
            background: 'linear-gradient(90deg, #C2714F, #E8A87C)',
            width: `${loadingPct}%`,
            transition: 'width 0.45s ease',
          }} />
        </div>

        {/* Steps */}
        <div style={{ width: '80%', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {LOADING_STEPS.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                background: i < loadingStep ? '#C2714F' : '#E5E0D8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 8, color: '#fff',
                transition: 'background 0.3s ease',
              }}>{i < loadingStep ? '✓' : ''}</div>
              <p style={{ fontSize: 10, color: i < loadingStep ? '#1A1714' : '#9C8E80', fontWeight: i < loadingStep ? 600 : 400, margin: 0, transition: 'color 0.3s' }}>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SCENE 4: Report ── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          opacity: scene === 4 ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Report header */}
        <div style={{ background: 'linear-gradient(135deg, #F0EDE8 0%, #F7F5F0 100%)', padding: '16px 20px 12px', borderBottom: '1px solid #E5E0D8' }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: '#C2714F', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Competitor Creative Analysis</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#1A1714', fontFamily: "'DM Serif Display', Georgia, serif", margin: 0 }}>Post Script Society — Scout Report</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {[['93', 'Ads analyzed'], ['5', 'Angles'], ['3', 'Competitors']].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#C2714F', margin: 0, fontFamily: "'DM Serif Display', Georgia, serif" }}>{val}</p>
                <p style={{ fontSize: 9, color: '#6B5E52', margin: 0 }}>{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Report body */}
        <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Angles section */}
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#C2714F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Messaging Angles</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {HERO_ANGLES.map((angle, i) => (
                <div key={angle.label} style={{ display: 'flex', alignItems: 'center', gap: 8,
                  opacity: i < visibleAngles ? 1 : 0,
                  transform: i < visibleAngles ? 'translateX(0)' : 'translateX(-8px)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                }}>
                  <p style={{ fontSize: 9, color: '#1A1714', width: 110, flexShrink: 0, margin: 0, fontWeight: 500 }}>{angle.label}</p>
                  <div style={{ flex: 1, height: 6, background: '#E5E0D8', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 3, background: angle.color,
                      width: i < visibleAngles ? `${angle.pct}%` : '0%',
                      transition: 'width 0.5s ease 0.1s',
                    }} />
                  </div>
                  <p style={{ fontSize: 9, color: '#6B5E52', width: 24, textAlign: 'right', margin: 0 }}>{angle.pct}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* SwipeFile ads */}
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#C2714F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>SwipeFile Ads</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {HERO_ADS.map((ad, i) => (
                <div key={ad.brand} style={{
                  flex: 1, background: '#fff', border: `1px solid ${ad.color}25`, borderRadius: 7, padding: '8px 10px',
                  opacity: i < visibleAds ? 1 : 0,
                  transform: i < visibleAds ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                }}>
                  <div style={{ width: '100%', height: 28, background: `${ad.color}15`, borderRadius: 4, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '60%', height: 3, background: ad.color, borderRadius: 2, opacity: 0.5 }} />
                  </div>
                  <p style={{ fontSize: 8, fontWeight: 700, color: '#1A1714', margin: '0 0 2px', lineHeight: 1.3 }}>{ad.hook}</p>
                  <span style={{ fontSize: 7, background: `${ad.color}20`, color: ad.color, borderRadius: 3, padding: '1px 5px', fontWeight: 600 }}>{ad.angle}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TYPED_URL = 'postscriptsociety.com';
// Animation phases: 0=typing, 1=typed+scanning, 2=brand shown, 3=competitors shown, 4=pause before reset
const PHASE_DURATIONS = [TYPED_URL.length * 60, 600, 500, 800, 1200];

function WizardMockup() {
  const [phase, setPhase] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [visibleCompetitors, setVisibleCompetitors] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 0) {
      // Typing phase: add one character every 60ms
      if (charCount < TYPED_URL.length) {
        timeout = setTimeout(() => setCharCount(c => c + 1), 60);
      } else {
        timeout = setTimeout(() => setPhase(1), PHASE_DURATIONS[1]);
      }
    } else if (phase === 1) {
      timeout = setTimeout(() => setPhase(2), PHASE_DURATIONS[2]);
    } else if (phase === 2) {
      // Show competitors one by one
      if (visibleCompetitors < MOCK_COMPETITORS.length) {
        timeout = setTimeout(() => setVisibleCompetitors(v => v + 1), 300);
      } else {
        timeout = setTimeout(() => setPhase(3), PHASE_DURATIONS[3]);
      }
    } else if (phase === 3) {
      timeout = setTimeout(() => setPhase(4), PHASE_DURATIONS[4]);
    } else if (phase === 4) {
      // Reset
      setCharCount(0);
      setVisibleCompetitors(0);
      setPhase(0);
    }

    return () => clearTimeout(timeout);
  }, [phase, charCount, visibleCompetitors]);

  const displayedUrl = TYPED_URL.slice(0, charCount);
  const isScanning = phase === 1;
  const showBrand = phase >= 2;
  const showCompetitors = phase >= 2;

  return (
    <div style={{ background: '#F7F5F0', padding: '28px 24px', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-6">
        {['Brand URL', 'Identity', 'Competitors', 'Angles', 'Ads', 'Takeaways'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-full text-xs font-bold"
              style={{
                width: 22, height: 22, flexShrink: 0,
                background: i === 0 ? '#C2714F' : '#E5E0D8',
                color: i === 0 ? '#fff' : '#9C8E80',
                fontSize: 10,
              }}
            >
              {i + 1}
            </div>
            {i < 5 && <div style={{ width: 16, height: 2, background: '#E5E0D8', borderRadius: 2 }} />}
          </div>
        ))}
      </div>

      {/* Step heading */}
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#C2714F', textTransform: 'uppercase', marginBottom: 4 }}>Step 1 — Scout Your Brand</p>
      <p style={{ fontSize: 18, fontWeight: 700, color: '#1A1714', fontFamily: "'DM Serif Display', Georgia, serif", marginBottom: 4, letterSpacing: '-0.02em' }}>What's your brand URL?</p>
      <p style={{ fontSize: 12, color: '#6B5E52', marginBottom: 16 }}>Paste your website URL and Scout will identify your brand, category, and top competitors.</p>

      {/* URL input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <div style={{ flex: 1, background: '#fff', border: `2px solid ${isScanning ? '#E8A87C' : '#C2714F'}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#1A1714', display: 'flex', alignItems: 'center', gap: 6, transition: 'border-color 0.3s' }}>
          <span style={{ color: '#9C8E80', fontSize: 12 }}>🔗</span>
          <span style={{ color: '#1A1714', fontFamily: 'monospace' }}>{displayedUrl}</span>
          {!isScanning && phase < 3 && (
            <span style={{ width: 2, height: 16, background: '#C2714F', borderRadius: 1, animation: 'blink 1s step-end infinite', display: 'inline-block' }} />
          )}
          {isScanning && (
            <span style={{ marginLeft: 4, fontSize: 10, color: '#C2714F', fontWeight: 600, animation: 'pulse 1s ease-in-out infinite' }}>Scanning...</span>
          )}
        </div>
        <div style={{ background: '#C2714F', color: '#fff', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', opacity: phase >= 1 ? 1 : 0.6, transition: 'opacity 0.3s' }}>Scout →</div>
      </div>

      {/* Detected brand card */}
      <div
        style={{
          background: '#fff', border: '1px solid #E5E0D8', borderRadius: 12, padding: '14px 16px', marginBottom: 12,
          opacity: showBrand ? 1 : 0,
          transform: showBrand ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F0EDE8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✉️</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1714', margin: 0 }}>Post Script Society</p>
            <p style={{ fontSize: 11, color: '#6B5E52', margin: 0 }}>Mail subscription · DTC · Gifting</p>
          </div>
          <div style={{ marginLeft: 'auto', background: '#E8F5EE', color: '#2D7A4F', borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 700 }}>✓ Identified</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Nostalgic Gifting', 'Subscription Box', 'Pen Pal Culture'].map(tag => (
            <span key={tag} style={{ background: '#FBF5F1', border: '1px solid #E8D5C8', borderRadius: 6, padding: '3px 8px', fontSize: 10, color: '#C2714F', fontWeight: 600 }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Competitors found */}
      <div
        style={{
          background: '#FBF5F1', border: '1px solid #E8D5C8', borderRadius: 10, padding: '10px 14px',
          opacity: showCompetitors ? 1 : 0,
          transform: showCompetitors ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s',
        }}
      >
        <p style={{ fontSize: 10, fontWeight: 700, color: '#C2714F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Competitors Found</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {MOCK_COMPETITORS.map((c, idx) => (
            <div
              key={c.name}
              style={{
                flex: 1, background: '#fff', border: `1px solid ${c.color}30`, borderRadius: 8, padding: '8px 10px', textAlign: 'center',
                opacity: idx < visibleCompetitors ? 1 : 0,
                transform: idx < visibleCompetitors ? 'scale(1)' : 'scale(0.85)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
              }}
            >
              <div style={{ fontSize: 16, marginBottom: 3 }}>{c.emoji}</div>
              <p style={{ fontSize: 9, fontWeight: 700, color: c.color, lineHeight: 1.3, margin: 0 }}>{c.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── REPORT MOCKUP ───────────────────────────────────────────────────────────

const MOCK_ADS = [
  { brand: 'LFA', color: '#C2714F', emoji: 'Map', headline: 'Letters from the edge of the world', format: 'Video' },
  { brand: 'TFL', color: '#B5546A', emoji: 'Mail', headline: "Send a letter. Make someone's day.", format: 'Image' },
];

function ReportMockup() {
  return (
    <div style={{ background: '#F7F5F0', fontFamily: "'DM Sans', sans-serif", display: 'flex', height: 420 }}>
      {/* Sidebar */}
      <div style={{ width: 140, background: '#fff', borderRight: '1px solid #E5E0D8', padding: '16px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 12px 12px', borderBottom: '1px solid #E5E0D8', marginBottom: 8 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: '#C2714F', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Creative Report</p>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#1A1714', margin: '2px 0 0' }}>Competitor Analysis</p>
        </div>
        {['◈ Report Overview', '📌 SwipeFile', '🧭 Angle Landscape', '🔬 Angle Deep Dives', '🎣 Top Hooks', '🧠 Psych Triggers', '◉ Cross-Brand', '◆ Key Takeaways'].map((item, i) => (
          <div key={item} style={{ padding: '6px 12px', background: i === 0 ? '#F0EDE8' : 'transparent', fontSize: 10, color: i === 0 ? '#1A1714' : '#6B5E52', fontWeight: i === 0 ? 700 : 400, display: 'flex', alignItems: 'center', gap: 4 }}>
            {item}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '16px 20px' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #F0EDE8, #EAE4DC)', borderRadius: 12, padding: '16px 20px', marginBottom: 14, border: '1px solid #E5E0D8' }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: '#C2714F', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Report Overview</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#1A1714', fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em', marginBottom: 2 }}>Post Script Society —</p>
          <p style={{ fontSize: 14, color: '#C2714F', fontStyle: 'italic', fontFamily: "'DM Serif Display', Georgia, serif", marginBottom: 8 }}>Competitor Creative Analysis</p>
          <div style={{ display: 'flex', gap: 16 }}>
            {[['12', 'Ads'], ['5', 'Angles'], ['3', 'Brands'], ['93', 'Variations']].map(([val, label]) => (
              <div key={label}>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#1A1714', fontFamily: "'DM Serif Display', Georgia, serif", margin: 0 }}>{val}</p>
                <p style={{ fontSize: 9, color: '#6B5E52', margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Angle bars */}
        <div style={{ background: '#fff', border: '1px solid #E5E0D8', borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: '#C2714F', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Messaging Angles</p>
          {[['Nostalgic Escapism', 80, '#C2714F'], ['Gift Positioning', 65, '#B5546A'], ['Curiosity Gap', 50, '#4A6FA5'], ['Identity & Belonging', 45, '#5A8A6A'], ['Social Proof', 30, '#8B6FA5']].map(([label, pct, color]) => (
            <div key={String(label)} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#4A3F36', marginBottom: 2 }}>
                <span>{label}</span><span style={{ fontWeight: 700, color: String(color) }}>{pct}%</span>
              </div>
              <div style={{ height: 4, background: '#F0EDE8', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: String(color), borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Ad cards row */}
        <div style={{ display: 'flex', gap: 8 }}>
          {MOCK_ADS.map(ad => (
            <div key={ad.brand} style={{ flex: 1, background: '#fff', border: '1px solid #E5E0D8', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ borderLeft: `3px solid ${ad.color}`, padding: '8px 10px' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  <span style={{ background: ad.color, color: '#fff', borderRadius: 4, padding: '1px 5px', fontSize: 8, fontWeight: 700 }}>{ad.brand}</span>
                  <span style={{ background: '#E5E0D8', color: '#5A4E44', borderRadius: 4, padding: '1px 5px', fontSize: 8 }}>{ad.format}</span>
                </div>
                <p style={{ fontSize: 9, fontWeight: 600, color: '#1A1714', lineHeight: 1.3, margin: 0 }}>{ad.headline}</p>
              </div>
              <div style={{ background: `${ad.color}10`, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{ad.emoji}</div>
            </div>
          ))}
        </div>
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
            <HeroJourneyMockup />
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
          Built for your team
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium" style={{ color: "#5A4E44" }}>
          {["DTC Brands", "Creative Agencies", "Media Buyers", "Brand Strategists"].map(
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
                <WizardMockup />
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
                <ReportMockup />
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
