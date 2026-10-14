import { useCallback, useEffect, useRef, useState } from 'react'
import { AUDIO } from '../data/wedding'

/* One song, one control.

   Phones will not start audio on their own — playback can only begin
   inside a real touch, click or key press. So `start()` is called from
   the envelope tap, and it is safe to call more than once: the envelope
   calls it on first touch and again as it opens, and the song carries
   straight on rather than restarting.

   A guest who has already opened the invite this session never sees
   the envelope, so for them there is no envelope tap to start from.
   Their first touch anywhere does it instead — the side chooser, a
   scroll, anything. Touches on the music button itself are left out
   of that, because that same touch goes on to toggle the button, and
   starting the song only to mute it a moment later would look broken.

   The song comes in gently. It used to fade up over under two seconds
   by setting `audio.volume`, and on an iPhone that does nothing at all:
   iOS treats an element's volume as read-only and plays it at full
   strength, so every iPhone guest got the song at full volume the
   instant they tapped. The volume now lives on a Web Audio gain node,
   which iOS does honour, and it comes in in two stages: a soft start
   that holds for a few seconds, then a slow rise to the full level.
   Browsers without Web Audio fall back to the old element volume. */

/* The shape of the fade-in, in seconds from the first note. */
const SOFT_LEVEL = 0.12 // share of the full volume to start at
const SOFT_IN = 2 // reach the soft level
const SOFT_HOLD = 5 // stay soft until here
const FULL_AT = 15 // then rise to full by here
export default function useInviteAudio() {
  const track = useRef(null)
  const graph = useRef(null)
  const fader = useRef(null)
  const started = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    if (!AUDIO.enabled) return
    const a = new Audio(AUDIO.track)
    a.loop = true
    a.preload = 'auto'
    a.volume = 0
    track.current = a
    return () => {
      clearInterval(fader.current)
      a.pause()
      a.src = ''
      graph.current?.ctx.close().catch(() => {})
    }
  }, [])

  /* Built on the first tap, because iOS only lets an AudioContext
     start inside one. An element can be wired into a graph only once,
     so this runs once and the result is kept. */
  const buildGraph = useCallback(() => {
    if (graph.current) return graph.current
    const a = track.current
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!a || !Ctx) return null
    try {
      /* Keep the song playing through the iPhone silent switch, the
         way a plain <audio> element always did. */
      if (navigator.audioSession) navigator.audioSession.type = 'playback'
      const ctx = new Ctx()
      const gain = ctx.createGain()
      gain.gain.value = 0
      ctx.createMediaElementSource(a).connect(gain)
      gain.connect(ctx.destination)
      a.volume = 1 // the gain node does the work from here on
      graph.current = { ctx, gain }
    } catch {
      graph.current = null
    }
    return graph.current
  }, [])

  /* The fallback, for browsers with no Web Audio: step the element's
     own volume through a list of [seconds, level] points. */
  const stepVolume = useCallback((points) => {
    const a = track.current
    if (!a) return
    clearInterval(fader.current)
    const t0 = performance.now()
    const from = a.volume
    fader.current = setInterval(() => {
      const t = (performance.now() - t0) / 1000
      let prev = [0, from]
      for (const p of points) {
        if (t < p[0]) {
          const k = (t - prev[0]) / (p[0] - prev[0] || 1)
          a.volume = Math.min(1, Math.max(0, prev[1] + (p[1] - prev[1]) * k))
          return
        }
        prev = p
      }
      a.volume = prev[1]
      clearInterval(fader.current)
    }, 50)
  }, [])

  const fadeIn = useCallback(() => {
    const full = AUDIO.volume
    const soft = full * SOFT_LEVEL
    const g = graph.current
    if (g) {
      const now = g.ctx.currentTime
      const v = g.gain.gain
      v.cancelScheduledValues(now)
      v.setValueAtTime(0, now)
      v.linearRampToValueAtTime(soft, now + SOFT_IN)
      v.setValueAtTime(soft, now + SOFT_HOLD)
      v.linearRampToValueAtTime(full, now + FULL_AT)
    } else {
      stepVolume([
        [SOFT_IN, soft],
        [SOFT_HOLD, soft],
        [FULL_AT, full],
      ])
    }
  }, [stepVolume])

  const start = useCallback(() => {
    const a = track.current
    if (!AUDIO.enabled || !a || started.current) return
    started.current = true
    const g = buildGraph()
    g?.ctx.resume().catch(() => {})
    a.play()
      .then(() => {
        setPlaying(true)
        fadeIn()
      })
      .catch(() => {
        /* Blocked — the browser did not count this as a gesture. Let
           the next real touch try again. */
        started.current = false
      })
  }, [buildGraph, fadeIn])

  /* First touch anywhere, for guests who skipped the envelope. */
  useEffect(() => {
    if (!AUDIO.enabled) return
    const onGesture = (e) => {
      if (started.current) return
      if (e.target instanceof Element && e.target.closest('[data-music-toggle]')) return
      start()
    }
    const events = ['pointerdown', 'touchstart', 'keydown']
    for (const ev of events) window.addEventListener(ev, onGesture, { capture: true, passive: true })
    return () => {
      for (const ev of events) window.removeEventListener(ev, onGesture, { capture: true })
    }
  }, [start])

  /* Not playing yet: the button starts the song. Playing: it mutes and
     unmutes. Muting goes through the gain when there is one, since the
     element's own mute is not reliably honoured once it feeds a graph;
     unmuting comes back over a second rather than all at once. */
  const toggleMute = useCallback(() => {
    if (!started.current) {
      start()
      return
    }
    setMuted((m) => {
      const next = !m
      const g = graph.current
      if (g) {
        const now = g.ctx.currentTime
        const v = g.gain.gain
        v.cancelScheduledValues(now)
        v.setValueAtTime(v.value, now)
        v.linearRampToValueAtTime(next ? 0 : AUDIO.volume, now + (next ? 0.15 : 1))
      } else if (track.current) {
        track.current.muted = next
      }
      return next
    })
  }, [start])

  return { start, toggleMute, muted, playing, hasAudio: AUDIO.enabled }
}
