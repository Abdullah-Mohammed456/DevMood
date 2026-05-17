import React from 'react';
import { useStats } from '../context/StatsContext';
import { useMood } from '../context/MoodContext';
import { cn } from '../lib/utils';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

const MOOD_DATA = [
  { name: 'Focused', value: 45, color: '#2ecc71' }, // Green
  { name: 'Neutral', value: 30, color: '#3498db' }, // Blue
  { name: 'Tired', value: 15, color: '#9b59b6' },   // Purple
  { name: 'Stressed', value: 10, color: '#ff4d4d' },// Red
];

export const DataAnalysis: React.FC = () => {
  const { stats } = useStats();
  const { moodConfig } = useMood();

  // Combine history with today's stats for the chart
  const chartData = [
    ...(stats.history || [])
      .filter(day => day && day.date)
      .map(day => ({
        name: format(parseISO(day.date), 'EEE'),
        fullDate: format(parseISO(day.date), 'MMM d, yyyy'),
        pomodoros: day.pomodoros || 0,
        tasks: day.tasks || 0,
      }))
      .slice(-6), // Take the last 6 historical days
    {
      name: 'Today',
      fullDate: format(new Date(), 'MMM d, yyyy'),
      pomodoros: stats.pomodorosToday || 0,
      tasks: stats.tasksCompletedToday || 0,
    }
  ];

  return (
    <div className="w-full mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Weekly Activity Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6 font-outfit">Weekly Activity</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem' }}
                itemStyle={{ color: '#e5e7eb' }}
                labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                labelFormatter={(_, payload) => payload[0]?.payload?.fullDate || ''}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar 
                dataKey="tasks" 
                name="Tasks Completed" 
                fill={moodConfig.color} 
                radius={[4, 4, 0, 0]} 
                barSize={30} 
              />
              <Line 
                type="monotone" 
                dataKey="pomodoros" 
                name="Pomodoros" 
                stroke="#f39c12" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Mood Distribution */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 flex flex-col"
      >
        <h3 className="text-xl font-bold text-white mb-2 font-outfit">Mood Distribution</h3>
        <p className="text-sm text-gray-400 mb-4">Estimated time spent in each mood.</p>
        
        <div className="flex-1 min-h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOOD_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {MOOD_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem' }}
                itemStyle={{ color: '#e5e7eb' }}
                formatter={(value) => [`${value}%`, 'Time Spent']}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Custom Legend */}
          <div className="absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] text-center pointer-events-none">
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          {MOOD_DATA.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-xs text-gray-300">{entry.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
