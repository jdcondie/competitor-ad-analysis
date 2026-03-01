
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

## Remove Meta Token Requirement
- [x] Remove token input step from wizard UI (StepUrl / any dedicated token step)
- [x] Remove metaToken from wizard state and all step props
- [x] Update server research router to use server-side token (env var) instead of user-provided token
- [x] Remove token from tRPC procedure inputs
- [x] Verify report generation works end-to-end without user entering a token

## Scout Landing Page
- [x] Build Scout landing page component (Hero, Problem, How It Works sections)
- [x] Wire landing page as root route (/) in App.tsx
- [x] Move wizard to /wizard route
- [x] Verify navigation from landing page CTA to wizard works

## Landing Page Enhancements
- [x] Add social proof / testimonial strip (between Problem and How It Works)
- [x] Add email capture secondary CTA in hero section
- [x] Add "What you'll get" feature grid section

## Report Generation Loading Animation
- [x] Read Wizard.tsx report generation flow to identify loading state hook point
- [x] Build animated loading overlay/screen with step-by-step progress messages
- [x] Wire loading state to show during generateReport mutation and hide on completion

## Landing Page Redesign (Light Editorial Theme)
- [x] Capture product screenshots of wizard and report pages for mockup sections
- [x] Upload screenshots to CDN
- [x] Redesign Landing.tsx: light/off-white theme, serif headings, scattered product screenshots
- [x] Add multi-section layout: Hero, Features with screenshots, Social proof, How It Works, FAQ, Footer
- [x] Update index.css global theme tokens to support light theme on landing page

## Hero Demo Video
- [x] Record screen capture of wizard → loading overlay → report flow
- [x] Process video (trim, compress, optimize for web)
- [x] Upload to CDN
- [x] Embed looping autoplay video in hero section of Landing.tsx

## Landing Page Copy & Contrast Fix
- [x] Restore original "Scout the Competition" headline and sub-tagline copy
- [x] Fix all font color contrast issues on off-white background
- [x] Audit every text color value in Landing.tsx for legibility
