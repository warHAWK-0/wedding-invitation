import { motion, useTransform } from 'framer-motion'

/* ============================================================
   A line of copy, tied to the slide's scroll progress.

   `order` staggers it: 0 is the first line up, each step after
   arrives a beat later. The stagger is a function of scroll
   position rather than a timer, so it plays forwards as the
   guest scrolls down, backwards as they scroll up, and holds
   still if they stop halfway. Nothing ever pops.
   ============================================================ */
export default function Reveal({
  p,
  order = 0,
  y = 26,
  className,
  style,
  children,
}) {
  /* Arrive between `start` and `end`, hold through the rest
     position, then leave. The last line in the longest stack must
     still finish arriving before 0.5 — the final slide parks there
     permanently, and anything mid-transition would sit forever at
     part opacity. */
  const start = 0.12 + Math.min(order, 6) * 0.025
  const end = start + 0.16

  const opacity = useTransform(p, [start, end, 0.64, 0.8], [0, 1, 1, 0])
  const translate = useTransform(p, [start, end, 0.8], [y, 0, -y * 0.7])

  return (
    <motion.div
      className={className}
      style={{ ...style, opacity, y: translate, willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

/* The hero is the one slide that also needs a one-shot entrance,
   because it is already on screen when the envelope lifts and has
   no "arriving" scroll to ride in on. The outer div plays that
   entrance once; the inner one carries the scroll link. Keeping
   them separate means the two never fight over the same value. */
export function IntroReveal({
  p,
  play,
  delay = 0,
  order = 0,
  y = 26,
  className,
  style,
  children,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Reveal p={p} order={order} y={y} className={className} style={style}>
        {children}
      </Reveal>
    </motion.div>
  )
}
