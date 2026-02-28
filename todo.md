
## Real Meta Ads Library Pipeline Rebuild

- [x] Investigate Meta Ads Library API (official) for real ad data access
- [x] Implement real ad fetching from Meta Ads Library for competitor brands
- [x] Rebuild research pipeline: brand scrape → competitor discovery → real ads fetch → LLM analysis
- [x] LLM analysis of real ads to extract messaging angles, hooks, psych triggers, takeaways
- [x] SwipeFile populated from real ads (10 ads, mix of formats, with creative assets)
- [x] Messaging angles derived from real ad analysis (not pre-defined)
- [x] Update wizard auto-fill handler to use new pipeline output shape

## Meta Ads Library Real API Integration
- [x] Add META_ACCESS_TOKEN secret handling (user-provided per-session)
- [x] Rebuild research router: real Meta Ads Library API calls for competitor brands
- [x] LLM analysis of real ad copy → angles, hooks, psych triggers, takeaways
- [x] Add token input step to wizard (Step 0.5 between URL and launch)
- [x] Wire snapshot URLs as "View on Meta" links in SwipeFile cards
- [x] Add graceful fallback if token is invalid or expired

## SwipeFile Screenshot Capture
- [x] Install Playwright and Chromium on server
- [x] Build server/screenshotService.ts for ad_snapshot_url capture
- [x] Add captureAdScreenshots tRPC endpoint
- [x] Wire screenshot capture into generateReport pipeline
- [x] Upload screenshots to CDN via storagePut
- [x] Update SwipeFile card UI to show real screenshots with loading state
- [x] Add fallback placeholder when screenshot fails

## Dark Premium Visual Redesign
- [x] Update global CSS design tokens (near-black backgrounds, white text, Inter font)
- [x] Apply dark theme to Report.tsx — all sections, cards, charts, tables
- [x] Apply dark theme to Wizard.tsx — sidebar, header, hero card, all step components
- [x] Fix light-mode table row alternating colors
- [x] Fix chart grid/axis colors to dark theme
- [x] Fix status badges (Active/Inactive) to dark theme
- [x] Fix loading skeleton colors to dark theme
- [x] Update Card, Btn, Label, Input, Textarea, Select shared components to dark theme
