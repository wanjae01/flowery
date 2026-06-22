export type Mood = 'great' | 'good' | 'neutral' | 'low' | 'bad'

export const MOODS: Mood[] = ['great', 'good', 'neutral', 'low', 'bad']

/** A single hourly check-in entry. */
export interface CheckIn {
  id: string
  /** Epoch ms floored to the top of the hour this entry belongs to. */
  hour: number
  /** When the entry was actually recorded. */
  createdAt: number
  text: string
  mood: Mood
  tags: string[]
}

export interface MorningCall {
  enabled: boolean
  /** "HH:MM" 24h local time. */
  time: string
  genre: string
}

export interface SleepState {
  active: boolean
  since: number | null
}

export interface Friend {
  id: string
  name: string
}

export interface Message {
  id: string
  friendId: string
  /** "me" or the friend id. */
  from: string
  text: string
  createdAt: number
  /** Epoch ms at which this message self-destructs. */
  expiresAt: number
}

export interface Profile {
  name: string
  /** ISO yyyy-mm-dd */
  birthDate: string
  /** Optional birth hour 0-23 for a more precise reading. */
  birthHour: number | null
  locale: string
  pro: boolean
  /** Waking window — notifications only fire between these hours. */
  wakeStart: number
  wakeEnd: number
  morningCall: MorningCall
  /** Minutes a message lives before it self-destructs. */
  messageTtlMinutes: number
}

export interface AppData {
  version: number
  onboarded: boolean
  profile: Profile
  checkins: CheckIn[]
  sleep: SleepState
  friends: Friend[]
  messages: Message[]
}
