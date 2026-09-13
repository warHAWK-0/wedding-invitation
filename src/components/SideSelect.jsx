import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { COUPLE, SIDES } from '../data/wedding'

/* ============================================================
   The fork in the road.

   Two families, two languages, two lists of functions — and one
   link that goes to everybody. So before the invite proper, one
   screen asks which half of the wedding the guest belongs to.

   This screen used to be built around the swipe, with the two
   sides as small labels underneath. That was the wrong way round.
   Most of these guests are opening a WhatsApp link, many of them
   are elders, and a drag is not a discoverable first move — you
   have to already know it is there. A screen whose primary action
   has to be explained by a pulsing hint has the wrong primary
   action.

   So the two sides are now two full-width cards, each naming the
   family it belongs to, and the answer to "whose side are you
   from?" is a thing you tap. The swipe is still here, and still
   commits — it is a lovely gesture and some people will find it —
   but it is now the shortcut rather than the road. The card gives
   itself away with one small rock on arrival instead of a caption.

   The arrow keys do the same job, for anyone on a laptop or a
   screen reader.
   ============================================================ */

/* Past this much drag (or this much flick), releasing commits. */
const COMMIT_PX = 88
const COMMIT_VELOCITY = 480

export default function SideSelect({ onChoose }) {
  const [committed, setCommitted] = useState(null)
  const controls = useAnimationControls()
  const x = useMotionValue(0)
  const live = useRef(true)
  /* Set the moment the card is touched, so the nudge below knows
     to stay out of the way. */
  const grabbed = useRef(false)
  const reduceMotion = useReducedMotion()

  /* The card leans into the pull rather than sliding flat — it is
     what makes the gesture feel like turning toward a family
     rather than dismissing a notification. */
  const rotate = useTransform(x, [-180, 0, 180], [-10, 0, 10])

  /* Both cards sit at full strength at rest, and the one you are
     dragging *away* from steps back.

     These used to run the other way — 0.42 at rest, rising to 1 as
     the card came toward them — which was right while they were
     two small labels annotating the gesture. They are the primary
     action now, and a primary action cannot be the faintest thing
     on the screen waiting to be earned by a drag most guests will
     never make. So rest is full, and the drag only dims the side
     being turned down. */
  const brideGlow = useTransform(x, [-COMMIT_PX, 0, COMMIT_PX], [1, 1, 0.45])
  const groomGlow = useTransform(x, [-COMMIT_PX, 0, COMMIT_PX], [0.45, 1, 1])
  const brideMark = useTransform(x, [-COMMIT_PX, -20], [1, 0.25])
  const groomMark = useTransform(x, [20, COMMIT_PX], [0.25, 1])

  const commit = useCallback(
    (side) => {
      if (!live.current) return
      live.current = false
      setCommitted(side)
      /* Send the card the way the guest sent it, then hand over. */
      controls.start({
        x: side === 'groom' ? 460 : -460,
        opacity: 0,
        rotate: side === 'groom' ? 14 : -14,
        transition: { duration: 0.42, ease: [0.4, 0, 0.2, 1] },
      })
      setTimeout(() => onChoose(side), 340)
    },
    [controls, onChoose]
  )

  const handleDragEnd = useCallback(
    (_, info) => {
      const { offset, velocity } = info
      const far = Math.abs(offset.x) > COMMIT_PX
      const fast = Math.abs(velocity.x) > COMMIT_VELOCITY
      if (!far && !fast) {
        controls.start({ x: 0, rotate: 0, transition: { type: 'spring', stiffness: 320, damping: 30 } })
        return
      }
      /* A flick decides by its own direction; a slow drag by where
         it ended up. They agree except at the very edge of both. */
      commit((fast ? velocity.x : offset.x) > 0 ? 'groom' : 'bride')
    },
    [commit, controls]
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') commit('groom')
      if (e.key === 'ArrowLeft') commit('bride')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [commit])

  /* The one-time rock that says the card moves.

     A caption cannot teach a gesture — it can only describe one,
     and by the time somebody has read "swipe either way" they have
     already decided this screen is asking them to work. Showing
     the card give a little under its own weight does the whole job
     wordlessly, and it is over before it can be mistaken for an
     animation that is going to keep happening.

     It waits a beat so it lands after the screen has settled, and
     it stands down entirely if the guest has already grabbed the
     card — interrupting somebody mid-drag to demonstrate dragging
     would be its own small insult. */
  useEffect(() => {
    if (reduceMotion) return

    const id = setTimeout(() => {
      if (!live.current || grabbed.current) return
      controls.start({
        x: [0, -14, 12, 0],
        rotate: [0, -1.2, 1, 0],
        transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1], times: [0, 0.35, 0.7, 1] },
      })
    }, 1100)

    return () => clearTimeout(id)
  }, [controls, reduceMotion])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        filter: 'blur(6px)',
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
      }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 55,
        maxWidth: 'var(--shell)',
        margin: '0 auto',
        background:
          'radial-gradient(120% 90% at 50% 28%, #fbf6ea 0%, #f2e8d3 55%, #e5d5b6 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        /* Two three-line cards is more screen than the old pair of
           small boxes, so the gaps give way before the content
           does — and `auto` overflow is the last resort for a short
           landscape phone, where nothing would have fitted. */
        gap: 'clamp(14px, 3svh, 26px)',
        padding:
          'clamp(20px, 4svh, 34px) 26px calc(clamp(20px, 4svh, 34px) + env(safe-area-inset-bottom))',
        textAlign: 'center',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <div
        className="frame"
        style={{ '--frame-color': 'rgba(165,135,44,0.42)' }}
        aria-hidden="true"
      />

      {/* Both scripts, side by side — the only screen on the site
          that belongs to both families at once. */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 1 }}
        style={{ display: 'grid', gap: 4 }}
      >
        <p className="deva" style={{ fontSize: 14.5, color: 'var(--gold)' }}>
          ॥ श्री गणेशाय नमः ॥
        </p>
        <p className="tamil" style={{ fontSize: 13, color: 'var(--gold)', opacity: 0.85 }}>
          வாழ்க வளமுடன்
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 1 }}
        className="eyebrow"
        /* `ch` units don't count the tracking, so this line has to
           be held to a real width or it stacks four deep. */
        style={{
          color: 'var(--ink-soft)',
          maxWidth: 300,
          letterSpacing: '0.24em',
          lineHeight: 1.9,
        }}
      >
        Whose side are you joining us from?
      </motion.p>

      {/* The card, with an arrow standing at each edge it can go to. */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Arrow dir="left" opacity={brideMark} />

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.75}
          dragMomentum={false}
          onDragStart={() => {
            grabbed.current = true
          }}
          onDragEnd={handleDragEnd}
          animate={controls}
          style={{
            x,
            rotate,
            position: 'relative',
            touchAction: 'pan-y',
            cursor: 'grab',
            flex: '0 1 236px',
            padding: 'clamp(18px, 3.5svh, 30px) 20px clamp(16px, 3svh, 26px)',
            background:
              'linear-gradient(180deg, rgba(255,252,245,0.96) 0%, rgba(247,241,227,0.92) 100%)',
            border: '1px solid rgba(165,135,44,0.5)',
            boxShadow: '0 18px 44px rgba(62,50,38,0.16)',
            display: 'grid',
            gap: 'clamp(7px, 1.5svh, 12px)',
            justifyItems: 'center',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 5,
              border: '1px solid rgba(165,135,44,0.24)',
              pointerEvents: 'none',
            }}
          />

          <p className="deva" style={{ fontSize: 15, color: 'var(--gold)' }}>
            {COUPLE.groom.hi} <span style={{ opacity: 0.6 }}>·</span>{' '}
            {COUPLE.bride.hi}
          </p>

          <p
            style={{
              fontSize: 27,
              fontStyle: 'italic',
              fontWeight: 300,
              lineHeight: 1.15,
              color: 'var(--ink)',
            }}
          >
            {COUPLE.groom.en} &amp; {COUPLE.bride.en}
          </p>

          <p className="tamil" style={{ fontSize: 13.5, color: 'var(--gold)' }}>
            {COUPLE.bride.ta} <span style={{ opacity: 0.6 }}>·</span>{' '}
            {COUPLE.groom.ta}
          </p>

          <span
            aria-hidden="true"
            style={{ height: 1, width: 46, background: 'rgba(165,135,44,0.45)', margin: '2px 0' }}
          />

          {/* Quiet now, and no longer pulsing. The cards below are
              the instruction; this is a footnote for anyone who
              felt the card give under the nudge and wondered. */}
          <motion.p
            animate={{ opacity: committed ? 0 : 0.55 }}
            transition={{ duration: 0.4 }}
            className="eyebrow"
            style={{ color: 'var(--ink-faint)', fontSize: 9 }}
          >
            or swipe the card
          </motion.p>
        </motion.div>

        <Arrow dir="right" opacity={groomMark} />
      </div>

      {/* The actual question, answered by tapping. Each card names
          the family as well as the side, because "bride's side" is
          a category and "the Manimaran family" is the thing a guest
          actually recognises themselves in. */}
      <div
        style={{
          display: 'grid',
          gap: 10,
          width: '100%',
          maxWidth: 330,
        }}
      >
        <SideButton
          side={SIDES.bride}
          script="tamil"
          glow={brideGlow}
          onClick={() => commit('bride')}
          chosen={committed === 'bride'}
        />
        <SideButton
          side={SIDES.groom}
          script="deva"
          glow={groomGlow}
          onClick={() => commit('groom')}
          chosen={committed === 'groom'}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        style={{
          fontSize: 12.5,
          fontStyle: 'italic',
          fontWeight: 300,
          color: 'var(--ink-faint)',
          maxWidth: '30ch',
          lineHeight: 1.6,
        }}
      >
        Each side has its own ceremonies. You can change this later.
      </motion.p>
    </motion.div>
  )
}

