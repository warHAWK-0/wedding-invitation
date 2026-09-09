import { useState } from 'react'
import { motion } from 'framer-motion'
import { COUPLE } from '../data/wedding'

/* The first screen. One job: invite a tap.
   The tap is also what unlocks audio on mobile, so it does double duty.

   This is the one screen that arrives before the guest has told us
   which family they are with, so it speaks to both: the Devanagari
   invocation over the Tamil blessing, one above the other. They
   are not translations of each other — each is the line its own
   side would actually open a wedding card with. */
export default function EnvelopeIntro({ onFirstTouch, onOpen }) {
  const [opening, setOpening] = useState(false)
  const [sealOk, setSealOk] = useState(true)

  const handleOpen = () => {
    if (opening) return
    setOpening(true)
    onOpen()
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      /* Lifts and opens toward the guest rather than dissolving in
         place, so it hands over to the hero instead of cutting. The
         hero's own entrance is timed to start underneath this. */
      exit={{
        opacity: 0,
        scale: 1.08,
        filter: 'blur(6px)',
        transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
      }}
      onTouchStart={onFirstTouch}
      onMouseDown={onFirstTouch}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        maxWidth: 'var(--shell)',
        margin: '0 auto',
        background:
          'radial-gradient(120% 90% at 50% 30%, #fbf6ea 0%, #f2e8d3 55%, #e5d5b6 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        padding: 34,
        textAlign: 'center',
      }}
    >
      <div
        className="frame"
        style={{ '--frame-color': 'rgba(165,135,44,0.42)' }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.1 }}
        style={{ display: 'grid', gap: 5, color: 'var(--gold)' }}
      >
        <p className="deva" style={{ fontSize: 17, letterSpacing: '0.02em' }}>
          ॥ श्री गणेशाय नमः ॥
        </p>
        <p className="tamil" style={{ fontSize: 14.5, opacity: 0.85 }}>
          வாழ்க வளமுடன்
        </p>
      </motion.div>

      <motion.button
        onClick={handleOpen}
        aria-label="Open the invitation"
        animate={opening ? { scale: 1.06, opacity: 0 } : { y: [0, -8, 0] }}
        transition={
          opening
            ? { duration: 0.5 }
            : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          border: 0,
          background: 'transparent',
          padding: 0,
          cursor: 'pointer',
          width: 196,
          maxWidth: '52vw',
        }}
      >
        {sealOk ? (
          <img
            src="/plates/seal.png"
            alt=""
            onError={() => setSealOk(false)}
            style={{ width: '100%', display: 'block' }}
          />
        ) : (
          <SealFallback />
        )}
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1.2 }}
        style={{ display: 'grid', gap: 14 }}
      >
        <p
          style={{
            fontSize: 25,
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'var(--ink)',
          }}
        >
          {COUPLE.groom.en} &amp; {COUPLE.bride.en}
        </p>

        <motion.p
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="eyebrow"
          style={{ color: 'var(--ink-soft)' }}
        >
          Tap to open
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

/* Drawn seal, used until seal.png exists. */
function SealFallback() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: '100%', display: 'block' }}>
      <g fill="none" stroke="#a5872c" strokeWidth="1.2">
        <circle cx="100" cy="100" r="76" opacity="0.55" />
        <circle cx="100" cy="100" r="68" opacity="0.3" />
        {Array.from({ length: 16 }).map((_, i) => (
          <path
            key={i}
            d="M100 24 Q108 40 100 52 Q92 40 100 24"
            transform={`rotate(${i * 22.5} 100 100)`}
            opacity="0.5"
          />
        ))}
        <path d="M100 62 Q124 78 124 104 Q124 132 100 142 Q76 132 76 104 Q76 78 100 62" />
        <path d="M100 78 Q112 90 112 106 Q112 122 100 130 Q88 122 88 106 Q88 90 100 78" opacity="0.6" />
        <circle cx="100" cy="104" r="5" fill="#a5872c" stroke="none" />
      </g>
    </svg>
  )
}
