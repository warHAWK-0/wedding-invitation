import { useState } from 'react'
import { motion, useTransform } from 'framer-motion'

/* ============================================================
   A cut-out illustration sitting on a slide.

   This is not the same thing as `PlateArt`. A plate is the
   photograph behind everything, cropped to fill and dimmed by a
   scrim so type can sit on it. These are transparent pieces of
   art — garlands, a procession, a gold spray — that belong *on*
   the paper, over the wash, with nothing dimming them.

   They are built the way the hero's lines are: an optional
   one-shot entrance on the outside, and the scroll link on the
   inside. So the art arrives with the copy and then drifts and
   fades as the slide leaves, rather than staying pinned to the
   frame while everything around it moves.

   Art that drifts less than the plate behind it reads as sitting
   on the paper; art that drifts more reads as being in the
   picture. These sit on the paper.
   ============================================================ */
export default function SlideArt({
  src,
  /* Any CSS width. Full-bleed art (the haldi garlands) wants
     '100%'; a centred piece wants a px number. */
  width = 220,
  top = 30,
  /* Where the art sits across the slide. Most pieces are centred,
     but art drawn against its own edge — foliage cut off at the
     stem, a border — has to be pinned to that side and allowed to
     run off it, or the cut shows as a line down the page. */
  align = 'center',
  /* Distance from that edge. Negative hangs the art off the slide,
     which is what puts a cut safely out of sight. */
  inset = 0,
  /* Space under flow art, mirroring `top`. Making the two
     adjustable is how the picture is nudged up or down inside the
     space it is centred in. */
  bottom = 18,
  opacity: peak = 1,
  /* Pass `play` for a one-shot entrance (the hero, and the
     thank-you, which both appear without a scroll to ride in on).
     Leave it out on a scrolled slide and the scroll link does all
     the work. */
  play,
  /* Absolutely positioned art can collide with the copy on a short
     screen, because the two are placed independently — the copy is
     anchored to the bottom and grows upward, while the art is
     pinned to the top. On slides where the copy is tall that is a
     real risk, so `flow` puts the art in the layout instead: it
     becomes the flex item above the copy, takes whatever height is
     left, and scales down to fit. The two can then never overlap,
     at any viewport height. */
  flow = false,
  p,
}) {
  const [ok, setOk] = useState(true)

  const y = useTransform(p, [0, 1], [-16, 16])
  /* Arrives with the copy, holds while the slide is at rest, and
     is gone before the seam with the next one. */
  const opacity = useTransform(p, [0.16, 0.34, 0.62, 0.78], [0, peak, peak, 0])

  if (!ok) return null

  const image = (
    <motion.img
      src={src}
      alt=""
      onError={() => setOk(false)}
      /* In flow mode the image is bounded on both axes and keeps
         its ratio, so a short screen shrinks it rather than letting
         it run into the type. Otherwise the wrapper owns the size
         and the image fills it, so a percentage width scales the
         art up to meet the edge instead of stopping at its own
         natural width. */
      style={
        flow
          ? {
              y,
              opacity,
              display: 'block',
              /* Bounded on both axes and left at its natural
                 ratio, so the element box *is* the picture — no
                 dead space inside it. Filling the box and letting
                 `contain` letterbox instead would park all the
                 slack on one side of the image, which is what made
                 the portrait sit low with a hole above it.

                 A percentage max-height needs a definite height to
                 resolve against; it gets one here because the flex
                 item above has been sized by the time this is
                 laid out. */
              maxWidth: width,
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
            }
          : { y, opacity, width: '100%', display: 'block' }
      }
    />
  )

  const inner = flow ? (
    image
  ) : (
    <div
      style={{
        width,
        maxWidth: align === 'center' ? '100%' : undefined,
        marginLeft: align === 'left' ? inset : undefined,
        marginRight: align === 'right' ? inset : undefined,
      }}
    >
      {image}
    </div>
  )

  const frame = flow ? (
    /* A flex item, not an overlay: it holds the space above the
       copy and gives back whatever it does not need. */
    <div
      /* `position: relative` is load-bearing, not cosmetic. Within
         one stacking context a positioned element paints above a
         static one whatever the document order, and the plate
         behind this is absolutely positioned — so a static wrapper
         here is painted over by the plate and the art vanishes
         completely. Positioned and z-auto puts it back in document
         order: above the plate, still below the frame. */
      style={{
        position: 'relative',
        flex: '1 1 auto',
        minHeight: 0,
        /* Centred in whatever room is left, so a taller phone adds
           air evenly above and below rather than all of it above. */
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: top,
        paddingBottom: bottom,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {inner}
    </div>
  ) : (
    <div
      /* No z-index on purpose. The gold frame is the one device
         every slide shares, and full-bleed art with a positive
         z-index paints straight over it. Left on `auto`, this
         stacks by document order — above the plate, under the
         frame, and under the copy, which carries its own z-index. */
      style={{
        position: 'absolute',
        top,
        left: 0,
        right: 0,
        display: 'grid',
        justifyItems:
          align === 'left' ? 'start' : align === 'right' ? 'end' : 'center',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {inner}
    </div>
  )

  if (play === undefined) return frame

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.94 }}
      animate={play ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
      transition={{ delay: 0.15, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {frame}
    </motion.div>
  )
}
