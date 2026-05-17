import React from 'react';
import { Flame, CheckCircle2, Timer } from 'lucide-react';
import { useStats } from '../context/StatsContext';
import { useMood } from '../context/MoodContext';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export const StatsBar: React.FC = () => {
  const { stats } = useStats();
  const { moodConfig } = useMood();

  const statItems = [
    {
      icon: <Timer size={20} />,
      label: "Pomodoros Today",
      value: stats.pomodorosToday,
    },
    {
      icon: <CheckCircle2 size={20} />,
      label: "Tasks Completed",
      value: stats.tasksCompletedToday,
    },
    {
      icon: <Flame size={20} />,
      label: "Day Streak",
      value: stats.currentStreak,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 flex items-center gap-4"
        >
          <div className={cn("p-3 rounded-xl", moodConfig.bgColor, moodConfig.textColor)}>
            {item.icon}
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">{item.label}</p>
            <p className="text-2xl font-bold text-white tracking-tight">{item.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
