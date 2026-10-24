import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useMood } from '../context/MoodContext'
import { MOODS, type MoodType } from '../constants/moods'

export const Header = () => {
  const [time, setTime] = useState(() => new Date())
  const { mood, setMood } = useMood()

  useEffect(() => {
    const timerId = window.setInterval(() => setTime(new Date()), 60_000)
    return () => window.clearInterval(timerId)
  }, [])

  return (
    <header className="dm-header">
      <div className="dm-brand">
        <div className="dm-brand-copy">
          <p className="dm-wordmark">DevMood</p>
          <time className="dm-date-time" dateTime={time.toISOString()}>
            <span>{format(time, 'EEEE, MMMM do')}</span>
            <span>{format(time, 'h:mm a')}</span>
          </time>
        </div>
      </div>

      <div className="dm-mood-area">
        <span className="dm-mood-label">Current mood</span>
        <div className="dm-mood-switcher" role="group" aria-label="Choose your current mood">
          {(Object.keys(MOODS) as MoodType[]).map((moodOption) => {
            const config = MOODS[moodOption]
            const isActive = mood === moodOption

            return (
              <button
                key={moodOption}
                type="button"
                aria-pressed={isActive}
                onClick={() => setMood(moodOption)}
                className="dm-mood-option"
              >
                {config.label}
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
