import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Missing verification token');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/auth/verify?token=${token}`,
        {
          credentials: 'include', // Important! Sends/receives cookies
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Success! Save user data
        login(data.user);
        setStatus('success');
        setMessage('Login successful! Redirecting...');

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full">
        <div className="flex flex-col items-center">
          {/* Verifying */}
          {status === 'verifying' && (
            <>
              <Loader2 className="w-16 h-16 text-white animate-spin mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Verifying...</h2>
              <p className="text-white/70 text-center">
                Please wait while we verify your email
              </p>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-400 mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
              <p className="text-white/70 text-center">{message}</p>
            </>
          )}

          {/* Error */}
          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-400 mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Verification Failed
              </h2>
              <p className="text-white/70 text-center mb-6">{message}</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-red-900 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all"
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}