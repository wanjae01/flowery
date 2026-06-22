# Doing

**What are you doing, right now?**

Doing nudges you every hour to record what you're up to, turning a day of small
check-ins into a searchable diary. It pairs that habit with a personalised daily
*saju* (사주 / Four Pillars) reading, a song-based morning alarm, and ephemeral
messaging. Built to run on **desktop and mobile** from one responsive,
installable (PWA) codebase, and **global from day one** with multi-language
support.

## Features

| Feature | Status |
| --- | --- |
| **Hourly check-in** — "What are you doing?" with mood + tags | ✅ Working |
| **Sleep mode** — "Sleep now" pauses notifications until you wake or your morning call | ✅ Working |
| **Browser notifications** on the hour, only within your waking window | ✅ Working |
| **Diary** — entries grouped by day | ✅ Working |
| **Calendar** — month heat-map of check-in density | ✅ Working |
| **Daily saju** — real Four Pillars engine → personalised Ten God advice | ✅ Working |
| **Philosophy on the loading screen** — a thought for the day | ✅ Working |
| **i18n** — English, 한국어, 日本語, Español (fallback to English) | ✅ Working |
| **1-month free retention + Pro paywall** — older entries hidden, never deleted, on Free | ✅ Working (purchase stubbed) |
| **Morning call** — pick a genre, hear it at wake time | ✅ Working (audio synthesised; Suno API pending) |
| **Ephemeral messaging** — messages self-destruct after a TTL | ✅ Local demo (cross-device sync needs a backend) |

### Honest scope

This is a **frontend-complete MVP**. Everything above runs entirely in the
browser with `localStorage` persistence. Three pieces are deliberately stubbed
because they need infrastructure that can't be provisioned client-side:

- **Payments** — the Pro upgrade flips a flag instead of charging a card. Wire to
  Stripe / App Store / Play Billing for production.
- **Suno morning-call tracks** — the alarm currently plays a synthesised,
  genre-flavoured motif via the Web Audio API. Swap `src/lib/audio.ts` for the
  Suno generation + streaming API.
- **Messaging sync** — messages are local-only and a "friend" echoes your text
  back, to demonstrate the self-destruct behaviour. Real friend-to-friend
  delivery needs a server (and the same TTL purge enforced server-side).

### About the saju reading

`src/lib/saju.ts` computes the **traditional sexagenary day pillar** from a
Gregorian date (Julian Day Number → 60-cycle), then derives the Five Elements
(오행) and the **Ten Gods** (십성) relationship between today's energy and your
*day master* (일간, the stem of your birth day). The same date always yields the
same reading — it's a reproducible algorithm, offered for reflection rather than
literal prediction. The day-pillar math is validated against known references
(e.g. 2000-01-01 → 戊午).

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # production build to dist/
npm run preview    # serve the production build
npm run typecheck  # tsc --noEmit
```

## Tech & layout

- **Vite + React 18 + TypeScript**, no UI framework — small, fast, easy to wrap.
- State lives in a single `useReducer` store (`src/store.tsx`) persisted to
  `localStorage`.

```
src/
  App.tsx              # shell, navigation, hourly + morning-call wiring
  store.tsx            # app state + persistence
  types.ts
  i18n/                # translator + per-language dictionaries
  hooks/               # useHourly (check-in loop), useMorningCall
  lib/                 # saju engine, advice, quotes, audio, retention, time, storage
  components/          # one file per screen + shared widgets
```

## Roadmap to native

The web app is responsive and installable as a PWA today. For first-class apps:

- **Desktop**: wrap with Tauri or Electron; replace browser notifications with
  the OS notification API.
- **Mobile**: wrap with Capacitor; use native local notifications so hourly
  check-ins fire even when the app is closed.
- **Backend**: a small service for accounts, cross-device sync, real payments,
  Suno track generation, and server-enforced message expiry.

## License

Apache License 2.0.
