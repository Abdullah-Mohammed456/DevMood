import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useStats } from '../context/StatsContext';
import { MOODS, type MoodType } from '../constants/moods';
import { useMood } from '../context/MoodContext';

const MOOD_DATA: Array<{ name: MoodType; value: number; color: string }> = [
  { name: 'Focused', value: 45, color: MOODS.Focused.color },
  { name: 'Neutral', value: 30, color: MOODS.Neutral.color },
  { name: 'Tired', value: 15, color: MOODS.Tired.color },
  { name: 'Stressed', value: 10, color: MOODS.Stressed.color },
];

export const DataAnalysis = () => {
  const { stats } = useStats();
  const { moodConfig } = useMood();

  const chartData = [
    ...stats.history
      .filter((day) => day && day.date)
      .map((day) => ({
        name: format(parseISO(day.date), 'EEE'),
        fullDate: format(parseISO(day.date), 'MMM d, yyyy'),
        pomodoros: day.pomodoros,
        tasks: day.tasks,
      }))
      .slice(-6),
    {
      name: 'Today',
      fullDate: format(new Date(), 'MMM d, yyyy'),
      pomodoros: stats.pomodorosToday,
      tasks: stats.tasksCompletedToday,
    },
  ];

  return (
    <>
      <article className="dm-card dm-chart-card" aria-labelledby="weekly-activity-title">
        <div className="dm-chart-heading">
          <div>
            <p className="dm-eyebrow">YOUR RECENT RHYTHM</p>
            <h2 className="dm-card-title" id="weekly-activity-title">Weekly activity</h2>
            <p>Sessions and completed tasks, day by day.</p>
          </div>
          <div className="dm-chart-legend" aria-label="Chart legend">
            <span><i className="dm-legend-dot" style={{ backgroundColor: moodConfig.color }} />Tasks</span>
            <span><i className="dm-legend-dot" style={{ backgroundColor: '#bd3e2f' }} />Pomodoros</span>
          </div>
        </div>
        <div className="dm-chart-container" role="img" aria-label="Weekly chart comparing tasks completed and Pomodoro sessions">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid stroke="#c7cdc6" strokeDasharray="3 5" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#58635d"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickMargin={11}
              />
              <YAxis
                stroke="#58635d"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#f8f9f4', borderColor: '#88928a' }}
                itemStyle={{ color: '#19211d', fontSize: '11px' }}
                labelStyle={{ color: '#59655e', marginBottom: '5px', fontSize: '10px' }}
                labelFormatter={(_, payload) => payload[0]?.payload?.fullDate ?? ''}
              />
              <Bar dataKey="tasks" name="Tasks" fill={moodConfig.color} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Line
                type="monotone"
                dataKey="pomodoros"
                name="Pomodoros"
                stroke="#bd3e2f"
                strokeWidth={2}
                dot={{ r: 3, fill: '#bd3e2f', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#bd3e2f', stroke: '#f8f9f4', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="dm-card dm-chart-card" aria-labelledby="mood-distribution-title">
        <div className="dm-chart-heading">
          <div>
            <p className="dm-eyebrow">MOOD OVERVIEW</p>
            <h2 className="dm-card-title" id="mood-distribution-title">Mood distribution</h2>
            <p>Example mix; mood history is not tracked yet.</p>
          </div>
        </div>
        <div className="dm-donut-wrap" role="img" aria-label="Example mood distribution: 45 percent focused, 30 percent neutral, 15 percent tired, 10 percent stressed">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOOD_DATA}
                cx="50%"
                cy="50%"
                innerRadius={61}
                outerRadius={82}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {MOOD_DATA.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#f8f9f4', borderColor: '#88928a' }}
                itemStyle={{ color: '#19211d', fontSize: '11px' }}
                formatter={(value) => [`${value}%`, 'Example share']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="dm-donut-center" aria-hidden="true">
            <strong>4</strong>
            <span>MOODS</span>
          </div>
        </div>
        <ul className="dm-mood-legend" aria-label="Example mood distribution values">
          {MOOD_DATA.map((entry) => (
            <li key={entry.name}>
              <i className="dm-mood-swatch" style={{ backgroundColor: entry.color }} aria-hidden="true" />
              <span>{entry.name}</span>
              <strong>{entry.value}%</strong>
            </li>
          ))}
        </ul>
      </article>
    </>
  );
};
