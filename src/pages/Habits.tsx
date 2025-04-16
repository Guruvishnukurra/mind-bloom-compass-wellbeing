import { useState, useEffect } from 'react';
import { HabitTracker } from '@/components/habits/HabitTracker';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function Habits() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tablesExist, setTablesExist] = useState(false);

  useEffect(() => {
    if (user) {
      checkTables();
    }
  }, [user]);

  const checkTables = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Check if the habits table exists
      const { error: habitsTableError } = await supabase
        .from('habits')
        .select('id')
        .limit(1);
        
      // Check if the habit_completions table exists
      const { error: completionsTableError } = await supabase
        .from('habit_completions')
        .select('id')
        .limit(1);
        
      if (habitsTableError || completionsTableError) {
        console.warn('Habits tables may not exist yet');
        setTablesExist(false);
      } else {
        setTablesExist(true);
      }
    } catch (error) {
      console.error('Error checking tables:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Habit Builder</h1>
        
        {!tablesExist ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  The database tables for habit tracking are not set up yet. Please run the database migrations first.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <HabitTracker />
        )}
      </div>
    </div>
  );
}