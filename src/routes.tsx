import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import Dashboard from '@/pages/Dashboard';
import { Journal } from '@/pages/Journal';
import { Meditation } from '@/pages/Meditation';
import Resources from '@/pages/Resources';
import Gratitude from '@/pages/Gratitude';
import Chat from '@/pages/Chat';
import ApiTest from '@/pages/ApiTest';
import Achievements from '@/pages/Achievements';

export function AppRoutes() {
  const { user, loading, error } = useAuth();

  // Check if Supabase credentials are configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isSupabaseConfigured = 
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl !== 'your_supabase_url_here' && 
    supabaseKey !== 'your_supabase_anon_key_here';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show configuration warning if Supabase is not configured
  if (!isSupabaseConfigured) {
    console.error("Supabase configuration missing or invalid. Check your .env file.");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Configuration Required</h1>
          <p className="mb-4 dark:text-white">
            Supabase credentials are not properly configured. Please update your .env file with valid Supabase URL and anonymous key.
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-left mb-4 overflow-x-auto">
            <pre className="text-sm dark:text-white">
              VITE_SUPABASE_URL=your_actual_supabase_url<br/>
              VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
            </pre>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            After updating the .env file, restart your development server.
          </p>
        </div>
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
      <Route
        path="/api-test"
        element={<ApiTest />}
      />
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/auth'} />} />
    </Routes>
  );
}