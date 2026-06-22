import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store'
import { newId } from '../lib/storage'
import type { Message } from '../types'

function remainingLabel(expiresAt: number, now: number): string {
  const ms = expiresAt - now
  if (ms <= 0) return '0s'
  const min = Math.floor(ms / 60000)
  if (min >= 1) return `${min}m`
  return `${Math.ceil(ms / 1000)}s`
}

export function MessagesScreen() {
  const { state, dispatch, t } = useStore()
  const ttlMs = state.profile.messageTtlMinutes * 60_000

  const [selected, setSelected] = useState<string | null>(state.friends[0]?.id ?? null)
  const [draft, setDraft] = useState('')
  const [newFriend, setNewFriend] = useState('')
  const [now, setNow] = useState(Date.now())

  // Re-render every second so the self-destruct countdowns stay live.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const friendId = selected ?? state.friends[0]?.id ?? null

  const thread = useMemo(
    () => state.messages.filter((m) => m.friendId === friendId && m.expiresAt > now).sort((a, b) => a.createdAt - b.createdAt),
    [state.messages, friendId, now],
  )

  function addFriend() {
    const name = newFriend.trim()
    if (!name) return
    const id = newId()
    dispatch({ type: 'addFriend', name })
    dispatch({ type: 'addMessage', message: greeting(id, name, ttlMs) })
    setNewFriend('')
    setSelected(id)
  }

  function send() {
    const text = draft.trim()
    if (!text || !friendId) return
    const created = Date.now()
    dispatch({
      type: 'addMessage',
      message: { id: newId(), friendId, from: 'me', text, createdAt: created, expiresAt: created + ttlMs },
    })
    setDraft('')
    // Local demo: the friend echoes back shortly after. Real sync needs a server.
    const fid = friendId
    window.setTimeout(() => {
      const t2 = Date.now()
      dispatch({
        type: 'addMessage',
        message: { id: newId(), friendId: fid, from: fid, text: `↩ ${text}`, createdAt: t2, expiresAt: t2 + ttlMs },
      })
    }, 1200)
  }

  const friend = state.friends.find((f) => f.id === friendId)

  return (
    <>
      <h1 className="screen-title">{t('msg.title')}</h1>
      <p className="tagline">{t('msg.note', { n: state.profile.messageTtlMinutes })}</p>

      <div className="row" style={{ marginBottom: 16 }}>
        <input value={newFriend} onChange={(e) => setNewFriend(e.target.value)} placeholder={t('msg.namePh')} />
        <button className="btn primary" onClick={addFriend}>
          {t('msg.add')}
        </button>
      </div>

      {state.friends.length === 0 ? (
        <div className="card muted">{t('msg.empty')}</div>
      ) : (
        <div className="msg-layout">
          <div className="row wrap" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            {state.friends.map((f) => (
              <button
                key={f.id}
                className={`friend${f.id === friendId ? ' sel' : ''}`}
                onClick={() => setSelected(f.id)}
              >
                <span className="avatar">{f.name.slice(0, 1).toUpperCase()}</span>
                <span>{f.name}</span>
              </button>
            ))}
          </div>

          <div className="card">
            <h3>{friend?.name ?? t('msg.startHint')}</h3>
            <div className="chat">
              {thread.map((m) => (
                <div key={m.id} className={`bubble${m.from === 'me' ? ' me' : ''}`}>
                  <div>{m.text}</div>
                  <div className="meta">
                    {m.from === 'me' ? t('msg.you') : friend?.name} · 💨 {t('msg.expires', { n: remainingLabel(m.expiresAt, now) })}
                  </div>
                </div>
              ))}
            </div>
            <div className="row" style={{ marginTop: 12 }}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t('msg.placeholder')}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <button className="btn primary" onClick={send} disabled={!draft.trim()}>
                {t('msg.send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function greeting(friendId: string, name: string, ttlMs: number): Message {
  const now = Date.now()
  return {
    id: newId(),
    friendId,
    from: friendId,
    text: `👋 ${name}`,
    createdAt: now,
    expiresAt: now + ttlMs,
  }
}
