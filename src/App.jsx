import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

import EnvelopeIntro from './components/EnvelopeIntro'
import SideSelect from './components/SideSelect'
import HeroSlide from './components/HeroSlide'
import CountdownSlide from './components/CountdownSlide'
import EventCards from './components/EventCards'
import FinalSlide from './components/FinalSlide'
import RsvpSlide from './components/RsvpSlide'
import ProgressRail from './components/ProgressRail'
import Grain from './components/Grain'
import { SlideScrollProvider } from './hooks/useSlideScroll'
import { SideProvider, useSideChoice } from './hooks/useSide'
import useInviteAudio from './hooks/useInviteAudio'
import { eventsForSide } from './data/wedding'

/* Slide order, and the index each one answers to. Every slide
   derives its own animation from its index, so this is the only
   place the running order is written down.

   Hero, countdown, that side's ceremonies, the closing blessing,
   and then the reply. The two sides attend a different number of
   functions, so the back half of the running order depends on who
   is reading. */
const HERO = 0
const COUNTDOWN = 1
const EVENTS_START = 2

export default function App() {
  const [open, setOpen] = useState(
    () => sessionStorage.getItem('sv-invite-open') === 'true'
  )
  const [index, setIndex] = useState(0)
  const scroller = useRef(null)

  const { side, choose, clear } = useSideChoice()
  const { startSeal, startInner, toggleMute, muted, hasAudio } = useInviteAudio()

  const handleOpen = useCallback(() => {
    startInner() // must fire inside the tap, or mobile blocks playback
    setTimeout(() => {
      sessionStorage.setItem('sv-invite-open', 'true')
      setOpen(true)
    }, 400)
  }, [startInner])

  /* Changing side changes the slides underneath, so the scroller
     has to go back to the top or the guest lands mid-invite on a
     slide that no longer exists. */
  const handleSwitchSide = useCallback(() => {
    scroller.current?.scrollTo({ top: 0 })
    setIndex(0)
    clear()
  }, [clear])

  return (
    <MotionConfig reducedMotion="user">
      <SlideScrollProvider scroller={scroller} onIndexChange={setIndex}>
        {/* The scroller itself must outlive a change of side. It is
            the element the one scroll listener is bound to, and that
            binding is set up once against the ref — remount the box
            and the listener would be left on a detached node, with
            every slide frozen at the progress it last read. So the
            key sits on the contents, which are what actually differ
            per side. */}
        <div className="snap" ref={scroller} data-locked={!open || !side}>
          {side && (
            <Invite
              key={side}
              side={side}
              play={open}
              onSwitchSide={handleSwitchSide}
            />
          )}
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

        <AnimatePresence>
          {open && !side && <SideSelect key="side-select" onChoose={choose} />}
        </AnimatePresence>

        {open && side && <SideRail side={side} index={index} />}

        {open && side && hasAudio && (
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

/* One side's invite. Everything below here reads its language and
   its list of functions off the provider, so no slide has to be
   told twice which family it is speaking to. */
function Invite({ side, play, onSwitchSide }) {
  const events = useMemo(() => eventsForSide(side), [side])
  const final = EVENTS_START + events.length
  const rsvp = final + 1

  /* The slides only care about `play` (the hero waits for it
     before running its entrance). Holding them still here means a
     change of index repaints the rail and nothing else. */
  const slides = useMemo(
    () => (
      <>
        <HeroSlide index={HERO} play={play} />
        <CountdownSlide index={COUNTDOWN} />
        <EventCards start={EVENTS_START} />
        <FinalSlide index={final} onSwitchSide={onSwitchSide} />
        <RsvpSlide index={rsvp} />
      </>
    ),
    [play, final, rsvp, onSwitchSide]
  )

  return <SideProvider side={side}>{slides}</SideProvider>
}

/* The rail needs the same per-side count the slides were built
   from, and it sits outside the scroller — so it gets its own
   thin wrapper rather than a second copy of the arithmetic. */
function SideRail({ side, index }) {
  const events = useMemo(() => eventsForSide(side), [side])
  return (
    <ProgressRail
      index={index}
      total={EVENTS_START + events.length + 2}
      events={events}
      eventsStart={EVENTS_START}
    />
  )
}
