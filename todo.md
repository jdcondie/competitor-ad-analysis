
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

## Light Theme Retheme & Illustrated Landing Cards
- [x] Retheme Wizard.tsx to light editorial style (off-white bg, dark text, terracotta accents)
- [x] Retheme Report.tsx to light editorial style (off-white bg, dark text, terracotta accents)
- [x] Replace landing page product screenshots with illustrated SVG feature preview cards
- [x] Add zoom-in detail cards for specific features (angles bar chart, hooks list, swipefile card, comparison table)

## WizardMockup Animation
- [x] Add typewriter URL animation (character by character)
- [x] Add sequential brand identity card population after URL types
- [x] Add sequential competitor card population after brand identity appears
- [x] Loop the animation continuously

## Hero Journey Animation
- [x] Remove hero video embed
- [x] Build HeroJourneyMockup: URL typing → brand ID → competitors → loading → report
- [x] Replace video with animated mockup in hero section

## Report Page Visual Redesign (Match Landing Page Theme)
- [x] Replace sidebar layout with top-nav matching landing page nav style
- [x] Add dot-grid hero header section matching landing page hero aesthetic
- [x] Redesign section headers with editorial dividers and eyebrow labels
- [x] Upgrade card treatments: white bg, subtle shadows, editorial borders
- [x] Add Scout nav bar to Report page (same as landing page nav)
- [x] Improve typography hierarchy to match landing page DM Serif Display usage
- [x] Add section dividers and editorial spacing between report sections
- [x] Redesign stat strip to match landing page stat cards

## Share Report Feature
- [x] Add Share Report button to Report page nav bar
- [x] Implement clipboard copy of current page URL
- [x] Show toast confirmation after copy with link icon

## Report Generation Speed
- [x] Audit generation pipeline for sequential bottlenecks
- [x] Parallelize all independent API calls (Meta Ads fetch + LLM analysis)
- [x] Reduce LLM prompt size / use faster model settings where possible
- [x] Stream generation progress steps to frontend for perceived speed

## Meta Token Fix
- [x] Refresh expired META_ACCESS_TOKEN secret
- [x] Improve wizard error message for token expiry (show actionable guidance)

## Meta API Permission Fix (code 10)
- [x] Diagnose ads_archive permission requirements
- [x] Fix API call to use correct endpoint / parameters for the token type
- [x] Improve error message for permission errors (code 10)

## Report History Feature
- [x] Add reports table to drizzle schema (id, userId, brandName, category, config JSON, createdAt)
- [x] Push DB migration
- [x] Add saveReport procedure (protected, saves config to DB after generation)
- [x] Add listReports procedure (protected, returns user's reports)
- [x] Add getReport procedure (protected, returns single report by ID)
- [x] Build Reports History page (list of user's reports with brand name, date, category)
- [x] Update Report detail page to load config from DB by report ID
- [x] Wire wizard to save report to DB on successful generation and redirect to /report/:id
- [x] Update App.tsx routing for /reports and /report/:id

## Remove Report Detail Pages
- [x] Remove /report and /report/:id routes from App.tsx
- [x] Delete Report.tsx
- [x] Update wizard to redirect to /reports after generation
- [x] Clean up any remaining imports/references to Report.tsx

## Fix Report Generation Overlay Stall
- [x] Shorten overlay step durations to match actual ~15-25s pipeline
- [x] Add "done" prop to overlay so it jumps to 100% when mutation resolves
- [x] Shorten wizard progress message timings to match

## Fix Server-Side Generation Hang
- [x] Identify exact step causing 4+ minute hang in server logs
- [x] Add per-step timeouts to prevent indefinite hangs
- [x] Add overall mutation timeout (e.g. 60s hard limit)
