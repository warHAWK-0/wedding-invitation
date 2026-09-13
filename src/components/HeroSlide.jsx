import { motion, useTransform } from 'framer-motion'
import PlateArt from './PlateArt'
import SlideArt from './SlideArt'
import Frame from './Frame'
import { IntroReveal } from './Reveal'
import { useEasedProgress, useSlideProgress } from '../hooks/useSlideScroll'
import { useSide } from '../hooks/useSide'
import { COUPLE } from '../data/wedding'

/* Slide 1 after the envelope: who is inviting, and who for.
   The two names are the only moment of real scale on the site.

   This is the one slide with no "arriving" scroll to ride in on —
   it is already there when the envelope lifts — so each line plays
   a one-shot entrance keyed to `play`, then hands over to the
   scroll link for the exit.

   Each family is greeted by their own house, in their own script,
   and reads their own name first — the way each side's printed
   card would have set it. */
export default function HeroSlide({ index, play }) {
  const { copy, script } = useSide()
  const p = useSlideProgress(index)
  const eased = useEasedProgress(index)

  /* The rule between the names draws itself once the names land,
     then unspools again as the slide leaves. */
  const ruleScale = useTransform(eased, [0.5, 0.78], [1, 0])

  return (
    <section className="slide" aria-label={`${copy.first} and ${copy.second}`}>
      <PlateArt
        src="/plates/hero.jpg"
        wash={['#f8f2e5', '#e6dcc4', '#c8b291']}
        p={p}
      />
      <Frame color="rgba(247,241,227,0.5)" />

      {/* Agni, the sacred fire every vow is taken before — the
          witness to the wedding, set at the head of the invitation.

          Unlike the hands it replaced, this is a centred motif with
          air all round it rather than full-bleed art cut off at the
          edges, so it flows: it takes the height the names leave
          free and centres in it, shrinking on a short phone instead
          of running into the type. Flow art has to come before the
          copy in the document to sit above it. */}
      <SlideArt
        src="/plates/agni-art.png"
        width="clamp(210px, 32svh, 300px)"
        flow
        top="clamp(24px, 6svh, 60px)"
        bottom="clamp(10px, 2svh, 22px)"
        play={play}
        p={p}
      />

      <div
        className="copy"
        style={{
          color: 'var(--ivory)',
          flex: '0 0 auto',
          /* Held clear of the scroll cue, which is pinned 18px off
             the bottom and stands about 45px tall. Any less than
             this on a short phone and "Scroll" lands on the same
             line as the city. */
          paddingBottom: 'calc(clamp(66px, 8svh, 76px) + env(safe-area-inset-bottom))',
        }}
      >
        <IntroReveal
          p={eased}
          play={play}
          delay={0.25}
          order={0}
          className={script}
          style={{
            fontSize: script === 'tamil' ? 13.5 : 15,
            color: 'var(--gold-light)',
            marginBottom: 4,
          }}
        >
          {copy.family.native}
        </IntroReveal>

        <IntroReveal
          p={eased}
          play={play}
          delay={0.38}
          order={1}
          style={{
            fontSize: 16.5,
            fontStyle: 'italic',
            fontWeight: 300,
            opacity: 0.92,
            lineHeight: 1.5,
            maxWidth: '30ch',
          }}
        >
          {copy.invite}
        </IntroReveal>

        <IntroReveal
          p={eased}
          play={play}
          delay={0.55}
          order={2}
          y={34}
          className="display"
          style={{ marginTop: 14 }}
        >
          {copy.first}
        </IntroReveal>

        <IntroReveal p={eased} play={play} delay={0.75} order={3}>
          <motion.div
            style={{
              scaleX: ruleScale,
              transformOrigin: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '10px 0',
            }}
          >
            <span style={{ height: 1, width: 44, background: 'var(--gold-light)' }} />
            <span style={{ fontSize: 20, fontStyle: 'italic', opacity: 0.85 }}>
              {copy.joiner}
            </span>
            <span
              style={{
                height: 1,
                flex: 1,
                background: 'var(--gold-light)',
                opacity: 0.4,
              }}
            />
          </motion.div>
        </IntroReveal>

        <IntroReveal
          p={eased}
          play={play}
          delay={0.88}
          order={4}
          y={34}
          className="display"
        >
          {copy.second}
        </IntroReveal>

        <IntroReveal
          p={eased}
          play={play}
          delay={1.1}
          order={5}
          style={{
            marginTop: 22,
            fontSize: 14.5,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            opacity: 0.8,
          }}
        >
          {COUPLE.dateRange}
          <br />
          <span style={{ opacity: 0.7 }}>{COUPLE.city}</span>
        </IntroReveal>
      </div>

      <ScrollCue play={play} p={p} />
    </section>
  )
}

/* A guest who doesn't know the site scrolls needs telling once.
   It fades out for good as soon as they start. */
function ScrollCue({ play, p }) {
  const opacity = useTransform(p, [0.5, 0.62], [1, 0])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: play ? 1 : 0 }}
      transition={{ delay: 2.2, duration: 1.2 }}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 'calc(18px + env(safe-area-inset-bottom))',
        zIndex: 3,
        display: 'grid',
        justifyItems: 'center',
        gap: 7,
        pointerEvents: 'none',
      }}
    >
      <motion.div style={{ opacity, display: 'grid', justifyItems: 'center', gap: 7 }}>
        <span
          className="eyebrow"
          style={{ color: 'var(--gold-light)', fontSize: 9 }}
        >
          Scroll
        </span>
        <motion.span
          animate={{ scaleY: [0.25, 1, 0.25], originY: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 1,
            height: 26,
            background: 'var(--gold-light)',
            transformOrigin: 'top',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
