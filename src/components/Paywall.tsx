import { useStore } from '../store'

export function Paywall({ onClose }: { onClose: () => void }) {
  const { dispatch, t } = useStore()

  function goPro() {
    // Demo only — a real build would complete a Stripe / App Store purchase here.
    dispatch({ type: 'setProfile', profile: { pro: true } })
    onClose()
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{t('paywall.title')}</h2>
        <p className="muted">{t('paywall.body')}</p>

        {['paywall.f1', 'paywall.f2', 'paywall.f3'].map((k) => (
          <div className="feature" key={k}>
            <span className="check">✓</span>
            <span>{t(k)}</span>
          </div>
        ))}

        <button className="btn primary block" style={{ marginTop: 12 }} onClick={goPro}>
          {t('paywall.cta')}
        </button>
        <button className="btn ghost block" style={{ marginTop: 8 }} onClick={onClose}>
          {t('paywall.later')}
        </button>
      </div>
    </div>
  )
}
