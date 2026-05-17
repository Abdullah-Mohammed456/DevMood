import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { useMood } from '../context/MoodContext';
import { useStats } from '../context/StatsContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export const TaskList: React.FC = () => {
  const { moodConfig } = useMood();
  const { addTaskCompleted, removeTaskCompleted } = useStats();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('devmood-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem('devmood-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      text: newTask.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTasks(prev => [task, ...prev]);
    setNewTask('');
  };

  const toggleTask = (id: string, currentlyCompleted: boolean) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
    
    if (!currentlyCompleted) {
      addTaskCompleted();
    } else {
      removeTaskCompleted();
    }
  };

  const deleteTask = (id: string, wasCompleted: boolean) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (wasCompleted) {
      removeTaskCompleted();
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Tasks</h2>
        <span className={cn("text-sm font-semibold px-3 py-1 rounded-full", moodConfig.bgColor, moodConfig.textColor)}>
          {completedCount} / {tasks.length} done
        </span>
      </div>

      <form onSubmit={handleAddTask} className="relative mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all"
          style={{ '--tw-ring-color': moodConfig.color } as React.CSSProperties}
        />
        <button
          type="submit"
          disabled={!newTask.trim()}
          className={cn(
            "absolute right-2 top-2 bottom-2 w-8 rounded-lg flex items-center justify-center text-white transition-colors disabled:opacity-50",
            moodConfig.bgColor
          )}
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2 -mr-2 scrollbar-thin">
        <AnimatePresence initial={false}>
          {tasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="h-full flex flex-col items-center justify-center text-gray-500 gap-2"
            >
              <Check size={48} className="opacity-20" />
              <p>All caught up!</p>
            </motion.div>
          ) : (
            tasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 8 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div 
                  className={cn(
                    "group flex items-center gap-3 p-3 rounded-xl border transition-all duration-300",
                    task.completed ? "bg-gray-900/30 border-transparent opacity-60" : "bg-gray-800/50 border-gray-800 hover:border-gray-700"
                  )}
                >
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors border-2",
                      task.completed 
                        ? cn(moodConfig.bgColor, moodConfig.accentColor, "border-transparent") 
                        : "border-gray-600 hover:border-gray-400"
                    )}
                  >
                    {task.completed && <Check size={14} className="text-white" />}
                  </button>
                  
                  <span className={cn(
                    "flex-1 text-sm transition-all duration-300",
                    task.completed ? "text-gray-500 line-through" : "text-gray-200"
                  )}>
                    {task.text}
                  </span>
                  
                  <button
                    onClick={() => deleteTask(task.id, task.completed)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-all rounded-lg hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
