import { useStore } from '../store'
import { LOCALES } from '../i18n'
import { Toggle } from './common'
import type { NotifPermission } from '../hooks/useHourly'

export function SettingsScreen({
  permission,
  requestPermission,
}: {
  permission: NotifPermission
  requestPermission: () => void
}) {
  const { state, dispatch, t } = useStore()
  const p = state.profile
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <>
      <h1 className="screen-title">{t('set.title')}</h1>

      <div className="card">
        <h3>{t('set.profile')}</h3>
        <div className="field">
          <label>{t('set.name')}</label>
          <input value={p.name} onChange={(e) => dispatch({ type: 'setProfile', profile: { name: e.target.value } })} />
        </div>
        <div className="field">
          <label>{t('set.birth')}</label>
          <input
            type="date"
            value={p.birthDate}
            onChange={(e) => dispatch({ type: 'setProfile', profile: { birthDate: e.target.value } })}
          />
        </div>
        <div className="field">
          <label>{t('set.birthHour')}</label>
          <select
            value={p.birthHour ?? ''}
            onChange={(e) =>
              dispatch({
                type: 'setProfile',
                profile: { birthHour: e.target.value === '' ? null : Number(e.target.value) },
              })
            }
          >
            <option value="">—</option>
            {hours.map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, '0')}:00
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>{t('set.language')}</label>
          <select value={p.locale} onChange={(e) => dispatch({ type: 'setProfile', profile: { locale: e.target.value } })}>
            {LOCALES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <h3>{t('set.wake')}</h3>
        <div className="row">
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <label>{t('set.wakeFrom')}</label>
            <select
              value={p.wakeStart}
              onChange={(e) => dispatch({ type: 'setProfile', profile: { wakeStart: Number(e.target.value) } })}
            >
              {hours.map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <label>{t('set.wakeTo')}</label>
            <select
              value={p.wakeEnd}
              onChange={(e) => dispatch({ type: 'setProfile', profile: { wakeEnd: Number(e.target.value) } })}
            >
              {hours.map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>{t('set.notif')}</h3>
        <div className="row">
          <span>{t('set.enableNotif')}</span>
          <span className="spacer" />
          {permission === 'granted' ? (
            <span className="pill">✓ {t('set.notifOn')}</span>
          ) : permission === 'denied' || permission === 'unsupported' ? (
            <span className="pill">{t('set.notifBlocked')}</span>
          ) : (
            <button className="btn" onClick={requestPermission}>
              {t('set.enableNotif')}
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <h3>{t('set.subscription')}</h3>
        <p className="muted">{t('set.proBody')}</p>
        <div className="row">
          <span>{p.pro ? t('set.pro') : t('set.free')}</span>
          <span className="spacer" />
          <Toggle on={p.pro} onChange={(v) => dispatch({ type: 'setProfile', profile: { pro: v } })} />
        </div>
        <div className="hint">{t('set.retention')}</div>
      </div>

      <div className="card">
        <h3>{t('set.msgTtl')}</h3>
        <div className="row">
          <input
            type="number"
            min={1}
            max={1440}
            value={p.messageTtlMinutes}
            onChange={(e) =>
              dispatch({ type: 'setProfile', profile: { messageTtlMinutes: Math.max(1, Number(e.target.value) || 1) } })
            }
          />
          <span className="muted">{t('set.minutes')}</span>
        </div>
      </div>

      <div className="card">
        <h3>{t('set.disclaimerTitle')}</h3>
        <p className="muted" style={{ fontSize: '0.9rem' }}>
          {t('set.disclaimer')}
        </p>
      </div>

      <div className="card">
        <h3>{t('set.data')}</h3>
        <button
          className="btn danger block"
          onClick={() => {
            if (window.confirm(t('set.resetConfirm'))) dispatch({ type: 'reset' })
          }}
        >
          {t('set.reset')}
        </button>
      </div>
    </>
  )
}
