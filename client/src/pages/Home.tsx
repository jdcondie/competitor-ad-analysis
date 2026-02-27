/**
 * Mail Subscription Brands — Creative Ad Analysis Dashboard
 * Design: Intelligence Dashboard — Warm Editorial
 * Palette: Off-white bg, deep charcoal text, terracotta primary, sage secondary
 * Typography: DM Serif Display (headings) + DM Sans (body)
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, ReferenceLine
} from "recharts";
import {
  brands, campaigns, contentTypeData, hashtagData, peakTimeData,
  engagementData, socialStats, keyInsights, messagingPillars, radarData,
  type BrandKey
} from "@/lib/analysisData";

// ─── SIDEBAR NAV ──────────────────────────────────────────────────────────────

const navSections = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'lfa', label: 'Letters From Afar', icon: '🗺' },
  { id: 'tfl', label: 'The Flower Letters', icon: '💌' },
  { id: 'smc', label: 'Snail Mail Chronicles', icon: '✈️' },
  { id: 'tfm', label: 'Tiny Farmers Market', icon: '🌿' },
  { id: 'comparison', label: 'Cross-Brand Analysis', icon: '◉' },
  { id: 'insights', label: 'Key Insights', icon: '◆' },
];

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[oklch(0.88_0.01_80)] rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold text-[oklch(0.18_0.015_50)] mb-1">{label}</p>
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

// ─── STAT CARD ────────────────────────────────────────────────────────────────

const StatCard = ({ value, label, sub, color }: { value: string; label: string; sub?: string; color: string }) => (
  <div className="paper-card rounded-xl p-5 flex flex-col gap-1">
    <p className="section-label">{label}</p>
    <p className="stat-number" style={{ color }}>{value}</p>
    {sub && <p className="text-xs text-[oklch(0.52_0.015_60)] mt-1">{sub}</p>}
  </div>
);

// ─── BRAND HEADER ─────────────────────────────────────────────────────────────

const BrandHeader = ({ brandKey }: { brandKey: BrandKey }) => {
  const brand = brands.find(b => b.key === brandKey)!;
  const adPresenceColors: Record<string, string> = {
    'Very High': '#5A8A6A',
    'High': '#C2714F',
    'Minimal': '#4A6FA5',
    'None': '#888',
  };
  return (
    <div className={`paper-card rounded-xl p-6 mb-6 ${brand.stripClass}`}>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{brand.emoji}</span>
            <span className="section-label">{brand.shortName}</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: adPresenceColors[brand.adPresence] }}
            >
              {brand.adPresence} Ad Presence
            </span>
          </div>
          <h2 className="text-3xl font-normal text-[oklch(0.18_0.015_50)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            {brand.name}
          </h2>
          <p className="text-sm text-[oklch(0.52_0.015_60)] italic">"{brand.tagline}"</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[oklch(0.52_0.015_60)]">{brand.website}</p>
          <p className="text-xs text-[oklch(0.52_0.015_60)] mt-1">{brand.origin}</p>
          {brand.character && (
            <p className="text-xs text-[oklch(0.52_0.015_60)] mt-1">Character: <span className="font-medium">{brand.character}</span></p>
          )}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-[oklch(0.88_0.01_80)] grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-[oklch(0.52_0.015_60)]">
        <div><span className="font-semibold text-[oklch(0.35_0.015_50)]">Target:</span> {brand.targetAudience}</div>
        <div><span className="font-semibold text-[oklch(0.35_0.015_50)]">Platform:</span> {brand.primaryPlatform}</div>
        <div><span className="font-semibold text-[oklch(0.35_0.015_50)]">Pricing:</span> {brand.pricePoint}</div>
        <div><span className="font-semibold text-[oklch(0.35_0.015_50)]">Active Ads:</span> {brand.activeAds} campaigns</div>
      </div>
    </div>
  );
};

// ─── CAMPAIGN TABLE ───────────────────────────────────────────────────────────

const CampaignTable = ({ brandKey }: { brandKey: BrandKey }) => {
  const brand = brands.find(b => b.key === brandKey)!;
  const data = campaigns[brandKey];
  if (data.length === 0) {
    return (
      <div className="paper-card rounded-xl p-6 text-center text-[oklch(0.52_0.015_60)]">
        <p className="text-4xl mb-3">📭</p>
        <p className="font-medium">No Meta Ads Found</p>
        <p className="text-sm mt-1">This brand has zero advertising presence in the Meta Ads Library.</p>
      </div>
    );
  }
  return (
    <div className="paper-card rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[oklch(0.88_0.01_80)]">
        <p className="section-label">Ad Campaigns — Meta Ads Library</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[oklch(0.96_0.005_80)]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[oklch(0.52_0.015_60)] uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[oklch(0.52_0.015_60)] uppercase tracking-wide">Launch Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[oklch(0.52_0.015_60)] uppercase tracking-wide">Content Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[oklch(0.52_0.015_60)] uppercase tracking-wide">Variations</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[oklch(0.52_0.015_60)] uppercase tracking-wide">Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((campaign, i) => (
              <tr key={campaign.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[oklch(0.985_0.003_80)]'}>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                    campaign.status === 'Active'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${campaign.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {campaign.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[oklch(0.35_0.015_50)]">{campaign.startDate}</td>
                <td className="px-4 py-3 text-[oklch(0.35_0.015_50)]">{campaign.contentType}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold" style={{ color: brand.color }}>{campaign.variations}</span>
                </td>
                <td className="px-4 py-3 text-[oklch(0.52_0.015_60)] text-xs max-w-xs">{campaign.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── HASHTAG CLOUD ────────────────────────────────────────────────────────────

const HashtagCloud = ({ brandKey }: { brandKey: BrandKey }) => {
  const brand = brands.find(b => b.key === brandKey)!;
  const tags = hashtagData[brandKey];
  const typeColors: Record<string, string> = {
    Brand: brand.color,
    Category: '#4A6FA5',
    Lifestyle: '#5A8A6A',
    Aesthetic: '#B5546A',
    Location: '#C2714F',
    Community: '#8B6FA5',
  };
  return (
    <div className="paper-card rounded-xl p-5">
      <p className="section-label mb-4">Hashtag & Emoji Strategy</p>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span
            key={tag.tag}
            className="px-3 py-1.5 rounded-full text-white text-xs font-medium"
            style={{
              backgroundColor: typeColors[tag.type] || '#888',
              opacity: 0.5 + (tag.frequency / 200),
              fontSize: `${0.65 + (tag.frequency / 300)}rem`,
            }}
            title={`${tag.type} • ${tag.usage} • Frequency: ${tag.frequency}%`}
          >
            {tag.tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {Object.entries(typeColors).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1.5 text-xs text-[oklch(0.52_0.015_60)]">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── MESSAGING BARS ───────────────────────────────────────────────────────────

const MessagingBars = ({ brandKey }: { brandKey: BrandKey }) => {
  const brand = brands.find(b => b.key === brandKey)!;
  const pillars = messagingPillars[brandKey];
  return (
    <div className="paper-card rounded-xl p-5">
      <p className="section-label mb-4">Messaging Pillar Strength</p>
      <div className="space-y-4">
        {pillars.map(p => (
          <div key={p.pillar}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-[oklch(0.35_0.015_50)]">{p.pillar}</span>
              <span className="text-xs text-[oklch(0.52_0.015_60)]">{p.strength}%</span>
            </div>
            <div className="h-2 bg-[oklch(0.92_0.008_80)] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: brand.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${p.strength}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
              />
            </div>
            <p className="text-xs text-[oklch(0.6_0.015_60)] mt-1 italic">{p.example}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── PEAK TIME CHART ──────────────────────────────────────────────────────────

const PeakTimeChart = ({ brandKey }: { brandKey: BrandKey }) => {
  const brand = brands.find(b => b.key === brandKey)!;
  const data = peakTimeData[brandKey];
  return (
    <div className="paper-card rounded-xl p-5">
      <p className="section-label mb-4">Peak Posting Activity (Monthly)</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.005 80)" vertical={false} />
          <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'oklch(0.52 0.015 60)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'oklch(0.52 0.015 60)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="intensity" fill={brand.color} radius={[3, 3, 0, 0]} name="Activity Index" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── CONTENT TYPE PIE ─────────────────────────────────────────────────────────

const ContentTypePie = ({ brandKey }: { brandKey: BrandKey }) => {
  const data = contentTypeData[brandKey];
  return (
    <div className="paper-card rounded-xl p-5">
      <p className="section-label mb-4">Content Type Distribution</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── BRAND SECTION ────────────────────────────────────────────────────────────

const BrandSection = ({ brandKey }: { brandKey: BrandKey }) => {
  const brand = brands.find(b => b.key === brandKey)!;
  const stats = socialStats[brandKey];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <BrandHeader brandKey={brandKey} />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {stats.map(s => (
          <StatCard key={s.platform} value={s.metric} label={`${s.platform} — ${s.metricLabel}`} sub={s.followers !== 'Active' && s.followers !== 'Active page' ? `${s.followers} followers` : undefined} color={brand.color} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ContentTypePie brandKey={brandKey} />
        <PeakTimeChart brandKey={brandKey} />
      </div>

      {/* Hashtags + Messaging */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <HashtagCloud brandKey={brandKey} />
        <MessagingBars brandKey={brandKey} />
      </div>

      {/* Campaigns */}
      <CampaignTable brandKey={brandKey} />
    </motion.div>
  );
};

