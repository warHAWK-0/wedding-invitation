import { ChevronDown, Repeat } from 'lucide-react'
import PlateArt from './PlateArt'
import SlideArt from './SlideArt'
import Frame from './Frame'
import Reveal from './Reveal'
import { useEasedProgress, useSlideProgress } from '../hooks/useSlideScroll'
import { useSide } from '../hooks/useSide'
import { BLESSING, BLESSING_ART, CONTACT, COUPLE, SIDES } from '../data/wedding'

/* The closing blessing, and the handover to the reply.

   The button used to open WhatsApp; it now carries the guest down
   to the RSVP slide, which is the last thing on the site. Keeping
   it in the same place, at the same weight, matters more than
   what it does — it is the one thing on the page a guest is meant
   to press, and the blessing above it is what earns the press.

   It also carries the way back. A guest who swiped the wrong way
   at the start would otherwise have to close the tab and reopen
   the link to find out, so the offer to switch sits here — before
   the form, so a reply is never filed under the wrong family. */
export default function FinalSlide({ index, onSwitchSide }) {
  const { side, other, copy, script } = useSide()
  const p = useSlideProgress(index)
  const eased = useEasedProgress(index)

  const blessing = BLESSING[side]
  /* Only the groom's side has a contact to give out. */
  const contact = CONTACT[side]

  return (
    <section className="slide" aria-label="Blessings and RSVP">
      <PlateArt
        src="/plates/blessing.jpg"
        wash={['#3a2f24', '#54402c', '#7d5a33']}
        dark
        p={p}
      />
      <SlideArt {...BLESSING_ART} flow p={p} />

      <Frame color="rgba(201,172,92,0.45)" />

      <div
        className="copy"
        style={{
          color: 'var(--ivory)',
          paddingBottom: 40,
          textAlign: 'center',
          flex: '0 0 auto',
        }}
      >
        {blessing.lines.map((line, i) => (
          <Reveal
            key={line}
            p={eased}
            order={i}
            style={{
              fontSize: 16,
              fontStyle: 'italic',
              fontWeight: 300,
              /* One sentence broken over three lines, so they are
                 set as a paragraph rather than three statements —
                 the old 7px between each read as a list. */
              lineHeight: 1.5,
              opacity: 0.88,
              marginBottom: i === blessing.lines.length - 1 ? 20 : 1,
            }}
          >
            {line}
          </Reveal>
        ))}

        <Reveal
          p={eased}
          order={3}
          className={script}
          style={{
            fontSize: script === 'tamil' ? 17 : 20,
            color: 'var(--gold-light)',
            marginBottom: 6,
          }}
        >
          {copy.nativePair}
        </Reveal>

        <Reveal
          p={eased}
          order={4}
          y={30}
          className="display"
          style={{ fontSize: 'clamp(34px, 10vw, 46px)', marginBottom: 18 }}
        >
          {copy.first} &amp; {copy.second}
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
            marginBottom: 22,
          }}
        >
          {blessing.closing}
        </Reveal>

        <Reveal p={eased} order={6}>
          <button
            className="btn"
            type="button"
            onClick={() =>
              document
                .getElementById('rsvp')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            style={{
              color: '#2f2419',
              background: 'var(--gold-light)',
              borderColor: 'var(--gold-light)',
            }}
          >
            <ChevronDown size={15} strokeWidth={1.5} aria-hidden="true" />
            Let us know you are coming
          </button>

          {contact && (
            <p style={{ marginTop: 14, fontSize: 13.5, opacity: 0.72, lineHeight: 1.55 }}>
              {contact.name} · {contact.relation}
              <br />
              {/* Only a real number becomes a tel: link. A
                  placeholder stays plain text, so nobody can tap it
                  and ring a stranger. */}
              {contact.phone ? (
                <a
                  href={`tel:+${contact.phone}`}
                  style={{ color: 'var(--gold-light)', textDecoration: 'none' }}
                >
                  {contact.display}
                </a>
              ) : (
                <span style={{ color: 'var(--gold-light)' }}>{contact.display}</span>
              )}
            </p>
          )}

          <p
            style={{
              marginTop: 16,
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              opacity: 0.5,
            }}
          >
            {COUPLE.city} · {COUPLE.dateRange}
          </p>

          {/* Deliberately understated. It is a correction, not a
              second invitation. */}
          <button
            type="button"
            onClick={onSwitchSide}
            style={{
              marginTop: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '6px 4px',
              border: 0,
              background: 'transparent',
              fontFamily: 'var(--serif)',
              fontSize: 12.5,
              fontStyle: 'italic',
              color: 'var(--ivory)',
              opacity: 0.6,
              cursor: 'pointer',
            }}
          >
            <Repeat size={12} strokeWidth={1.4} aria-hidden="true" />
            Viewing the {SIDES[side].label.en.toLowerCase()} — switch to the{' '}
            {SIDES[other].label.en.toLowerCase()}
          </button>
        </Reveal>
      </div>
    </section>
  )
}
