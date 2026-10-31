import DaySection from './components/DaySection.jsx'
import Hero from './components/Hero.jsx'
import TopBar from './components/TopBar.jsx'
import { groupByDay } from './group-by-day.js'
import { useHeadlines } from './hooks/useHeadlines.js'

export default function App() {
  const { articles, range, hasError } = useHeadlines()
  const isLoading = articles === null && !hasError

  return (
    <>
      <TopBar />
      <main>
        <Hero range={range} />

        <div id="headlines">
          {hasError && <p>Couldn't load headlines from CNN.</p>}
          {isLoading && <p>Loading headlines…</p>}
          {articles?.length === 0 && <p>No sports articles published this week yet.</p>}

          {articles &&
            groupByDay(articles).map((group) => (
              <DaySection key={group.day} day={group.day} articles={group.articles} />
            ))}
        </div>
      </main>
    </>
  )
}
