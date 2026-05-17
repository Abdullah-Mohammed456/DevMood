import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOODS, type MoodType, type MoodConfig } from '../constants/moods';

interface MoodContextProps {
  mood: MoodType;
  setMood: (mood: MoodType) => void;
  moodConfig: MoodConfig;
}

const MoodContext = createContext<MoodContextProps | undefined>(undefined);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mood, setMoodState] = useState<MoodType>(() => {
    const saved = localStorage.getItem('devmood-current-mood');
    return (saved as MoodType) || 'Neutral';
  });

  useEffect(() => {
    localStorage.setItem('devmood-current-mood', mood);
    
    // Update body background and color based on mood
    const config = MOODS[mood];
    document.documentElement.style.setProperty('--color-primary', config.color);
    document.documentElement.style.setProperty('--bg-primary', config.bgColor);
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
