export function groupByDay(articles) {
  const groups = Object.groupBy(articles, (article) => article.publishedOn)
  const days = Object.keys(groups).sort().reverse()
  return days.map((day) => ({ day, articles: groups[day] }))
}

export function formatDay(day) {
  // The time keeps the date local; a bare date string would be read as UTC.
  return new Date(`${day}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
