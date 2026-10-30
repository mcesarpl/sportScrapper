import * as cheerio from 'cheerio'

const CNN_ORIGIN = 'https://edition.cnn.com'
const CNN_HOSTS = ['edition.cnn.com', 'www.cnn.com']
const ARTICLE_PATH = /^\/(\d{4})\/(\d{2})\/(\d{2})\/sport\//

export function localDate(now = new Date()) {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function parseCards(html) {
  const $ = cheerio.load(html)
  const cards = new Map()

  $('a[href]').each((_, link) => {
    const href = URL.parse($(link).attr('href'), CNN_ORIGIN)
    if (!CNN_HOSTS.includes(href?.hostname)) return

    // The path alone identifies an article, whatever query or fragment the link carries.
    const path = href.pathname.replace(/\/$/, '')
    const match = path.match(ARTICLE_PATH)
    if (!match || path.includes('/video/') || path.includes('/gallery/')) return

    // A card has an image link and a headline link; only the second has a title.
    const title = $(link).find('.container__headline-text').text().trim()
    if (!title || cards.has(path)) return

    const [, year, month, day] = match
    cards.set(path, { title, url: CNN_ORIGIN + path, publishedOn: `${year}-${month}-${day}` })
  })

  return [...cards.values()]
}

export function todaysArticles(cards, today) {
  return cards.filter((card) => card.publishedOn === today)
}
