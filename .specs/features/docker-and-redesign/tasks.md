# Docker and Redesign Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, the walk, check_proofs, the Verifier and the screens sub-agent).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: inline - no new architecture; decisions are in `.specs/features/docker-and-redesign/spec.md`
**Status**: Approved
**Approved**: 2026-10-31 - user: "Approve both, start"
**Mutations**: 3
**Build**: `pnpm --dir backend lint; pnpm --dir backend test:coverage; pnpm --dir frontend lint; pnpm --dir frontend test:coverage; pnpm --dir frontend build; docker compose config --quiet`

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: `backend/eslint.config.js`, `frontend/eslint.config.js`, `backend/vitest.config.js`, `frontend/vite.config.js`.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Formatting logic | unit | Every branch; 1:1 to spec ACs | `frontend/src/*.test.js` | `pnpm --dir frontend test` |
| React components and hooks | integration | Through `App`, happy, empty and error paths; 90% lines and branches | `frontend/src/App.test.jsx` | `pnpm --dir frontend test` |
| CSS | none | Proven by the walk | - | build gate only |
| Dockerfiles, nginx, compose | none | Proven by the walk | - | `docker compose config --quiet` |
| README | none | Proven by the walk | - | - |

## Gate Check Commands

> Generated from codebase - confirm before Execute.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | After tasks with unit tests | `pnpm --dir frontend test` |
| Full | After tasks with integration tests | `pnpm --dir frontend lint; pnpm --dir frontend test:coverage` |
| Build | After phase completion or config-only tasks | `pnpm --dir backend lint; pnpm --dir backend test:coverage; pnpm --dir frontend lint; pnpm --dir frontend test:coverage; pnpm --dir frontend build; docker compose config --quiet` |

---

## Execution Plan

Phases are ordered and run sequentially - each phase completes before the next begins, and tasks within a phase execute in order. Phase 1 is one worker; Phase 2 is a second worker, started after the manager reviews Phase 1.

### Phase 1: Redesign

```
T1 → T2 → T3 → T4 → T5
```

### Phase 2: Docker

```
T6 → T7 → T8 → T9
```

---

## Task Breakdown

### T1: Format the date range ✅

**What**: Export `formatRange(from, to)`, which returns `Oct 24 – Oct 30, 2026`, or `Dec 27, 2026 – Jan 2, 2027` when the years differ.
**Where**: `frontend/src/format-range.js`
**Depends on**: None
**Reuses**: `frontend/src/format-day.js` for the local-time parsing pattern
**Requirement**: PAGE-01

**Done when**:

- [ ] Tests in `frontend/src/format-range.test.js` cover C5 and C6 under a pinned `America/Sao_Paulo` timezone
- [ ] Gate check passes: `pnpm --dir frontend test`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(frontend): format the date range`

---

### T2: Expose the range from the hook ✅

**What**: Make `useHeadlines` return `range` (`{ from, to }`, or `null` until a response arrives) beside `articles` and `hasError`.
**Where**: `frontend/src/hooks/useHeadlines.js`
**Depends on**: T1
**Reuses**: The existing hook
**Requirement**: PAGE-01

**Done when**:

- [ ] Every existing test still passes unchanged
- [ ] Gate check passes: `pnpm --dir frontend lint; pnpm --dir frontend test:coverage`

**Tests**: integration
**Gate**: full

**Commit**: `feat(frontend): expose the date range from the headlines hook`

---

### T3: Add the top bar ✅

**What**: Create `TopBar`, showing `SportScrapper` and the `View on GitHub` link, and render it in `App`.
**Where**: `frontend/src/components/TopBar.jsx`
**Depends on**: T2
**Reuses**: Existing component style
**Requirement**: PAGE-01

**Done when**:

- [ ] C1 passes
- [ ] Gate check passes: `pnpm --dir frontend lint; pnpm --dir frontend test:coverage`

**Tests**: integration
**Gate**: full

**Commit**: `feat(frontend): add the top bar`

---

### T4: Add the hero ✅

**What**: Create `Hero`, taking `range` as a prop and showing the pill, the title with its `aria-hidden` cursor, the description and `See headlines` linking to `#headlines`. Render it in `App`, replacing the old `h1`, and put `id="headlines"` on the element holding the messages and day sections.
**Where**: `frontend/src/components/Hero.jsx`
**Depends on**: T3
**Reuses**: `formatRange` from T1
**Requirement**: PAGE-01

