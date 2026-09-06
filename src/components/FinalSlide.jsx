import { MessageCircle } from 'lucide-react'
import PlateArt from './PlateArt'
import Frame from './Frame'
import Reveal from './Reveal'
import { useEasedProgress, useSlideProgress } from '../hooks/useSlideScroll'
import { BLESSING, RSVP, COUPLE, rsvpLink } from '../data/wedding'

/* The closing slide carries the blessing and the only real action
   on the site: replying. RSVP goes straight to a WhatsApp message
   addressed to Harish Chandra Bhatt — no form, no server, and the
   guests who need it most already know how to use it.

   Nothing follows this slide, so it never plays a leaving state —
   it arrives and stays put. */
export default function FinalSlide({ index }) {
  const p = useSlideProgress(index)
  const eased = useEasedProgress(index)

  return (
    <section className="slide" aria-label="Blessings and RSVP">
      <PlateArt
        src="/plates/blessing.jpg"
        wash={['#3a2f24', '#54402c', '#7d5a33']}
        dark
        p={p}
      />
      <Frame color="rgba(201,172,92,0.45)" />

      <div
        className="copy"
        style={{
          color: 'var(--ivory)',
          paddingBottom: 52,
          textAlign: 'center',
        }}
      >
        {BLESSING.lines.map((line, i) => (
          <Reveal
            key={line}
            p={eased}
            order={i}
            style={{
              fontSize: 16,
              fontStyle: 'italic',
              fontWeight: 300,
              lineHeight: 1.65,
              opacity: 0.88,
              marginBottom: i === BLESSING.lines.length - 1 ? 30 : 7,
            }}
          >
            {line}
          </Reveal>
        ))}

        <Reveal
          p={eased}
          order={3}
          className="deva"
          style={{ fontSize: 20, color: 'var(--gold-light)', marginBottom: 6 }}
        >
          {COUPLE.groom.hi} &amp; {COUPLE.bride.hi}
        </Reveal>

        <Reveal
          p={eased}
          order={4}
          y={30}
          className="display"
          style={{ fontSize: 'clamp(34px, 10vw, 46px)', marginBottom: 26 }}
        >
          {COUPLE.groom.en} &amp; {COUPLE.bride.en}
        </Reveal>

        <Reveal
          p={eased}
          order={5}
          style={{
            fontSize: 15.5,
            fontStyle: 'italic',
            fontWeight: 300,
            opacity: 0.85,
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          {BLESSING.closing}
        </Reveal>

        <Reveal p={eased} order={6}>
          <a
            className="btn"
            href={rsvpLink()}
            target="_blank"
            rel="noreferrer"
            style={{
              color: '#2f2419',
              background: 'var(--gold-light)',
              borderColor: 'var(--gold-light)',
            }}
          >
            <MessageCircle size={15} strokeWidth={1.5} aria-hidden="true" />
            Let us know you are coming
          </a>

          <p style={{ marginTop: 20, fontSize: 13.5, opacity: 0.72, lineHeight: 1.6 }}>
            {RSVP.name} · {RSVP.relation}
            <br />
            <a
              href={`tel:+${RSVP.phone}`}
              style={{ color: 'var(--gold-light)', textDecoration: 'none' }}
            >
              {RSVP.display}
            </a>
          </p>

          <p
            style={{
              marginTop: 26,
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              opacity: 0.5,
            }}
          >
            {COUPLE.city} · {COUPLE.dateRange}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
