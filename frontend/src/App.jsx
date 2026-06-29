import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppShell } from './components/oga/AppShell';
import { MarketMonitor } from './components/oga/MarketMonitor';
import { NewsFeed } from './components/oga/NewsFeed';
import { DealRadar } from './components/oga/DealRadar';
import { Clients } from './components/oga/Clients';
import { Digest } from './components/oga/Digest';
import { WorkflowView } from './components/oga/WorkflowView';
import AgentLibrary from './pages/Agents';
import LandingPage from './pages/LandingPage';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [view, setView] = useState('deals');

  useEffect(() => {
    document.body.classList.toggle('dashboard-mode', !showLanding);
  }, [showLanding]);

  return (
    <AnimatePresence mode="wait">
      {showLanding ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.45 }}
        >
          <LandingPage onEnter={() => setShowLanding(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          className="h-screen"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AppShell view={view} setView={setView}>
            {view === 'market'   && <MarketMonitor />}
            {view === 'news'     && <NewsFeed />}
            {view === 'deals'    && <DealRadar />}
            {view === 'clients'  && <Clients />}
            {view === 'digest'   && <Digest />}
            {view === 'workflow' && <WorkflowView />}
            {view === 'agents'   && (
              <div className="p-6">
                <AgentLibrary onNavigate={setView} />
              </div>
            )}
          </AppShell>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
