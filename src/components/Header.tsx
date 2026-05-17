import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { format } from 'date-fns';
import { useMood } from '../context/MoodContext';
import { MOODS, type MoodType } from '../constants/moods';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { mood, setMood, moodConfig } = useMood();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full mb-8 pt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl transition-colors duration-500", moodConfig.bgColor, moodConfig.textColor)}>
            <Terminal size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">DevMood</h1>
            <p className="text-sm text-gray-400 font-medium">
              {format(time, 'EEEE, MMMM do')} • {format(time, 'h:mm:ss a')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 p-1.5 bg-gray-900/50 rounded-2xl backdrop-blur-sm border border-gray-800">
          {(Object.keys(MOODS) as MoodType[]).map((m) => {
            const config = MOODS[m];
            const isActive = mood === m;
            return (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300",
                  isActive ? "text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMood"
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: config.color, opacity: 0.2 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
