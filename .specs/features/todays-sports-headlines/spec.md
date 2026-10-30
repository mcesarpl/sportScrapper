# Today's Sports Headlines Specification

**Approved**: 2026-10-30 - user: "Approve, build it"

## Problem Statement

CNN Sport mixes today's stories with weeks of older articles and hundreds of videos. This app prints only today's sports articles, with each one's title, link and publication date. It is the smallest version that works: one Node endpoint that scrapes the sport page, and one React page that shows the result.

## Goals

- [ ] A person opens one page and sees the CNN Sport articles dated today, with title, link and publication date.
- [ ] The backend is one small Node service with cheerio as its only runtime dependency.

## Out of Scope

| Feature | Reason |
| ----------- | -------------- |
| Opening each article's page for an exact publish time | User asked for the minimal version that scrapes the sport page |
| Refresh and Try again buttons | User said the frontend should just show today's articles; reloading the browser fetches again |
| Database, history, caching, background scraping | Each page load fetches live |
| Login, rate limiting, deployment | Runs locally for one person |
| Other CNN sections or other news sites | The request names `https://edition.cnn.com/sport` only |
| Videos and galleries | The request asks for articles; decided with the user |
| Search, filters, images, summaries | Not requested |

---

## Assumptions & Open Questions

Every ambiguity is resolved or recorded here - nothing is left silently unclear.

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | --------------- | --------- | ---------- |
| Meaning of "today" | The link's URL date equals the calendar date in the timezone of the computer running the backend | User chose their computer's timezone; "minimal" rules out opening every article. Close to midnight a URL date can differ from the local date, so an article can land on the neighbouring day | n |
| Publication date shown | The date from the link's URL, with no time | The sport page has no other date for a card | n |
| Which items appear | Standard articles and live blogs; no videos or galleries | User chose "articles and live blogs" | y |
| When data is fetched | On page load only | User said the frontend should "just show" today's articles, which replaces the earlier Refresh choice | n |
| Backend stack | Plain JavaScript on Node's built-in `http` module, with cheerio | User asked for the minimal Node backend | n |
| Frontend stack | Vite and React in plain JavaScript with plain CSS; no Tailwind, TanStack Query, router or TypeScript | Minimal scope replaces the earlier `react-standard` subset | n |
| Tests | Vitest in both apps; Testing Library in the frontend | The spec standard requires a test for each criterion | n |
| Result order | The order the cards appear on CNN's page | No sort rule is needed for a same-day list | n |
| CNN returns a page with no recognisable stories | Treat it as a failure, not as "no articles today" | A CNN layout change must not read as a quiet news day | n |
| Local ports | Backend on 3333; Vite dev server on 5173, proxying `/api` to the backend | Standard ports for these tools | n |

**Dimensions sweep** - input validation: N/A because the endpoint takes no input. Idempotency and retries: N/A because every request is a read with no stored state. Auth and rate limits: out of scope above. Concurrency and data lifecycle: N/A because nothing is stored. Observability: the backend logs a failed CNN request (HEAD-01 AC 6). State transitions: N/A because there is no stored state. Failures and external dependencies: HEAD-01 AC 6 and 7, HEAD-02 AC 4.

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Get today's articles from the backend ⭐ MVP

**User Story**: As the frontend, I want one endpoint that returns today's CNN Sport articles so that the page only has to display them.

**Why P1**: All the scraping and the "today" rule live here.

**Requirement**: HEAD-01

**Acceptance Criteria** (each line is one EARS pattern):

