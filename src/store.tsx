import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { AppData, CheckIn, Message, Mood, Profile } from './types'
import { defaultData, load, newId, save } from './lib/storage'
import { makeT, type TFn } from './i18n'

type Action =
  | { type: 'onboard'; profile: Partial<Profile> }
  | { type: 'setProfile'; profile: Partial<Profile> }
  | { type: 'upsertCheckin'; hour: number; text: string; mood: Mood; tags: string[] }
  | { type: 'deleteCheckin'; id: string }
  | { type: 'sleepOn' }
  | { type: 'sleepOff' }
  | { type: 'addFriend'; name: string }
  | { type: 'addMessage'; message: Message }
  | { type: 'purgeExpired'; now: number }
  | { type: 'reset' }

function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case 'onboard':
      return { ...state, onboarded: true, profile: { ...state.profile, ...action.profile } }

    case 'setProfile':
      return { ...state, profile: { ...state.profile, ...action.profile } }

    case 'upsertCheckin': {
      const existing = state.checkins.find((c) => c.hour === action.hour)
      const checkins = existing
        ? state.checkins.map((c) =>
            c.hour === action.hour ? { ...c, text: action.text, mood: action.mood, tags: action.tags } : c,
          )
        : [
            ...state.checkins,
            {
              id: newId(),
              hour: action.hour,
              createdAt: Date.now(),
              text: action.text,
              mood: action.mood,
              tags: action.tags,
            } satisfies CheckIn,
          ]
      return { ...state, checkins }
    }

    case 'deleteCheckin':
      return { ...state, checkins: state.checkins.filter((c) => c.id !== action.id) }

    case 'sleepOn':
      return { ...state, sleep: { active: true, since: Date.now() } }

    case 'sleepOff':
      return { ...state, sleep: { active: false, since: null } }

    case 'addFriend':
      return { ...state, friends: [...state.friends, { id: newId(), name: action.name }] }

    case 'addMessage':
      return { ...state, messages: [...state.messages, action.message] }

    case 'purgeExpired': {
      const messages = state.messages.filter((m) => m.expiresAt > action.now)
      if (messages.length === state.messages.length) return state
      return { ...state, messages }
    }

    case 'reset':
      return defaultData()

    default:
      return state
  }
}

interface Store {
  state: AppData
  dispatch: React.Dispatch<Action>
  t: TFn
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    save(state)
  }, [state])

  // Reflect the active locale on the document for correct CJK/RTL handling.
  useEffect(() => {
    document.documentElement.lang = state.profile.locale
  }, [state.profile.locale])

  const t = useMemo(() => makeT(state.profile.locale), [state.profile.locale])

  const value = useMemo<Store>(() => ({ state, dispatch, t }), [state, t])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
