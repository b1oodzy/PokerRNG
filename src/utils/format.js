/**
 * Formats a number with K/M/B/T suffixes, 2 decimal places.
 * e.g. 5270 → "5.27K", 8110000000 → "8.11B"
 * Values below 1000 are shown as plain integers.
 */
export function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '0'
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000_000_000) return sign + (abs / 1_000_000_000_000).toFixed(2) + 'T'
  if (abs >= 1_000_000_000)     return sign + (abs / 1_000_000_000).toFixed(2) + 'B'
  if (abs >= 1_000_000)         return sign + (abs / 1_000_000).toFixed(2) + 'M'
  if (abs >= 1_000)             return sign + (abs / 1_000).toFixed(2) + 'K'
  return sign + Math.round(abs).toString()
}