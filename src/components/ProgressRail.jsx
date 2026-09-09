import { Fragment } from 'react'

/* A tick per slide down the left edge. It encodes the sequence
   for whichever side is reading, with a small gold dot marking
   where the 13th ends and the 14th begins — so you always know
   where you are in the arc.

   The two sides attend different functions, so the day break sits
   at a different tick on each: it is found from the list rather
   than counted out here. */
export default function ProgressRail({ index, total, events, eventsStart }) {
  const firstDay = events.filter((e) => e.day === 'Sunday').length
  const breakAfter = firstDay ? eventsStart + firstDay - 1 : -1

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
