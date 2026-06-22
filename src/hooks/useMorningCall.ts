import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store'
import { playMorningCall, stopMorningCall, type Genre } from '../lib/audio'

/**
 * Watches the clock and triggers the morning call when the wake time arrives.
 * Also ends sleep mode so the hourly loop resumes for the day.
 */
export function useMorningCall() {
  const { state, dispatch } = useStore()
  const [ringing, setRinging] = useState(false)
  const firedFor = useRef<string>('') // "yyyy-mm-dd HH:MM" already rung today

  const live = useRef(state)
  live.current = state

  useEffect(() => {
    const tick = () => {
      const s = live.current
      const mc = s.profile.morningCall
      if (!mc.enabled) return
      const now = new Date()
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      if (hhmm !== mc.time) return
      const stamp = `${now.toDateString()} ${hhmm}`
      if (firedFor.current === stamp) return
      firedFor.current = stamp

      if (s.sleep.active) dispatch({ type: 'sleepOff' })
      if (playMorningCall(mc.genre as Genre)) setRinging(true)
    }
    const id = window.setInterval(tick, 15_000)
    return () => window.clearInterval(id)
  }, [dispatch])

  function dismiss() {
    stopMorningCall()
    setRinging(false)
  }

  return { ringing, dismiss }
}
