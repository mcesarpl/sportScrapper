export function groupByDay(articles) {
  const groups = Object.groupBy(articles, (article) => article.publishedOn)
  const days = Object.keys(groups).sort().reverse()
  return days.map((day) => ({ day, articles: groups[day] }))
}
