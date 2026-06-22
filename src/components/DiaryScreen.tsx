import { useMemo } from 'react'
import { useStore } from '../store'
import { applyRetention } from '../lib/retention'
import { dayLabel, hourLabel, localDayIso } from '../lib/time'
import { MOOD_EMOJI } from './common'
import type { CheckIn } from '../types'

export function DiaryScreen({ onUpgrade }: { onUpgrade: () => void }) {
  const { state, dispatch, t } = useStore()

  const { visible, hiddenCount } = useMemo(
    () => applyRetention(state.checkins, state.profile, Date.now()),
    [state.checkins, state.profile],
  )

  const groups = useMemo(() => {
    const byDay = new Map<string, CheckIn[]>()
    for (const c of visible) {
      const key = localDayIso(c.hour)
      const arr = byDay.get(key) ?? []
      arr.push(c)
      byDay.set(key, arr)
    }
    return [...byDay.entries()]
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([day, items]) => ({ day, items: items.sort((a, b) => b.hour - a.hour) }))
  }, [visible])

  return (
    <>
      <h1 className="screen-title">{t('diary.title')}</h1>
      <p className="tagline">{t('diary.count', { n: visible.length })}</p>

      {hiddenCount > 0 && (
        <div className="banner">
          <span>🔒 {t('paywall.hidden', { n: hiddenCount })}</span>
          <span className="spacer" />
          <button className="btn" onClick={onUpgrade}>
            {t('paywall.cta')}
          </button>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="card muted">{t('diary.empty')}</div>
      ) : (
        groups.map((g) => (
          <div className="day-group" key={g.day}>
            <h4>{dayLabel(g.items[0].hour, state.profile.locale)}</h4>
            <div className="card">
              {g.items.map((c) => (
                <div className="entry" key={c.id}>
                  <div className="time">{hourLabel(c.hour, state.profile.locale)}</div>
                  <div className="body">
                    <div>
                      <span className="emoji">{MOOD_EMOJI[c.mood]}</span> {c.text}
                    </div>
                    {c.tags.length > 0 && (
                      <div className="row wrap" style={{ marginTop: 6 }}>
                        {c.tags.map((tag) => (
                          <span className="tag" key={tag}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    className="btn ghost"
                    style={{ padding: '4px 8px', color: 'var(--muted)' }}
                    aria-label={t('common.delete')}
                    onClick={() => dispatch({ type: 'deleteCheckin', id: c.id })}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </>
  )
}
