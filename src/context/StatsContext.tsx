import React, { createContext, useContext, useState, useEffect } from 'react';
import { isSameDay, isYesterday } from 'date-fns';

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

const defaultStats: Stats = {
  pomodorosToday: 0,
  tasksCompletedToday: 0,
  currentStreak: 0,
  lastActiveDate: null,
  history: [],
};

const isNonNegativeInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;

const isDailyStat = (value: unknown): value is DailyStat => {
  if (typeof value !== 'object' || value === null) return false;
  if (!('date' in value) || typeof value.date !== 'string') return false;
  if (!Number.isFinite(Date.parse(value.date))) return false;
  return (
    'pomodoros' in value &&
    isNonNegativeInteger(value.pomodoros) &&
    'tasks' in value &&
    isNonNegativeInteger(value.tasks)
  );
};

const isStats = (value: unknown): value is Stats => {
  if (typeof value !== 'object' || value === null) return false;
  if (!('pomodorosToday' in value) || !isNonNegativeInteger(value.pomodorosToday)) return false;
  if (!('tasksCompletedToday' in value) || !isNonNegativeInteger(value.tasksCompletedToday)) {
    return false;
  }
  if (!('currentStreak' in value) || !isNonNegativeInteger(value.currentStreak)) return false;
  if (!('lastActiveDate' in value)) return false;
  if (
    value.lastActiveDate !== null &&
    (typeof value.lastActiveDate !== 'string' || !Number.isFinite(Date.parse(value.lastActiveDate)))
  ) {
    return false;
  }
  return 'history' in value && Array.isArray(value.history) && value.history.every(isDailyStat);
};

const initialStats = (): Stats => ({ ...defaultStats, history: [] });

const readSavedStats = (): Stats => {
  try {
    const saved = localStorage.getItem('devmood-stats');
    if (!saved) return initialStats();

    const parsed: unknown = JSON.parse(saved);
    if (!isStats(parsed)) return initialStats();

    const stats: Stats = { ...parsed };

    if (stats.lastActiveDate) {
      const lastDate = new Date(stats.lastActiveDate);
      const today = new Date();

      if (!isSameDay(lastDate, today)) {
        stats.history.push({
          date: lastDate.toISOString(),
          pomodoros: stats.pomodorosToday,
          tasks: stats.tasksCompletedToday,
        });

        stats.history = stats.history.slice(-30);
        stats.pomodorosToday = 0;
        stats.tasksCompletedToday = 0;

        if (!isYesterday(lastDate)) stats.currentStreak = 0;
      }
    }

    return stats;
  } catch {
    return initialStats();
  }
};

const StatsContext = createContext<StatsContextProps | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<Stats>(readSavedStats);

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
    try {
      localStorage.setItem('devmood-stats', JSON.stringify(stats));
    } catch {
      // Statistics remain available in memory when storage is unavailable.
    }
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
