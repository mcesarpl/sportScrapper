const DAYS_BEFORE_TODAY = 6

export function localDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function weekRange(today) {
  const firstDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - DAYS_BEFORE_TODAY)
  return { from: localDate(firstDay), to: localDate(today) }
}

export function filterToWeek(articles, { from, to }) {
  return articles.filter((article) => article.publishedOn >= from && article.publishedOn <= to)
}

export function sortNewestFirst(articles) {
  return articles.toSorted((first, second) => second.publishedOn.localeCompare(first.publishedOn))
}
