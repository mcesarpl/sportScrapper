import { readFileSync } from 'node:fs'
import process from 'node:process'
import { fireEvent, render, screen, within } from '@testing-library/react'
import App from './App.jsx'

const article = {
  title: 'Packers’ Watson returns',
  url: 'https://edition.cnn.com/2026/10/30/sport/packers-watson',
  publishedOn: '2026-10-30',
  imageUrl: 'https://media.cnn.com/photo.jpg',
  imageAlt: 'Watson on the field',
}
const olderArticle = {
  title: 'An older story',
  url: 'https://edition.cnn.com/2026/10/28/sport/older',
  publishedOn: '2026-10-28',
  imageUrl: 'https://media.cnn.com/older.jpg',
  imageAlt: 'An older photo',
}

function stubResponse(body, status = 200) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })))
}

function stubArticles(articles) {
  stubResponse({ from: '2026-10-24', to: '2026-10-30', articles })
}

function daySection(heading) {
  return within(screen.getByRole('heading', { name: heading, level: 2 }).closest('section'))
}

beforeAll(() => {
  // West of UTC, so reading a bare date as UTC would show the previous day.
  process.env.TZ = 'America/Sao_Paulo'
})

afterEach(() => {
  vi.unstubAllGlobals()
})

it('shows page title', async () => {
  stubArticles([article])

  render(<App />)

  expect(await screen.findByRole('heading', { name: "This Week's Sports Headlines", level: 1 })).toBeTruthy()
})

it('shows page title in the browser tab', () => {
  const html = readFileSync('index.html', 'utf8')

  expect(html).toContain("<title>This Week's Sports Headlines</title>")
})

it('shows one heading per day newest first', async () => {
  const middleArticle = { ...article, url: 'https://edition.cnn.com/middle', publishedOn: '2026-10-29' }
  stubArticles([middleArticle, article, olderArticle, { ...article, url: 'https://edition.cnn.com/same-day' }])

  render(<App />)

  await screen.findAllByRole('heading', { level: 2 })
  const headings = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
  expect(headings).toEqual([
    'Friday, October 30, 2026',
    'Thursday, October 29, 2026',
    'Wednesday, October 28, 2026',
  ])
})

it('keeps page order within a day', async () => {
  const secondOnPage = { ...article, title: 'Second on page', url: 'https://edition.cnn.com/second' }
  stubArticles([article, secondOnPage])

  render(<App />)

  await screen.findByText(secondOnPage.title)
  const titles = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
  expect(titles).toEqual([article.title, secondOnPage.title])
})

it('shows each article under its day', async () => {
  stubArticles([article, olderArticle])

  render(<App />)

  await screen.findByText(article.title)
  const day = daySection('Friday, October 30, 2026')
  expect(day.getByText(article.title)).toBeTruthy()
  expect(day.getByRole('img', { name: article.imageAlt }).getAttribute('src')).toBe(article.imageUrl)
  expect(day.getByText(article.publishedOn)).toBeTruthy()
  const link = day.getByRole('link', { name: article.url })
  expect(link.getAttribute('href')).toBe(article.url)
  expect(link.getAttribute('target')).toBe('_blank')
  expect(day.queryByText(olderArticle.title)).toBeNull()
  expect(daySection('Wednesday, October 28, 2026').getByText(olderArticle.title)).toBeTruthy()
  expect(fetch).toHaveBeenCalledWith('/api/headlines')
})

it('shows no image placeholder when url is null', async () => {
  stubArticles([{ ...article, imageUrl: null, imageAlt: '' }])

  render(<App />)

  expect(await screen.findByText('No image')).toBeTruthy()
  expect(screen.queryByRole('img')).toBeNull()
})

it('shows no image placeholder when image fails', async () => {
  stubArticles([article])

  render(<App />)

  fireEvent.error(await screen.findByRole('img', { name: article.imageAlt }))

  expect(await screen.findByText('No image')).toBeTruthy()
  expect(screen.queryByRole('img')).toBeNull()
})

it('shows loading message', () => {
  vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))

  render(<App />)

  expect(screen.getByText('Loading headlines…')).toBeTruthy()
})

it('shows empty message', async () => {
  stubArticles([])

  render(<App />)

  expect(await screen.findByText('No sports articles published this week yet.')).toBeTruthy()
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
