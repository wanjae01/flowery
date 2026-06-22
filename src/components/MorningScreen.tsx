import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { Toggle } from './common'
import { GENRES, isPlaying, playMorningCall, stopMorningCall, type Genre } from '../lib/audio'

export function MorningScreen() {
  const { state, dispatch, t } = useStore()
  const mc = state.profile.morningCall
  const [previewing, setPreviewing] = useState(false)

  useEffect(() => () => stopMorningCall(), [])

  function update(patch: Partial<typeof mc>) {
    dispatch({ type: 'setProfile', profile: { morningCall: { ...mc, ...patch } } })
  }

  function togglePreview() {
    if (previewing || isPlaying()) {
      stopMorningCall()
      setPreviewing(false)
    } else {
      playMorningCall(mc.genre as Genre)
      setPreviewing(true)
    }
  }

  return (
    <>
      <h1 className="screen-title">{t('morning.title')}</h1>

      <div className="card">
        <div className="row">
          <span>{t('morning.enable')}</span>
          <span className="spacer" />
          <Toggle on={mc.enabled} onChange={(v) => update({ enabled: v })} />
        </div>
      </div>

      <div className="card">
        <div className="field">
          <label>{t('morning.time')}</label>
          <input type="time" value={mc.time} onChange={(e) => update({ time: e.target.value })} />
        </div>
        <div className="field">
          <label>{t('morning.genre')}</label>
          <select value={mc.genre} onChange={(e) => update({ genre: e.target.value })}>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {t(`genre.${g}`)}
              </option>
            ))}
          </select>
        </div>
        <button className="btn primary" onClick={togglePreview}>
          {previewing ? `⏹ ${t('morning.stop')}` : `▶ ${t('morning.preview')}`}
        </button>
        <div className="hint">{t('morning.note')}</div>
      </div>
    </>
  )
}
