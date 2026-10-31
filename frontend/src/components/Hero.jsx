import { formatRange } from '../format-range.js'

export default function Hero({ range }) {
  return (
    <div className="hero">
      {range && <p className="pill">{formatRange(range.from, range.to)}</p>}
      <h1>
        This Week's Sports Headlines<span className="cursor" aria-hidden="true">_</span>
      </h1>
      <p className="description">The last 7 days of CNN Sport, gathered in one place.</p>
      <a className="button" href="#headlines">
        See headlines
      </a>
    </div>
  )
}
