# SportScrapper

SportScrapper shows the last 7 days of CNN Sport headlines on one page. It scrapes
[edition.cnn.com/sport](https://edition.cnn.com/sport) each time the page opens, then lists the
articles and live blogs under one heading per day. Each headline has its image, title, link and
publication date.

The project has two small apps:

- **Backend:** a Node service that scrapes CNN and exposes the articles as JSON.
- **Frontend:** a React page that displays them.

## Docker

Docker is the quickest way to run SportScrapper. It needs only Docker with Compose.

You need:

- [Docker](https://docs.docker.com/get-docker/) with Compose, which Docker Desktop includes
- A connection to the internet, because the app reads CNN live

Clone the repository, enter its folder, and start both apps:

```bash
git clone https://github.com/mcesarpl/sportScrapper.git
cd sportScrapper
docker compose up --build
```

Open <http://localhost:8080> in your browser.

To stop the apps, press `Ctrl+C`. To stop them and remove their containers, run `docker compose down`.

To use another timezone, set `TZ` before the command:

```bash
TZ=Europe/Lisbon docker compose up --build
```

In Docker, "today" follows `TZ`, and the default is `America/Sao_Paulo`.

## Run without Docker

Use these steps to develop the apps. The frontend reloads as you edit it.

### Prerequisites

- [Node.js](https://nodejs.org) 24.2 or newer
- [pnpm](https://pnpm.io/installation) 11 or newer
- A connection to the internet, because the app reads CNN live

Check your versions:

```bash
node --version
pnpm --version
```

### Install

Clone the repository, enter its folder, and install each app's dependencies:

```bash
git clone https://github.com/mcesarpl/sportScrapper.git
cd sportScrapper
pnpm --dir backend install
pnpm --dir frontend install
```

### Launch

The app needs both parts running, so use two terminals, both in the project folder.

Terminal 1, the backend:

```bash
pnpm --dir backend start
```

It runs at <http://localhost:3333>.

Terminal 2, the frontend:

```bash
pnpm --dir frontend dev
```

Open <http://localhost:5173> in your browser. If that port is already in use, Vite picks the next
free one and prints the address in the terminal.

Press `Ctrl+C` in each terminal to stop the apps.

## Test and lint

Run these from the project folder.

| Command | What it does |
| --- | --- |
| `pnpm --dir backend test` | Runs the backend tests |
| `pnpm --dir frontend test` | Runs the frontend tests |
| `pnpm --dir backend test:coverage` | Runs the tests and fails below 90% line or branch coverage |
| `pnpm --dir frontend test:coverage` | Runs the tests and fails below 90% line or branch coverage |
| `pnpm --dir backend lint` | Checks the code with ESLint |
| `pnpm --dir frontend lint` | Checks the code with ESLint |

Tests use [Vitest](https://vitest.dev) and never call CNN, so they pass offline. One backend test
waits 10 seconds on purpose to prove the request timeout.

ESLint fails on any function with complexity over 8 and any unused variable. It also fails on any
function over 25 lines, except in test files, where `describe` blocks are long by nature.

## Project structure

```text
backend/
  Dockerfile                      Builds the backend image
  server.js                       HTTP server and the /api/headlines route
  headlines.js                    Fetches the CNN page and builds the response
  parse-cards.js                  Scrapes articles and images out of the HTML
  dates.js                        Today, the 7-day range, filtering and sorting
frontend/
  Dockerfile                      Builds the frontend and serves it with nginx
  nginx.conf                      Serves the page and passes /api/ to the backend
frontend/src/
  App.jsx                         The page and its loading, empty and error messages
  hooks/useHeadlines.js           Requests the headlines from the backend
  group-by-day.js                 Groups articles by day, newest day first
  format-day.js                   Formats a date as a day heading
  format-range.js                 Formats the date range shown in the pill
  components/DaySection.jsx       One day's heading and its articles
  components/ArticleCard.jsx      One headline
  components/ArticleImage.jsx     The image, or a placeholder when there is none
  components/TopBar.jsx           The top bar with the name and the GitHub link
  components/Hero.jsx             The title, description, date pill and See headlines button
docker-compose.yml                Starts the backend and the frontend together
.specs/                           Specifications the project was built from
```

Tests sit beside the code they cover, as `*.test.js` or `*.test.jsx`.

## API

`GET /api/headlines` returns the 7-day range and its articles, newest day first:

```json
{
  "from": "2026-10-24",
  "to": "2026-10-30",
  "articles": [
    {
      "title": "Headline text",
      "url": "https://edition.cnn.com/2026/10/30/sport/example",
      "publishedOn": "2026-10-30",
      "imageUrl": "https://media.cnn.com/api/v1/images/stellar/prod/example.jpg",
      "imageAlt": "Description of the image"
    }
  ]
}
```

If CNN can't be read, it returns HTTP 502 with `{ "error": "Could not load CNN Sport" }`.

## Known limits

- **It shows what CNN's sport page lists.** The app reads one page, so articles CNN has dropped from
  that page don't appear, even if they were published this week.
- **Dates come from each article's URL.** Close to midnight, a URL date can differ from your local
  date, so an article can appear under the neighbouring day. A live blog appears on the day it
  started.
- **Videos and galleries are left out.** The app lists articles and live blogs only.
- **It depends on CNN's page layout.** If CNN changes its HTML so no stories can be found, the page
  shows `Couldn't load headlines from CNN.` rather than an empty list.
- **"Today" follows the computer running the backend**, using that computer's timezone. In Docker,
  it follows `TZ` instead, and the default is `America/Sao_Paulo`.
