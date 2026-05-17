import { MoodProvider } from './context/MoodContext';
import { StatsProvider } from './context/StatsContext';
import { Header } from './components/Header';
import { QuoteCard } from './components/QuoteCard';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskList } from './components/TaskList';
import { StatsBar } from './components/StatsBar';
import { DataAnalysis } from './components/DataAnalysis';

function AppContent() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 font-sans">
      <Header />
      
      <main className="space-y-8 mt-6">
        <QuoteCard />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <PomodoroTimer />
          </div>
          
          <div className="lg:col-span-8">
            <TaskList />
          </div>
        </div>

        <StatsBar />
        
        <DataAnalysis />
      </main>
    </div>
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
