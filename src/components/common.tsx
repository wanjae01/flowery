import type { Mood } from '../types'
import { MOODS } from '../types'
import type { TFn } from '../i18n'

export const MOOD_EMOJI: Record<Mood, string> = {
  great: '🤩',
  good: '🙂',
  neutral: '😐',
  low: '😕',
  bad: '😣',
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      className={`switch${on ? ' on' : ''}`}
      aria-pressed={on}
      onClick={() => onChange(!on)}
    />
  )
}

export function MoodPicker({ value, onChange, t }: { value: Mood; onChange: (m: Mood) => void; t: TFn }) {
  return (
    <div className="moods">
      {MOODS.map((m) => (
        <button
          key={m}
          type="button"
          className={`mood${value === m ? ' sel' : ''}`}
          onClick={() => onChange(m)}
        >
          <span className="emoji">{MOOD_EMOJI[m]}</span>
          {t(`mood.${m}`)}
        </button>
      ))}
    </div>
  )
}