function Arrow({ dir, opacity }) {
  const Icon = dir === 'left' ? ChevronLeft : ChevronRight
  return (
    <motion.span
      aria-hidden="true"
      style={{ opacity, color: 'var(--gold)', display: 'grid', flex: '0 0 auto' }}
    >
      <Icon size={20} strokeWidth={1.2} />
    </motion.span>
  )
}

/* One side, as a card you tap.

   Full width, left-aligned, three lines and a chevron — the shape
   of a row that goes somewhere, which is the whole point. The two
   used to share a row as small centred boxes, and at that size
   neither the tap target nor the reading order made it obvious
   they were the way through. */
function SideButton({ side, script, glow, onClick, chosen }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`${side.label.en} — ${side.house.en}`}
      style={{
        opacity: glow,
        fontFamily: 'var(--serif)',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: 12,
        textAlign: 'left',
        /* Comfortably past the 44px tap minimum, and set in the
           padding rather than a fixed height so the Tamil card and
           the Devanagari one stay the same size as their scripts
           set at different heights. */
        padding: '14px 16px',
        border: '1px solid rgba(165,135,44,0.45)',
        background: chosen ? 'rgba(201,172,92,0.22)' : 'rgba(255,252,245,0.5)',
        color: 'var(--ink)',
        cursor: 'pointer',
      }}
    >
      <span style={{ display: 'grid', gap: 3 }}>
        <span
          className={script}
          style={{
            fontSize: script === 'tamil' ? 14 : 15.5,
            color: 'var(--gold)',
            lineHeight: 1.35,
          }}
        >
          {side.label.native}
        </span>
        <span
          style={{
            fontSize: 16.5,
            fontStyle: 'italic',
            fontWeight: 300,
            lineHeight: 1.2,
          }}
        >
          {side.label.en}
        </span>
        <span
          className="eyebrow"
          style={{ color: 'var(--ink-soft)', fontSize: 9, letterSpacing: '0.18em' }}
        >
          {side.house.en}
        </span>
      </span>

      <ChevronRight
        size={18}
        strokeWidth={1.3}
        aria-hidden="true"
        style={{ color: 'var(--gold)', opacity: 0.7 }}
      />
    </motion.button>
  )
}
