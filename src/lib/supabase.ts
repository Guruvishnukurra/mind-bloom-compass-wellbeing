import { createClient } from '@supabase/supabase-js';

// Get environment variables or use fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key-for-development-only';

// Check if environment variables are properly set
const isValidUrl = supabaseUrl && supabaseUrl !== 'your_supabase_url_here' && supabaseUrl !== 'https://example.supabase.co';
const isValidKey = supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key_here' && supabaseAnonKey !== 'dummy-key-for-development-only';

if (!isValidUrl) {
  console.warn('Invalid or missing VITE_SUPABASE_URL environment variable - using development fallback');
}
if (!isValidKey) {
  console.warn('Invalid or missing VITE_SUPABASE_ANON_KEY environment variable - using development fallback');
}

// Create the Supabase client with fallback values to prevent crashes
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Flag to check if we're using real credentials
export const isSupabaseConfigured = isValidUrl && isValidKey;