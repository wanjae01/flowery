/**
 * Four Pillars (사주, BaZi) engine.
 *
 * This computes the traditional sexagenary (60-cycle) day pillar from a
 * Gregorian date, derives the Five Elements (오행) and Ten Gods (십성)
 * relationship between today's energy and the user's "day master" (일간),
 * and turns that into a deterministic daily theme.
 *
 * It is a genuine, reproducible algorithm — not random — but it is offered
 * as reflective guidance, not literal prediction. See README for the honest
 * disclaimer that ships in the app's Settings screen.
 */

export const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const
export const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const

export const STEM_ROMAN = ['Gap', 'Eul', 'Byeong', 'Jeong', 'Mu', 'Gi', 'Gyeong', 'Sin', 'Im', 'Gye']
export const BRANCH_ROMAN = ['Ja', 'Chuk', 'In', 'Myo', 'Jin', 'Sa', 'O', 'Mi', 'Sin', 'Yu', 'Sul', 'Hae']
export const BRANCH_ANIMAL = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig']

export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water'

const STEM_ELEMENT: Element[] = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water']
const BRANCH_ELEMENT: Element[] = ['water', 'earth', 'wood', 'wood', 'earth', 'fire', 'fire', 'earth', 'metal', 'metal', 'earth', 'water']

/** Element that each element generates (상생 cycle). */
const GENERATES: Record<Element, Element> = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' }
/** Element that each element controls (상극 cycle). */
const CONTROLS: Record<Element, Element> = { wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood' }

export type TenGod =
  | 'bi-gyeon' | 'geop-jae'
  | 'sik-sin' | 'sang-gwan'
  | 'pyeon-jae' | 'jeong-jae'
  | 'pyeon-gwan' | 'jeong-gwan'
  | 'pyeon-in' | 'jeong-in'

/** Julian Day Number for a Gregorian date (Fliegel & Van Flandern). */
function julianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  )
}

export interface Pillar {
  stem: number // 0-9
  branch: number // 0-11
}

/** The sexagenary day pillar for a given local date. */
export function dayPillar(date: Date): Pillar {
  const jdn = julianDayNumber(date.getFullYear(), date.getMonth() + 1, date.getDate())
  // Offset aligns JDN with the traditional 60-day cycle (0 = 갑자 / Gap-Ja).
  const cycle = ((jdn + 49) % 60 + 60) % 60
  return { stem: cycle % 10, branch: cycle % 12 }
}

export function stemElement(stem: number): Element {
  return STEM_ELEMENT[stem]
}

export function branchElement(branch: number): Element {
  return BRANCH_ELEMENT[branch]
}

/** Yang stems sit at even indices, yin at odd. */
export function isYang(stem: number): boolean {
  return stem % 2 === 0
}

/**
 * The Ten God relationship of `other` as seen from the `dayMaster` stem.
 * This is the heart of personalised daily advice.
 */
export function tenGod(dayMaster: number, other: number): TenGod {
  const dm = STEM_ELEMENT[dayMaster]
  const ot = STEM_ELEMENT[other]
  const samePolarity = isYang(dayMaster) === isYang(other)

  if (dm === ot) return samePolarity ? 'bi-gyeon' : 'geop-jae'
  if (GENERATES[dm] === ot) return samePolarity ? 'sik-sin' : 'sang-gwan' // I produce it
  if (CONTROLS[dm] === ot) return samePolarity ? 'pyeon-jae' : 'jeong-jae' // I control it
  if (CONTROLS[ot] === dm) return samePolarity ? 'pyeon-gwan' : 'jeong-gwan' // it controls me
  return samePolarity ? 'pyeon-in' : 'jeong-in' // it produces me
}

/** The element that supports (generates) a given day master — its "resource". */
export function favorableElement(dayMaster: number): Element {
  const dm = STEM_ELEMENT[dayMaster]
  // Find x such that x generates dm.
  return (Object.keys(GENERATES) as Element[]).find((e) => GENERATES[e] === dm)!
}

export interface DailyReading {
  iso: string
  day: Pillar
  dayElement: Element
  /** Present only when the user has supplied a birth date. */
  dayMaster?: Pillar
  tenGod?: TenGod
  favorable?: Element
  /** A 1-5 "alignment" derived deterministically from the pairing. */
  alignment: number
}

function parseLocalDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return Number.isNaN(d.getTime()) ? null : d
}

/** Deterministic 1-5 alignment from a day master / day-of pairing. */
function alignmentScore(reading: { tenGod?: TenGod; dayElement: Element; favorable?: Element }): number {
  if (!reading.tenGod) return 3
  // Resource & wealth days score higher, clash days lower — a simple, stable heuristic.
  const weights: Record<TenGod, number> = {
    'jeong-in': 5, 'pyeon-in': 4,
    'jeong-jae': 5, 'pyeon-jae': 4,
    'sik-sin': 4, 'sang-gwan': 3,
    'jeong-gwan': 4, 'pyeon-gwan': 2,
    'bi-gyeon': 3, 'geop-jae': 2,
  }
  let score = weights[reading.tenGod]
  if (reading.favorable && reading.favorable === reading.dayElement) score = Math.min(5, score + 1)
  return score
}

export function readingForDate(date: Date, birthIso?: string): DailyReading {
  const day = dayPillar(date)
  const dayElement = stemElement(day.stem)
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  const birth = birthIso ? parseLocalDate(birthIso) : null
  if (!birth) {
    return { iso, day, dayElement, alignment: alignmentScore({ dayElement }) }
  }

  const dayMaster = dayPillar(birth)
  const god = tenGod(dayMaster.stem, day.stem)
  const favorable = favorableElement(dayMaster.stem)
  return {
    iso,
    day,
    dayElement,
    dayMaster,
    tenGod: god,
    favorable,
    alignment: alignmentScore({ tenGod: god, dayElement, favorable }),
  }
}

export function pillarLabel(p: Pillar): string {
  return `${STEMS[p.stem]}${BRANCHES[p.branch]}`
}

export function pillarRoman(p: Pillar): string {
  return `${STEM_ROMAN[p.stem]}-${BRANCH_ROMAN[p.branch]}`
}
