# Weekly Headlines With Images Specification

**Approved**: 2026-10-30 - user: "Approve, build it"

## Problem Statement

The first version shows only today's articles, which is 2 stories on a typical day, with no pictures. Readers need more headlines and an image for each one. The code also has to stay easy to read, stay tested, and come with a README that lets a new person install and launch it.

## Goals

- [ ] The page shows the last 7 days of CNN Sport articles, grouped by day, each with its image.
- [ ] Code quality is enforced by commands: lint rules and a coverage threshold fail when the code breaks them.
- [ ] A person with no context can install and launch the app using only the README.

## Out of Scope

| Feature | Reason |
| ----------- | -------------- |
| Articles CNN's sport page no longer lists | The app scrapes one page, so older or dropped stories are not reachable; the README states this |
| More than 7 days, pagination, date pickers | The request asks for the week |
| Copying or proxying images through the backend | The browser loads them directly from CNN, which keeps the backend minimal |
| Refresh button, database, caching, deployment | Unchanged from the first version |
| TypeScript migration | Not requested |

---

## Assumptions & Open Questions

Every ambiguity is resolved or recorded here - nothing is left silently unclear.

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | --------------- | --------- | ---------- |
| Meaning of "the week" | Today plus the 6 days before it, in the backend's timezone | User chose "Last 7 days" | y |
| Arrangement | One heading per day, newest day first | User chose "Grouped by day" | y |
| Image source | The `src` and `alt` of the image inside each CNN card, loaded by the browser from `media.cnn.com` | 56 of 57 stories had one on 2026-10-30 | n |
| Image shape | Every image is shown at the same 16:9 shape | CNN's card URLs are already cropped to 16:9 | n |
| Article with no usable image | A `No image` placeholder keeps the layout even | Rare, but it must not break the page | n |
| Date under each headline | Kept, even with day headings | The original request prints each article's date | n |
| Order inside a day | CNN's page order | CNN's order is its own editorial ranking | n |
| Meaning of "clean code" | ESLint fails on any function over 25 lines, complexity over 8, or unused code; files are split by responsibility and judged by the Verifier | A rule a tool enforces survives; a reviewer judges naming and structure | n |
| Meaning of "tested" | Vitest with a coverage threshold of 90% for lines and branches in both apps | The user named Vitest; a threshold makes the claim measurable | n |
| Failure behaviour and existing messages | The 502 rules, `Loading headlines…` and `Couldn't load headlines from CNN.` stay as they are | Nothing in this request changes them | n |
| Prerequisites in the README | Node 24.2 or newer and pnpm 11 or newer | `import.meta.main` needs Node 24.2; `package.json` pins pnpm 11 | n |

**Dimensions sweep** - input validation: N/A because the endpoint takes no input. Failures: a missing or broken image is covered by WEEK-01 AC 4 and WEEK-02 AC 3 and 4; CNN failures are unchanged. External dependency: images now load from `media.cnn.com`, covered by WEEK-02 AC 4. Remaining dimensions N/A for this scope.

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Get the week's articles with images ⭐ MVP

**User Story**: As the frontend, I want the last 7 days of articles with their images so that the page can show them.

**Why P1**: More headlines and images both come from here.

**Requirement**: WEEK-01

**Acceptance Criteria** (each line is one EARS pattern):

