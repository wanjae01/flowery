import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { applyRetention } from '../lib/retention'
import { hourLabel, localDayIso } from '../lib/time'
import { MOOD_EMOJI } from './common'

export function CalendarScreen() {
  const { state, t } = useStore()
  const locale = state.profile.locale
  const today = new Date()
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selected, setSelected] = useState<string>(localDayIso(Date.now()))

  const visible = useMemo(
    () => applyRetention(state.checkins, state.profile, Date.now()).visible,
    [state.checkins, state.profile],
  )

  const countByDay = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of visible) m.set(localDayIso(c.hour), (m.get(localDayIso(c.hour)) ?? 0) + 1)
    return m
  }, [visible])

  const cells = useMemo(() => {
    const first = new Date(view.year, view.month, 1)
    const startPad = first.getDay()
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
    const out: (number | null)[] = []
    for (let i = 0; i < startPad; i++) out.push(null)
    for (let d = 1; d <= daysInMonth; d++) out.push(d)
    return out
  }, [view])

  const selectedEntries = useMemo(
    () => visible.filter((c) => localDayIso(c.hour) === selected).sort((a, b) => a.hour - b.hour),
    [visible, selected],
  )

  const weekdays = useMemo(() => {
    const base = new Date(2024, 0, 7) // a Sunday
    return Array.from({ length: 7 }, (_, i) =>
      new Date(base.getFullYear(), base.getMonth(), base.getDate() + i).toLocaleDateString(locale, {
        weekday: 'narrow',
      }),
    )
  }, [locale])

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  })

  function shift(delta: number) {
    const d = new Date(view.year, view.month + delta, 1)
    setView({ year: d.getFullYear(), month: d.getMonth() })
  }

  const todayIso = localDayIso(Date.now())
  const maxCount = Math.max(1, ...countByDay.values())

  return (
    <>
      <h1 className="screen-title">{t('cal.title')}</h1>
      <p className="tagline">{t('cal.legend')}</p>

      <div className="card">
        <div className="cal-nav">
          <button className="btn ghost" onClick={() => shift(-1)}>
            ‹
          </button>
          <strong>{monthLabel}</strong>
          <button className="btn ghost" onClick={() => shift(1)}>
            ›
          </button>
        </div>
        <div className="cal-grid">
          {weekdays.map((w, i) => (
            <div className="cal-head" key={i}>
              {w}
            </div>
          ))}
          {cells.map((d, i) => {
            if (d === null) return <div className="cal-cell empty" key={`e${i}`} />
            const iso = `${view.year}-${String(view.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
            const count = countByDay.get(iso) ?? 0
            const intensity = count ? 0.15 + 0.55 * (count / maxCount) : 0
            return (
              <button
                key={iso}
                className={`cal-cell${iso === todayIso ? ' today' : ''}${iso === selected ? ' sel' : ''}`}
                style={count ? { background: `rgba(139,124,255,${intensity})` } : undefined}
                onClick={() => setSelected(iso)}
              >
                {d}
                {count > 0 && <span className="count">{count}</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="card">
        <h3>{t('cal.entriesOn', { date: selected })}</h3>
        {selectedEntries.length === 0 ? (
          <p className="muted">{t('cal.noEntries')}</p>
        ) : (
          selectedEntries.map((c) => (
            <div className="entry" key={c.id}>
              <div className="time">{hourLabel(c.hour, locale)}</div>
              <div className="body">
                <span className="emoji">{MOOD_EMOJI[c.mood]}</span> {c.text}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
