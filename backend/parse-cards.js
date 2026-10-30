import * as cheerio from 'cheerio'

const CNN_ORIGIN = 'https://edition.cnn.com'
const CNN_HOSTS = ['edition.cnn.com', 'www.cnn.com']
const ARTICLE_PATH = /^\/(\d{4})\/(\d{2})\/(\d{2})\/sport\//

// The path alone identifies an article, whatever query or fragment the link carries.
function articlePath(href) {
  const url = URL.parse(href, CNN_ORIGIN)
  if (!CNN_HOSTS.includes(url?.hostname)) return null

  const path = url.pathname.replace(/\/$/, '')
  const isArticle = ARTICLE_PATH.test(path) && !path.includes('/video/') && !path.includes('/gallery/')
  return isArticle ? path : null
}

function publishedOn(path) {
  const [, year, month, day] = path.match(ARTICLE_PATH)
  return `${year}-${month}-${day}`
}

function cardImage(card) {
  const image = card.find('img').first()
  return { imageUrl: image.attr('src') ?? null, imageAlt: image.attr('alt') ?? '' }
}

export function parseCards(html) {
  const $ = cheerio.load(html)
  const articles = new Map()

  $('a[href]').each((_, element) => {
    const link = $(element)
    const path = articlePath(link.attr('href'))
    // A card has an image link and a headline link; only the second has a title.
    const title = link.find('.container__headline-text').text().trim()
    if (!path || !title || articles.has(path)) return

    articles.set(path, {
      title,
      url: CNN_ORIGIN + path,
      publishedOn: publishedOn(path),
      ...cardImage(link.closest('.card')),
    })
  })

  return [...articles.values()]
}
