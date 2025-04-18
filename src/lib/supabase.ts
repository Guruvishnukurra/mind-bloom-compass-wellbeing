import { createClient } from '@supabase/supabase-js';

// Get environment variables or use fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key-for-development-only';

// Check if environment variables are properly set
const isValidUrl = supabaseUrl && supabaseUrl !== 'your_supabase_url_here' && supabaseUrl !== 'https://example.supabase.co';
const isValidKey = supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key_here' && supabaseAnonKey !== 'dummy-key-for-development-only';

// Log warnings for development mode
if (!isValidUrl) {
  console.warn('Invalid or missing VITE_SUPABASE_URL environment variable - using development fallback');
}
if (!isValidKey) {
  console.warn('Invalid or missing VITE_SUPABASE_ANON_KEY environment variable - using development fallback');
}

// Create the Supabase client with fallback values to prevent crashes
// We use a valid URL format even for fallbacks to avoid initialization errors
const validSupabaseUrl = isValidUrl ? supabaseUrl : 'https://example.supabase.co';
const validSupabaseKey = isValidKey ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient(validSupabaseUrl, validSupabaseKey);

// Flag to check if we're using real credentials
export const isSupabaseConfigured = isValidUrl && isValidKey;