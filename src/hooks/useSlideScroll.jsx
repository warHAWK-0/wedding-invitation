import { createContext, useContext, useEffect, useRef } from 'react'
import {
  motionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'

/* ============================================================
   One scroll listener, one motion value, zero re-renders.

   The old build called setState on every scroll frame, which
   re-rendered every slide at 60fps and made the parallax stutter.
   Here the scroll position lives in a MotionValue instead: React
   renders once, and everything downstream is driven straight on
   the compositor.
   ============================================================ */

/* Stand-ins for a slide rendered outside the provider. Hooks can't
   be called conditionally, so useSlideProgress always needs a pair
   of real motion values to read from; these park it at rest. */
const IDLE = { scrollY: motionValue(0), viewH: motionValue(0) }

const SlideScrollContext = createContext(IDLE)

export function SlideScrollProvider({ scroller, onIndexChange, children }) {
  const scrollY = useMotionValue(0)
  const viewH = useMotionValue(1)
  const lastIndex = useRef(-1)

  useEffect(() => {
    const el = scroller.current
    if (!el) return

    const measure = () => {
      viewH.set(el.clientHeight || 1)
      scrollY.set(el.scrollTop)
    }
    measure()

    let queued = false
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        const h = el.clientHeight || 1
        scrollY.set(el.scrollTop)

        /* The only thing that still needs React is the rail, and
           it only cares when the whole number changes. */
        const i = Math.round(el.scrollTop / h)
        if (i !== lastIndex.current) {
          lastIndex.current = i
          onIndexChange?.(i)
        }
      })
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [scroller, scrollY, viewH, onIndexChange])

  return (
    <SlideScrollContext.Provider value={{ scrollY, viewH }}>
      {children}
    </SlideScrollContext.Provider>
  )
}

/* Progress of one slide through the viewport.
     0   — sitting one full screen below, not yet arrived
     0.5 — centred and at rest (where snap parks it)
     1   — one full screen above, gone

   Because it is continuous and symmetric, a slide animates the
   same way leaving as arriving, and reverses cleanly when the
   guest scrolls back up. That is what the old whileInView
   couldn't do. */
export function useSlideProgress(index) {
  const { scrollY, viewH } = useContext(SlideScrollContext)

  return useTransform([scrollY, viewH], ([s, h]) => {
    if (!h) return 0.5
    const p = (s - (index - 1) * h) / (2 * h)
    return p < 0 ? 0 : p > 1 ? 1 : p
  })
}

/* The same progress with a little weight behind it. Scroll input
   is quantised and jumpy — especially a trackpad — and a light
   spring turns those steps into a glide without feeling laggy. */
export function useEasedProgress(index) {
  const p = useSlideProgress(index)
  return useSpring(p, {
    stiffness: 260,
    damping: 42,
    mass: 0.35,
    restDelta: 0.0005,
  })
}
