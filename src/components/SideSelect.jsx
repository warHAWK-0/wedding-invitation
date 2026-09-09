import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useAnimationControls,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { COUPLE, SIDES } from '../data/wedding'

/* ============================================================
   The fork in the road.

   Two families, two languages, two lists of functions — and one
   link that goes to everybody. So before the invite proper, one
   screen asks which half of the wedding the guest belongs to.

   Swiping is the gesture the screen is built around: the card
   leans toward whichever side you are pulling it to, and the
   label on that edge lifts as the other fades. But a swipe is
   never the only way through — the two labels are real buttons,
   and the arrow keys do the same job — because a good number of
   these guests will be opening the link on a laptop, or with a
   screen reader, or with hands that don't swipe reliably.
   ============================================================ */

/* Past this much drag (or this much flick), releasing commits. */
const COMMIT_PX = 88
const COMMIT_VELOCITY = 480

export default function SideSelect({ onChoose }) {
  const [committed, setCommitted] = useState(null)
  const controls = useAnimationControls()
  const x = useMotionValue(0)
  const live = useRef(true)

  /* The card leans into the pull rather than sliding flat — it is
     what makes the gesture feel like turning toward a family
     rather than dismissing a notification. */
  const rotate = useTransform(x, [-180, 0, 180], [-10, 0, 10])

  /* Each edge label brightens as the card comes toward it. */
  const brideGlow = useTransform(x, [-COMMIT_PX, -12, 0], [1, 0.55, 0.42])
  const groomGlow = useTransform(x, [0, 12, COMMIT_PX], [0.42, 0.55, 1])
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
        gap: 26,
        padding: '34px 26px calc(34px + env(safe-area-inset-bottom))',
        textAlign: 'center',
        overflow: 'hidden',
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
          onDragEnd={handleDragEnd}
          animate={controls}
          style={{
            x,
            rotate,
            position: 'relative',
            touchAction: 'pan-y',
            cursor: 'grab',
            flex: '0 1 236px',
            padding: '30px 20px 26px',
            background:
              'linear-gradient(180deg, rgba(255,252,245,0.96) 0%, rgba(247,241,227,0.92) 100%)',
            border: '1px solid rgba(165,135,44,0.5)',
            boxShadow: '0 18px 44px rgba(62,50,38,0.16)',
            display: 'grid',
            gap: 12,
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

          <motion.p
            animate={committed ? { opacity: 0 } : { opacity: [0.45, 1, 0.45] }}
            transition={
              committed
                ? { duration: 0.2 }
                : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }
            className="eyebrow"
            style={{ color: 'var(--ink-faint)', fontSize: 9 }}
          >
            Swipe either way
          </motion.p>
        </motion.div>

        <Arrow dir="right" opacity={groomMark} />
      </div>

      {/* The same two choices as plain buttons. Anyone who would
          rather tap, or is on a laptop, never has to discover the
          gesture at all. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
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
        gap: 5,
        justifyItems: 'center',
        padding: '12px 8px',
        border: '1px solid rgba(165,135,44,0.45)',
        background: chosen ? 'rgba(201,172,92,0.22)' : 'transparent',
        color: 'var(--ink)',
        cursor: 'pointer',
      }}
    >
      <span
        className={script}
        style={{ fontSize: script === 'tamil' ? 13 : 14.5, color: 'var(--gold)' }}
      >
        {side.label.native}
      </span>
      <span
        className="eyebrow"
        style={{ color: 'var(--ink-soft)', fontSize: 9, letterSpacing: '0.2em' }}
      >
        {side.label.en}
      </span>
    </motion.button>
  )
}
