import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMood } from '../context/MoodContext'

const chooseQuote = (quotes: string[]) => quotes[Math.floor(Math.random() * quotes.length)]

export const QuoteCard = () => {
  const { mood, moodConfig } = useMood()
  const [quote, setQuote] = useState(() => chooseQuote(moodConfig.quotes))

  useEffect(() => {
    setQuote(chooseQuote(moodConfig.quotes))
  }, [moodConfig])

  return (
    <section className="dm-quote-card" aria-labelledby="daily-focus-title">
      <div className="dm-quote-copy">
        <p className="dm-eyebrow dm-quote-kicker">DEVMOOD / MOOD: {mood.toUpperCase()}</p>
        <h1 className="dm-hero-title" id="daily-focus-title">
          One task One Session
        </h1>
      </div>
      <div className="dm-quote-side">
        <p className="dm-quote-label">A line for this mood</p>
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={quote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="dm-quote-text"
            aria-live="polite"
          >
            {quote}
          </motion.blockquote>
        </AnimatePresence>
      </div>
    </section>
  )
}
