import { render, screen } from '@testing-library/react'
import App from './App.jsx'

const article = {
  title: 'Packers’ Watson returns',
  url: 'https://edition.cnn.com/2026/10/30/sport/packers-watson',
  publishedOn: '2026-10-30',
}

function stubResponse(body, status = 200) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

it('shows title link and date', async () => {
  stubResponse({ date: '2026-10-30', articles: [article] })

  render(<App />)

  expect(await screen.findByText(article.title)).toBeTruthy()
  const link = screen.getByRole('link', { name: article.url })
  expect(link.getAttribute('href')).toBe(article.url)
  expect(link.getAttribute('target')).toBe('_blank')
  expect(screen.getByText(article.publishedOn)).toBeTruthy()
  expect(fetch).toHaveBeenCalledWith('/api/headlines')
})

it('shows title link and date of every returned article', async () => {
  const second = { ...article, title: 'Second story', url: 'https://edition.cnn.com/second' }
  stubResponse({ date: '2026-10-30', articles: [article, second] })

  render(<App />)

  expect(await screen.findByText(second.title)).toBeTruthy()
  expect(screen.getAllByRole('listitem')).toHaveLength(2)
})

it('shows loading message', async () => {
  vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))

  render(<App />)

  expect(screen.getByText('Loading headlines…')).toBeTruthy()
})

it('shows empty message', async () => {
  stubResponse({ date: '2026-10-30', articles: [] })

  render(<App />)

  expect(await screen.findByText('No sports articles published today yet.')).toBeTruthy()
  expect(screen.queryByText('Loading headlines…')).toBeNull()
})

it('shows error message when the backend responds with an error', async () => {
  stubResponse({ error: 'Could not load CNN Sport' }, 502)

  render(<App />)

  expect(await screen.findByText("Couldn't load headlines from CNN.")).toBeTruthy()
  expect(screen.queryByText('Loading headlines…')).toBeNull()
})

it('shows error message when the backend cannot be reached', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

  render(<App />)

  expect(await screen.findByText("Couldn't load headlines from CNN.")).toBeTruthy()
})
