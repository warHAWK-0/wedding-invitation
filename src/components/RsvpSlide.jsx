import { useState } from 'react'
import { motion, useTransform } from 'framer-motion'
import { Check, Minus, Plus, Send } from 'lucide-react'
import PlateArt from './PlateArt'
import SlideArt from './SlideArt'
import Frame from './Frame'
import Reveal from './Reveal'
import { useEasedProgress, useSlideProgress } from '../hooks/useSlideScroll'
import { useSide } from '../hooks/useSide'
import useRsvp from '../hooks/useRsvp'
import { RSVP_COPY, RSVP_FORM } from '../data/wedding'

/* ============================================================
   The reply.

   Same frame, same ledger rules, same scroll-linked reveals as
   every other slide — set on a deep garden green, the one ground
   the invite has not used yet. It reads as the last page of the
   same card rather than a form bolted onto the end.

   The fields are ruled lines, not boxes: it is the same device
   the ceremony slides use for day, time and venue, so the guest
   is writing onto the invitation rather than filling in a web
   form.

   Nothing follows this slide, so it never plays a leaving state.
   ============================================================ */

const WASH = ['#2b3a2c', '#3d5132', '#6d7f48']

export default function RsvpSlide({ index }) {
  const { side, script } = useSide()
  const copy = RSVP_COPY[side]
  const p = useSlideProgress(index)
  const eased = useEasedProgress(index)

  const { status, reply, error, submit, reset } = useRsvp()

  const [name, setName] = useState('')
  const [guests, setGuests] = useState(2)
  const [touched, setTouched] = useState(false)

  const ruleScale = useTransform(eased, [0.28, 0.46], [0, 1])

  const nameOk = name.trim().length > 1
  const sending = status === 'sending'

  const onSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (!nameOk || sending) return
    await submit({ name, guests, side })
  }

  return (
    <section className="slide" id="rsvp" aria-label="RSVP">
      <PlateArt src="/plates/rsvp.jpg" wash={WASH} dark p={p} />

      {/* Gold on the deep green, and only once they have replied —
          the form stays plain so nothing competes with the two
          fields. It arrives on the state change rather than on a
          scroll, so it plays its own entrance. */}
      {status === 'done' && (
        <SlideArt
          src="/plates/golden-flower.png"
          width={250}
          top={54}
          opacity={0.9}
          play
          p={eased}
        />
      )}

      <Frame color="rgba(201,172,92,0.4)" />

      <div className="copy" style={{ color: 'var(--ivory)', paddingBottom: 40 }}>
        {status === 'done' ? (
          <Done copy={copy} script={script} reply={reply} p={eased} onAgain={reset} />
        ) : (
          <>
            <Reveal
              p={eased}
              order={0}
              className="eyebrow"
              style={{ color: 'var(--gold-light)', marginBottom: 10 }}
            >
              {copy.eyebrow}
            </Reveal>

            <Reveal
              p={eased}
              order={1}
              className={script}
              style={{
                fontSize: script === 'tamil' ? 16 : 18,
                opacity: 0.88,
                marginBottom: 2,
              }}
            >
              {copy.native}
            </Reveal>

            <Reveal
              p={eased}
              order={2}
              y={30}
              className="display"
              style={{ fontSize: 'clamp(32px, 9.4vw, 46px)' }}
            >
              {copy.en}
            </Reveal>

            <Reveal
              p={eased}
              order={3}
              style={{
                margin: '14px 0 20px',
                fontSize: 15,
                fontStyle: 'italic',
                fontWeight: 300,
                lineHeight: 1.6,
                opacity: 0.84,
                maxWidth: '32ch',
              }}
            >
              {copy.note}
            </Reveal>

            <Reveal p={eased} order={4}>
              <form onSubmit={onSubmit} noValidate>
                {/* The name gets the whole width under its label;
                    the stepper sits out on the same line as its
                    own, the way a printed form would set them. */}
                <Ruled ruleScale={ruleScale} stacked>
                  <label className="field__label" htmlFor="rsvp-name">
                    Your name
                  </label>
                  <input
                    id="rsvp-name"
                    className="field__input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="As we would know you"
                    autoComplete="name"
                    enterKeyHint="done"
                    aria-invalid={touched && !nameOk}
                    disabled={sending}
                  />
                </Ruled>

                <Ruled ruleScale={ruleScale}>
                  <span className="field__label" id="rsvp-guests-label">
                    How many are coming
                  </span>
                  <Stepper
                    value={guests}
                    onChange={setGuests}
                    disabled={sending}
                    labelledBy="rsvp-guests-label"
                  />
                </Ruled>

                {/* One line, reserved whether or not it is in use, so
                    the button never jumps as a message appears. */}
                <p
                  role="status"
                  style={{
                    minHeight: 18,
                    margin: '12px 0 4px',
                    fontSize: 12.5,
                    fontStyle: 'italic',
                    lineHeight: 1.45,
                    color: error ? '#f0b189' : 'var(--gold-light)',
                    opacity: error || (touched && !nameOk) ? 0.95 : 0,
                  }}
                >
                  {error || (touched && !nameOk ? 'Please tell us your name.' : '·')}
                </p>

                <button
                  className="btn"
                  type="submit"
                  disabled={sending}
                  style={{
                    color: '#22301f',
                    background: 'var(--gold-light)',
                    borderColor: 'var(--gold-light)',
                    opacity: sending ? 0.7 : 1,
                  }}
                >
                  <Send size={14} strokeWidth={1.5} aria-hidden="true" />
                  {sending ? 'Sending…' : 'Send our reply'}
                </button>
              </form>
            </Reveal>
          </>
        )}
      </div>
    </section>
  )
}

