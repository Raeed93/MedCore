import { Stethoscope, Activity, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* --- HEADER --- */}
      <header className="p-6 flex items-center gap-4 border-b border-white/10">
        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20">
          <Stethoscope className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wide">MediAI Diagnostics</h1>
          <p className="text-xs text-white/60 uppercase tracking-wider">Clinical Decision Support System</p>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 text-center max-w-6xl mx-auto w-full">
        
        {/* Hero Text */}
        <h2 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          Ready for Clinical Analysis
        </h2>
        <p className="text-lg text-white/80 mb-12 max-w-2xl font-light">
          AI-powered diagnostic assistance for medical professionals. 
          Streamline your workflow with real-time data analysis.
        </p>

        {/* Call to Action Button */}
        <button 
          onClick={onStart}
          className="group flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-md transition-all duration-300 mb-20 shadow-xl hover:shadow-2xl hover:scale-105"
        >
          <Activity className="w-5 h-5" />
          <span className="text-lg font-medium">Start New Diagnosis</span>
          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0" />
        </button>

        {/* --- PROCESS CARDS (The 01, 02, 03) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Card 1 */}
          <GlassCard 
            number="01" 
            title="Enter Patient Data" 
            desc="Input symptoms, history, and vital signs for comprehensive analysis." 
          />
          {/* Card 2 */}
          <GlassCard 
            number="02" 
            title="AI Analysis" 
            desc="Advanced algorithms process the data against thousands of medical records." 
          />
          {/* Card 3 */}
          <GlassCard 
            number="03" 
            title="Get Recommendations" 
            desc="Receive diagnosis suggestions, differential diagnosis, and test plans." 
          />
        </div>
      </main>

      {/* --- FOOTER WARNING --- */}
      <footer className="p-6">
        <div className="max-w-4xl mx-auto bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-md rounded-lg p-3 flex items-center justify-center gap-3">
          <span className="text-yellow-400">⚠️</span>
          <p className="text-xs text-white/70 italic">
            This AI system is for clinical decision support only. Always validate with professional medical judgment and additional testing.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Helper Component for the Cards
function GlassCard({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors text-center shadow-lg">
      <div className="text-4xl font-light text-white/90 mb-4">{number}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
    </div>
  );
}