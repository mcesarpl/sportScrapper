import { createServer } from 'node:http'
import { CNN_SPORT_URL, getHeadlines } from './headlines.js'

const PORT = 3333

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