1. WHEN a client sends `GET /api/headlines` THEN the backend SHALL fetch `https://edition.cnn.com/sport` and respond with HTTP 200 and the JSON fields `date` (`YYYY-MM-DD`, today in the backend's timezone) and `articles`.
2. The backend SHALL return each entry in `articles` with `title` (decoded text), `url` (an absolute `https://edition.cnn.com/...` address) and `publishedOn` (`YYYY-MM-DD`, from the link's URL).
3. The backend SHALL select only listing cards whose link path matches `/YYYY/MM/DD/sport/...`, including `/sport/live-news/` paths and excluding paths containing `/video/` or `/gallery/`.
4. The backend SHALL include an article only when its `publishedOn` equals today's calendar date in the backend's timezone.
5. IF the same link appears on more than one listing card THEN the backend SHALL return that article once.
6. IF the listing request fails, returns a non-2xx status or takes longer than 10 seconds THEN the backend SHALL respond with HTTP 502 and `{ "error": "Could not load CNN Sport" }` and log the failure.
7. IF the listing page contains no cards matching AC 3 THEN the backend SHALL respond with HTTP 502 and `{ "error": "Could not load CNN Sport" }`.
8. WHEN no selected card is dated today THEN the backend SHALL respond with HTTP 200, an empty `articles` array and the current `date`.

**Independent Test**: With the backend running, `curl localhost:3333/api/headlines` returns today's articles and no video links.

---

### P1: See today's articles on the page ⭐ MVP

**User Story**: As a reader, I want a page that prints today's sports articles so that I can see what was published without browsing CNN.

**Why P1**: This is the UI the request asks for.

**Requirement**: HEAD-02

**Acceptance Criteria**:

1. WHEN the page opens THEN the frontend SHALL request `GET /api/headlines` and show every returned article's title, its URL as a visible link that opens in a new tab, and its publication date.
2. WHILE the request is running the frontend SHALL show `Loading headlines…`.
3. WHEN the response has no articles THEN the frontend SHALL show `No sports articles published today yet.`
4. IF the request fails THEN the frontend SHALL show `Couldn't load headlines from CNN.`
5. The page SHALL show all its content without horizontal page scrolling at window widths of 375px and 1280px.

**Independent Test**: Open the page with the backend running and compare the list with the `curl` output from HEAD-01.

---

## Edge Cases

- WHEN a headline contains HTML entities THEN the backend SHALL return the decoded text, as covered by HEAD-01 AC 2.
- WHEN a long URL is shown THEN the page SHALL wrap it inside the window, as covered by HEAD-02 AC 5.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----------- | ------ | ------- |
| HEAD-01 | P1: Get today's articles from the backend | Execute | Verified |
| HEAD-02 | P1: See today's articles on the page | Execute | Verified |

**Coverage:** 2 total, 2 mapped to checks, 0 unmapped.

---

## Sources

- User request, 2026-10-30 - settles the source URL, the three printed fields and the React plus Node stack.
- User message, 2026-10-30 - "the minimal project backend with nodejs" and a frontend that should "just show" today's article.
- `https://edition.cnn.com/sport`, inspected 2026-10-30 - cards carry the link and headline; `robots.txt` does not disallow `/sport` for `User-agent: *`.

---

## Success Criteria

- [ ] On the day of the walk, the page lists the same today-dated articles and live blogs as CNN Sport's own page.
- [ ] Every check below passes on the final commit.

---

## Checks

**Mutations**: 3
**Build**: `pnpm --dir frontend build`

**C1** - `GET /api/headlines` fetches the CNN Sport URL and returns 200 with `date` and `articles` (HEAD-01, AC 1)
Proof: `cd backend && pnpm exec vitest run server.test.js -t "returns date and articles"`

**C2** - Each article has a decoded `title`, an absolute `url` and a `publishedOn` from its URL (HEAD-01, AC 2)
Proof: `cd backend && pnpm exec vitest run headlines.test.js -t "returns decoded title absolute url and date"`

**C3** - Articles and live blogs are selected; videos and galleries are not (HEAD-01, AC 3)
Proof: `cd backend && pnpm exec vitest run headlines.test.js -t "selects articles and live blogs only"`

**C4** - A card dated yesterday in the backend's timezone is excluded (HEAD-01, AC 4)
Proof: `cd backend && pnpm exec vitest run headlines.test.js -t "keeps only cards dated today"`

**C5** - A link on two cards is returned once (HEAD-01, AC 5)
Proof: `cd backend && pnpm exec vitest run headlines.test.js -t "returns duplicate links once"`

**C6** - A failed, non-2xx or timed-out listing returns 502 with the agreed error and logs it (HEAD-01, AC 6)
Proof: `cd backend && pnpm exec vitest run server.test.js -t "returns 502 when listing fails"`

**C7** - A listing with no matching cards returns 502 (HEAD-01, AC 7)
Proof: `cd backend && pnpm exec vitest run server.test.js -t "returns 502 when listing has no cards"`

**C8** - A listing with no card dated today returns 200 with an empty list (HEAD-01, AC 8)
Proof: `cd backend && pnpm exec vitest run server.test.js -t "returns empty list when nothing is dated today"`

**C9** - The page shows each title, a new-tab URL link and the publication date (HEAD-02, AC 1)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "shows title link and date"`

**C10** - `Loading headlines…` shows during the request (HEAD-02, AC 2)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "shows loading message"`

**C11** - An empty response shows `No sports articles published today yet.` (HEAD-02, AC 3)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "shows empty message"`

**C12** - A failed request shows `Couldn't load headlines from CNN.` (HEAD-02, AC 4)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "shows error message"`

**C13** - No horizontal page scrolling at 375px and 1280px (HEAD-02, AC 5)
Proof: walk - at both widths the page's scroll width equals its window width

---

## Handoff

**Settled mid-build:** none
**Dispatched:** Verifier at HEAD af3a27b, returned
**Walked:** Ran the backend with `pnpm --dir backend start` and the frontend with `pnpm --dir frontend dev` (it landed on port 5174 because 5173 was taken), on 2026-10-30 against live CNN. HEAD-01: `curl localhost:3333/api/headlines` returned `date` 2026-10-30 and 2 articles, no video links. HEAD-02: the page showed the same 2 titles, URLs and dates. At 1280px and 375px, `scrollWidth` equalled `innerWidth`, and long URLs wrapped. With the backend stopped, the page showed `Couldn't load headlines from CNN.` After the Verifier's fixes, a 125-character unbroken title set on the running page wrapped at both widths: `scrollWidth` equalled `innerWidth` at 1280px and 375px.
