function parse(day) {
  // The time keeps the date local; a bare date string would be read as UTC.
  return new Date(`${day}T00:00:00`)
}

function monthDay(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatRange(from, to) {
  const start = parse(from)
  const end = parse(to)
  const startYear = start.getFullYear()
  const endYear = end.getFullYear()

  if (startYear === endYear) {
    return `${monthDay(start)} – ${monthDay(end)}, ${endYear}`
  }
  return `${monthDay(start)}, ${startYear} – ${monthDay(end)}, ${endYear}`
}
