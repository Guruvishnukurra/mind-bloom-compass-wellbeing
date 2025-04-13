import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly set
const isValidUrl = supabaseUrl && supabaseUrl !== 'your_supabase_url_here';
const isValidKey = supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key_here';

if (!isValidUrl) {
  console.warn('Invalid or missing VITE_SUPABASE_URL environment variable');
}
if (!isValidKey) {
  console.warn('Invalid or missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create the Supabase client even with empty values to prevent crashes
// The application will handle the missing configuration in the UI
export const supabase = createClient(
  isValidUrl ? supabaseUrl : '',
  isValidKey ? supabaseAnonKey : ''
);