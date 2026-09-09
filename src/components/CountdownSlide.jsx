import { useEffect, useMemo, useState } from 'react'
import { motion, useTransform } from 'framer-motion'
import Frame from './Frame'
import Reveal from './Reveal'
import { useEasedProgress, useSlideProgress } from '../hooks/useSlideScroll'
import { useSide } from '../hooks/useSide'
import { countdownTarget } from '../data/wedding'

/* Each side counts down to the first function it is actually
   invited to — the morning puja for the groom's family, the
   evening for the bride's — so nobody is shown a clock running
   toward something they aren't attending. */
function remaining(target) {
  const diff = target - new Date()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  }
}

/* Each side attends a different number of functions, and the
   closing line says so out loud — so it is spelled from the list
   rather than typed in, and stays true if a function is added. */
const COUNT = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']

/* The one slide with no plate behind it. It sits between the names
   and the ceremonies as a deliberate breath — so it gets a plain
   wash, and the wash itself drifts a little to keep the transition
   in and out from reading as a flat cut. */
export default function CountdownSlide({ index }) {
  const { side, events } = useSide()
  const target = useMemo(() => new Date(countdownTarget(side)), [side])
  const [t, setT] = useState(() => remaining(target))
  const p = useSlideProgress(index)
  const eased = useEasedProgress(index)

  const washY = useTransform(p, [0, 1], [-24, 24])
  const veil = useTransform(p, [0.2, 0.5, 0.8], [0.55, 0, 0.55])

  useEffect(() => {
    setT(remaining(target))
    const id = setInterval(() => setT(remaining(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <section
      className="slide"
      aria-label="Countdown to the wedding"
      style={{ justifyContent: 'center' }}
    >
      <div className="plate">
        <motion.div
          className="plate__layer"
          style={{ y: washY, scale: 1.1 }}
        >
          <div
            className="plate__wash"
            style={{
              background:
                'radial-gradient(110% 70% at 50% 30%, #fbf6ea 0%, #f1e7d2 60%, #e2d0ae 100%)',
            }}
          />
        </motion.div>
        <motion.div
          className="plate__veil"
          style={{ opacity: veil, background: '#b9a583' }}
        />
      </div>

      <Frame />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '0 34px',
          textAlign: 'center',
        }}
      >
        {t ? (
          <>
            <Reveal p={eased} order={0} className="eyebrow" style={{ marginBottom: 30 }}>
              Until we gather
            </Reveal>

            <Reveal p={eased} order={1}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 4,
                }}
              >
                {[
                  ['Days', t.days],
                  ['Hours', t.hours],
                  ['Min', t.mins],
                  ['Sec', t.secs],
                ].map(([label, value], i) => (
                  <div
                    key={label}
                    style={{
                      padding: '0 2px',
                      borderLeft: i === 0 ? 0 : '1px solid rgba(165,135,44,0.28)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 'clamp(34px, 10vw, 46px)',
                        fontWeight: 300,
                        lineHeight: 1,
                        fontVariantNumeric: 'tabular-nums',
                        color: 'var(--ink)',
                      }}
                    >
                      {String(value).padStart(2, '0')}
                    </div>
                    <div
                      style={{
                        marginTop: 9,
                        fontSize: 9.5,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'var(--ink-soft)',
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal
              p={eased}
              order={3}
              style={{
                marginTop: 34,
                fontSize: 17,
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--ink-soft)',
                lineHeight: 1.6,
              }}
            >
              Two days, {COUNT[events.length] ?? events.length} ceremonies,
              <br />
              one family growing larger.
            </Reveal>
          </>
        ) : (
          <Reveal
            p={eased}
            order={0}
            style={{
              fontSize: 25,
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--ink)',
              lineHeight: 1.5,
            }}
          >
            Thank you for celebrating
            <br />
            with us.
          </Reveal>
        )}
      </div>
    </section>
  )
}
