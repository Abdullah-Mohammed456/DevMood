import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Coffee, Pause, Play, RotateCcw, Settings } from 'lucide-react';
import { useStats } from '../context/StatsContext';

type SessionType = 'work' | 'break';

const parseMinutes = (value: string, max: number) =>
  Math.min(max, Math.max(1, Number.parseInt(value, 10) || 1));

const playAlarm = (sessionType: SessionType) => {
  try {
    const audioContext = new window.AudioContext();

    for (const timeOffset of [0, 0.3, 0.6]) {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const startAt = audioContext.currentTime + timeOffset;

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, startAt);
      gain.gain.setValueAtTime(0, startAt);
      gain.gain.linearRampToValueAtTime(0.35, startAt + 0.05);
      gain.gain.setValueAtTime(0.35, startAt + 0.15);
      gain.gain.linearRampToValueAtTime(0, startAt + 0.2);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + 0.2);
    }

    window.setTimeout(() => void audioContext.close().catch(() => undefined), 1200);
  } catch {
    // Audio alerts are optional when the browser does not provide Web Audio.
  }

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`DevMood: ${sessionType === 'work' ? 'Work session complete' : 'Break over'}`);
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    void Notification.requestPermission();
  }
};

export const PomodoroTimer = () => {
  const { addPomodoro } = useStats();
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const totalTime = (sessionType === 'work' ? workMinutes : breakMinutes) * 60;
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    if (!isActive) {
      setTimeLeft((sessionType === 'work' ? workMinutes : breakMinutes) * 60);
    }
  }, [breakMinutes, isActive, sessionType, workMinutes]);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft === 0) {
      if (sessionType === 'work') {
        addPomodoro();
        setSessionType('break');
        setTimeLeft(breakMinutes * 60);
      } else {
        setSessionType('work');
        setTimeLeft(workMinutes * 60);
      }
      setIsActive(false);
      playAlarm(sessionType);
      return;
    }

    const intervalId = window.setInterval(() => setTimeLeft((time) => time - 1), 1000);
    return () => window.clearInterval(intervalId);
  }, [addPomodoro, breakMinutes, isActive, sessionType, timeLeft, workMinutes]);

  const toggleTimer = () => {
    setIsActive((active) => !active);
    setShowSettings(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft((sessionType === 'work' ? workMinutes : breakMinutes) * 60);
  };

  const switchSession = (type: SessionType) => {
    setIsActive(false);
    setSessionType(type);
    setTimeLeft((type === 'work' ? workMinutes : breakMinutes) * 60);
  };

  return (
    <section className="dm-card dm-timer-card" aria-labelledby="timer-title">
      <div className="dm-card-heading">
        <div>
          <p className="dm-eyebrow">POMODORO</p>
          <h2 className="dm-card-title" id="timer-title">Focus timer</h2>
        </div>
        <button
          className="dm-settings-button"
          type="button"
          aria-label="Open timer settings"
          aria-expanded={showSettings}
          aria-controls={showSettings ? 'timer-settings' : undefined}
          onClick={() => {
            setIsActive(false);
            setShowSettings((visible) => !visible);
          }}
        >
          <Settings size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="dm-session-tabs" role="group" aria-label="Choose timer session">
        <button type="button" aria-pressed={sessionType === 'work'} onClick={() => switchSession('work')}>
          <Brain size={14} aria-hidden="true" /> Work
        </button>
        <button type="button" aria-pressed={sessionType === 'break'} onClick={() => switchSession('break')}>
          <Coffee size={14} aria-hidden="true" /> Break
        </button>
      </div>

      <div className="dm-timer-dial">
        <div className="dm-timer-progress-track" aria-hidden="true">
          <span className="dm-timer-progress" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="dm-timer-reading">
          <span
            className="dm-timer-time"
            role="timer"
            aria-live="off"
            aria-label={`${minutes} minutes ${seconds} seconds remaining`}
          >
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
          <span className="dm-timer-state">{sessionType}</span>
        </div>
      </div>

      <div className="dm-timer-actions">
        <button className="dm-primary-button" type="button" onClick={toggleTimer}>
          {isActive ? <Pause size={16} fill="currentColor" aria-hidden="true" /> : <Play size={16} fill="currentColor" aria-hidden="true" />}
          {isActive ? 'Pause' : 'Start focus'}
        </button>
        <button className="dm-icon-button" type="button" onClick={resetTimer} aria-label="Reset timer">
          <RotateCcw size={16} aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            id="timer-settings"
            className="dm-settings-layer"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.18 }}
            aria-labelledby="timer-settings-title"
          >
            <h3 id="timer-settings-title">Timer settings</h3>
            <div className="dm-settings-fields">
              <label htmlFor="work-duration">
                Work duration (minutes)
                <input
                  id="work-duration"
                  type="number"
                  min="1"
                  max="60"
                  value={workMinutes}
                  onChange={(event) => setWorkMinutes(parseMinutes(event.target.value, 60))}
                />
              </label>
              <label htmlFor="break-duration">
                Break duration (minutes)
                <input
                  id="break-duration"
                  type="number"
                  min="1"
                  max="30"
                  value={breakMinutes}
                  onChange={(event) => setBreakMinutes(parseMinutes(event.target.value, 30))}
                />
              </label>
              <button className="dm-primary-button dm-settings-save" type="button" onClick={() => setShowSettings(false)}>
                Save settings
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
