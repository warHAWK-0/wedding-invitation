import { motion, useTransform } from 'framer-motion'
import { MapPin } from 'lucide-react'
import PlateArt from './PlateArt'
import Frame from './Frame'
import Reveal from './Reveal'
import { useEasedProgress, useSlideProgress } from '../hooks/useSlideScroll'
import { EVENTS } from '../data/wedding'

/* Every ceremony slide is drawn from this one component.
   Details are set as a ruled ledger rather than icon cards — it reads
   the way the printed card would, and keeps the plate art breathing. */
export default function EventCards({ start = 0 }) {
  return (
    <>
      {EVENTS.map((e, i) => (
        <EventSlide key={e.id} event={e} index={start + i} />
      ))}
    </>
  )
}

function EventSlide({ event, index }) {
  const light = event.dark ? '#f4efe3' : 'var(--ivory)'
  const p = useSlideProgress(index)
  const eased = useEasedProgress(index)

  /* The ledger rules draw in from the left as the slide arrives.
     Small thing, but it is what makes the block feel typeset
     rather than dropped in. */
  const ruleScale = useTransform(eased, [0.28, 0.46, 0.72, 0.82], [0, 1, 1, 0])

  return (
    <section className="slide" id={event.id} aria-label={event.en}>
      <PlateArt src={event.plate} wash={event.wash} dark={event.dark} p={p} />
      <Frame color="rgba(247,241,227,0.42)" />

      <div className="copy" style={{ color: light }}>
        <Reveal
          p={eased}
          order={0}
          className="eyebrow"
          style={{ color: 'var(--gold-light)', marginBottom: 12 }}
        >
          {event.eyebrow}
        </Reveal>

        <Reveal
          p={eased}
          order={1}
          className="deva"
          style={{ fontSize: 19, opacity: 0.88, marginBottom: 2 }}
        >
          {event.hi}
        </Reveal>

        <Reveal
          p={eased}
          order={2}
          y={32}
          className="display"
          style={{ fontSize: 'clamp(38px, 11vw, 54px)' }}
        >
          {event.en}
        </Reveal>

        <Reveal
          p={eased}
          order={3}
          style={{
            margin: '16px 0 22px',
            fontSize: 15.5,
            fontStyle: 'italic',
            fontWeight: 300,
            lineHeight: 1.6,
            opacity: 0.86,
            maxWidth: '32ch',
          }}
        >
          {event.note}
        </Reveal>

        <Reveal p={eased} order={4}>
          <dl style={{ display: 'grid', gap: 0 }}>
            <Row
              label={event.day}
              value={event.date}
              light={light}
              ruleScale={ruleScale}
            />
            <Row
              label="Time"
              value={event.time}
              light={light}
              ruleScale={ruleScale}
            />
            <Row
              label="Venue"
              light={light}
              ruleScale={ruleScale}
              value={
                <>
                  {event.venue.name}
                  <span style={{ display: 'block', opacity: 0.68, fontSize: 13 }}>
                    {event.venue.area}
                  </span>
                </>
              }
            />
          </dl>
        </Reveal>

        <Reveal p={eased} order={5}>
          <a
            className="btn"
            href={event.venue.maps}
            target="_blank"
            rel="noreferrer"
            style={{
              marginTop: 22,
              color: light,
              borderColor: 'rgba(247,241,227,0.45)',
            }}
          >
            <MapPin size={14} strokeWidth={1.5} aria-hidden="true" />
            View map
          </a>
        </Reveal>
      </div>
    </section>
  )
}

function Row({ label, value, light, ruleScale }) {
  const rule =
    light === 'var(--ivory)'
      ? 'rgba(247,241,227,0.24)'
      : 'rgba(244,239,227,0.22)'

  return (
    <div
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '78px 1fr',
        gap: 14,
        padding: '11px 0',
        alignItems: 'baseline',
      }}
    >
      <motion.span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: rule,
          scaleX: ruleScale,
          transformOrigin: 'left',
        }}
      />
      <dt
        style={{
          fontSize: 9.5,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: 0.62,
        }}
      >
        {label}
      </dt>
      <dd style={{ fontSize: 15.5, lineHeight: 1.45 }}>{value}</dd>
    </div>
  )
}
