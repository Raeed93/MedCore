import { useState } from 'react';
import { Activity, Mail, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:3000/auth/send-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send magic link');
      }

      setMessage({
        type: 'success',
        text: 'Magic link sent! Check your email to continue.',
      });
      setEmail('');
    } catch (error: any) {
      console.error('Magic link error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send magic link. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Activity className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">MedCore AI</h1>
          <p className="text-white/70">AI-Powered Medical Diagnosis System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Sign In
          </h2>

          {/* Message Display */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-500/20 border-green-400 text-green-100'
                  : 'bg-red-500/20 border-red-400 text-red-100'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {/* Email Magic Link Form */}
          <form onSubmit={handleMagicLinkLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-white/90 mb-2 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@hospital.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-red-900 font-bold py-3 rounded-lg hover:bg-white/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Magic Link...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Magic Link
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-white/50">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Back to Landing */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}