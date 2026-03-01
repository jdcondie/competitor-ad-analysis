/**
 * ReportContext — Global state for the dynamic report template.
 *
 * Stores the wizard-configured report data and persists it to localStorage
 * so reports survive page refreshes. The Report page reads exclusively from
 * this context when a custom report is active; otherwise it falls back to the
 * built-in demo data (Post Script Society / Mail Subscription example).
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface WizardBrand {
  key: string;         // short identifier e.g. "LFA"
  name: string;        // full name e.g. "Letters From Afar"
  color: string;       // hex color
  emoji: string;       // single emoji
}

export interface WizardAd {
  id: string;
  brandKey: string;
  headline: string;
  bodyPreview: string;
  fullBody: string;
  format: "Video" | "Image" | "Carousel" | "DCO";
  status: "Active" | "Inactive";
  startDate: string;
  endDate?: string;
  variations: number;
  angle: string;
  hook: string;
  cta: string;
  platforms: string[];
  discount?: string;
  thumbnailUrl?: string;
  isVideo?: boolean;
  metaUrl?: string;
}

export interface WizardAngle {
  id: string;
  title: string;
  description: string;
  color: string;
  share: number; // 0–100 percentage
}

export interface PsychTrigger {
  trigger: string;
  description: string;
  frequency: string; // e.g. "High", "Medium", "Low"
  score: number;    // 0-100
  color: string;
  brands: string[]; // brand keys that use this trigger
}

export interface TopHook {
  text: string;
  type: string;         // e.g. "Question", "Stat", "Curiosity Gap"
  brand: string;        // brand key
  effectiveness: string; // e.g. "High", "Medium"
  score: number;        // 0-100
}

export interface PlatformStat {
  platform: string;  // e.g. "Facebook", "Instagram", "Messenger"
  adCount: number;
  share: number;     // 0-100 percentage
  color: string;
}

export interface BrandComparison {
  brandKey: string;
  brandName: string;
  adCount: number;
  avgRunDays: number;
  topAngle: string;
  topFormat: string;
  ctaStyle: string;
  toneOfVoice: string;
}

export interface ReportConfig {
  // Step 1 — Report Identity
  clientName: string;       // e.g. "Post Script Society"
  reportTitle: string;      // e.g. "Competitor Creative Analysis"
  reportDate: string;       // e.g. "March 2026"
  dataSource: string;       // e.g. "Meta Ads Library (United States)"
  executiveSummary: string;
  strategicNarrative?: string;  // Extended multi-paragraph narrative analysis

  // Step 2 — Competitor Brands
  brands: WizardBrand[];

  // Step 3 — Messaging Angles
  angles: WizardAngle[];

  // Step 4 — SwipeFile Ads
  ads: WizardAd[];

  // Step 5 — Key Takeaways
  takeaways: { title: string; body: string; icon: string; color: string }[];

  // Rich analysis fields
  psychTriggers?: PsychTrigger[];
  topHooks?: TopHook[];
  platformBreakdown?: PlatformStat[];
  brandComparison?: BrandComparison[];
  categoryContext?: string;     // 1-2 sentences on the broader category landscape
  opportunityGaps?: { title: string; description: string; priority: "High" | "Medium" | "Low" }[];
}

export interface ReportContextValue {
  config: ReportConfig | null;
  isCustomReport: boolean;
  setConfig: (config: ReportConfig) => void;
  clearConfig: () => void;
}

// ─── DEFAULTS ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "pss_report_config_v1";

const defaultContext: ReportContextValue = {
  config: null,
  isCustomReport: false,
  setConfig: () => {},
  clearConfig: () => {},
};

// ─── CONTEXT ──────────────────────────────────────────────────────────────────

const ReportContext = createContext<ReportContextValue>(defaultContext);

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<ReportConfig | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setConfig = useCallback((newConfig: ReportConfig) => {
    setConfigState(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch {
      // localStorage quota exceeded — fail silently
    }
  }, []);

  const clearConfig = useCallback(() => {
    setConfigState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return (
    <ReportContext.Provider
      value={{
        config,
        isCustomReport: config !== null,
        setConfig,
        clearConfig,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  return useContext(ReportContext);
}
