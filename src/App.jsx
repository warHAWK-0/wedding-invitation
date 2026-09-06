import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

import EnvelopeIntro from './components/EnvelopeIntro'
import HeroSlide from './components/HeroSlide'
import CountdownSlide from './components/CountdownSlide'
import EventCards from './components/EventCards'
import FinalSlide from './components/FinalSlide'
import ProgressRail from './components/ProgressRail'
import Grain from './components/Grain'
import { SlideScrollProvider } from './hooks/useSlideScroll'
import useInviteAudio from './hooks/useInviteAudio'
import { EVENTS } from './data/wedding'

/* Slide order, and the index each one answers to. Every slide
   derives its own animation from its index, so this is the only
   place the running order is written down. */
const HERO = 0
const COUNTDOWN = 1
const EVENTS_START = 2
const FINAL = EVENTS_START + EVENTS.length
const TOTAL_SLIDES = FINAL + 1

export default function App() {
  const [open, setOpen] = useState(
    () => sessionStorage.getItem('sv-invite-open') === 'true'
  )
  const [index, setIndex] = useState(0)
  const scroller = useRef(null)

  const { startSeal, startInner, toggleMute, muted, hasAudio } = useInviteAudio()

  const handleOpen = useCallback(() => {
    startInner() // must fire inside the tap, or mobile blocks playback
    setTimeout(() => {
      sessionStorage.setItem('sv-invite-open', 'true')
      setOpen(true)
    }, 400)
  }, [startInner])

  /* The slides only care about `open` (the hero waits for it before
     playing its entrance). Holding them still here means a change of
     index repaints the rail and nothing else. */
  const slides = useMemo(
    () => (
      <>
        <HeroSlide index={HERO} play={open} />
        <CountdownSlide index={COUNTDOWN} />
        <EventCards start={EVENTS_START} />
        <FinalSlide index={FINAL} />
      </>
    ),
    [open]
  )

  return (
    <MotionConfig reducedMotion="user">
      <SlideScrollProvider scroller={scroller} onIndexChange={setIndex}>
        <div className="snap" ref={scroller} data-locked={!open}>
          {slides}
        </div>

        {/* One grain layer over the lot, above the art, below the UI. */}
        <Grain />

        <AnimatePresence>
          {!open && (
            <EnvelopeIntro
              key="envelope"
              onFirstTouch={startSeal}
              onOpen={handleOpen}
            />
          )}
        </AnimatePresence>

        {open && <ProgressRail index={index} total={TOTAL_SLIDES} />}

        {open && hasAudio && (
          <button
            className="icon-btn"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute music' : 'Mute music'}
            style={{
              right: 'max(16px, env(safe-area-inset-right))',
              bottom: 'max(16px, env(safe-area-inset-bottom))',
            }}
          >
            {muted ? (
              <VolumeX size={16} strokeWidth={1.5} />
            ) : (
              <Volume2 size={16} strokeWidth={1.5} />
            )}
          </button>
        )}
      </SlideScrollProvider>
    </MotionConfig>
  )
}
