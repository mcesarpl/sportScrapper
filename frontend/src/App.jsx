import { useEffect, useState } from 'react'

async function fetchHeadlines() {
  const response = await fetch('/api/headlines')
  if (!response.ok) throw new Error(`Backend responded with status ${response.status}`)
  return response.json()
}

export default function App() {
  const [articles, setArticles] = useState(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    fetchHeadlines()
      .then((data) => setArticles(data.articles))
      .catch(() => setHasError(true))
  }, [])

  return (
    <main>
      <h1>Today's Sports Headlines</h1>

      {hasError && <p>Couldn't load headlines from CNN.</p>}
      {!hasError && articles === null && <p>Loading headlines…</p>}
      {articles?.length === 0 && <p>No sports articles published today yet.</p>}

      {articles?.length > 0 && (
        <ul>
          {articles.map((article) => (
            <li key={article.url}>
              <h2>{article.title}</h2>
              <a href={article.url} target="_blank" rel="noreferrer">
                {article.url}
              </a>
              <time dateTime={article.publishedOn}>{article.publishedOn}</time>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
