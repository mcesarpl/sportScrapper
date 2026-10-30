import ArticleImage from './ArticleImage.jsx'

export default function ArticleCard({ article }) {
  return (
    <li>
      <ArticleImage url={article.imageUrl} alt={article.imageAlt} />
      <h3>{article.title}</h3>
      <a href={article.url} target="_blank" rel="noreferrer">
        {article.url}
      </a>
      <time dateTime={article.publishedOn}>{article.publishedOn}</time>
    </li>
  )
}
