/** Epoch ms floored to the top of its hour. */
export function floorToHour(ts: number): number {
  const d = new Date(ts)
  d.setMinutes(0, 0, 0)
  return d.getTime()
}

/** ISO yyyy-mm-dd for the local day of a timestamp. */
export function localDayIso(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function hourLabel(ts: number, locale: string): string {
  return new Date(ts).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
}

export function dayLabel(ts: number, locale: string): string {
  return new Date(ts).toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' })
}

export const DAY_MS = 24 * 60 * 60 * 1000
export const MONTH_MS = 30 * DAY_MS

/** Is the given hour-of-day within the user's waking window? Handles windows that wrap past midnight. */
export function isWaking(hour: number, start: number, end: number): boolean {
  if (start <= end) return hour >= start && hour < end
  return hour >= start || hour < end
}
