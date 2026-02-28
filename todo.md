
## Real Meta Ads Library Pipeline Rebuild

- [ ] Investigate Meta Ads Library API (official) for real ad data access
- [ ] Implement real ad fetching from Meta Ads Library for competitor brands
- [ ] Rebuild research pipeline: brand scrape → competitor discovery → real ads fetch → LLM analysis
- [ ] LLM analysis of real ads to extract messaging angles, hooks, psych triggers, takeaways
- [ ] SwipeFile populated from real ads (10 ads, mix of formats, with creative assets)
- [ ] Messaging angles derived from real ad analysis (not pre-defined)
- [ ] Update wizard auto-fill handler to use new pipeline output shape

## Meta Ads Library Real API Integration
- [ ] Add META_ACCESS_TOKEN secret handling (user-provided per-session)
- [ ] Rebuild research router: real Meta Ads Library API calls for competitor brands
- [ ] LLM analysis of real ad copy → angles, hooks, psych triggers, takeaways
- [ ] Add token input step to wizard (Step 0.5 between URL and launch)
- [ ] Wire snapshot URLs as "View on Meta" links in SwipeFile cards
- [ ] Add graceful fallback if token is invalid or expired
