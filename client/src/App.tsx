import { useEffect, useState } from 'react';
import PatientManager from './components/patientManager';
import LandingPage from './components/LandingPage';

function App() {
  const [status, setStatus] = useState<string>('Loading...');

  // Simple "Router" state to switch views
  const [view, setView] = useState<'landing' | 'manager'>('landing');

  useEffect(() => {
    fetch('http://localhost:3000/')
      .then((res) => res.text())
      .then((data) => setStatus(data))
      .catch(() => setStatus('Error connecting to server'));
  }, []);

  return (
    // Apply the global medical background class here
    <div className="medical-bg font-sans antialiased text-white">
      
      {view === 'landing' && (
        <LandingPage onStart={() => setView('manager')} />
      )}

      {view === 'manager' && (
        <div className="min-h-screen p-6">
            <button 
                onClick={() => setView('landing')} 
                className="mb-4 text-white/70 hover:text-white underline"
            >
                ← Back to Home
            </button>
            
            {/* We wrap your existing manager in a glass container to match the theme */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl max-w-4xl mx-auto">
                <PatientManager />
            </div>
        </div>
      )}
    </div>
  );
}

export default App;