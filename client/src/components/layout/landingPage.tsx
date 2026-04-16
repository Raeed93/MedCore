import { useNavigate } from 'react-router-dom';
import { Activity, Brain, FileText, Shield, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <Activity className="w-10 h-10 text-white" />
            <span className="text-2xl font-bold text-white">MedCore AI</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-red-900 px-6 py-2 rounded-lg font-semibold hover:bg-white/90 transition-all shadow-lg"
          >
            Sign In
          </button>
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            AI-Powered Medical
            <br />
            Diagnosis System
          </h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Leverage cutting-edge AI and medical knowledge bases to generate
            evidence-based diagnostic recommendations for your patients.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-red-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/90 transition-all shadow-2xl flex items-center gap-2 mx-auto"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              RAG-Powered Analysis
            </h3>
            <p className="text-white/70 leading-relaxed">
              Retrieval-Augmented Generation combines your medical documents with
              advanced AI models for accurate diagnoses.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Evidence-Based Results
            </h3>
            <p className="text-white/70 leading-relaxed">
              Every diagnosis includes references to medical literature and
              guidelines used in the analysis.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Secure & Private
            </h3>
            <p className="text-white/70 leading-relaxed">
              Patient data is encrypted and handled with HIPAA-compliant security
              standards at every step.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <p className="text-white/70 mb-4">
            Trusted by medical professionals worldwide
          </p>
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
            <Shield className="w-4 h-4" />
            <span>Enterprise-grade security</span>
            <span className="mx-2">•</span>
            <Activity className="w-4 h-4" />
            <span>Clinical decision support</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-white/50 text-sm">
          <p>© 2024 MedCore AI. All rights reserved.</p>
          <p className="mt-2">
            This AI system is for clinical decision support only. Always validate
            with professional medical judgment.
          </p>
        </div>
      </div>
    </div>
  );
}