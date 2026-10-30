import { beforeAll, describe, expect, it } from 'vitest'
import { filterToWeek, localDate, sortNewestFirst, weekRange } from './dates.js'

beforeAll(() => {
  process.env.TZ = 'America/Sao_Paulo'
})

describe('localDate', () => {
  it('uses the backend timezone, not UTC', () => {
    // 01:30 UTC on the 31st is still 22:30 on the 30th in Sao Paulo.
    expect(localDate(new Date('2026-10-31T01:30:00Z'))).toBe('2026-10-30')
  })

  it('uses the backend timezone across a month and year end', () => {
    expect(localDate(new Date('2026-11-01T01:30:00Z'))).toBe('2026-10-31')
    expect(localDate(new Date('2027-01-01T01:30:00Z'))).toBe('2026-12-31')
  })
})

describe('weekRange', () => {
  it('week start is six days before today', () => {
    expect(weekRange(new Date(2026, 9, 30, 12))).toEqual({ from: '2026-10-24', to: '2026-10-30' })
  })

  it('week start is six days before today across a month end', () => {
    expect(weekRange(new Date(2026, 10, 3, 12))).toEqual({ from: '2026-10-28', to: '2026-11-03' })
  })

  it('week start is six days before today across a year end', () => {
    expect(weekRange(new Date(2027, 0, 2, 12))).toEqual({ from: '2026-12-27', to: '2027-01-02' })
  })
})

describe('filterToWeek', () => {
  const week = { from: '2026-10-24', to: '2026-10-30' }

  it('keeps only articles in the week, including both ends', () => {
    const articles = [
      { publishedOn: '2026-10-23' },
      { publishedOn: '2026-10-24' },
      { publishedOn: '2026-10-27' },
      { publishedOn: '2026-10-30' },
      { publishedOn: '2026-10-31' },
    ]

    expect(filterToWeek(articles, week).map((article) => article.publishedOn)).toEqual([
      '2026-10-24',
      '2026-10-27',
      '2026-10-30',
    ])
  })
})

describe('sortNewestFirst', () => {
  it('sorts newest day first keeping page order within a day', () => {
    const articles = [
      { title: 'Old', publishedOn: '2026-10-24' },
      { title: 'New first on page', publishedOn: '2026-10-30' },
      { title: 'Middle', publishedOn: '2026-10-27' },
      { title: 'New second on page', publishedOn: '2026-10-30' },
    ]

    expect(sortNewestFirst(articles).map((article) => article.title)).toEqual([
      'New first on page',
      'New second on page',
      'Middle',
      'Old',
    ])
  })
})