**Done when**:

- [ ] C2, C3, C4, C7, C8 and C9 pass
- [ ] Gate check passes: `pnpm --dir frontend lint; pnpm --dir frontend test:coverage`

**Tests**: integration
**Gate**: full

**Commit**: `feat(frontend): add the hero`

---

### T5: Apply the new look

**What**: Rewrite the stylesheet with the spec's palette as CSS variables on `:root`, the crimson glow, Inter, dark cards with a thin border and hover state, a pill matching the reference, and smooth scrolling that respects `prefers-reduced-motion`. Add `@fontsource-variable/inter` and import it in `src/main.jsx`.
**Where**: `frontend/src/App.css`
**Depends on**: T4
**Reuses**: `.specs/features/docker-and-redesign/captures/style-reference.webp`
**Requirement**: PAGE-02

**Done when**:

- [ ] All colours come from the variables on `:root`
- [ ] Gate check passes: `pnpm --dir backend lint; pnpm --dir backend test:coverage; pnpm --dir frontend lint; pnpm --dir frontend test:coverage; pnpm --dir frontend build`

**Tests**: none
**Gate**: build

**Commit**: `feat(frontend): apply the dark crimson design`

---

### T6: Containerise the backend

**What**: Create a Dockerfile on `node:24-alpine` that installs pnpm 11, installs production dependencies from the lockfile and runs `node server.js`, with a `backend/.dockerignore`.
**Where**: `backend/Dockerfile`
**Depends on**: None
**Reuses**: `backend/package.json`
**Requirement**: DOCK-01

**Done when**:

- [ ] `docker build backend` succeeds
- [ ] No test or dev dependency ends up in the image

**Tests**: none
**Gate**: build

**Commit**: `build(backend): add the docker image`

---

### T7: Containerise the frontend

**What**: Create a multi-stage Dockerfile that builds with Node and serves `dist` from `nginx:alpine`, with a `frontend/.dockerignore` and a `frontend/nginx.conf` passing `/api/` to `http://backend:3333`.
**Where**: `frontend/Dockerfile`
**Depends on**: T6
**Reuses**: `frontend/package.json`
**Requirement**: DOCK-01

**Done when**:

- [ ] `docker build frontend` succeeds

**Tests**: none
**Gate**: build

**Commit**: `build(frontend): add the docker image`

---

### T8: Add the compose file

**What**: Create `docker-compose.yml` at the root with `backend` (no published ports, `TZ: ${TZ:-America/Sao_Paulo}`) and `frontend` (port `8080:80`, depends on `backend`).
**Where**: `docker-compose.yml`
**Depends on**: T7
**Reuses**: T6 and T7 images
**Requirement**: DOCK-01

**Done when**:

- [ ] `docker compose up --build -d` serves the page at `http://localhost:8080`
- [ ] `docker compose config --quiet` exits 0
- [ ] `docker compose down` leaves nothing running

**Tests**: none
**Gate**: build

**Commit**: `build: add docker compose for both apps`

---

### T9: Update the README

**What**: Put a Docker section first with the prerequisite, command, address, how to stop and how to change `TZ`; move the current install and launch steps under a `Run without Docker` heading; update the prerequisites and project structure; add the Docker timezone note to the known limits.
**Where**: `README.md`
**Depends on**: T8
**Reuses**: The existing README
**Requirement**: DOCK-02

**Done when**:

- [ ] C15, C16 and C17 hold on reading the file
- [ ] The Node and pnpm prerequisites sit under `Run without Docker`

**Tests**: none
**Gate**: build

**Commit**: `docs: add docker steps to the readme`

---

## Checks

