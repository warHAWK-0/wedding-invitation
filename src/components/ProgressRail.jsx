import { Fragment } from 'react'
import { EVENTS } from '../data/wedding'

/* A tick per slide down the left edge. It encodes the two-day
   sequence, with a small gold dot marking where the 13th ends and
   the 14th begins — so you always know where you are in the arc. */
const EVENTS_START = 2 // hero, countdown, then the ceremonies

export default function ProgressRail({ index, total }) {
  const firstDay = EVENTS.filter((e) => e.day === 'Sunday').length
  const breakAfter = EVENTS_START + firstDay - 1

  return (
    <div className="rail" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <Fragment key={i}>
          <span
            className="rail__tick"
            data-on={i === index}
            style={{ background: i === index ? 'var(--gold)' : 'var(--ink-faint)' }}
          />
          {i === breakAfter && <span className="rail__day" />}
        </Fragment>
      ))}
    </div>
  )
}