// ─── OVERVIEW SECTION ─────────────────────────────────────────────────────────

const OverviewSection = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Hero */}
      <div className="paper-card rounded-xl p-8 mb-6 bg-gradient-to-br from-[oklch(0.18_0.015_50)] to-[oklch(0.25_0.02_45)] text-white">
        <p className="section-label text-[oklch(0.7_0.01_80)] mb-3">Meta Ads Library Research Report</p>
        <h1 className="text-4xl md:text-5xl font-normal mb-4 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Mail Subscription<br />
          <span style={{ color: '#C2714F' }}>Creative Analysis</span>
        </h1>
        <p className="text-[oklch(0.75_0.01_80)] max-w-2xl text-sm leading-relaxed">
          A comprehensive analysis of advertising strategies, content types, hashtag usage, engagement signals,
          and peak posting times for four leading mail subscription brands — extracted from the Meta Ads Library
          and cross-referenced with organic social media data.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-[oklch(0.65_0.01_80)]">
          <span>📅 Research Date: February 27, 2026</span>
          <span>🔍 Source: Meta Ads Library (US)</span>
          <span>📊 4 Brands Analyzed</span>
        </div>
      </div>

      {/* Brand cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {brands.map(brand => {
          const adPresenceColors: Record<string, string> = {
            'Very High': '#5A8A6A',
            'High': '#C2714F',
            'Minimal': '#4A6FA5',
            'None': '#888',
          };
          return (
            <div key={brand.key} className={`paper-card rounded-xl p-5 ${brand.stripClass}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{brand.emoji}</span>
                <div>
                  <h3 className="font-medium text-[oklch(0.18_0.015_50)]" style={{ fontFamily: 'var(--font-display)' }}>{brand.name}</h3>
                  <p className="text-xs text-[oklch(0.52_0.015_60)]">{brand.website}</p>
                </div>
                <span
                  className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: adPresenceColors[brand.adPresence] }}
                >
                  {brand.adPresence}
                </span>
              </div>
              <p className="text-xs text-[oklch(0.52_0.015_60)] italic mb-3">"{brand.tagline}"</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)', color: brand.color }}>{brand.activeAds}</p>
                  <p className="text-xs text-[oklch(0.6_0.015_60)]">Active Ads</p>
                </div>
                <div>
                  <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)', color: brand.color }}>{brand.totalResults}</p>
                  <p className="text-xs text-[oklch(0.6_0.015_60)]">Ad Results</p>
                </div>
                <div>
                  <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)', color: brand.color }}>{campaigns[brand.key].length}</p>
                  <p className="text-xs text-[oklch(0.6_0.015_60)]">Campaigns</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Engagement comparison */}
      <div className="paper-card rounded-xl p-5 mb-6">
        <p className="section-label mb-4">Engagement Proxy Score — All Brands</p>
        <p className="text-xs text-[oklch(0.52_0.015_60)] mb-4">Composite score based on creative variation count, ad longevity, social proof usage, and organic engagement signals. Not a direct engagement rate.</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={engagementData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.005 80)" vertical={false} />
            <XAxis dataKey="brand" tick={{ fontSize: 12, fill: 'oklch(0.35 0.015 50)', fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'oklch(0.52 0.015 60)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="estimatedScore" name="Engagement Score" radius={[4, 4, 0, 0]}>
              {engagementData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary table */}
      <div className="paper-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[oklch(0.88_0.01_80)]">
          <p className="section-label">Brand Comparison Summary</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[oklch(0.96_0.005_80)]">
                {['Brand', 'Ad Presence', 'Active Ads', 'Primary Platform', 'Target Audience', 'Key Hook'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[oklch(0.52_0.015_60)] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brands.map((brand, i) => (
                <tr key={brand.key} className={i % 2 === 0 ? 'bg-white' : 'bg-[oklch(0.985_0.003_80)]'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{brand.emoji}</span>
                      <span className="font-medium text-[oklch(0.18_0.015_50)]">{brand.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold" style={{ color: brand.color }}>{brand.adPresence}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: brand.color }}>{brand.activeAds}</td>
                  <td className="px-4 py-3 text-xs text-[oklch(0.52_0.015_60)]">{brand.primaryPlatform.split(' + ')[0]}</td>
                  <td className="px-4 py-3 text-xs text-[oklch(0.52_0.015_60)]">{brand.targetAudience.split(' + ')[0]}</td>
                  <td className="px-4 py-3 text-xs text-[oklch(0.52_0.015_60)] italic">
                    {brand.key === 'lfa' ? 'Adventure & wonder' :
                     brand.key === 'tfl' ? 'Lost magic of real mail' :
                     brand.key === 'smc' ? 'Couch travel fantasy' :
                     'Connection & community'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

// ─── COMPARISON SECTION ───────────────────────────────────────────────────────

const ComparisonSection = () => {
  const brandColors = { lfa: '#C2714F', tfl: '#B5546A', smc: '#4A6FA5', tfm: '#5A8A6A' };

  // Peak time comparison data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const peakCompData = months.map((month, i) => ({
    month,
    LFA: peakTimeData.lfa[i].intensity,
    TFL: peakTimeData.tfl[i].intensity,
    SMC: peakTimeData.smc[i].intensity,
    TFM: peakTimeData.tfm[i].intensity,
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-6">
        <h2 className="text-3xl font-normal text-[oklch(0.18_0.015_50)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Cross-Brand Analysis
        </h2>
        <p className="text-sm text-[oklch(0.52_0.015_60)]">Comparative metrics across all four mail subscription brands</p>
      </div>

      {/* Radar chart */}
      <div className="paper-card rounded-xl p-5 mb-6">
        <p className="section-label mb-4">Multi-Dimensional Brand Comparison</p>
        <p className="text-xs text-[oklch(0.52_0.015_60)] mb-4">Scores across six key dimensions: Ad Volume, Creative Testing, Organic Reach, Social Proof, Hashtag Strategy, and Community Building.</p>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="oklch(0.88 0.01 80)" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'oklch(0.35 0.015 50)' }} />
            <Radar name="LFA" dataKey="lfa" stroke={brandColors.lfa} fill={brandColors.lfa} fillOpacity={0.15} strokeWidth={2} />
            <Radar name="TFL" dataKey="tfl" stroke={brandColors.tfl} fill={brandColors.tfl} fillOpacity={0.15} strokeWidth={2} />
            <Radar name="SMC" dataKey="smc" stroke={brandColors.smc} fill={brandColors.smc} fillOpacity={0.15} strokeWidth={2} />
            <Radar name="TFM" dataKey="tfm" stroke={brandColors.tfm} fill={brandColors.tfm} fillOpacity={0.15} strokeWidth={2} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Peak time comparison */}
      <div className="paper-card rounded-xl p-5 mb-6">
        <p className="section-label mb-4">Peak Posting Activity — All Brands (Monthly)</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={peakCompData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.005 80)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'oklch(0.52 0.015 60)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'oklch(0.52 0.015 60)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x="Nov" stroke="oklch(0.7 0.01 80)" strokeDasharray="4 4" label={{ value: 'Holiday Peak', fontSize: 10, fill: 'oklch(0.52 0.015 60)' }} />
            <Line type="monotone" dataKey="LFA" stroke={brandColors.lfa} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="TFL" stroke={brandColors.tfl} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="SMC" stroke={brandColors.smc} strokeWidth={2} dot={false} strokeDasharray="4 4" />
            <Line type="monotone" dataKey="TFM" stroke={brandColors.tfm} strokeWidth={2} dot={false} />
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
                <span className="text-sm font-semibold text-[oklch(0.35_0.015_50)]">{brand.shortName}</span>
                <span className="text-xs text-[oklch(0.6_0.015_60)]">— {hashtagData[brand.key].length} tags/emojis</span>
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

      {/* Messaging comparison table */}
      <div className="paper-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[oklch(0.88_0.01_80)]">
          <p className="section-label">Messaging Pillars by Brand</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[oklch(0.96_0.005_80)]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[oklch(0.52_0.015_60)] uppercase tracking-wide">Dimension</th>
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
                <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-[oklch(0.985_0.003_80)]'}>
                  <td className="px-4 py-3 font-medium text-[oklch(0.35_0.015_50)] text-xs">{row.label}</td>
                  {row.values.map((v, j) => (
                    <td key={j} className="px-4 py-3 text-xs text-[oklch(0.52_0.015_60)]">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

// ─── INSIGHTS SECTION ─────────────────────────────────────────────────────────

const InsightsSection = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-6">
        <h2 className="text-3xl font-normal text-[oklch(0.18_0.015_50)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Key Strategic Insights
        </h2>
        <p className="text-sm text-[oklch(0.52_0.015_60)]">Six actionable findings from the comprehensive creative analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {keyInsights.map((insight, i) => (
          <motion.div
            key={insight.number}
            className="paper-card rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <span className="text-3xl" style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.88 0.01 80)' }}>{insight.number}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{insight.icon}</span>
                  <h3 className="text-base font-medium text-[oklch(0.18_0.015_50)]" style={{ fontFamily: 'var(--font-display)' }}>{insight.title}</h3>
                </div>
                <p className="text-sm text-[oklch(0.45_0.015_60)] leading-relaxed">{insight.body}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="paper-card rounded-xl p-6">
        <p className="section-label mb-5">Creative Recommendations</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Paid Advertising',
              color: '#C2714F',
              items: [
                'Invest in short-form video (40–60 seconds) featuring authentic product unboxing',
                'Avoid hashtags in ad copy; use emojis (💌 🗺 ✨) as visual rhythm markers',
                'Test minimum 3–5 creative variations simultaneously per campaign',
                'Launch holiday campaigns in early-to-mid November; summer campaigns in July',
              ]
            },
            {
              title: 'Organic Content',
              color: '#5A8A6A',
              items: [
                'Prioritize TikTok and Instagram Reels with behind-the-scenes "send-off day" content',
                'Use brand hashtag + category tags (#snailmail, #penpals) + lifestyle tags (#wholesome)',
                'Celebrate community milestones publicly to drive organic sharing',
                'Post consistently around monthly dispatch dates to build subscriber anticipation',
              ]
            },
            {
              title: 'Messaging Strategy',
              color: '#B5546A',
              items: [
                'Lead with the anti-digital tension, then resolve it with the physical mail experience',
                'Incorporate named customer testimonials for trust-building (TFL model)',
                'Use a named character or persona to create narrative continuity (LFA/SMC model)',
                'Frame subscriptions as "care packages from a friend" rather than products',
              ]
            },
            {
              title: 'Promotions & Timing',
              color: '#4A6FA5',
              items: [
                'Time discount offers around Black Friday, Valentine\'s Day, and summer reading season',
                'Use urgency language ("Limited Time") with specific dollar amounts vs. percentages',
                'Consider 6/12-month subscription bundles with holiday discount codes',
                'New Year acquisition push (January) is underutilized by most brands',
              ]
            },
          ].map(section => (
            <div key={section.title}>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: section.color }}>
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: section.color }} />
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="text-xs text-[oklch(0.45_0.015_60)] flex gap-2">
                    <span className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: section.color, opacity: 0.5 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[oklch(0.88_0.01_80)] text-center text-xs text-[oklch(0.6_0.015_60)]">
        <p>Analysis conducted February 27, 2026 · Data sourced from Meta Ads Library (US), brand websites, and public social media profiles</p>
        <p className="mt-1">Engagement rates are proxy estimates based on creative volume, ad longevity, and social proof signals — not direct platform metrics</p>
      </div>
    </motion.div>
  );
};

// ─── MAIN HOME COMPONENT ──────────────────────────────────────────────────────

export default function Home() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <OverviewSection />;
      case 'lfa': return <BrandSection brandKey="lfa" />;
      case 'tfl': return <BrandSection brandKey="tfl" />;
      case 'smc': return <BrandSection brandKey="smc" />;
      case 'tfm': return <BrandSection brandKey="tfm" />;
      case 'comparison': return <ComparisonSection />;
      case 'insights': return <InsightsSection />;
      default: return <OverviewSection />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[oklch(0.985_0.005_80)]">
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-14'} bg-[oklch(0.18_0.015_50)] flex flex-col overflow-hidden`}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-[oklch(0.28_0.015_50)] flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <p className="text-xs font-semibold text-[oklch(0.56_0.12_42)] uppercase tracking-widest">Ad Analysis</p>
              <p className="text-white text-sm font-medium mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>Mail Subscriptions</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[oklch(0.6_0.01_80)] hover:text-white transition-colors p-1 rounded"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto custom-scroll">
          {navSections.map(section => {
            const isActive = activeSection === section.id;
            const isBrand = ['lfa', 'tfl', 'smc', 'tfm'].includes(section.id);
            const brand = isBrand ? brands.find(b => b.key === section.id) : null;
            return (
              <button
                key={section.id}
                onClick={() => handleNavClick(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${
                  isActive
                    ? 'bg-[oklch(0.25_0.02_45)] text-white'
                    : 'text-[oklch(0.65_0.01_80)] hover:text-white hover:bg-[oklch(0.22_0.015_50)]'
                }`}
              >
                <span className="text-base flex-shrink-0">{section.icon}</span>
                {sidebarOpen && (
                  <span className="text-sm truncate">
                    {section.label}
                  </span>
                )}
                {sidebarOpen && isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: brand?.color || '#C2714F' }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Report page link */}
        <div className="px-3 pb-3 border-t border-[oklch(0.28_0.015_50)] pt-3">
          <Link href="/">
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all bg-[oklch(0.22_0.02_45)] text-[oklch(0.75_0.08_42)] hover:bg-[oklch(0.26_0.025_45)] hover:text-white"
            >
              <span className="text-base flex-shrink-0">📋</span>
              {sidebarOpen && (
                <span className="text-sm truncate font-medium">Creative Report</span>
              )}
            </button>
          </Link>
        </div>

        {/* Sidebar footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-[oklch(0.28_0.015_50)]">
            <p className="text-xs text-[oklch(0.45_0.01_80)]">Feb 27, 2026</p>
            <p className="text-xs text-[oklch(0.45_0.01_80)]">Meta Ads Library</p>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main ref={mainRef} className="flex-1 overflow-y-auto custom-scroll">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[oklch(0.985_0.005_80)] border-b border-[oklch(0.88_0.01_80)] px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-medium text-[oklch(0.18_0.015_50)]" style={{ fontFamily: 'var(--font-display)' }}>
              {navSections.find(s => s.id === activeSection)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[oklch(0.6_0.015_60)] hidden md:block">4 brands · Meta Ads Library · Feb 2026</span>
            <div className="flex gap-1">
              {brands.map(b => (
                <button
                  key={b.key}
                  onClick={() => handleNavClick(b.key)}
                  className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: b.color }}
                  title={b.name}
                >
                  {b.emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <div key={activeSection}>
              {renderContent()}
            </div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
