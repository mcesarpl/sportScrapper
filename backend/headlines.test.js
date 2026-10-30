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
    ].join('')

    expect(parseCards(html).map((article) => article.title)).toEqual(['An article', 'A live blog'])
  })

  it('returns duplicate links once', () => {
    const html = [
      card('/2026/10/30/sport/an-article', 'First card'),
      card('/2026/10/30/sport/an-article', 'Second card'),
    ].join('')

    expect(parseCards(html)).toHaveLength(1)
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
})
