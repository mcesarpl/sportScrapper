import DaySection from './components/DaySection.jsx'
import { groupByDay } from './group-by-day.js'
import { useHeadlines } from './hooks/useHeadlines.js'

export default function App() {
  const { articles, hasError } = useHeadlines()
  const isLoading = articles === null && !hasError

  return (
    <main>
      <h1>This Week's Sports Headlines</h1>

      {hasError && <p>Couldn't load headlines from CNN.</p>}
      {isLoading && <p>Loading headlines…</p>}
      {articles?.length === 0 && <p>No sports articles published this week yet.</p>}

      {articles &&
        groupByDay(articles).map((group) => (
          <DaySection key={group.day} day={group.day} articles={group.articles} />
        ))}
    </main>
  )
}
