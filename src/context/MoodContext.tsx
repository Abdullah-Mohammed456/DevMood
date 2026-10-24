import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOODS, type MoodType, type MoodConfig } from '../constants/moods';

interface MoodContextProps {
  mood: MoodType;
  setMood: (mood: MoodType) => void;
  moodConfig: MoodConfig;
}

const MoodContext = createContext<MoodContextProps | undefined>(undefined);

const isMoodType = (value: string | null): value is MoodType =>
  value !== null && Object.prototype.hasOwnProperty.call(MOODS, value);

const readSavedMood = (): MoodType => {
  try {
    const savedMood = localStorage.getItem('devmood-current-mood');
    return isMoodType(savedMood) ? savedMood : 'Neutral';
  } catch {
    return 'Neutral';
  }
};

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mood, setMoodState] = useState<MoodType>(readSavedMood);

  useEffect(() => {
    try {
      localStorage.setItem('devmood-current-mood', mood);
    } catch {
      // Mood still works for this session when storage is unavailable.
    }
    document.documentElement.style.setProperty('--mood-color', MOODS[mood].color);
  }, [mood]);

  const setMood = (newMood: MoodType) => {
    setMoodState(newMood);
  };

  return (
    <MoodContext.Provider value={{ mood, setMood, moodConfig: MOODS[mood] }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};
