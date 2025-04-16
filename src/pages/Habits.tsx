import { useState, useEffect } from 'react';
import { HabitTracker } from '@/components/habits/HabitTracker';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Habits() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tablesExist, setTablesExist] = useState(false);
  const [creatingTables, setCreatingTables] = useState(false);

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
  
  const createTables = async () => {
    setCreatingTables(true);
    try {
      // Execute SQL directly to create tables
      const { error } = await supabase.from('habits').insert({
        name: 'Temporary Habit',
        user_id: user?.id || '',
        category: 'other',
        frequency: 'daily',
        color: '#10b981',
        icon: 'default',
        archived: true
      });
      
      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist, show instructions
          toast.error('Tables need to be created in the Supabase dashboard');
          window.open('https://supabase.com/dashboard', '_blank');
        } else {
          console.error('Error creating tables:', error);
          toast.error('Failed to create tables: ' + error.message);
        }
      } else {
        // Table exists, refresh
        toast.success('Tables exist and are ready to use!');
        setTablesExist(true);
      }
    } catch (error) {
      console.error('Error creating tables:', error);
      toast.error('Failed to create tables');
    } finally {
      setCreatingTables(false);
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
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-md">
            <div className="flex flex-col space-y-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-yellow-800">Database Setup Required</h3>
                  <p className="mt-2 text-sm text-yellow-700">
                    The database tables for habit tracking are not set up yet. Please follow these steps:
                  </p>
                  <ol className="mt-3 ml-5 list-decimal text-sm text-yellow-700 space-y-2">
                    <li>Go to the Supabase dashboard</li>
                    <li>Navigate to the SQL Editor</li>
                    <li>Copy and paste the SQL from <code className="bg-yellow-100 px-1 rounded">supabase/create_habits_tables.sql</code></li>
                    <li>Run the SQL to create the necessary tables</li>
                    <li>Return to this page and click the "Check Tables" button</li>
                  </ol>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={checkTables}
                  disabled={creatingTables}
                  className="bg-yellow-600 hover:bg-yellow-700 mr-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking Tables...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Check Tables
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                  variant="outline"
                >
                  Open Supabase Dashboard
                </Button>
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