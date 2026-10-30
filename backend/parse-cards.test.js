import { describe, expect, it } from 'vitest'
import { parseCards } from './parse-cards.js'

const IMAGE_URL = 'https://media.cnn.com/api/v1/images/stellar/prod/photo.jpg?c=16x9&q=h_144,w_256,c_fill'

function card(href, headline, image = `<img src="${IMAGE_URL}" alt="A photo" />`) {
  return `
    <li class="card container__item" data-open-link="${href}">
      <a href="${href}" class="container__link"><div class="image">${image}</div></a>
      <a href="${href}" class="container__link">
        <div class="container__headline">
          <span class="container__headline-text" data-editable="headline">${headline}</span>
        </div>
      </a>
    </li>`
}

describe('parseCards', () => {
  it('returns every article field', () => {
    const html = card('/2026/10/30/sport/packers-watson', 'Packers&#x2019; Watson &amp; the &quot;return&quot;')

    expect(parseCards(html)).toEqual([
      {
        title: 'Packers’ Watson & the "return"',
        url: 'https://edition.cnn.com/2026/10/30/sport/packers-watson',
        publishedOn: '2026-10-30',
        imageUrl: IMAGE_URL,
        imageAlt: 'A photo',
      },
    ])
  })

  it('returns null image when card has none', () => {
    const html = card('/2026/10/30/sport/an-article', 'No picture', '')

    expect(parseCards(html)[0]).toMatchObject({ imageUrl: null, imageAlt: '' })
  })

  it('returns an empty alt when the image has none', () => {
    const html = card('/2026/10/30/sport/an-article', 'No alt', `<img src="${IMAGE_URL}" />`)

    expect(parseCards(html)[0]).toMatchObject({ imageUrl: IMAGE_URL, imageAlt: '' })
  })

  it('takes each image from its own card', () => {
    const html = [
      card('/2026/10/30/sport/first', 'First', '<img src="https://media.cnn.com/first.jpg" alt="First" />'),
      card('/2026/10/30/sport/second', 'Second', '<img src="https://media.cnn.com/second.jpg" alt="Second" />'),
    ].join('')

    expect(parseCards(html).map((article) => article.imageUrl)).toEqual([
      'https://media.cnn.com/first.jpg',
      'https://media.cnn.com/second.jpg',
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

    const articles = parseCards(html)

    expect(articles).toHaveLength(1)
    expect(articles[0]).toMatchObject({
      title: 'First card',
      url: 'https://edition.cnn.com/2026/10/30/sport/an-article',
    })
  })

  it('ignores links that are not valid addresses', () => {
    expect(parseCards(card('https://', 'Broken link'))).toEqual([])
  })
})
