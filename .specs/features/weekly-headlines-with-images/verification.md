# Weekly Headlines With Images verification

**Verdict**: FAIL
**Mutations**: 3 - probed C6, C7, C8
**Proofs**: `proofs.md` at adbf5fa
**Verifier**: independent sub-agent (author != verifier)

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| The endpoint's order is not proved: WEEK-01 AC 5 can break with every backend test green. C6 tests the helper `sortNewestFirst`, not what `GET /api/headlines` returns | mutation `sortNewestFirst(...).toReversed()` in `backend/headlines.js:18` not killed by the full backend suite; every `server.test.js` page has one article | add an endpoint test whose page has two days out of order and two articles on one day, and assert the exact `articles` order | c04dfbc - C19 |
| Nothing proves the page keeps CNN's order within a day (assumption "Order inside a day", confirmed by no test in the browser) | mutation `groups[day].toReversed()` in `frontend/src/group-by-day.js:4` not killed by the full frontend suite; the C7 fixture has two same-day articles but only headings are asserted | assert the titles' order under one day heading | 97210b2 - C20 |
| C7 depends on the machine's timezone. The frontend tests pin no `TZ`, so the UTC-parsing bug the comment at `group-by-day.js:8` warns about is caught only on a machine west of UTC. The backend pins it (`dates.test.js:5`) | mutation `new Date(day)` at `frontend/src/group-by-day.js:9` not killed with `TZ=UTC`; here (UTC-3) the same parse gives `Thursday` for 2026-10-30 | pin a timezone west of UTC for the frontend tests, in `vite.config.js` or the test file | 97210b2 - C7 |
| C7 proves newest-first on one input order only, oldest first, which is the opposite of what the backend sends. `.sort()` is not held: removing it leaves C7 green and would show real data oldest day first | `App.test.jsx:51` input is oldest first; the key logic run on its own gives `.reverse()` = `.sort().reverse()` on `[10-28, 10-30]` and the wrong order on `[10-30, 10-28]` | use at least three days out of order in C7's fixture | 97210b2 - C7 |
| WEEK-03 AC 1 says ESLint fails on any function over 25 lines, and `README.md:76` repeats "any function", but `max-lines-per-function` is off in test files. The criterion and the README claim are false for those files, and C14 does not mention the exemption | `backend/eslint.config.js:15-16`, `frontend/eslint.config.js:22-24`; a throwaway 32-line function in `backend/zz.test.js` made `eslint` exit 0 | keep the exemption only with an appended criterion and a README line saying test files are exempt; otherwise remove the override and split the test bodies | 364ad01 - C21 |
| WEEK-03 AC 3 and C16: `group-by-day.js` does two jobs and its name hides the second. `formatDay` is date formatting, not grouping, so `DaySection.jsx:1` imports a date formatter from a grouping module | `frontend/src/group-by-day.js:7-15`, `frontend/src/components/DaySection.jsx:1`, `README.md:90` | move `formatDay` to its own date module and update the README's project structure | 97210b2 - C16 |
