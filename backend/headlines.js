import { filterToWeek, sortNewestFirst, weekRange } from './dates.js'
import { parseCards } from './parse-cards.js'

export const CNN_SPORT_URL = 'https://edition.cnn.com/sport'
const TIMEOUT_MS = 10000

async function fetchSportPage() {
  const response = await fetch(CNN_SPORT_URL, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!response.ok) throw new Error(`CNN responded with status ${response.status}`)
  return response.text()
}

export async function getHeadlines() {
  const articles = parseCards(await fetchSportPage())
  if (articles.length === 0) throw new Error('CNN page has no article cards')

  const week = weekRange(new Date())
  return { ...week, articles: sortNewestFirst(filterToWeek(articles, week)) }
}
