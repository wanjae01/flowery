import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store'
import { BRANCH_ANIMAL, pillarLabel, pillarRoman, readingForDate, type Element } from '../lib/saju'
import { adviceFor } from '../lib/sajuAdvice'
import { quoteOfDay } from '../lib/quotes'

function ElementTag({ el, t }: { el: Element; t: (k: string) => string }) {
  return <span className={`el ${el}`}>{t(`element.${el}`)}</span>
}

export function SajuScreen({ onNeedBirth }: { onNeedBirth: () => void }) {
  const { state, t } = useStore()
  const locale = state.profile.locale
  const [loading, setLoading] = useState(true)

  const today = useMemo(() => new Date(), [])
  const reading = useMemo(
    () => readingForDate(today, state.profile.birthDate || undefined),
    [today, state.profile.birthDate],
  )
  const quote = useMemo(() => quoteOfDay(reading.iso), [reading.iso])

  // Brief, deliberate "computing" beat — this is where the philosophy line lives.
  useEffect(() => {
    setLoading(true)
    const id = window.setTimeout(() => setLoading(false), 1300)
    return () => window.clearTimeout(id)
  }, [reading.iso])

  if (loading) {
    return (
      <div className="saju-loading">
        <div className="spinner" />
        <p className="muted">{t('saju.loading')}</p>
        <blockquote className="quote">
          “{locale.startsWith('ko') ? quote.ko : quote.en}”
          <div className="by">— {quote.by}</div>
        </blockquote>
      </div>
    )
  }

  const advice = reading.tenGod ? adviceFor(locale, reading.tenGod) : null

  return (
    <>
      <h1 className="screen-title">{t('saju.title')}</h1>
      <p className="tagline">{today.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })}</p>

      <div className="card">
        <div className="pillars">
          <div className="pillar">
            <div className="glyph">{pillarLabel(reading.day)}</div>
            <div className="sub">{t('saju.dayPillar')}</div>
            <div className="sub">{pillarRoman(reading.day)}</div>
          </div>
          {reading.dayMaster && (
            <div className="pillar">
              <div className="glyph">{pillarLabel(reading.dayMaster)}</div>
              <div className="sub">{t('saju.dayMaster')}</div>
              <div className="sub">{pillarRoman(reading.dayMaster)}</div>
            </div>
          )}
        </div>
        <div className="row wrap" style={{ justifyContent: 'center', marginTop: 14, gap: 8 }}>
          <span className="pill">
            {t('saju.todayElement')}: <ElementTag el={reading.dayElement} t={t} />
          </span>
          <span className="pill">
            {t('saju.animal')}: {BRANCH_ANIMAL[reading.day.branch]}
          </span>
          {reading.favorable && (
            <span className="pill">
              {t('saju.favorable')}: <ElementTag el={reading.favorable} t={t} />
            </span>
          )}
        </div>
      </div>

      {advice ? (
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>{advice.title}</h3>
            <span className="stars" title={`${reading.alignment}/5`}>
              {'★'.repeat(reading.alignment)}
              <span className="muted">{'☆'.repeat(5 - reading.alignment)}</span>
            </span>
          </div>
          <p className="muted" style={{ marginTop: 4, fontSize: '0.8rem' }}>
            {t('saju.relation')} · {t('saju.alignment')} {reading.alignment}/5
          </p>

          <div className="advice-line">
            <div className="k">✦ {t('saju.focus')}</div>
            <div>{advice.focus}</div>
          </div>
          <div className="advice-line">
            <div className="k">⚠ {t('saju.caution')}</div>
            <div>{advice.caution}</div>
          </div>
          <div className="advice-line">
            <div className="k">→ {t('saju.action')}</div>
            <div>{advice.action}</div>
          </div>
        </div>
      ) : (
        <div className="card">
          <p>{t('saju.needBirth')}</p>
          <button className="btn primary" onClick={onNeedBirth}>
            {t('saju.needBirthCta')}
          </button>
        </div>
      )}

      <div className="card">
        <h3>{t('saju.quoteOfDay')}</h3>
        <blockquote className="quote" style={{ margin: 0, textAlign: 'left', fontSize: '1rem' }}>
          “{locale.startsWith('ko') ? quote.ko : quote.en}”
          <div className="by">— {quote.by}</div>
        </blockquote>
      </div>

      <p className="hint" style={{ textAlign: 'center' }}>
        {t('saju.disclaimer')}
      </p>
    </>
  )
}
