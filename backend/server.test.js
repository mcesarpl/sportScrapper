import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from './server.js'

const CNN_SPORT_URL = 'https://edition.cnn.com/sport'
const realFetch = globalThis.fetch
let baseUrl
let cnnRequests

function stubCnn(respond) {
  cnnRequests = []
  vi.stubGlobal('fetch', (url, options) => {
    if (String(url).startsWith(baseUrl)) return realFetch(url, options)
    cnnRequests.push(String(url))
    return respond(options)
  })
}

function cardsPage(path) {
  return `
    <li class="card">
      <a href="${path}"><img src="https://media.cnn.com/photo.jpg" alt="A photo" /></a>
      <a href="${path}"><span class="container__headline-text">A headline</span></a>
    </li>`
}

function getHeadlines() {
  return realFetch(`${baseUrl}/api/headlines`)
}

beforeAll(async () => {
  await new Promise((resolve) => server.listen(0, resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

afterAll(() => {
  server.close()
})

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'], now: new Date(2026, 9, 30, 12) })
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('GET /api/headlines', () => {
  it('returns from to and articles', async () => {
    stubCnn(() => new Response(cardsPage('/2026/10/30/sport/an-article')))

    const response = await getHeadlines()

    expect(response.status).toBe(200)
    expect(cnnRequests).toEqual([CNN_SPORT_URL])
    expect(await response.json()).toEqual({
      from: '2026-10-24',
      to: '2026-10-30',
      articles: [
        {
          title: 'A headline',
          url: 'https://edition.cnn.com/2026/10/30/sport/an-article',
          publishedOn: '2026-10-30',
          imageUrl: 'https://media.cnn.com/photo.jpg',
          imageAlt: 'A photo',
        },
      ],
    })
  })

  it('returns empty list when nothing is dated in the week', async () => {
    stubCnn(() => new Response(cardsPage('/2026/10/23/sport/an-article')))

    const response = await getHeadlines()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ from: '2026-10-24', to: '2026-10-30', articles: [] })
  })

  it('returns 404 for any other route', async () => {
    const response = await realFetch(`${baseUrl}/other`)

    expect(response.status).toBe(404)
  })

  it('returns 502 when listing has no cards', async () => {
    stubCnn(() => new Response('<html><body>Something else</body></html>'))

    const response = await getHeadlines()

    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ error: 'Could not load CNN Sport' })
  })

  it('returns 502 when listing fails with a network error', async () => {
    stubCnn(() => Promise.reject(new Error('connection refused')))

    const response = await getHeadlines()

    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ error: 'Could not load CNN Sport' })
    expect(console.error).toHaveBeenCalled()
  })

  it('returns 502 when listing fails with a non-2xx status', async () => {
    stubCnn(() => new Response(cardsPage('/2026/10/30/sport/an-article'), { status: 503 }))

    const response = await getHeadlines()

    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ error: 'Could not load CNN Sport' })
    expect(console.error).toHaveBeenCalled()
  })

  it('returns 502 when listing fails with a 404 status', async () => {
    stubCnn(() => new Response(cardsPage('/2026/10/30/sport/an-article'), { status: 404 }))

    const response = await getHeadlines()

    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ error: 'Could not load CNN Sport' })
  })

  it('returns 502 when listing fails by taking longer than 10 seconds', { timeout: 12000 }, async () => {
    stubCnn(
      (options) =>
        new Promise((_, reject) => {
          options.signal.addEventListener('abort', () => reject(options.signal.reason))
        }),
    )
    const startedAt = performance.now()

    const response = await getHeadlines()

    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ error: 'Could not load CNN Sport' })
    const elapsed = performance.now() - startedAt
    expect(elapsed).toBeGreaterThanOrEqual(9900)
    expect(elapsed).toBeLessThan(10500)
    expect(console.error).toHaveBeenCalled()
  })
})
