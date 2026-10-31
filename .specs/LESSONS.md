# LESSONS - auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Plan/Checks)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation - do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 - Test local date logic at month and year boundaries, not only at a day boundary
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `dates` · harmful: 0
- features: todays-sports-headlines
- evidence: backend/headlines.js:8 (dates)
- last seen: 2026-10-30T19:05:19Z

### L-002 - Test a non-2xx rule with both a 4xx and a 5xx status
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `http` · harmful: 0
- features: todays-sports-headlines
- evidence: backend/server.js:10 (http)
- last seen: 2026-10-30T19:05:19Z

### L-003 - Include a rejected input that contains a pattern mid-string whenever a regex is anchored
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `scraping` · harmful: 0
- features: todays-sports-headlines
- evidence: backend/headlines.js:5 (scraping)
- last seen: 2026-10-30T19:05:19Z

### L-004 - Parse scraped links with URL before matching so absolute and protocol-relative forms behave like relative ones
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `scraping` · harmful: 0
- features: todays-sports-headlines
- evidence: backend/headlines.js:18 (scraping)
- last seen: 2026-10-30T19:05:19Z

### L-005 - Dedupe scraped links on the normalised path, not the raw href
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `scraping` · harmful: 0
- features: todays-sports-headlines
- evidence: backend/headlines.js:23 (scraping)
- last seen: 2026-10-30T19:05:19Z

### L-006 - Set overflow-wrap on the page container so all long text wraps, not only links
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: todays-sports-headlines
- evidence: frontend/src/App.css:38 (ui)
- last seen: 2026-10-30T19:05:19Z

### L-007 - Make a check's proof filter select the test that proves every word of its criterion
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `tests` · harmful: 0
- features: todays-sports-headlines
- evidence: C9 (tests)
- last seen: 2026-10-30T19:05:19Z

### L-008 - Assert both bounds of a timing rule instead of relying on the test timeout
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `tests` · harmful: 0
- features: todays-sports-headlines
- evidence: C6 (tests)
- last seen: 2026-10-30T19:05:19Z

### L-009 - Prove an ordering rule at the outermost layer that applies it, not only in the helper
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `tests` · harmful: 0
- features: weekly-headlines-with-images
- evidence: backend/headlines.js:18 (tests)
- last seen: 2026-10-30T19:25:58Z

### L-010 - Assert order inside a group, not only the order of the groups
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `tests` · harmful: 0
- features: weekly-headlines-with-images
- evidence: frontend/src/group-by-day.js:4 (tests)
- last seen: 2026-10-30T19:25:58Z

### L-011 - Pin a timezone west of UTC in tests that format dates
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `dates` · harmful: 0
- features: weekly-headlines-with-images
- evidence: frontend/src/format-day.js:3 (dates)
- last seen: 2026-10-30T19:25:58Z

### L-012 - Give a sort test input that no fixed order would satisfy
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `tests` · harmful: 0
- features: weekly-headlines-with-images
- evidence: frontend/src/App.test.jsx:51 (tests)
- last seen: 2026-10-30T19:25:58Z

### L-013 - State every exemption wherever a rule is claimed
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `lint` · harmful: 0
- features: weekly-headlines-with-images
- evidence: backend/eslint.config.js:15 (lint)
- last seen: 2026-10-30T19:25:58Z

### L-014 - Name a module after its one job and move anything else out
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `structure` · harmful: 0
- features: weekly-headlines-with-images
- evidence: frontend/src/group-by-day.js:7 (structure)
- last seen: 2026-10-30T19:25:58Z

### L-015 - Size a page glow in pixels rather than on the body so it stays at the top of long pages
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: docker-and-redesign
- evidence: frontend/src/App.css:26 (ui)
- last seen: 2026-10-31T14:48:19Z

### L-016 - Measure contrast for decorative text too when a rule says every pair
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: docker-and-redesign
- evidence: frontend/src/App.css:79 (ui)
- last seen: 2026-10-31T14:48:19Z

### L-017 - Give a bar and the content below it the same box model so their edges line up
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: docker-and-redesign
- evidence: frontend/src/App.css:30 (ui)
- last seen: 2026-10-31T14:48:19Z

### L-018 - Add scroll margin to anchor targets
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: docker-and-redesign
- evidence: frontend/src/App.css:55 (ui)
- last seen: 2026-10-31T14:48:19Z

### L-019 - Set init true for Node containers so they stop on SIGTERM
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `docker` · harmful: 0
- features: docker-and-redesign
- evidence: docker-compose.yml:2 (docker)
- last seen: 2026-10-31T14:48:19Z

### L-020 - List a style reference's signature effects as criteria before building
- signal: `spec_deviation` · recurrence: 1 feature(s) · scope: `ui` · harmful: 0
- features: docker-and-redesign
- evidence: captures/style-reference.running.png (ui)
- last seen: 2026-10-31T14:50:34Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