**C1** - The top bar shows `SportScrapper` and a new-tab `View on GitHub` link to the repository (PAGE-01, AC 1)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "shows top bar"`

**C2** - The title reads `This Week's Sports Headlines`, and the cursor is hidden from screen readers (PAGE-01, AC 2)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "shows page title"`

**C3** - The description reads `The last 7 days of CNN Sport, gathered in one place.` (PAGE-01, AC 3)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "shows description"`

**C4** - The pill shows the response's range (PAGE-01, AC 4)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "shows date pill"`

**C5** - A range inside one year reads `Oct 24 – Oct 30, 2026` (PAGE-01, AC 4)
Proof: `cd frontend && pnpm exec vitest run src/format-range.test.js -t "formats a range inside one year"`

**C6** - A range across a year end reads `Dec 27, 2026 – Jan 2, 2027` (PAGE-01, AC 5)
Proof: `cd frontend && pnpm exec vitest run src/format-range.test.js -t "formats a range across a year end"`

**C7** - No pill shows while the request runs (PAGE-01, AC 6)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "hides date pill while loading"`

**C8** - No pill shows after a failed request (PAGE-01, AC 7)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "hides date pill after an error"`

**C9** - `See headlines` points at the element holding the headlines (PAGE-01, AC 8)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "see headlines points at the headlines"`

**C10** - Using `See headlines` scrolls the page to the headlines (PAGE-01, AC 8)
Proof: walk - clicking the button moved the first day heading into view

**C11** - The background and glow follow the style reference (PAGE-02, AC 1)
Proof: walk - the running page compared side by side with `captures/style-reference.webp`

**C12** - Every text and background pair reaches 4.5:1 (PAGE-02, AC 2)
Proof: walk - contrast computed from the running page's colours for each pair

**C13** - Articles keep their image, title, URL and date under their day (PAGE-02, AC 3)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "shows each article under its day"`

**C14** - Loading, empty and error messages keep their wording (PAGE-02, AC 4)
Proof: `cd frontend && pnpm exec vitest run src/App.test.jsx -t "message"`

**C15** - The README describes Docker first, with command, address, stop and `TZ` (DOCK-02, AC 1)
Proof: walk - each topic found in the README's first section

**C16** - The non-Docker steps stay under their own heading (DOCK-02, AC 2)
Proof: walk - the `Run without Docker` heading holds the install and launch steps

**C17** - The project structure lists the new files (DOCK-02, AC 3)
Proof: walk - each new file appears in the README's structure

**C18** - No horizontal page scrolling at 375px and 1280px (PAGE-02, AC 5)
Proof: walk - at both widths the page's scroll width is no larger than its window width

**C19** - `docker compose up --build` serves the page at port 8080 (DOCK-01, AC 1)
Proof: walk - in a fresh clone, the page loaded at `http://localhost:8080`

**C20** - Port 8080 passes `/api/headlines` to the backend (DOCK-01, AC 2)
Proof: walk - `curl localhost:8080/api/headlines` returned articles

**C21** - The backend publishes no host port (DOCK-01, AC 3)
Proof: walk - `docker compose ps` shows no host port for `backend`, and `curl localhost:3333` is refused

**C22** - `TZ` is honoured, and defaults to `America/Sao_Paulo` (DOCK-01, AC 4)
Proof: walk - `date` in the backend container showed -03 by default and the Lisbon offset with `TZ=Europe/Lisbon`

**C23** - With the backend stopped, the page shows the error message (DOCK-01, AC 5)
Proof: walk - after `docker compose stop backend`, a reload showed `Couldn't load headlines from CNN.`

---

## Handoff

The feature's live state, written as it happens - a compaction gives no warning.

**Settled mid-build:** none
**Dispatched:** Phase 1 worker (T1-T5)

---

## Phase Execution Map

```
Phase 1 → Phase 2

Phase 1:  T1 ------→ T2 ------→ T3 ------→ T4 ------→ T5
Phase 2:  T6 ------→ T7 ------→ T8 ------→ T9
```
