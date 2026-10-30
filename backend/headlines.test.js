import { beforeAll, describe, expect, it } from 'vitest'
import { localDate, parseCards, todaysArticles } from './headlines.js'

function card(href, headline) {
  return `
    <li class="card container__item" data-open-link="${href}">
      <a href="${href}" class="container__link"><div class="image"></div></a>
      <a href="${href}" class="container__link">
        <div class="container__headline">
          <span class="container__headline-text" data-editable="headline">${headline}</span>
        </div>
      </a>
    </li>`
}

describe('parseCards', () => {
  it('returns decoded title absolute url and date', () => {
    const html = card('/2026/10/30/sport/packers-watson', 'Packers&#x2019; Watson &amp; the &quot;return&quot;')

    expect(parseCards(html)).toEqual([
      {
        title: 'Packers’ Watson & the "return"',
        url: 'https://edition.cnn.com/2026/10/30/sport/packers-watson',
        publishedOn: '2026-10-30',
      },
    ])
  })

  it('selects articles and live blogs only', () => {
    const html = [
      card('/2026/10/30/sport/an-article', 'An article'),
      card('/2026/10/30/sport/live-news/game-5', 'A live blog'),
      card('/2026/10/30/sport/video/a-clip-vrtc', 'A video'),
      card('/2026/10/30/sport/gallery/some-photos', 'A gallery'),
      card('/2026/10/30/politics/not-sport', 'Another section'),
      card('/sport/football', 'A section page'),
      card('/style/2026/10/30/sport/nested-path', 'A path that only contains the pattern'),
      card('https://example.com/2026/10/30/sport/another-site', 'Another site'),
    ].join('')

    expect(parseCards(html).map((article) => article.title)).toEqual(['An article', 'A live blog'])
  })

  it('selects articles and live blogs only from absolute and protocol-relative links', () => {
    const html = [
      card('https://edition.cnn.com/2026/10/30/sport/absolute', 'Absolute'),
      card('//edition.cnn.com/2026/10/30/sport/protocol-relative', 'Protocol relative'),
      card('https://www.cnn.com/2026/10/30/sport/www-host', 'Www host'),
      card('https://edition.cnn.com/2026/10/30/sport/video/a-clip', 'A video'),
    ].join('')

    expect(parseCards(html).map((article) => article.url)).toEqual([
      'https://edition.cnn.com/2026/10/30/sport/absolute',
      'https://edition.cnn.com/2026/10/30/sport/protocol-relative',
      'https://edition.cnn.com/2026/10/30/sport/www-host',
    ])
  })

  it('returns duplicate links once', () => {
    const html = [
      card('/2026/10/30/sport/an-article', 'First card'),
      card('/2026/10/30/sport/an-article', 'Second card'),
    ].join('')

    expect(parseCards(html)).toHaveLength(1)
  })

  it('returns duplicate links once when only the query, fragment or trailing slash differs', () => {
    const html = [
      card('/2026/10/30/sport/an-article', 'First card'),
      card('/2026/10/30/sport/an-article?iid=cnn_buildContentRecirc', 'Query'),
      card('/2026/10/30/sport/an-article#comments', 'Fragment'),
      card('/2026/10/30/sport/an-article/', 'Trailing slash'),
    ].join('')

    expect(parseCards(html)).toEqual([
      {
        title: 'First card',
        url: 'https://edition.cnn.com/2026/10/30/sport/an-article',
        publishedOn: '2026-10-30',
      },
    ])
  })
})

describe('todaysArticles', () => {
  const yesterday = { title: 'Old', url: 'old', publishedOn: '2026-10-29' }
  const today = { title: 'New', url: 'new', publishedOn: '2026-10-30' }
  const tomorrow = { title: 'Next', url: 'next', publishedOn: '2026-10-31' }

  it('keeps only cards dated today', () => {
    expect(todaysArticles([yesterday, today, tomorrow], '2026-10-30')).toEqual([today])
  })
})

describe('localDate', () => {
  beforeAll(() => {
    process.env.TZ = 'America/Sao_Paulo'
  })

  it('keeps only cards dated today in the backend timezone', () => {
    // 01:30 UTC on the 31st is still 22:30 on the 30th in Sao Paulo.
    expect(localDate(new Date('2026-10-31T01:30:00Z'))).toBe('2026-10-30')
  })

  it('keeps only cards dated today across a month and year end in the backend timezone', () => {
    expect(localDate(new Date('2026-11-01T01:30:00Z'))).toBe('2026-10-31')
    expect(localDate(new Date('2027-01-01T01:30:00Z'))).toBe('2026-12-31')
  })
})
