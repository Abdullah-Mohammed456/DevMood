import { motion } from 'framer-motion';
import { useStats } from '../context/StatsContext';

export const StatsBar = () => {
  const { stats } = useStats();

  const statItems = [
    { label: 'Pomodoros today', value: stats.pomodorosToday },
    { label: 'Tasks completed', value: stats.tasksCompletedToday },
    { label: 'Day streak', value: stats.currentStreak },
  ];

  return statItems.map((item, index) => {
    return (
      <motion.article
        key={item.label}
        className="dm-stat-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.25 }}
      >
        <span className="dm-stat-copy">
          <span className="dm-stat-label">{item.label}</span>
          <strong className="dm-stat-value">{item.value}</strong>
        </span>
      </motion.article>
    );
  });
};
