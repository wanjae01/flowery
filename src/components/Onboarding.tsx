import { useState } from 'react'
import { useStore } from '../store'
import { LOCALES } from '../i18n'

export function Onboarding() {
  const { dispatch, t, state } = useStore()
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [locale, setLocale] = useState(state.profile.locale)

  function start() {
    dispatch({ type: 'onboard', profile: { name: name.trim(), birthDate, locale } })
  }

  return (
    <div className="onb">
      <div className="logo">{t('onb.title')}</div>
      <p className="tagline" style={{ marginTop: 8 }}>
        {t('onb.subtitle')}
      </p>

      <div className="field">
        <label>{t('set.language')}</label>
        <select value={locale} onChange={(e) => setLocale(e.target.value)}>
          {LOCALES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>{t('onb.name')}</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('onb.namePh')} />
      </div>

      <div className="field">
        <label>{t('onb.birth')}</label>
        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} max="2025-12-31" />
        <div className="hint">{t('onb.birthHint')}</div>
      </div>

      <button className="btn primary block" onClick={start}>
        {t('onb.start')}
      </button>
    </div>
  )
}
