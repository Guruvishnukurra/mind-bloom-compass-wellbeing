import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { Dashboard } from '@/pages/Dashboard';
import { Journal } from '@/pages/Journal';
import { Meditation } from '@/pages/Meditation';
import { Resources } from '@/pages/Resources';
import Gratitude from '@/pages/Gratitude';
import Chat from '@/pages/Chat';
import Achievements from '@/pages/Achievements';

export function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={!user ? <AuthForm /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/auth" />}
      />
      <Route
        path="/journal"
        element={user ? <Journal /> : <Navigate to="/auth" />}
      />
      <Route
        path="/meditation"
        element={user ? <Meditation /> : <Navigate to="/auth" />}
      />
      <Route
        path="/resources"
        element={user ? <Resources /> : <Navigate to="/auth" />}
      />
      <Route
        path="/gratitude"
        element={user ? <Gratitude /> : <Navigate to="/auth" />}
      />
      <Route
        path="/chat"
        element={user ? <Chat /> : <Navigate to="/auth" />}
      />
      <Route
        path="/achievements"
        element={
          user ? (
            <Achievements />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/auth'} />} />
    </Routes>
  );
} 