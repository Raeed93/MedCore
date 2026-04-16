import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/layout/landingPage';
import LoginForm from './components/auth/loginForm';
import VerifyEmail from './components/auth/verfyEmail';
import ProtectedRoute from './components/auth/protectedRoute';
import DashboardLayout from './components/layout/dashboardLayout';
import DashboardHome from './components/layout/dashboardHome';
import PatientManager from './components/patientManager';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/verify" element={<VerifyEmail />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="diagnose" element={<PatientManager />} />
              <Route path="history" element={
                <div className="text-white text-center mt-20">
                  <h2 className="text-3xl font-bold mb-4">Diagnosis History</h2>
                  <p className="text-white/70">Coming soon...</p>
                </div>
              } />
              <Route path="profile" element={
                <div className="text-white text-center mt-20">
                  <h2 className="text-3xl font-bold mb-4">Profile Settings</h2>
                  <p className="text-white/70">Coming soon...</p>
                </div>
              } />
            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;