import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { SIDES, SIDE_COPY, eventsForSide } from '../data/wedding'

/* ============================================================
   Which family the guest belongs to.

   Chosen once, on the swipe screen, and then read by every slide
   below it. Holding it in context rather than threading it as a
   prop keeps the slides looking the way they did before — they
   ask for the copy they need and never branch on language
   themselves.

   The choice is kept for the session so a guest who backgrounds
   the tab and comes back doesn't have to pick again, but is not
   kept forever: a phone passed around a family gets a fresh
   start the next day.
   ============================================================ */

const KEY = 'sv-invite-side'

const SideContext = createContext(null)

export function readStoredSide() {
  try {
    const v = sessionStorage.getItem(KEY)
    return v === 'groom' || v === 'bride' ? v : null
  } catch {
    return null // private mode, or storage blocked
  }
}

export function SideProvider({ side, children }) {
  const value = useMemo(
    () => ({
      side,
      other: side === 'groom' ? 'bride' : 'groom',
      meta: SIDES[side],
      copy: SIDE_COPY[side],
      /* The class the native-language lines are set in — `deva`
         for Hindi, `tamil` for Tamil. */
      script: SIDES[side].script,
      events: eventsForSide(side),
    }),
    [side]
  )

  return <SideContext.Provider value={value}>{children}</SideContext.Provider>
}

export function useSide() {
  const ctx = useContext(SideContext)
  if (!ctx) throw new Error('useSide must be used inside <SideProvider>')
  return ctx
}

/* Owns the choice itself. Lives above the provider so the swipe
   screen can set it and the closing slide can clear it. */
export function useSideChoice() {
  const [side, setSide] = useState(readStoredSide)

  const choose = useCallback((next) => {
    try {
      sessionStorage.setItem(KEY, next)
    } catch {
      /* Choice still works for this view, just not across reloads. */
    }
    setSide(next)
  }, [])

  const clear = useCallback(() => {
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      /* nothing stored to clear */
    }
    setSide(null)
  }, [])

  return { side, choose, clear }
}
