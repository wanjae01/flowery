import { useEffect, useState } from 'react'
import { useStore } from './store'
import { useHourly } from './hooks/useHourly'
import { useMorningCall } from './hooks/useMorningCall'
import { Onboarding } from './components/Onboarding'
import { NowScreen } from './components/NowScreen'
import { DiaryScreen } from './components/DiaryScreen'
import { CalendarScreen } from './components/CalendarScreen'
import { SajuScreen } from './components/SajuScreen'
import { MorningScreen } from './components/MorningScreen'
import { MessagesScreen } from './components/MessagesScreen'
import { SettingsScreen } from './components/SettingsScreen'
import { Paywall } from './components/Paywall'
import { stopMorningCall } from './lib/audio'

type Tab = 'now' | 'diary' | 'calendar' | 'saju' | 'morning' | 'messages' | 'settings'

const TABS: { id: Tab; ico: string }[] = [
  { id: 'now', ico: '⏱' },
  { id: 'diary', ico: '📖' },
  { id: 'calendar', ico: '🗓' },
  { id: 'saju', ico: '🔮' },
  { id: 'morning', ico: '⏰' },
  { id: 'messages', ico: '💬' },
  { id: 'settings', ico: '⚙️' },
]

export function App() {
  const { state, dispatch, t } = useStore()
  const [tab, setTab] = useState<Tab>('now')
  const [paywall, setPaywall] = useState(false)

  const { hour, permission, requestPermission } = useHourly()
  const { ringing, dismiss } = useMorningCall()

  // Self-destruct expired messages on a steady cadence.
  useEffect(() => {
    const id = window.setInterval(() => dispatch({ type: 'purgeExpired', now: Date.now() }), 30_000)
    return () => window.clearInterval(id)
  }, [dispatch])

  if (!state.onboarded) return <Onboarding />

  const Nav = (
    <nav className="nav">
      <div className="brand">
        <span className="dot" /> {t('onb.title')}
      </div>
      {TABS.map((tb) => (
        <button key={tb.id} className={tab === tb.id ? 'active' : ''} onClick={() => setTab(tb.id)}>
          <span className="ico">{tb.ico}</span>
          {t(`nav.${tb.id}`)}
        </button>
      ))}
    </nav>
  )

  return (
    <div className="shell">
      {Nav}
      <main className="main">
        <div className="brand-mobile">
          <div className="brand">
            <span className="dot" /> {t('onb.title')}
          </div>
          <span className="muted" style={{ fontSize: '0.85rem' }}>
            {state.profile.name}
          </span>
        </div>

        {ringing && (
          <div className="banner">
            <span>⏰ {t('morning.ringing', { genre: t(`genre.${state.profile.morningCall.genre}`) })}</span>
            <span className="spacer" />
            <button
              className="btn"
              onClick={() => {
                stopMorningCall()
                dismiss()
              }}
            >
              {t('morning.dismiss')}
            </button>
          </div>
        )}

        {tab === 'now' && <NowScreen hour={hour} />}
        {tab === 'diary' && <DiaryScreen onUpgrade={() => setPaywall(true)} />}
        {tab === 'calendar' && <CalendarScreen />}
        {tab === 'saju' && <SajuScreen onNeedBirth={() => setTab('settings')} />}
        {tab === 'morning' && <MorningScreen />}
        {tab === 'messages' && <MessagesScreen />}
        {tab === 'settings' && <SettingsScreen permission={permission} requestPermission={requestPermission} />}
      </main>

      {paywall && <Paywall onClose={() => setPaywall(false)} />}
    </div>
  )
}
