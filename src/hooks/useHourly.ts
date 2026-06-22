import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store'
import { floorToHour, isWaking } from '../lib/time'

export type NotifPermission = 'default' | 'granted' | 'denied' | 'unsupported'

function currentPermission(): NotifPermission {
  if (typeof Notification === 'undefined') return 'unsupported'
  return Notification.permission as NotifPermission
}

/**
 * Drives the hourly check-in loop: tracks the current hour, and fires a single
 * browser notification when a new waking hour begins (unless sleeping).
 */
export function useHourly() {
  const { state, t } = useStore()
  const [hour, setHour] = useState(() => floorToHour(Date.now()))
  const [permission, setPermission] = useState<NotifPermission>(currentPermission)
  const lastNotified = useRef<number>(0)

  // Keep these in a ref so the interval always sees fresh values without resubscribing.
  const live = useRef(state)
  live.current = state

  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      const thisHour = floorToHour(now)
      setHour((prev) => (prev === thisHour ? prev : thisHour))

      const s = live.current
      const hod = new Date(now).getHours()
      const waking = isWaking(hod, s.profile.wakeStart, s.profile.wakeEnd)
      const already = s.checkins.some((c) => c.hour === thisHour)

      if (
        currentPermission() === 'granted' &&
        !s.sleep.active &&
        waking &&
        !already &&
        lastNotified.current !== thisHour
      ) {
        lastNotified.current = thisHour
        try {
          new Notification(t('now.question'), { body: t('app.tagline'), tag: 'doing-hourly' })
        } catch {
          /* notifications may throw in some contexts; ignore */
        }
      }
    }

    tick()
    const id = window.setInterval(tick, 20_000)
    return () => window.clearInterval(id)
    // t is stable per locale; rebinding on locale change is fine.
  }, [t])

  async function requestPermission(): Promise<void> {
    if (typeof Notification === 'undefined') return
    try {
      const result = await Notification.requestPermission()
      setPermission(result as NotifPermission)
    } catch {
      setPermission(currentPermission())
    }
  }

  return { hour, permission, requestPermission }
}
