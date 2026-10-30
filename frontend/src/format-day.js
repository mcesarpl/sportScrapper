export function formatDay(day) {
  // The time keeps the date local; a bare date string would be read as UTC.
  return new Date(`${day}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
