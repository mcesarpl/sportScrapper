import { createServer } from 'node:http'
import { localDate, parseCards, todaysArticles } from './headlines.js'

const CNN_SPORT_URL = 'https://edition.cnn.com/sport'
const TIMEOUT_MS = 10000
const PORT = 3333

async function getHeadlines() {
  const response = await fetch(CNN_SPORT_URL, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!response.ok) throw new Error(`CNN responded with status ${response.status}`)

  const cards = parseCards(await response.text())
  if (cards.length === 0) throw new Error('CNN page has no article cards')

  const date = localDate()
  return { date, articles: todaysArticles(cards, date) }
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

export const server = createServer(async (req, res) => {
  if (req.method !== 'GET' || req.url !== '/api/headlines') {
    return sendJson(res, 404, { error: 'Not found' })
  }

  try {
    sendJson(res, 200, await getHeadlines())
  } catch (error) {
    console.error(`Failed to load ${CNN_SPORT_URL}:`, error.message)
    sendJson(res, 502, { error: 'Could not load CNN Sport' })
  }
})

if (import.meta.main) {
  server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
}
