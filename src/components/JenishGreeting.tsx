import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ChristmasTree from './ChristmasTree'
import {
  jenishBondConclusion,
  jenishBondLines,
  jenishEncouragement,
  jenishJourney,
  jenishMainParagraphs,
} from '../data/jenishGreeting'

const revealItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export default function JenishGreeting() {
  const reduceMotion = useReducedMotion() ?? false
  const revealContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.42 } },
  }
  const itemTransition = { duration: reduceMotion ? 0 : 0.55 }

  return (
    <div className="jenish-experience">
      <div className="jenish-particles" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span
            className="jenish-particle"
            key={index}
            style={{
              left: `${(index * 47 + 11) % 100}%`,
              top: `${(index * 31 + 13) % 100}%`,
              animationDelay: `${(index % 6) * -0.7}s`,
              animationDuration: `${7 + (index % 4)}s`,
            } as CSSProperties}
          />
        ))}
      </div>

      <section className="jenish-hero" aria-label="Golden Brotherhood Christmas">
        <span className="eyebrow jenish-eyebrow">A CHRISTMAS TRIBUTE TO MY BROTHER</span>
        <div className="jenish-brother-stars" aria-hidden="true">
          <span>✦</span><span>✦</span>
        </div>
        <motion.h1
          className="jenish-title"
          initial={reduceMotion ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : 0.25 }}
        >
          MERRY CHRISTMAS,<br /><span>JENISH!</span>
        </motion.h1>
        <div className="jenish-fireworks" aria-hidden="true">
          <span className="jenish-firework jenish-firework--one" />
          <span className="jenish-firework jenish-firework--two" />
          <span className="jenish-firework jenish-firework--three" />
        </div>
        <div className="jenish-tree">
          <ChristmasTree placed={[0, 1, 2, 3, 4, 5]} lit />
        </div>
        <div className="jenish-heart" aria-hidden="true">♥</div>
        <p className="jenish-hero-caption">BROTHERS BY HEART. FAMILY BY CHOICE.</p>
      </section>

      <motion.section
        className="jenish-letter"
        aria-label="A message for Jenish"
        variants={revealContainer}
        initial={reduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
      >
        <span className="jenish-section-label">TO MY BROTHER, WITH ALL MY HEART</span>
        {jenishMainParagraphs.map((paragraph) => (
          <motion.p key={paragraph} variants={revealItem} transition={itemTransition}>{paragraph}</motion.p>
        ))}
      </motion.section>

      <motion.section
        className="jenish-bond"
        aria-labelledby="jenish-bond-title"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: reduceMotion ? 0 : 0.7 }}
      >
        <span className="jenish-heart jenish-heart--section" aria-hidden="true">♥</span>
        <h2 id="jenish-bond-title">SOME BONDS ARE BEYOND BLOOD <span>❤️</span></h2>
        <div className="jenish-bond-lines">
          {jenishBondLines.map((line, index) => (
            <motion.p
              key={line}
              initial={reduceMotion ? false : { opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : index * 0.35 }}
            >
              <span>✦</span>{line}
            </motion.p>
          ))}
        </div>
        <motion.p
          className="jenish-bond-conclusion"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 1.15 }}
        >
          {jenishBondConclusion}
        </motion.p>
      </motion.section>

      <section className="jenish-journey" aria-labelledby="jenish-journey-title">
        <span className="jenish-section-label">A NEW CHAPTER IS WAITING</span>
        <h2 id="jenish-journey-title">NEXT CHAPTER: THE DREAMER&apos;S JOURNEY <span>🚀</span></h2>
        <div className="jenish-journey-layout">
          <div className="jenish-journey-track" aria-hidden="true">
            <motion.span
              initial={reduceMotion ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reduceMotion ? 0 : 1.4, ease: 'easeOut' }}
            />
          </div>
          <div className="jenish-goals">
            {jenishJourney.map(({ label, value }, index) => (
              <motion.div
                className="jenish-goal"
                key={label}
                initial={reduceMotion ? false : { opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.12 }}
              >
                <span className="jenish-goal-label">{label}</span>
                <strong>{value}</strong>
              </motion.div>
            ))}
          </div>
        </div>
        <p className="jenish-encouragement">{jenishEncouragement}</p>
      </section>
    </div>
  )
}