1. WHEN a client sends `GET /api/headlines` THEN the backend SHALL respond with HTTP 200 and the JSON fields `from` (`YYYY-MM-DD`, six days before today in the backend's timezone), `to` (today) and `articles`.
2. The backend SHALL include an article only when its `publishedOn` is from `from` through `to`, inclusive.
3. The backend SHALL return each entry in `articles` with `title`, `url`, `publishedOn`, `imageUrl` (the `src` of the card's image) and `imageAlt` (that image's `alt`).
4. IF a card has no image THEN the backend SHALL return `imageUrl` as `null` and `imageAlt` as an empty string.
5. The backend SHALL sort `articles` newest `publishedOn` first and keep CNN's page order within a day.

**Independent Test**: With the backend running, `curl localhost:3333/api/headlines` returns articles from 7 days, each with an `imageUrl`.

---

### P1: See the week grouped by day, with images ⭐ MVP

**User Story**: As a reader, I want a week of headlines with pictures, grouped by day, so that I can scan what happened.

**Why P1**: This is what the reader asked to see.

**Requirement**: WEEK-02

**Acceptance Criteria**:

1. WHEN the response has articles THEN the frontend SHALL show one heading per day, newest day first, in the form `Friday, October 30, 2026`.
2. WHEN a day is shown THEN the frontend SHALL show, under its heading, each of that day's articles with its image, title, URL as a visible link that opens in a new tab, and publication date.
3. IF an article's `imageUrl` is `null` THEN the frontend SHALL show `No image` in the image's place.
4. IF an image fails to load THEN the frontend SHALL show `No image` in the image's place.
5. The frontend SHALL title the page `This Week's Sports Headlines`.
6. WHEN the response has no articles THEN the frontend SHALL show `No sports articles published this week yet.`
7. The page SHALL show all its content without horizontal page scrolling at window widths of 375px and 1280px.

**Independent Test**: Open the page with the backend running and compare the days and titles with the `curl` output from WEEK-01.

---

### P1: Keep the code clean and tested ⭐ MVP

**User Story**: As a developer, I want quality rules that commands enforce so that the code stays understandable and tested.

**Why P1**: The user asked for clean, understandable, tested code.

**Requirement**: WEEK-03

**Acceptance Criteria**:

1. WHEN `pnpm lint` runs in `backend` or `frontend` THEN ESLint SHALL fail on any function over 25 lines, any function with complexity over 8, and any unused variable.
2. WHEN `pnpm test:coverage` runs in `backend` or `frontend` THEN Vitest SHALL fail if line or branch coverage is below 90%.
3. The project SHALL keep HTTP handling, scraping, date logic, data fetching, grouping and rendering in separate modules.
4. WHERE a file is a test file ESLint SHALL skip the 25-line function limit, and the README SHALL state this.

**Independent Test**: Run both commands in both apps and see them pass.

---

### P1: Install and launch from the README ⭐ MVP

**User Story**: As a new developer, I want a README so that I can understand, install and launch the project without help.

**Why P1**: The user asked for it directly.

**Requirement**: WEEK-04

**Acceptance Criteria**:

1. The root `README.md` SHALL state what the app does, its prerequisites, how to install, how to launch both apps, how to run tests and lint, the project structure and the app's known limits.
2. WHEN a person follows the README's steps in a fresh clone THEN the page SHALL show headlines at the address the README gives.

**Independent Test**: Clone the repo into an empty folder, follow only the README and see the page.

---

## Edge Cases

- WHEN an article is dated exactly six days before today THEN the backend SHALL include it, as covered by WEEK-01 AC 2.
- WHEN an article is dated seven days before today THEN the backend SHALL leave it out, as covered by WEEK-01 AC 2.
- WHEN the 7-day range crosses a month or year end THEN `from` SHALL still be six calendar days before `to`, as covered by WEEK-01 AC 1.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----------- | ------ | ------- |
| WEEK-01 | P1: Get the week's articles with images | Execute | Verified |
| WEEK-02 | P1: See the week grouped by day, with images | Execute | Verified |
| WEEK-03 | P1: Keep the code clean and tested | Execute | Verified |
| WEEK-04 | P1: Install and launch from the README | Execute | Verified |

**Coverage:** 4 total, 4 mapped to checks, 0 unmapped.

---

## Sources

- User message, 2026-10-30 - images for each headline, the week's headlines, clean tested code with Vitest, an understandable README.
- `.specs/features/todays-sports-headlines/spec.md` - this feature replaces its "today" rule (HEAD-01 AC 1 and 4) and its page title and empty message (HEAD-02 AC 3). Everything else in it still holds.
- `https://edition.cnn.com/sport`, inspected 2026-10-30 - 56 of 57 stories carry an image with `alt`; 20 articles fall in the last 7 days.

---

## Success Criteria

- [ ] The page shows every article CNN Sport's page lists from the last 7 days, each with an image or `No image`.
- [ ] A fresh clone reaches a working page by following only the README.

---

## Checks

**Mutations**: 3
**Build**: `pnpm --dir backend lint; pnpm --dir backend test:coverage; pnpm --dir frontend lint; pnpm --dir frontend test:coverage; pnpm --dir frontend build`

**C19** - The endpoint returns articles newest day first, in CNN's order within a day (WEEK-01, AC 5)
Proof: `cd backend && pnpm exec vitest run server.test.js -t "returns articles newest day first keeping page order"`

**C20** - The page keeps CNN's order within a day (WEEK-02, AC 2)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "keeps page order within a day"`

**C21** - Test files skip the 25-line limit, and the README says so (WEEK-03, AC 4)
Proof: walk - `eslint.config.js` in both apps turns the rule off for test files, and the README's Test and lint section states it

**C1** - `GET /api/headlines` returns 200 with `from`, `to` and `articles` (WEEK-01, AC 1)
Proof: `cd backend && pnpm exec vitest run server.test.js -t "returns from to and articles"`

**C2** - `from` is six calendar days before `to`, across a month and a year end (WEEK-01, AC 1)
Proof: `cd backend && pnpm exec vitest run dates.test.js -t "week start is six days before today"`

**C3** - An article dated six days ago is kept; seven days ago and tomorrow are left out (WEEK-01, AC 2)
Proof: `cd backend && pnpm exec vitest run dates.test.js -t "keeps only articles in the week"`

**C4** - Each article has `title`, `url`, `publishedOn`, `imageUrl` and `imageAlt` from its card (WEEK-01, AC 3)
Proof: `cd backend && pnpm exec vitest run parse-cards.test.js -t "returns every article field"`

**C5** - A card with no image returns `imageUrl` `null` and an empty `imageAlt` (WEEK-01, AC 4)
Proof: `cd backend && pnpm exec vitest run parse-cards.test.js -t "returns null image when card has none"`

**C6** - Articles are newest day first and keep CNN's order within a day (WEEK-01, AC 5)
Proof: `cd backend && pnpm exec vitest run dates.test.js -t "sorts newest day first keeping page order"`

**C7** - Days appear newest first with headings like `Friday, October 30, 2026` (WEEK-02, AC 1)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "shows one heading per day newest first"`

**C8** - Each article shows under its own day with image, title, new-tab URL and date (WEEK-02, AC 2)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "shows each article under its day"`

**C9** - A `null` image shows `No image` (WEEK-02, AC 3)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "shows no image placeholder when url is null"`

**C10** - An image that fails to load shows `No image` (WEEK-02, AC 4)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "shows no image placeholder when image fails"`

**C11** - The page title reads `This Week's Sports Headlines` (WEEK-02, AC 5)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "shows page title"`

**C12** - An empty response shows `No sports articles published this week yet.` (WEEK-02, AC 6)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "shows empty message"`

**C13** - No horizontal page scrolling at 375px and 1280px (WEEK-02, AC 7)
Proof: walk - at both widths the page's scroll width equals its window width

**C14** - ESLint fails on a 26-line function, on complexity 9 and on an unused variable (WEEK-03, AC 1)
Proof: walk - each rule broken on purpose in both apps made `pnpm lint` fail, and the clean code passes

**C15** - Vitest fails below 90% line or branch coverage (WEEK-03, AC 2)
Proof: walk - removing tests below the threshold made `pnpm test:coverage` fail in both apps

**C16** - Each responsibility has its own module (WEEK-03, AC 3)
Proof: walk - the project structure in the README matches the files, one responsibility each

**C17** - The README covers every topic AC 1 lists (WEEK-04, AC 1)
Proof: walk - each topic was found in `README.md`

**C18** - A fresh clone reaches a working page by following only the README (WEEK-04, AC 2)
Proof: walk - in an empty folder, the README's steps showed headlines at the address it gives

---

## Handoff

**Settled mid-build:** none
**Dispatched:** Verifier at HEAD adbf5fa, returned
**Walked:** On 2026-10-30, against live CNN, in a fresh `git clone`, using only the README's commands. `pnpm --dir backend install` and `pnpm --dir frontend install` succeeded, then `pnpm --dir backend start` and `pnpm --dir frontend dev`. Vite printed port 5174 because 5173 was taken, as the README says it can. WEEK-01: `curl localhost:3333/api/headlines` returned `from` 2026-10-24, `to` 2026-10-30 and 20 articles across 7 days, each with an `imageUrl`, no video links. WEEK-02: the page showed 7 day headings newest first, 2, 3, 4, 3, 4, 1 and 3 articles under them, and all 20 images loaded. At 1280px `scrollWidth` was 1265 with a 15px scrollbar, and at 375px it was 375, so nothing scrolled sideways. The walk found the browser tab title still reading the old name; fixed in 1e1ae5d with a test. WEEK-03: one file each breaking the line, complexity and unused-variable rules made `eslint` report all three in both apps with exit 1, and the real code exits 0. Running a single test with `--coverage` failed both apps below 90% with exit 1, and the full suites pass at 98% lines and 96% branches in the backend, 100% in the frontend. The README's project structure matches the files, one responsibility each. After the Verifier's fixes, `eslint.config.js` in both apps turns the 25-line rule off for test files, and the README's Test and lint section states it. WEEK-04: the README states what the app does, prerequisites, install, launch, test and lint commands, project structure and known limits.
