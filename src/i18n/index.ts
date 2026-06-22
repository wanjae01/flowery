import { FALLBACK, LOCALES } from './strings'

export type TFn = (key: string, vars?: Record<string, string | number>) => string

function interpolate(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`))
}

/** Build a translator for a locale, falling back to English for missing keys. */
export function makeT(locale: string): TFn {
  const found = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]
  return (key, vars) => {
    const raw = found.dict[key] ?? FALLBACK[key] ?? key
    return interpolate(raw, vars)
  }
}

export { LOCALES }
