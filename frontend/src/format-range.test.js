import process from 'node:process'
import { beforeAll, expect, it } from 'vitest'
import { formatRange } from './format-range.js'

beforeAll(() => {
  // West of UTC, so reading a bare date as UTC would show the previous day.
  process.env.TZ = 'America/Sao_Paulo'
})

it('formats a range inside one year', () => {
  expect(formatRange('2026-10-24', '2026-10-30')).toBe('Oct 24 – Oct 30, 2026')
})

it('formats a range across a year end', () => {
  expect(formatRange('2026-12-27', '2027-01-02')).toBe('Dec 27, 2026 – Jan 2, 2027')
})
