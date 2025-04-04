import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = 'https://pyaxmhwaebbwvnvlopvy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YXhtaHdhZWJid3ZudmxvcHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NTI3ODQsImV4cCI6MjA1OTMyODc4NH0.vHNpS-M3fVf7HbMqYwwORafMX_O93VjRre6mt5Ks86g';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey); 