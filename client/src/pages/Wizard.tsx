/**
 * Wizard.tsx — New Report Setup Wizard
 *
 * Step 0: Brand URL — paste a URL, AI auto-fills everything
 * Step 1: Report Identity   — client name, title, date, data source, executive summary
 * Step 2: Competitor Brands — up to 4 brands with name, short key, color, emoji
 * Step 3: Messaging Angles  — up to 6 angles with title, description, color, prevalence %
 * Step 4: SwipeFile Ads     — up to 10 ads with all fields
 * Step 5: Key Takeaways     — up to 6 strategic insights
 * Step 6: Review & Launch   — summary before generating the report
 */

import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useReport, type ReportConfig, type WizardBrand, type WizardAd, type WizardAngle } from "@/contexts/ReportContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── STEP DEFINITIONS ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Report Identity", icon: "◈", desc: "Name your report and set the context" },
  { id: 2, label: "Competitor Brands", icon: "🏷", desc: "Add up to 4 brands to analyze" },
  { id: 3, label: "Messaging Angles", icon: "🧭", desc: "Define the creative angles in this category" },
  { id: 4, label: "SwipeFile Ads", icon: "📌", desc: "Add up to 10 ads from the Ads Library" },
  { id: 5, label: "Key Takeaways", icon: "◆", desc: "Summarize your strategic findings" },
  { id: 6, label: "Review & Launch", icon: "🚀", desc: "Preview and generate your report" },
];

const ANGLE_COLORS = ["#C2714F", "#B5546A", "#4A6FA5", "#5A8A6A", "#8B6FA5", "#D4A853"];
const BRAND_COLORS = ["#C2714F", "#B5546A", "#4A6FA5", "#5A8A6A"];
const BRAND_EMOJIS = ["🗺", "💌", "✈️", "🌿", "📬", "🌸", "📖", "🎯"];
const FORMAT_OPTIONS = ["Video", "Image", "Carousel", "DCO"] as const;
const PLATFORM_OPTIONS = ["Facebook", "Instagram", "Audience Network", "Messenger", "Threads", "TikTok"];

// ─── SHARED UI PRIMITIVES ─────────────────────────────────────────────────────

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-xs font-semibold text-[oklch(0.35_0.015_50)] uppercase tracking-wide mb-1.5">
    {children} {required && <span className="text-[#C2714F]">*</span>}
  </label>
);

const Input = ({ value, onChange, placeholder, type = "text", className = "" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string;
}) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full px-3 py-2 text-sm rounded-lg border border-[oklch(0.88_0.01_80)] bg-white text-[oklch(0.25_0.015_50)] placeholder:text-[oklch(0.7_0.01_80)] focus:outline-none focus:ring-2 focus:ring-[#C2714F]/30 focus:border-[#C2714F] transition-all ${className}`}
  />
);

