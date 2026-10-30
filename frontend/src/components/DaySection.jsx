import { formatDay } from '../format-day.js'
import ArticleCard from './ArticleCard.jsx'

export default function DaySection({ day, articles }) {
  return (
    <section>
      <h2>{formatDay(day)}</h2>
      <ul>
        {articles.map((article) => (
          <ArticleCard key={article.url} article={article} />
        ))}
      </ul>
    </section>
  )
}
