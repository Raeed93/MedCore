import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/layout/landingPage';
import LoginForm from './components/auth/loginForm';
import VerifyEmail from './components/auth/verfyEmail';
import ProtectedRoute from './components/auth/protectedRoute';
import DashboardLayout from './components/layout/dashboardLayout';
import DashboardHome from './components/layout/dashboardHome';
import PatientManager from './components/patientManager';
import HistoryPage from './components/layout/historyPage';
import ProfilePage from './components/layout/profilePage';

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
              <Route path="history" element={<HistoryPage />} />
              <Route path="profile" element={<ProfilePage />} />

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