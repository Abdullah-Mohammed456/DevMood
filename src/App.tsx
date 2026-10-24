import type { CSSProperties } from 'react';
import { MotionConfig } from 'framer-motion';
import { MoodProvider, useMood } from './context/MoodContext';
import { StatsProvider } from './context/StatsContext';
import { Header } from './components/Header';
import { QuoteCard } from './components/QuoteCard';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskList } from './components/TaskList';
import { StatsBar } from './components/StatsBar';
import { DataAnalysis } from './components/DataAnalysis';

function AppContent() {
  const { moodConfig } = useMood();

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="dm-app"
        style={{ '--mood-color': moodConfig.color } as CSSProperties & { '--mood-color': string }}
      >
        <Header />
        <main className="dm-main">
          <QuoteCard />

          <section className="dm-workspace-grid" aria-label="Focus timer and tasks">
            <PomodoroTimer />
            <TaskList />
          </section>

          <section className="dm-stats-grid" aria-label="Today's statistics">
            <StatsBar />
          </section>

          <section className="dm-analysis-grid" aria-label="Weekly activity and mood distribution">
            <DataAnalysis />
          </section>
        </main>
      </div>
    </MotionConfig>
  );
}

function App() {
  return (
    <MoodProvider>
      <StatsProvider>
        <AppContent />
      </StatsProvider>
    </MoodProvider>
  );
}

export default App;