const Textarea = ({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) => (
  <textarea
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="w-full px-3 py-2 text-sm rounded-lg border border-[oklch(0.88_0.01_80)] bg-white text-[oklch(0.25_0.015_50)] placeholder:text-[oklch(0.7_0.01_80)] focus:outline-none focus:ring-2 focus:ring-[#C2714F]/30 focus:border-[#C2714F] transition-all resize-none"
  />
);

const Select = ({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[];
}) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="w-full px-3 py-2 text-sm rounded-lg border border-[oklch(0.88_0.01_80)] bg-white text-[oklch(0.25_0.015_50)] focus:outline-none focus:ring-2 focus:ring-[#C2714F]/30 focus:border-[#C2714F] transition-all"
  >
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl border border-[oklch(0.88_0.01_80)] shadow-sm ${className}`}>
    {children}
  </div>
);

const Btn = ({ onClick, children, variant = "primary", disabled = false, className = "" }: {
  onClick?: () => void; children: React.ReactNode; variant?: "primary" | "ghost" | "danger"; disabled?: boolean; className?: string;
}) => {
  const base = "px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none";
  const variants = {
    primary: "bg-[#C2714F] text-white hover:bg-[#a85e3e] disabled:opacity-40",
    ghost: "border border-[oklch(0.88_0.01_80)] text-[oklch(0.45_0.015_60)] hover:bg-[oklch(0.96_0.005_80)] hover:text-[oklch(0.25_0.015_50)]",
    danger: "text-red-500 hover:bg-red-50 border border-red-200",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// ─── STEP 0: BRAND URL (AI AUTO-FILL) ────────────────────────────────────────

function StepUrl({
  onAutoFill,
  onSkip,
}: {
  onAutoFill: (config: Partial<ReportConfig>) => void;
  onSkip: () => void;
}) {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const researchMutation = trpc.research.fromUrl.useMutation({
    onSuccess: (data) => {
      if (data.success && data.config) {
        setPhase("done");
        setStatusMsg("All fields pre-filled! Review and adjust below.");
        onAutoFill(data.config as Partial<ReportConfig>);
        toast.success("Report pre-filled from brand URL!");
      } else {
        setPhase("error");
        setStatusMsg("Could not extract data. Try a different URL or fill in manually.");
      }
    },
    onError: (err) => {
      setPhase("error");
      setStatusMsg(err.message || "Something went wrong. Try again or fill in manually.");
    },
  });

  const handleAnalyze = () => {
    if (!url) { toast.error("Please enter a brand URL"); return; }
    let normalized = url.trim();
    if (!normalized.startsWith("http")) normalized = "https://" + normalized;

    setPhase("loading");
    setStatusMsg("Fetching brand website...");

    // Simulate progress messages
    const messages = [
      { ms: 1500, msg: "Analyzing brand identity & category..." },
      { ms: 4000, msg: "Identifying competitor brands..." },
      { ms: 7000, msg: "Generating messaging angles..." },
      { ms: 11000, msg: "Building SwipeFile ad examples..." },
      { ms: 16000, msg: "Synthesizing key takeaways..." },
      { ms: 22000, msg: "Almost done — finalizing report..." },
    ];
    messages.forEach(({ ms, msg }) => {
      setTimeout(() => {
        if (phase !== "done" && phase !== "error") setStatusMsg(msg);
      }, ms);
    });

    researchMutation.mutate({ url: normalized });
  };

  return (
    <div className="space-y-6">
      {/* Hero explainer */}
      <div className="bg-gradient-to-br from-[oklch(0.18_0.015_50)] to-[oklch(0.24_0.02_45)] rounded-2xl p-7 text-white">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">✦</span>
          <div>
            <h2 className="text-xl font-normal leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              AI-Powered Auto-Fill
            </h2>
            <p className="text-[oklch(0.7_0.01_80)] text-sm">Paste one URL — get a complete report in ~30 seconds</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          {[
            { icon: "🔍", label: "Brand Analysis", desc: "Extracts brand name, category, and value proposition" },
            { icon: "🏷", label: "Competitor Discovery", desc: "Identifies 2–4 direct competitors in your category" },
            { icon: "📌", label: "SwipeFile Generation", desc: "Creates 10 realistic ad examples with copy & angles" },
          ].map(item => (
            <div key={item.label} className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span>{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              <p className="text-xs text-[oklch(0.7_0.01_80)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* URL input */}
      <Card className="p-6">
        <Label required>Your Brand URL</Label>
        <div className="flex gap-3 mt-1">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && phase === "idle" && handleAnalyze()}
            placeholder="https://yourbrand.com"
            disabled={phase === "loading"}
            className="flex-1 px-4 py-3 text-sm rounded-xl border-2 border-[oklch(0.88_0.01_80)] bg-white text-[oklch(0.25_0.015_50)] placeholder:text-[oklch(0.7_0.01_80)] focus:outline-none focus:ring-2 focus:ring-[#C2714F]/30 focus:border-[#C2714F] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono"
          />
          <button
            onClick={handleAnalyze}
            disabled={phase === "loading" || !url}
            className="px-6 py-3 bg-[#C2714F] text-white rounded-xl text-sm font-semibold hover:bg-[#a85e3e] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
          >
            {phase === "loading" ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>✦ Generate Report</>
            )}
          </button>
        </div>
        <p className="text-xs text-[oklch(0.6_0.015_60)] mt-2">
          Enter your brand's website URL. The AI will research your category, identify competitors, and pre-fill all report sections.
        </p>

        {/* Status / progress */}
        <AnimatePresence>
          {phase !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-4 rounded-xl px-4 py-3 flex items-center gap-3 text-sm ${
                phase === "loading" ? "bg-[oklch(0.97_0.005_80)] border border-[oklch(0.88_0.01_80)]" :
                phase === "done" ? "bg-green-50 border border-green-200 text-green-700" :
                "bg-red-50 border border-red-200 text-red-600"
              }`}
            >
              {phase === "loading" && (
                <svg className="animate-spin w-4 h-4 text-[#C2714F] flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {phase === "done" && <span className="text-green-600 flex-shrink-0">✓</span>}
              {phase === "error" && <span className="text-red-500 flex-shrink-0">✕</span>}
              <span className={phase === "loading" ? "text-[oklch(0.45_0.015_60)]" : ""}>{statusMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* What gets auto-filled */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { icon: "◈", label: "Report Identity", desc: "Brand name, title, executive summary" },
          { icon: "🏷", label: "Competitor Brands", desc: "2–4 brands with colors & keys" },
          { icon: "🧭", label: "Messaging Angles", desc: "4–6 creative angles with descriptions" },
          { icon: "📌", label: "SwipeFile Ads", desc: "10 ad examples with copy & format" },
          { icon: "◆", label: "Key Takeaways", desc: "5–6 strategic insights" },
          { icon: "🚀", label: "Ready to Launch", desc: "Review & adjust before publishing" },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-[oklch(0.88_0.01_80)] p-3 flex items-start gap-3">
            <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
            <div>
              <p className="text-xs font-semibold text-[oklch(0.35_0.015_50)]">{item.label}</p>
              <p className="text-xs text-[oklch(0.6_0.015_60)] mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Skip option */}
      <div className="text-center">
        <button
          onClick={onSkip}
          className="text-sm text-[oklch(0.6_0.015_60)] hover:text-[oklch(0.35_0.015_50)] transition-colors underline underline-offset-4"
        >
          Skip auto-fill — I'll enter everything manually →
        </button>
      </div>
    </div>
  );
}

// ─── STEP 1: REPORT IDENTITY ──────────────────────────────────────────────────

function StepIdentity({ data, onChange }: {
  data: Pick<ReportConfig, "clientName" | "reportTitle" | "reportDate" | "dataSource" | "executiveSummary">;
  onChange: (k: string, v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label required>Client / Brand Name</Label>
          <Input value={data.clientName} onChange={v => onChange("clientName", v)} placeholder="e.g. Post Script Society" />
          <p className="text-xs text-[oklch(0.6_0.015_60)] mt-1">Your brand or client name — appears in the report hero</p>
        </div>
        <div>
          <Label required>Report Title</Label>
          <Input value={data.reportTitle} onChange={v => onChange("reportTitle", v)} placeholder="e.g. Competitor Creative Analysis" />
        </div>
        <div>
          <Label required>Report Date</Label>
          <Input value={data.reportDate} onChange={v => onChange("reportDate", v)} placeholder="e.g. March 2026" />
        </div>
        <div>
          <Label>Data Source</Label>
          <Input value={data.dataSource} onChange={v => onChange("dataSource", v)} placeholder="e.g. Meta Ads Library (United States)" />
        </div>
      </div>
      <div>
        <Label required>Executive Summary</Label>
        <Textarea
          value={data.executiveSummary}
          onChange={v => onChange("executiveSummary", v)}
          rows={6}
          placeholder="Write a 2–3 paragraph overview of the analysis. What brands were studied? What were the key findings? What does this category compete on?"
        />
        <p className="text-xs text-[oklch(0.6_0.015_60)] mt-1">Appears in the Report Overview section. Separate paragraphs with a blank line.</p>
      </div>
    </div>
  );
}

// ─── STEP 2: COMPETITOR BRANDS ────────────────────────────────────────────────

function StepBrands({ brands, onChange }: {
  brands: WizardBrand[];
  onChange: (brands: WizardBrand[]) => void;
}) {
  const addBrand = () => {
    if (brands.length >= 4) { toast.error("Maximum 4 competitor brands"); return; }
    const idx = brands.length;
    onChange([...brands, {
      key: "",
      name: "",
      color: BRAND_COLORS[idx] || "#888888",
      emoji: BRAND_EMOJIS[idx] || "📬",
    }]);
  };

  const updateBrand = (i: number, field: keyof WizardBrand, value: string) => {
    const next = [...brands];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };

  const removeBrand = (i: number) => onChange(brands.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <p className="text-sm text-[oklch(0.45_0.015_60)]">Add the competitor brands you analyzed. Each brand gets its own color and identifier used throughout the report.</p>
      {brands.map((brand, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[oklch(0.35_0.015_50)]" style={{ fontFamily: 'var(--font-display)' }}>Brand {i + 1}</span>
            {brands.length > 1 && <Btn variant="danger" onClick={() => removeBrand(i)}>Remove</Btn>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Label required>Full Brand Name</Label>
              <Input value={brand.name} onChange={v => updateBrand(i, "name", v)} placeholder="e.g. Letters From Afar" />
            </div>
            <div>
              <Label required>Short Key (3–4 chars)</Label>
              <Input value={brand.key} onChange={v => updateBrand(i, "key", v.toUpperCase().slice(0, 4))} placeholder="LFA" />
            </div>
            <div>
              <Label>Emoji</Label>
              <Input value={brand.emoji} onChange={v => updateBrand(i, "emoji", v)} placeholder="🗺" />
            </div>
            <div>
              <Label>Brand Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brand.color}
                  onChange={e => updateBrand(i, "color", e.target.value)}
                  className="w-10 h-9 rounded border border-[oklch(0.88_0.01_80)] cursor-pointer"
                />
                <Input value={brand.color} onChange={v => updateBrand(i, "color", v)} placeholder="#C2714F" className="font-mono" />
              </div>
            </div>
          </div>
        </Card>
      ))}
      {brands.length < 4 && (
        <button
          onClick={addBrand}
          className="w-full py-3 rounded-xl border-2 border-dashed border-[oklch(0.88_0.01_80)] text-sm text-[oklch(0.6_0.015_60)] hover:border-[#C2714F] hover:text-[#C2714F] transition-all"
        >
          + Add Competitor Brand
        </button>
      )}
    </div>
  );
}

// ─── STEP 3: MESSAGING ANGLES ─────────────────────────────────────────────────

function StepAngles({ angles, onChange }: {
  angles: WizardAngle[];
  onChange: (angles: WizardAngle[]) => void;
}) {
  const addAngle = () => {
    if (angles.length >= 6) { toast.error("Maximum 6 messaging angles"); return; }
    const idx = angles.length;
    onChange([...angles, {
      id: `angle-${Date.now()}`,
      title: "",
      description: "",
      color: ANGLE_COLORS[idx] || "#888888",
      share: 50,
    }]);
  };

  const update = (i: number, field: keyof WizardAngle, value: string | number) => {
    const next = [...angles];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };

  const remove = (i: number) => onChange(angles.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <p className="text-sm text-[oklch(0.45_0.015_60)]">Define the creative messaging angles being tested in this category. These appear in the Angle Landscape and Angle Deep Dives sections.</p>
      {angles.map((angle, i) => (
        <Card key={angle.id} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: angle.color }} />
              <span className="text-sm font-semibold text-[oklch(0.35_0.015_50)]" style={{ fontFamily: 'var(--font-display)' }}>
                Angle {i + 1}
              </span>
            </div>
            {angles.length > 1 && <Btn variant="danger" onClick={() => remove(i)}>Remove</Btn>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="md:col-span-2">
              <Label required>Angle Title</Label>
              <Input value={angle.title} onChange={v => update(i, "title", v)} placeholder="e.g. Nostalgic Escapism & Digital Detox" />
            </div>
            <div>
              <Label>Prevalence (%)</Label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={angle.share}
                  onChange={e => update(i, "share", parseInt(e.target.value))}
                  className="flex-1 accent-[#C2714F]"
                />
                <span className="text-sm font-semibold text-[oklch(0.35_0.015_50)] w-10 text-right">{angle.share}%</span>
              </div>
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={angle.description}
              onChange={v => update(i, "description", v)}
              rows={3}
              placeholder="Describe how this angle manifests in ads. What emotion does it trigger? What's the conversion mechanism?"
            />
          </div>
        </Card>
      ))}
      {angles.length < 6 && (
        <button
          onClick={addAngle}
          className="w-full py-3 rounded-xl border-2 border-dashed border-[oklch(0.88_0.01_80)] text-sm text-[oklch(0.6_0.015_60)] hover:border-[#C2714F] hover:text-[#C2714F] transition-all"
        >
          + Add Messaging Angle
        </button>
      )}
    </div>
  );
}

// ─── STEP 4: SWIPEFILE ADS ────────────────────────────────────────────────────

function StepAds({ ads, brands, angles, onChange }: {
  ads: WizardAd[];
  brands: WizardBrand[];
  angles: WizardAngle[];
  onChange: (ads: WizardAd[]) => void;
}) {
  const addAd = () => {
    if (ads.length >= 10) { toast.error("Maximum 10 ads"); return; }
    onChange([...ads, {
      id: `ad-${Date.now()}`,
      brandKey: brands[0]?.key || "",
      format: "Video" as const,
      headline: "",
      bodyPreview: "",
      fullBody: "",
      status: "Active" as const,
      startDate: "",
      variations: 1,
      angle: angles[0]?.title || "",
      hook: "",
      cta: "Subscribe Now",
      platforms: ["Facebook", "Instagram"],
      thumbnailUrl: "",
      metaUrl: "https://www.facebook.com/ads/library/",
    }]);
  };

  const update = (i: number, field: keyof WizardAd, value: any) => {
    const next = [...ads];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };

  const remove = (i: number) => onChange(ads.filter((_, idx) => idx !== i));

  const togglePlatform = (adIdx: number, platform: string) => {
    const ad = ads[adIdx];
    const current = ad.platforms || [];
    const next = current.includes(platform)
      ? current.filter(p => p !== platform)
      : [...current, platform];
    update(adIdx, "platforms", next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[oklch(0.45_0.015_60)]">Add up to 10 ads from the Meta Ads Library. Mix formats: Video, Image, Carousel, DCO.</p>
        <span className="text-xs text-[oklch(0.6_0.015_60)] bg-[oklch(0.96_0.005_80)] px-2 py-1 rounded-full">{ads.length}/10 ads</span>
      </div>
      {ads.map((ad, i) => {
        const brandColor = brands.find(b => b.key === ad.brandKey)?.color || "#888";
        return (
          <Card key={ad.id} className="overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[oklch(0.92_0.005_80)]" style={{ borderLeftColor: brandColor, borderLeftWidth: 3 }}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[oklch(0.6_0.015_60)]">#{String(i + 1).padStart(2, "0")}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: brandColor }}>
                  {ad.brandKey || "?"}
                </span>
                <span className="text-xs text-[oklch(0.6_0.015_60)]">{ad.format}</span>
              </div>
              <Btn variant="danger" onClick={() => remove(i)}>Remove</Btn>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label required>Brand</Label>
                <Select
                  value={ad.brandKey}
                  onChange={v => {
                    update(i, "brandKey", v);
                  }}
                  options={brands.map(b => b.key)}
                />
              </div>
              <div>
                <Label required>Ad Format</Label>
                <Select value={ad.format} onChange={v => update(i, "format", v)} options={[...FORMAT_OPTIONS]} />
              </div>
              <div className="md:col-span-2">
                <Label required>Headline</Label>
                <Input value={ad.headline} onChange={v => update(i, "headline", v)} placeholder="e.g. Remember when getting mail was actually exciting?" />
              </div>
              <div className="md:col-span-2">
                <Label>Body Copy (Preview)</Label>
                <Input value={ad.bodyPreview} onChange={v => update(i, "bodyPreview", v)} placeholder="Short preview (1-2 sentences)..." />
              </div>
              <div className="md:col-span-2">
                <Label>Full Body Copy</Label>
                <Textarea value={ad.fullBody} onChange={v => update(i, "fullBody", v)} rows={3} placeholder="Full ad body copy..." />
              </div>
              <div>
                <Label>Messaging Angle</Label>
                <Select value={ad.angle} onChange={v => update(i, "angle", v)} options={angles.map(a => a.title).filter(Boolean).length > 0 ? angles.map(a => a.title) : ["Angle 1"]} />
              </div>
              <div>
                <Label>CTA</Label>
                <Input value={ad.cta} onChange={v => update(i, "cta", v)} placeholder="e.g. Subscribe Now" />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input value={ad.startDate} onChange={v => update(i, "startDate", v)} placeholder="e.g. Nov 2025" />
              </div>
              <div>
                <Label>Meta Ads Library URL</Label>
                <Input value={ad.metaUrl || ""} onChange={v => update(i, "metaUrl", v)} placeholder="https://www.facebook.com/ads/library/?id=..." className="font-mono text-xs" />
              </div>
              <div>
                <Label>Hook (opening line)</Label>
                <Input value={ad.hook} onChange={v => update(i, "hook", v)} placeholder="e.g. Did you know..." />
              </div>
              <div className="md:col-span-2">
                <Label>Thumbnail URL (optional)</Label>
                <Input value={ad.thumbnailUrl || ""} onChange={v => update(i, "thumbnailUrl", v)} placeholder="https://cdn.example.com/thumbnail.jpg" className="font-mono text-xs" />
              </div>
              <div className="md:col-span-2">
                <Label>Platforms</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {PLATFORM_OPTIONS.map(p => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(i, p)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        (ad.platforms || []).includes(p)
                          ? "text-white"
                          : "border border-[oklch(0.88_0.01_80)] text-[oklch(0.6_0.015_60)] hover:border-[#C2714F]"
                      }`}
                      style={(ad.platforms || []).includes(p) ? { backgroundColor: brandColor } : {}}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
      {ads.length < 10 && (
        <button
          onClick={addAd}
          className="w-full py-3 rounded-xl border-2 border-dashed border-[oklch(0.88_0.01_80)] text-sm text-[oklch(0.6_0.015_60)] hover:border-[#C2714F] hover:text-[#C2714F] transition-all"
        >
          + Add Ad to SwipeFile
        </button>
      )}
    </div>
  );
}

// ─── STEP 5: KEY TAKEAWAYS ────────────────────────────────────────────────────

const TAKEAWAY_COLORS = ["#C2714F", "#B5546A", "#4A6FA5", "#5A8A6A", "#8B6FA5", "#D4A853"];

function StepTakeaways({ takeaways, onChange }: {
  takeaways: ReportConfig["takeaways"];
  onChange: (t: ReportConfig["takeaways"]) => void;
}) {
  const add = () => {
    if (takeaways.length >= 6) { toast.error("Maximum 6 takeaways"); return; }
    const idx = takeaways.length;
    onChange([...takeaways, { title: "", body: "", icon: "💡", color: TAKEAWAY_COLORS[idx] || "#888" }]);
  };

  const update = (i: number, field: string, value: string) => {
    const next = [...takeaways];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };

  const remove = (i: number) => onChange(takeaways.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <p className="text-sm text-[oklch(0.45_0.015_60)]">Add up to 6 strategic insights for creative strategists working in this category.</p>
      {takeaways.map((t, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
              <span className="text-sm font-semibold text-[oklch(0.35_0.015_50)]" style={{ fontFamily: 'var(--font-display)' }}>
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            {takeaways.length > 1 && <Btn variant="danger" onClick={() => remove(i)}>Remove</Btn>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <div className="md:col-span-3">
              <Label required>Insight Title</Label>
              <Input value={t.title} onChange={v => update(i, "title", v)} placeholder="e.g. Nostalgia is the Category's Master Key" />
            </div>
            <div>
              <Label>Icon (emoji)</Label>
              <Input value={t.icon} onChange={v => update(i, "icon", v)} placeholder="💡" />
            </div>
          </div>
          <div>
            <Label>Insight Body</Label>
            <Textarea value={t.body} onChange={v => update(i, "body", v)} rows={3} placeholder="Explain the insight with specific evidence from the ads analyzed. What should a creative strategist do with this finding?" />
          </div>
        </Card>
      ))}
      {takeaways.length < 6 && (
        <button onClick={add} className="w-full py-3 rounded-xl border-2 border-dashed border-[oklch(0.88_0.01_80)] text-sm text-[oklch(0.6_0.015_60)] hover:border-[#C2714F] hover:text-[#C2714F] transition-all">
          + Add Key Takeaway
        </button>
      )}
    </div>
  );
}

// ─── STEP 6: REVIEW & LAUNCH ──────────────────────────────────────────────────

function StepReview({ config }: { config: Partial<ReportConfig> }) {
  const checks = [
    { label: "Client name", ok: !!config.clientName },
    { label: "Report title", ok: !!config.reportTitle },
    { label: "Executive summary", ok: !!config.executiveSummary && config.executiveSummary.length > 50 },
    { label: "At least 1 competitor brand", ok: (config.brands?.length ?? 0) >= 1 },
    { label: "At least 1 messaging angle", ok: (config.angles?.length ?? 0) >= 1 },
    { label: "At least 1 SwipeFile ad", ok: (config.ads?.length ?? 0) >= 1 },
    { label: "At least 1 key takeaway", ok: (config.takeaways?.length ?? 0) >= 1 },
  ];
  const allGood = checks.every(c => c.ok);

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <p className="section-label mb-3">Readiness Check</p>
        <div className="space-y-2">
          {checks.map(c => (
            <div key={c.label} className="flex items-center gap-3">
              <span className={`text-sm ${c.ok ? "text-green-600" : "text-[oklch(0.6_0.015_60)]"}`}>
                {c.ok ? "✓" : "○"}
              </span>
              <span className={`text-sm ${c.ok ? "text-[oklch(0.35_0.015_50)]" : "text-[oklch(0.6_0.015_60)]"}`}>{c.label}</span>
            </div>
          ))}
        </div>
        {!allGood && (
          <p className="text-xs text-amber-600 mt-3 bg-amber-50 px-3 py-2 rounded-lg">Complete the required items above before launching. You can still launch and fill in details later.</p>
        )}
      </Card>

      <Card className="p-5">
        <p className="section-label mb-3">Report Summary</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div><span className="text-[oklch(0.6_0.015_60)]">Client:</span> <span className="font-medium text-[oklch(0.35_0.015_50)]">{config.clientName || "—"}</span></div>
          <div><span className="text-[oklch(0.6_0.015_60)]">Brands:</span> <span className="font-medium text-[oklch(0.35_0.015_50)]">{config.brands?.length ?? 0}</span></div>
          <div><span className="text-[oklch(0.6_0.015_60)]">Angles:</span> <span className="font-medium text-[oklch(0.35_0.015_50)]">{config.angles?.length ?? 0}</span></div>
          <div><span className="text-[oklch(0.6_0.015_60)]">Ads:</span> <span className="font-medium text-[oklch(0.35_0.015_50)]">{config.ads?.length ?? 0}</span></div>
          <div><span className="text-[oklch(0.6_0.015_60)]">Takeaways:</span> <span className="font-medium text-[oklch(0.35_0.015_50)]">{config.takeaways?.length ?? 0}</span></div>
          <div><span className="text-[oklch(0.6_0.015_60)]">Date:</span> <span className="font-medium text-[oklch(0.35_0.015_50)]">{config.reportDate || "—"}</span></div>
        </div>
      </Card>

      <div className="bg-[oklch(0.97_0.005_80)] rounded-xl p-4 border border-[oklch(0.88_0.01_80)]">
        <p className="text-sm text-[oklch(0.45_0.015_60)]">
          <strong className="text-[oklch(0.35_0.015_50)]">How this works:</strong> Your report configuration is saved to your browser. Click <strong>Launch Report</strong> to generate the full interactive report using your data. You can always return to this wizard to edit any section.
        </p>
      </div>
    </div>
  );
}

// ─── MAIN WIZARD ──────────────────────────────────────────────────────────────

export default function Wizard() {
  const [, navigate] = useLocation();
  const { setConfig, config: existingConfig, clearConfig } = useReport();

  // step 0 = URL auto-fill screen; steps 1–6 = manual editing
  const [step, setStep] = useState(0);
  const [autoFilled, setAutoFilled] = useState(false);

  const [formData, setFormData] = useState<Partial<ReportConfig>>(() => existingConfig || {
    clientName: "",
    reportTitle: "Competitor Creative Analysis",
    reportDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    dataSource: "Meta Ads Library (United States)",
    executiveSummary: "",
    brands: [
      { key: "BR1", name: "", color: BRAND_COLORS[0], emoji: BRAND_EMOJIS[0] },
      { key: "BR2", name: "", color: BRAND_COLORS[1], emoji: BRAND_EMOJIS[1] },
    ],
    angles: [
      { id: "a1", title: "", description: "", color: ANGLE_COLORS[0], share: 80 },
      { id: "a2", title: "", description: "", color: ANGLE_COLORS[1], share: 60 },
    ],
    ads: [],
    takeaways: [
      { title: "", body: "", icon: "💡", color: TAKEAWAY_COLORS[0] },
    ],
  });

  const updateField = useCallback((key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleAutoFill = (config: Partial<ReportConfig>) => {
    setFormData(config);
    setAutoFilled(true);
    // Auto-advance to step 1 after a short delay
    setTimeout(() => setStep(1), 800);
  };

  const canProceed = () => {
    if (step === 1) return !!(formData.clientName && formData.reportTitle);
    if (step === 2) return (formData.brands?.length ?? 0) >= 1 && formData.brands!.every(b => b.name && b.key);
    return true;
  };

  const handleLaunch = () => {
    const finalConfig: ReportConfig = {
      clientName: formData.clientName || "My Client",
      reportTitle: formData.reportTitle || "Competitor Creative Analysis",
      reportDate: formData.reportDate || "",
      dataSource: formData.dataSource || "Meta Ads Library",
      executiveSummary: formData.executiveSummary || "",
      brands: formData.brands || [],
      angles: formData.angles || [],
      ads: formData.ads || [],
      takeaways: formData.takeaways || [],
    };
    setConfig(finalConfig);
    toast.success("Report generated! Redirecting...");
    setTimeout(() => navigate("/"), 600);
  };

  const stepContent = () => {
    switch (step) {
      case 0: return (
        <StepUrl
          onAutoFill={handleAutoFill}
          onSkip={() => setStep(1)}
        />
      );
      case 1: return <StepIdentity data={formData as any} onChange={updateField} />;
      case 2: return <StepBrands brands={formData.brands || []} onChange={v => updateField("brands", v)} />;
      case 3: return <StepAngles angles={formData.angles || []} onChange={v => updateField("angles", v)} />;
      case 4: return <StepAds ads={formData.ads || []} brands={formData.brands || []} angles={formData.angles || []} onChange={v => updateField("ads", v)} />;
      case 5: return <StepTakeaways takeaways={formData.takeaways || []} onChange={v => updateField("takeaways", v)} />;
      case 6: return <StepReview config={formData} />;
      default: return null;
    }
  };

  const currentStepLabel = step === 0 ? "Brand URL" : STEPS[step - 1]?.label || "";
  const totalSteps = STEPS.length + 1; // +1 for step 0

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.005_80)] flex">
      {/* Left sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[oklch(0.18_0.015_50)] text-white flex-col hidden md:flex">
        <div className="p-5 border-b border-[oklch(0.28_0.015_50)]">
          <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.56_0.12_42)] mb-1">New Report</p>
          <p className="text-base font-normal leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Setup Wizard</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {/* Step 0 */}
          <button
            onClick={() => setStep(0)}
            className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
              step === 0
                ? "bg-[oklch(0.26_0.025_45)] text-white"
                : step > 0
                ? "text-[oklch(0.65_0.08_42)] hover:bg-[oklch(0.22_0.02_45)] cursor-pointer"
                : "text-[oklch(0.45_0.01_50)] cursor-default"
            }`}
          >
            <span className="text-sm flex-shrink-0 mt-0.5">{step > 0 ? "✓" : "✦"}</span>
            <div>
              <p className="text-sm font-medium leading-tight">Brand URL</p>
              <p className="text-xs opacity-60 mt-0.5 leading-tight">
                {autoFilled ? "Auto-filled ✓" : "AI auto-fill from URL"}
              </p>
            </div>
          </button>
          {/* Steps 1–6 */}
          {STEPS.map(s => (
            <button
              key={s.id}
              onClick={() => s.id < step && setStep(s.id)}
              className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                step === s.id
                  ? "bg-[oklch(0.26_0.025_45)] text-white"
                  : s.id < step
                  ? "text-[oklch(0.65_0.08_42)] hover:bg-[oklch(0.22_0.02_45)] cursor-pointer"
                  : "text-[oklch(0.45_0.01_50)] cursor-default"
              }`}
            >
              <span className="text-sm flex-shrink-0 mt-0.5">{s.id < step ? "✓" : s.icon}</span>
              <div>
                <p className="text-sm font-medium leading-tight">{s.label}</p>
                <p className="text-xs opacity-60 mt-0.5 leading-tight">{s.desc}</p>
              </div>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[oklch(0.28_0.015_50)]">
          <button
            onClick={() => { clearConfig(); navigate("/"); }}
            className="w-full text-xs text-[oklch(0.55_0.01_50)] hover:text-white transition-colors text-left"
          >
            ← Back to Demo Report
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-[oklch(0.88_0.01_80)] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-xs text-[oklch(0.6_0.015_60)] uppercase tracking-wide font-semibold">
              {step === 0 ? "Step 0 of 6" : `Step ${step} of ${STEPS.length}`}
            </p>
            <h1 className="text-lg font-normal text-[oklch(0.18_0.015_50)]" style={{ fontFamily: 'var(--font-display)' }}>
              {currentStepLabel}
            </h1>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="w-32 h-1.5 bg-[oklch(0.92_0.004_80)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C2714F] rounded-full transition-all duration-500"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
            <span className="text-xs text-[oklch(0.6_0.015_60)]">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
        </header>

        {/* Step content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                {stepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Bottom nav */}
        <footer className="bg-white border-t border-[oklch(0.88_0.01_80)] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <Btn variant="ghost" onClick={() => step > 0 && setStep(s => s - 1)} disabled={step === 0}>
            ← Back
          </Btn>
          <div className="flex items-center gap-2">
            {/* Step dots */}
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${step === i ? "bg-[#C2714F] w-4" : i < step ? "bg-[#C2714F] opacity-40" : "bg-[oklch(0.88_0.01_80)]"}`} />
            ))}
          </div>
          {step === 0 ? (
            <Btn variant="ghost" onClick={() => setStep(1)}>
              Skip →
            </Btn>
          ) : step < STEPS.length ? (
            <Btn onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
              Continue →
            </Btn>
          ) : (
            <Btn onClick={handleLaunch}>
              🚀 Launch Report
            </Btn>
          )}
        </footer>
      </div>
    </div>
  );
}
