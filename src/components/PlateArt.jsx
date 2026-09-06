import { useState } from 'react'
import { motion, useTransform } from 'framer-motion'

/* ============================================================
   The illustrated plate behind each slide.

   Until the artwork exists it falls back to a soft wash built
   from that scene's palette, so the site is shareable before the
   Runway plates are approved. Drop the jpg in and it takes over.

   Three things move with the scroll, all off one motion value:

   1. Parallax — the art drifts down as the slide travels up, so
      it reads as sitting behind the frame rather than printed on
      it.
   2. Breath — a slow scale that is widest off-centre and settles
      when the slide is at rest, so arriving feels like coming to
      a stop rather than stopping dead.
   3. The veil — the reason the seam works. Two full-bleed plates
      butted together is a cut; each one sinking into its own
      shadow as it leaves, and rising out of it as it arrives, is
      a dissolve. Both halves are veiled at the moment they share
      the screen, so their palettes never clash.
   ============================================================ */

/* Parallax travel, in px, each way from centre. Kept well inside
   the scale slack below so the plate edge never shows. */
const DRIFT = 34

export default function PlateArt({ src, wash, dark, p }) {
  const [ok, setOk] = useState(Boolean(src))
  const [a, b, c] = wash

  const y = useTransform(p, [0, 1], [-DRIFT, DRIFT])
  const scale = useTransform(p, [0, 0.5, 1], [1.18, 1.1, 1.18])
  const veil = useTransform(p, [0.2, 0.5, 0.8], [0.72, 0, 0.72])

  const shadow = dark ? '#12141f' : '#2a1f14'

  return (
    <div className="plate">
      <motion.div className="plate__layer" style={{ y, scale }}>
        <div
          className="plate__wash"
          style={{
            background: `radial-gradient(120% 80% at 50% 8%, ${a} 0%, ${b} 52%, ${c} 100%)`,
          }}
        />

        {src && ok && (
          <img
            className="plate__img"
            src={src}
            alt=""
            onError={() => setOk(false)}
          />
        )}
      </motion.div>

      {/* Reading scrim: keeps the copy legible over any plate. */}
      <div
        className="plate__scrim"
        style={{
          background: dark
            ? 'linear-gradient(to top, rgba(18,20,32,0.92) 0%, rgba(18,20,32,0.55) 34%, rgba(18,20,32,0.05) 62%)'
            : 'linear-gradient(to top, rgba(46,36,24,0.86) 0%, rgba(46,36,24,0.42) 34%, rgba(46,36,24,0) 62%)',
        }}
      />

      {/* Transition veil: zero at rest, deep at the seam. */}
      <motion.div
        className="plate__veil"
        style={{ opacity: veil, background: shadow }}
      />
    </div>
  )
}
