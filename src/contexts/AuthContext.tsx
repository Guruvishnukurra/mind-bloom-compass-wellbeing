import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Supabase URL and key are configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl === 'your_supabase_url_here' || 
        supabaseKey === 'your_supabase_anon_key_here') {
      console.warn('Supabase credentials not properly configured. Using demo mode with limited functionality.');
      
      // Create a demo user for development
      const demoUser = {
        id: 'demo-user-id',
        email: 'demo@example.com',
        user_metadata: {
          name: 'Demo User'
        }
      } as User;
      
      setUser(demoUser);
      setLoading(false);
      return;
    }

    try {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }).catch(err => {
        console.error('Error getting session:', err);
        setLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error initializing auth:', error);
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your_supabase_url_here' || 
          supabaseKey === 'your_supabase_anon_key_here') {
        console.warn('Using demo mode - creating demo user');
        
        // Create a demo user for development
        const demoUser = {
          id: 'demo-user-id',
          email: email,
          user_metadata: {
            name: email.split('@')[0]
          }
        } as User;
        
        setUser(demoUser);
        return;
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during sign in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your_supabase_url_here' || 
          supabaseKey === 'your_supabase_anon_key_here') {
        console.warn('Using demo mode - creating demo user');
        
        // Create a demo user for development
        const demoUser = {
          id: 'demo-user-id',
          email: email,
          user_metadata: {
            name: email.split('@')[0]
          }
        } as User;
        
        setUser(demoUser);
        return;
      }
      
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during sign up');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your_supabase_url_here' || 
          supabaseKey === 'your_supabase_anon_key_here') {
        console.warn('Using demo mode - signing out demo user');
        setUser(null);
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during sign out');
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 