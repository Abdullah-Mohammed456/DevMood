import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Settings } from 'lucide-react';
import { useMood } from '../context/MoodContext';
import { useStats } from '../context/StatsContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type SessionType = 'work' | 'break';

export const PomodoroTimer: React.FC = () => {
  const { moodConfig } = useMood();
  const { addPomodoro } = useStats();
  
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const totalTime = sessionType === 'work' ? workMinutes * 60 : breakMinutes * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Reset timer when durations change if it's not active
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(sessionType === 'work' ? workMinutes * 60 : breakMinutes * 60);
    }
  }, [workMinutes, breakMinutes, sessionType]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Session ended
      if (sessionType === 'work') {
        addPomodoro();
        setSessionType('break');
        setTimeLeft(breakMinutes * 60);
        playAlarm();
      } else {
        setSessionType('work');
        setTimeLeft(workMinutes * 60);
        playAlarm();
      }
      setIsActive(false);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, sessionType, addPomodoro, workMinutes, breakMinutes]);

  const playAlarm = () => {
    // Play a sequence of beeps using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playBeep = (timeOffset: number) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + timeOffset); // A5 note
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime + timeOffset);
        gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + timeOffset + 0.05);
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime + timeOffset + 0.15);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + timeOffset + 0.2);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start(audioCtx.currentTime + timeOffset);
        oscillator.stop(audioCtx.currentTime + timeOffset + 0.2);
      };

      // Play 3 beeps
      playBeep(0);
      playBeep(0.3);
      playBeep(0.6);
      
    } catch (e) {
      console.log('Audio API not supported');
    }

    // Also show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`DevMood: ${sessionType === 'work' ? 'Work Session Complete!' : 'Break Over!'}`);
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    setShowSettings(false); // Hide settings when starting
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(sessionType === 'work' ? workMinutes * 60 : breakMinutes * 60);
  };

  const switchSession = (type: SessionType) => {
    setIsActive(false);
    setSessionType(type);
    setTimeLeft(type === 'work' ? workMinutes * 60 : breakMinutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden">
      
      {/* Settings Toggle Button */}
      <button 
        onClick={() => {
          setIsActive(false);
          setShowSettings(!showSettings);
        }}
        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
      >
        <Settings size={20} />
      </button>

      <div className="flex gap-2 mb-8 bg-gray-950 p-1 rounded-xl z-10">
        <button
          onClick={() => switchSession('work')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
            sessionType === 'work' 
              ? cn("text-white", moodConfig.bgColor) 
              : "text-gray-400 hover:text-gray-200"
          )}
        >
          <Brain size={16} /> Work
        </button>
        <button
          onClick={() => switchSession('break')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
            sessionType === 'break' 
              ? cn("text-white", moodConfig.bgColor) 
              : "text-gray-400 hover:text-gray-200"
          )}
        >
          <Coffee size={16} /> Break
        </button>
      </div>

      <div className="relative w-48 h-48 mb-8 flex items-center justify-center z-10">
        {/* SVG Ring */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            className="stroke-gray-800"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            className="transition-all duration-1000 ease-linear"
            stroke={moodConfig.color}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={(2 * Math.PI * 88) * (1 - progress / 100)}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="relative flex flex-col items-center">
          <span className="text-5xl font-bold tracking-tighter text-white font-mono">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
          <span className={cn("text-xs font-semibold uppercase tracking-widest mt-1", moodConfig.textColor)}>
            {sessionType}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 z-10">
        <button
          onClick={toggleTimer}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 shadow-lg",
            moodConfig.bgColor
          )}
        >
          {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        <button
          onClick={resetTimer}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Settings Panel Overlay */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 bg-gray-900/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 font-outfit">Timer Settings</h3>
            
            <div className="w-full max-w-[200px] space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Work Duration (min)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="60" 
                  value={workMinutes}
                  onChange={(e) => setWorkMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Break Duration (min)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="30" 
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-gray-500"
                />
              </div>
              
              <button 
                onClick={() => setShowSettings(false)}
                className={cn("w-full py-2 mt-4 rounded-lg font-semibold text-white transition-colors", moodConfig.bgColor)}
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
