import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { hourLabel, isWaking } from '../lib/time'
import { MoodPicker } from './common'
import type { Mood } from '../types'

export function NowScreen({ hour }: { hour: number }) {
  const { state, dispatch, t } = useStore()
  const existing = state.checkins.find((c) => c.hour === hour)

  const [text, setText] = useState('')
  const [mood, setMood] = useState<Mood>('neutral')
  const [tags, setTags] = useState('')

  // Reload the form whenever the active hour or its stored entry changes.
  useEffect(() => {
    setText(existing?.text ?? '')
    setMood(existing?.mood ?? 'neutral')
    setTags(existing?.tags.join(', ') ?? '')
  }, [hour, existing?.id])

  if (state.sleep.active) {
    return (
      <div className="card sleep-card">
        <div className="sleep-moon">🌙</div>
        <h3>{t('now.sleeping')}</h3>
        <p className="muted">{t('now.sleepingBody')}</p>
        <button className="btn primary" onClick={() => dispatch({ type: 'sleepOff' })}>
          {t('now.wake')}
        </button>
      </div>
    )
  }

  const hod = new Date(hour).getHours()
  const waking = isWaking(hod, state.profile.wakeStart, state.profile.wakeEnd)

  function save() {
    const parsedTags = tags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    dispatch({ type: 'upsertCheckin', hour, text: text.trim(), mood, tags: parsedTags })
  }

  return (
    <>
      <div className="now-hero">
        <div className="now-hour">{hourLabel(hour, state.profile.locale)}</div>
        <p className="tagline">{t('now.question')}</p>
      </div>

      {!waking && <div className="pill" style={{ marginBottom: 12 }}>🌗 {t('now.outsideWake')}</div>}
      {existing && <div className="pill" style={{ marginBottom: 12 }}>✓ {t('now.logged')}</div>}

      <div className="card">
        <div className="field">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('now.placeholder')}
            autoFocus
          />
        </div>
        <div className="field">
          <MoodPicker value={mood} onChange={setMood} t={t} />
        </div>
        <div className="field">
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t('now.tagsPh')} />
        </div>
        <div className="row">
          <button className="btn primary" onClick={save} disabled={!text.trim()}>
            {existing ? t('now.update') : t('now.save')}
          </button>
          {existing && (
            <span className="muted" style={{ fontSize: '0.85rem' }}>
              {t('now.saved', { time: hourLabel(existing.createdAt, state.profile.locale) })}
            </span>
          )}
        </div>
      </div>

      <button className="btn ghost block" onClick={() => dispatch({ type: 'sleepOn' })}>
        🌙 {t('now.sleepNow')}
      </button>
      <div className="hint" style={{ textAlign: 'center' }}>
        {t('now.sleepHint')}
      </div>
    </>
  )
}
