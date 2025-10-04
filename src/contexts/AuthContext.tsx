import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import otpService from '@/lib/otp-service';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  // Email/Password auth (legacy)
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  // Phone/OTP auth (new)
  sendOTP: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<void>;
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
      console.error('Supabase credentials not properly configured. Please check your .env file.');
      setError('Authentication service is not properly configured. Please contact support.');
      setLoading(false);
      return;
    }

    try {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError('Failed to get authentication session. Please try again.');
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
        setLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error initializing auth:', error);
      setError('Failed to initialize authentication. Please try again.');
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please try again.');
        } else if (signInError.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email before signing in.');
        } else {
          throw signInError;
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const { error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          throw new Error('An account with this email already exists.');
        } else {
          throw signUpError;
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during sign up');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (phoneNumber: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // Validate phone number format
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        throw new Error('Please enter a valid phone number');
      }
      
      // Use the formatted phone number for display but clean phone for processing
      const result = await otpService.sendOTP(phoneNumber);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // Verify OTP with our service
      const isValidOTP = otpService.verifyOTP(phoneNumber, otp);
      if (!isValidOTP) {
        throw new Error('Invalid or expired OTP. Please try again.');
      }
      
      // Clean phone number for database operations
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      
      // Check if user exists with this phone number
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', cleanPhone)
        .single();
      
      if (userError && userError.code !== 'PGRST116') {
        throw new Error('Database error occurred');
      }
      
      if (existingUser) {
        // User exists, sign them in using their email
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: existingUser.email,
          password: 'phone_auth_placeholder' // This is a placeholder - in production, use proper phone auth
        });
        
        if (signInError) {
          // For now, we'll create a new session by signing up again
          // In production, you should implement proper phone authentication
          const { error: signUpError } = await supabase.auth.signUp({
            email: `${cleanPhone}@mindbloom.local`,
            password: Math.random().toString(36).slice(-8),
            options: {
              data: {
                phone: cleanPhone,
                full_name: existingUser.full_name || 'User'
              }
            }
          });
          
          if (signUpError) {
            throw new Error('Sign in failed. Please try again.');
          }
        }
      } else {
        // New user, create account
        const { error: signUpError } = await supabase.auth.signUp({
          email: `${cleanPhone}@mindbloom.local`,
          password: Math.random().toString(36).slice(-8),
          options: {
            data: {
              phone: cleanPhone,
              full_name: 'User'
            }
          }
        });
        
        if (signUpError) {
          throw new Error('Failed to create account. Please try again.');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        throw signOutError;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during sign out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    sendOTP,
    verifyOTP,
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