import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { checkHealth } from './services/api';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Help from './pages/Help';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Money from './pages/Money';
import Savings from './pages/Savings';
import Credit from './pages/Credit';
import Health from './pages/Health';
import Ask from './pages/Ask';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Public-only route (redirects to dash if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dash" replace /> : children;
}

function AppContent() {
  useEffect(() => {
    // Ping Render backend in background so it starts warming up immediately
    checkHealth();
  }, []);

  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Auth Pages */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Authenticated Dashboard & Feature Pages */}
          <Route
            path="/dash"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/money"
            element={
              <ProtectedRoute>
                <Money />
              </ProtectedRoute>
            }
          />
          <Route
            path="/save"
            element={
              <ProtectedRoute>
                <Savings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/credit"
            element={
              <ProtectedRoute>
                <Credit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health"
            element={
              <ProtectedRoute>
                <Health />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ask"
            element={
              <ProtectedRoute>
                <Ask />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}
