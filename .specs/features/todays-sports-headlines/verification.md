# Today's Sports Headlines verification

**Verdict**: FAIL
**Mutations**: 3 - probed C3, C4, C6
**Proofs**: `proofs.md` at af3a27b
**Verifier**: independent sub-agent (author != verifier)

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| The "today" rule (HEAD-01 AC 4) is proved for the day of the month only: reading the month in UTC fails no test. The code at HEAD is right, but this bug would return `2026-11-31` on the evening of 31 Oct in Sao Paulo, and so an empty list | mutation `localDate month read in UTC` not killed; `headlines.test.js:69` uses one instant where local and UTC share month and year | add a `localDate` case across a month end and a year end, e.g. `2026-11-01T01:30:00Z` gives `2026-10-31` and `2027-01-01T01:30:00Z` gives `2026-12-31` (both pass at HEAD) | e3ef411 - C4 |
| AC 6 says non-2xx, and C6 proves only 503: a change that lets 4xx through fails no test | mutation `only 5xx treated as a failed listing` not killed; `server.test.js:95` is the only status case | add a 4xx case whose body contains a card for today, and expect 502 | e3ef411 - C6 |
| The AC 3 path shape is not held at its start: dropping the `^` anchor fails no test. `/style/2026/10/30/sport/x` would be selected, and an absolute href would give the url `https://edition.cnn.comhttps://...` | mutation `article path no longer anchored` not killed; the fixtures at `headlines.test.js:30-37` all start at `/YYYY` or are other sections | add a prefixed-path card that must be rejected | e3ef411 - C3 |
| A card whose link is absolute is dropped without notice, though its link path matches AC 3. If every card were absolute, the endpoint would return 502. Not checked against live CNN (offline example) | own example: `parseCards` on `https://edition.cnn.com/2026/10/30/sport/abs` and on `//edition.cnn.com/...` returns `[]`, because `ARTICLE_PATH` runs against the raw href at `headlines.js:17-18` | match on the href's pathname and build `url` from it; add a test | e3ef411 - C3 |
| AC 5 dedupes on the exact href string, so one article reached through links that differ only by suffix is returned twice. Not checked against live CNN (offline example) | own example: `/2026/10/30/sport/x` with `?iid=cnn_buildContentRecirc`, with `#comments` and with a trailing `/` each return 2 entries; `cards.has(path)` at `headlines.js:23` | key the map on the normalised pathname, or record in the spec that "same link" means the exact href; add a test | e3ef411 - C5 |
| AC 5 (HEAD-02) says all content fits, but only URLs wrap: a long unbroken title scrolls the page. A title of this length is an extreme input | own example with the stubbed API on the built page: 125-character unbroken title, at 1280px `scrollWidth` 1527 against `innerWidth` 1280; at 375px the `h2` has `scrollWidth` 1247 against a 343px box. `overflow-wrap` is set only on `a` (`App.css:38`) | set `overflow-wrap: anywhere` on `h2` or `main` | 64f949b - C13 |
| C9 says each title is shown and AC 1 says "every" returned article, but the C9 proof runs a one-article case. The test that proves "every" (`shows every returned article`, `App.test.jsx:31`) is outside the C9 filter, so no check proves it | `proofs.md` C9 row: Ran 1, filter `-t "shows title link and date"` | widen the C9 proof to select both tests, by appending a check or renaming the test into the filter | 64f949b - C9 |
| The timeout test is looser than the 10 seconds in AC 6: `TIMEOUT_MS` anywhere from about 9500 to about 12000 passes (inferred from the bounds, not run as a mutation) | `server.test.js:117` `toBeGreaterThan(9500)`, and the only upper limit is the test's own 12000 ms timeout | assert the elapsed time on both sides, or assert the value passed to `AbortSignal.timeout` | e3ef411 - C6 |
