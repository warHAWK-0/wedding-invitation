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
   starting the song only to mute it a moment later would look broken. */
export default function useInviteAudio() {
  const track = useRef(null)
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
    }
  }, [])

  const fadeTo = useCallback((to, ms) => {
    const a = track.current
    if (!a) return
    clearInterval(fader.current)
    const from = a.volume
    const steps = Math.max(1, Math.round(ms / 40))
    let i = 0
    fader.current = setInterval(() => {
      i += 1
      a.volume = Math.min(1, Math.max(0, from + ((to - from) * i) / steps))
      if (i >= steps) clearInterval(fader.current)
    }, 40)
  }, [])

  const start = useCallback(() => {
    const a = track.current
    if (!AUDIO.enabled || !a || started.current) return
    started.current = true
    a.play()
      .then(() => {
        setPlaying(true)
        fadeTo(AUDIO.volume, 1800)
      })
      .catch(() => {
        /* Blocked — the browser did not count this as a gesture. Let
           the next real touch try again. */
        started.current = false
      })
  }, [fadeTo])

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
     unmutes. */
  const toggleMute = useCallback(() => {
    if (!started.current) {
      start()
      return
    }
    setMuted((m) => {
      const next = !m
      if (track.current) track.current.muted = next
      return next
    })
  }, [start])

  return { start, toggleMute, muted, playing, hasAudio: AUDIO.enabled }
}
