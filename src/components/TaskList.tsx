import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, CheckCheck, Plus, Trash2 } from 'lucide-react';
import { useStats } from '../context/StatsContext';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const isTask = (value: unknown): value is Task => {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'text' in value &&
    typeof value.text === 'string' &&
    'completed' in value &&
    typeof value.completed === 'boolean' &&
    'createdAt' in value &&
    typeof value.createdAt === 'number' &&
    Number.isFinite(value.createdAt)
  );
};

const readSavedTasks = (): Task[] => {
  try {
    const saved = localStorage.getItem('devmood-tasks');
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter(isTask) : [];
  } catch {
    return [];
  }
};

export const TaskList = () => {
  const { addTaskCompleted, removeTaskCompleted } = useStats();
  const [tasks, setTasks] = useState<Task[]>(readSavedTasks);
  const [newTask, setNewTask] = useState('');
  const completedCount = tasks.filter((task) => task.completed).length;

  useEffect(() => {
    try {
      localStorage.setItem('devmood-tasks', JSON.stringify(tasks));
    } catch {
      // Tasks remain available in memory when storage is unavailable.
    }
  }, [tasks]);

  const handleAddTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) return;

    setTasks((current) => [
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() },
      ...current,
    ]);
    setNewTask('');
  };

  const toggleTask = (task: Task) => {
    setTasks((current) =>
      current.map((savedTask) =>
        savedTask.id === task.id ? { ...savedTask, completed: !task.completed } : savedTask,
      ),
    );
    if (task.completed) removeTaskCompleted();
    else addTaskCompleted();
  };

  const deleteTask = (task: Task) => {
    setTasks((current) => current.filter((savedTask) => savedTask.id !== task.id));
    if (task.completed) removeTaskCompleted();
  };

  return (
    <section className="dm-card dm-task-card" aria-labelledby="task-list-title">
      <div className="dm-card-heading">
        <div>
          <p className="dm-eyebrow">TASK LIST</p>
          <h2 className="dm-card-title" id="task-list-title">Your tasks</h2>
        </div>
        <span className="dm-task-count" aria-label={`${completedCount} of ${tasks.length} tasks complete`}>
          {completedCount} / {tasks.length} DONE
        </span>
      </div>

      <form className="dm-task-form" onSubmit={handleAddTask}>
        <label className="sr-only" htmlFor="new-task">Add a task</label>
        <input
          id="new-task"
          className="dm-task-input"
          type="text"
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          placeholder="Add one thing to your list..."
          autoComplete="off"
          maxLength={180}
        />
        <button className="dm-task-add" type="submit" disabled={!newTask.trim()} aria-label="Add task">
          <Plus size={18} aria-hidden="true" />
        </button>
      </form>

      <ul className="dm-task-list scrollbar-thin" aria-label="Tasks">
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className="dm-task-row">
                <button
                  className="dm-task-toggle"
                  type="button"
                  aria-label={`${task.completed ? 'Mark incomplete' : 'Complete'}: ${task.text}`}
                  aria-pressed={task.completed}
                  onClick={() => toggleTask(task)}
                >
                  {task.completed && <Check size={13} aria-hidden="true" />}
                </button>
                <span className="dm-task-text" data-completed={task.completed}>
                  {task.text}
                </span>
                <button
                  className="dm-task-delete"
                  type="button"
                  aria-label={`Delete task: ${task.text}`}
                  onClick={() => deleteTask(task)}
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {tasks.length === 0 && (
        <div className="dm-empty-tasks" role="status">
          <CheckCheck size={27} aria-hidden="true" />
          <p>Nothing queued. Add a small next step.</p>
        </div>
      )}
    </section>
  );
};
