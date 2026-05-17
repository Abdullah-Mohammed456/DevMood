import React, { createContext, useContext, useState, useEffect } from 'react';
import { isSameDay, isYesterday, subDays } from 'date-fns';

export interface DailyStat {
  date: string;
  pomodoros: number;
  tasks: number;
}

interface Stats {
  pomodorosToday: number;
  tasksCompletedToday: number;
  currentStreak: number;
  lastActiveDate: string | null;
  history: DailyStat[];
}

interface StatsContextProps {
  stats: Stats;
  addPomodoro: () => void;
  addTaskCompleted: () => void;
  removeTaskCompleted: () => void;
}

// Generate 7 days of mock data
const generateMockHistory = (): DailyStat[] => {
  const history: DailyStat[] = [];
  const today = new Date();
  
  for (let i = 7; i > 0; i--) {
    const pastDate = subDays(today, i);
    history.push({
      date: pastDate.toISOString(),
      pomodoros: Math.floor(Math.random() * 8) + 2, // 2 to 9 pomodoros
      tasks: Math.floor(Math.random() * 6) + 1, // 1 to 6 tasks
    });
  }
  return history;
};

const defaultStats: Stats = {
  pomodorosToday: 0,
  tasksCompletedToday: 0,
  currentStreak: 0,
  lastActiveDate: null,
  history: [],
};

const StatsContext = createContext<StatsContextProps | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<Stats>(() => {
    const saved = localStorage.getItem('devmood-stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Stats;
        // Ensure history exists
        if (!parsed.history || parsed.history.length === 0) {
          parsed.history = generateMockHistory();
        }

        if (parsed.lastActiveDate) {
          const lastDate = new Date(parsed.lastActiveDate);
          const today = new Date();
          
          if (!isSameDay(lastDate, today)) {
            // Save yesterday's stats to history before resetting
            parsed.history.push({
              date: lastDate.toISOString(),
              pomodoros: parsed.pomodorosToday || 0,
              tasks: parsed.tasksCompletedToday || 0,
            });
            
            // Keep history to last 30 days
            if (parsed.history.length > 30) {
              parsed.history = parsed.history.slice(parsed.history.length - 30);
            }

            // Reset daily stats
            parsed.pomodorosToday = 0;
            parsed.tasksCompletedToday = 0;
            
            // Check streak
            if (!isYesterday(lastDate)) {
              parsed.currentStreak = 0;
            }
          }
        }
        return parsed;
      } catch (e) {
        return { ...defaultStats, history: generateMockHistory() };
      }
    }
    return { ...defaultStats, history: generateMockHistory() };
  });

  // Update streak on mount if first time today
  useEffect(() => {
    const todayStr = new Date().toISOString();
    const today = new Date();
    
    setStats(prev => {
      let newStreak = prev.currentStreak;
      if (!prev.lastActiveDate) {
        newStreak = 1;
      } else {
        const lastDate = new Date(prev.lastActiveDate);
        if (!isSameDay(lastDate, today)) {
          if (isYesterday(lastDate)) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
        }
      }
      
      return {
        ...prev,
        currentStreak: newStreak,
        lastActiveDate: todayStr
      };
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('devmood-stats', JSON.stringify(stats));
  }, [stats]);

  const addPomodoro = () => {
    setStats(prev => ({ ...prev, pomodorosToday: prev.pomodorosToday + 1 }));
  };

  const addTaskCompleted = () => {
    setStats(prev => ({ ...prev, tasksCompletedToday: prev.tasksCompletedToday + 1 }));
  };

  const removeTaskCompleted = () => {
    setStats(prev => ({ ...prev, tasksCompletedToday: Math.max(0, prev.tasksCompletedToday - 1) }));
  };

  return (
    <StatsContext.Provider value={{ stats, addPomodoro, addTaskCompleted, removeTaskCompleted }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};
