import { useCallback, useEffect, useRef, useState } from 'react'
import { AUDIO } from '../data/wedding'

/* Two tracks, one control.
   Phones will not autoplay audio — playback can only begin inside a
   real touch or click, which is why start() is called from the
   envelope tap rather than from a timer. */
export default function useInviteAudio() {
  const seal = useRef(null)
  const inner = useRef(null)
  const fader = useRef(null)
  const [muted, setMuted] = useState(false)
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (!AUDIO.enabled) return
    seal.current = new Audio(AUDIO.seal)
    inner.current = new Audio(AUDIO.inner)
    for (const a of [seal.current, inner.current]) {
      a.loop = true
      a.preload = 'auto'
      a.volume = 0
    }
    return () => {
      clearInterval(fader.current)
      for (const a of [seal.current, inner.current]) {
        if (a) {
          a.pause()
          a.src = ''
        }
      }
    }
  }, [])

  const fade = useCallback((el, to, ms = 700) => {
    if (!el) return
    clearInterval(fader.current)
    const from = el.volume
    const steps = Math.max(1, Math.round(ms / 40))
    let i = 0
    fader.current = setInterval(() => {
      i += 1
      el.volume = Math.min(1, Math.max(0, from + ((to - from) * i) / steps))
      if (i >= steps) {
        clearInterval(fader.current)
        if (to === 0) el.pause()
      }
    }, 40)
  }, [])

  /* Called from the first touch on the envelope screen. */
  const startSeal = useCallback(() => {
    if (!AUDIO.enabled || !seal.current || active) return
    seal.current.play().then(() => {
      setActive('seal')
      fade(seal.current, 0.75, 1400)
    }).catch(() => {})
  }, [active, fade])

  /* Called when the envelope opens — hands over to the second track. */
  const startInner = useCallback(() => {
    if (!AUDIO.enabled || !inner.current) return
    if (seal.current && !seal.current.paused) fade(seal.current, 0, 600)
    setTimeout(() => {
      inner.current.play().then(() => {
        setActive('inner')
        inner.current.volume = 0
        fade(inner.current, 0.7, 1600)
      }).catch(() => {})
    }, 380)
  }, [fade])

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m
      for (const a of [seal.current, inner.current]) if (a) a.muted = next
      return next
    })
  }, [])

  return { startSeal, startInner, toggleMute, muted, hasAudio: AUDIO.enabled }
}
