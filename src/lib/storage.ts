import type { AppData, Profile } from '../types'

const KEY = 'doing.app.v1'

export const DEFAULT_PROFILE: Profile = {
  name: '',
  birthDate: '',
  birthHour: null,
  locale: 'en',
  pro: false,
  wakeStart: 8,
  wakeEnd: 23,
  morningCall: { enabled: false, time: '07:30', genre: 'lofi' },
  messageTtlMinutes: 60,
}

export function defaultData(): AppData {
  return {
    version: 1,
    onboarded: false,
    profile: { ...DEFAULT_PROFILE },
    checkins: [],
    sleep: { active: false, since: null },
    friends: [],
    messages: [],
  }
}

export function load(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultData()
    const parsed = JSON.parse(raw) as Partial<AppData>
    const base = defaultData()
    // Shallow-merge so newly added fields get sensible defaults across versions.
    return {
      ...base,
      ...parsed,
      profile: { ...base.profile, ...(parsed.profile ?? {}) },
      sleep: { ...base.sleep, ...(parsed.sleep ?? {}) },
      checkins: parsed.checkins ?? [],
      friends: parsed.friends ?? [],
      messages: parsed.messages ?? [],
    }
  } catch {
    return defaultData()
  }
}

export function save(data: AppData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // Storage full or unavailable — fail quietly; the in-memory state still works.
  }
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}
