import type { CheckIn, Profile } from '../types'
import { MONTH_MS } from './time'

/**
 * Free tier keeps ~1 month of history. Beyond that, entries are *hidden* (not
 * destroyed) and the app offers a Pro upgrade. Pro users see everything.
 */
export function retentionCutoff(now: number): number {
  return now - MONTH_MS
}

export interface RetentionView {
  visible: CheckIn[]
  hiddenCount: number
}

export function applyRetention(checkins: CheckIn[], profile: Profile, now: number): RetentionView {
  if (profile.pro) return { visible: checkins, hiddenCount: 0 }
  const cutoff = retentionCutoff(now)
  const visible = checkins.filter((c) => c.hour >= cutoff)
  return { visible, hiddenCount: checkins.length - visible.length }
}
