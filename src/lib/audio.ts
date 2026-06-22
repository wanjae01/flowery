/**
 * Morning-call playback.
 *
 * In production these would be tracks generated on Suno and streamed by genre.
 * Until that backend exists, we synthesise a short, pleasant genre-flavoured
 * motif with the Web Audio API so the alarm actually makes sound and the genre
 * picker is demonstrably wired up.
 */

export const GENRES = ['lofi', 'piano', 'ambient', 'synthwave', 'acoustic'] as const
export type Genre = (typeof GENRES)[number]

interface Motif {
  /** Semitone offsets from A3 (220Hz). */
  notes: number[]
  wave: OscillatorType
  /** Seconds per note. */
  step: number
}

const MOTIFS: Record<Genre, Motif> = {
  lofi: { notes: [0, 3, 7, 10, 7, 3], wave: 'sine', step: 0.32 },
  piano: { notes: [0, 4, 7, 12, 7, 4], wave: 'triangle', step: 0.28 },
  ambient: { notes: [0, 7, 12, 7], wave: 'sine', step: 0.6 },
  synthwave: { notes: [0, 5, 7, 12, 10, 5], wave: 'sawtooth', step: 0.22 },
  acoustic: { notes: [0, 4, 7, 9, 7, 4], wave: 'triangle', step: 0.3 },
}

function midiToFreq(semitonesFromA3: number): number {
  return 220 * Math.pow(2, semitonesFromA3 / 12)
}

let ctx: AudioContext | null = null
let stopFn: (() => void) | null = null

export function isPlaying(): boolean {
  return stopFn !== null
}

export function stopMorningCall(): void {
  if (stopFn) {
    stopFn()
    stopFn = null
  }
}

/** Loops the genre motif until stopped. Returns true if audio started. */
export function playMorningCall(genre: Genre): boolean {
  stopMorningCall()
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = ctx ?? new AudioCtx()
    void ctx.resume()
    const motif = MOTIFS[genre] ?? MOTIFS.lofi

    const master = ctx.createGain()
    master.gain.value = 0.0001
    master.connect(ctx.destination)
    // Gentle fade-in so the wake-up isn't jarring.
    master.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 4)

    let cancelled = false
    const oscillators: OscillatorNode[] = []

    const scheduleLoop = (startAt: number) => {
      if (cancelled || !ctx) return
      let t = startAt
      motif.notes.forEach((n) => {
        const osc = ctx!.createOscillator()
        const g = ctx!.createGain()
        osc.type = motif.wave
        osc.frequency.value = midiToFreq(n)
        g.gain.setValueAtTime(0.0001, t)
        g.gain.exponentialRampToValueAtTime(0.9, t + 0.04)
        g.gain.exponentialRampToValueAtTime(0.0001, t + motif.step * 0.95)
        osc.connect(g)
        g.connect(master)
        osc.start(t)
        osc.stop(t + motif.step)
        oscillators.push(osc)
        t += motif.step
      })
      const loopMs = (t - ctx.currentTime) * 1000
      window.setTimeout(() => scheduleLoop(t), Math.max(50, loopMs))
    }

    scheduleLoop(ctx.currentTime + 0.05)

    stopFn = () => {
      cancelled = true
      if (ctx) master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6)
      oscillators.forEach((o) => {
        try {
          o.stop()
        } catch {
          /* already stopped */
        }
      })
    }
    return true
  } catch {
    return false
  }
}