/* A field on a ruled line — the same device the ceremony slides
   use for day, time and venue. */
function Ruled({ ruleScale, stacked, children }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: stacked ? '1fr' : '1fr auto',
        alignItems: 'center',
        gap: stacked ? 0 : 12,
        padding: '13px 0',
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
          background: 'rgba(247,241,227,0.24)',
          scaleX: ruleScale,
          transformOrigin: 'left',
        }}
      />
      {children}
    </div>
  )
}

function Stepper({ value, onChange, disabled, labelledBy }) {
  const step = (by) =>
    onChange(
      Math.min(RSVP_FORM.maxGuests, Math.max(RSVP_FORM.minGuests, value + by))
    )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <StepButton
        onClick={() => step(-1)}
        disabled={disabled || value <= RSVP_FORM.minGuests}
        label="One fewer guest"
      >
        <Minus size={14} strokeWidth={1.6} />
      </StepButton>

      <output
        aria-live="polite"
        aria-labelledby={labelledBy}
        style={{
          minWidth: 38,
          textAlign: 'center',
          fontSize: 20,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </output>

      <StepButton
        onClick={() => step(1)}
        disabled={disabled || value >= RSVP_FORM.maxGuests}
        label="One more guest"
      >
        <Plus size={14} strokeWidth={1.6} />
      </StepButton>
    </div>
  )
}

function StepButton({ onClick, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        display: 'grid',
        placeItems: 'center',
        width: 32,
        height: 32,
        border: '1px solid rgba(247,241,227,0.4)',
        background: 'transparent',
        color: 'var(--ivory)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.35 : 1,
      }}
    >
      {children}
    </button>
  )
}

/* What a guest sees once they have replied — on this visit, or on
   any later one, since the reply is remembered on the device. */
function Done({ copy, script, reply, p, onAgain }) {
  return (
    <>
      <Reveal p={p} order={0}>
        <span
          aria-hidden="true"
          style={{
            display: 'grid',
            placeItems: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '1px solid var(--gold-light)',
            color: 'var(--gold-light)',
            marginBottom: 18,
          }}
        >
          <Check size={18} strokeWidth={1.4} />
        </span>
      </Reveal>

      <Reveal
        p={p}
        order={1}
        className={script}
        style={{
          fontSize: script === 'tamil' ? 17 : 19,
          color: 'var(--gold-light)',
          marginBottom: 2,
        }}
      >
        {copy.doneNative}
      </Reveal>

      <Reveal
        p={p}
        order={2}
        y={30}
        className="display"
        style={{ fontSize: 'clamp(34px, 10vw, 48px)' }}
      >
        {copy.doneEn}
      </Reveal>

      <Reveal
        p={p}
        order={3}
        style={{
          margin: '16px 0 22px',
          fontSize: 15.5,
          fontStyle: 'italic',
          fontWeight: 300,
          lineHeight: 1.6,
          opacity: 0.86,
          maxWidth: '30ch',
        }}
      >
        {copy.doneNote}
      </Reveal>

      {reply && (
        <Reveal
          p={p}
          order={4}
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            opacity: 0.78,
            paddingTop: 14,
            borderTop: '1px solid rgba(247,241,227,0.2)',
          }}
        >
          {reply.name}
          <br />
          <span style={{ opacity: 0.75 }}>
            {reply.guests} {reply.guests === 1 ? 'guest' : 'guests'}
          </span>
        </Reveal>
      )}

      <Reveal p={p} order={5}>
        <button
          type="button"
          onClick={onAgain}
          style={{
            marginTop: 20,
            padding: '6px 0',
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
          Something changed? Send another reply
        </button>
      </Reveal>
    </>
  )
}
