import { useEffect, useState } from 'react'

async function fetchHeadlines() {
  const response = await fetch('/api/headlines')
  if (!response.ok) throw new Error(`Backend responded with status ${response.status}`)
  return response.json()
}

export function useHeadlines() {
  const [articles, setArticles] = useState(null)
  const [range, setRange] = useState(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    fetchHeadlines()
      .then((data) => {
        setArticles(data.articles)
        setRange({ from: data.from, to: data.to })
      })
      .catch(() => setHasError(true))
  }, [])

  return { articles, range, hasError }
}
