-- Create mood_entries table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_score SMALLINT NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  energy_level SMALLINT,
  activities TEXT[],
  factors JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS mood_entries_user_id_idx ON public.mood_entries(user_id);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS mood_entries_created_at_idx ON public.mood_entries(created_at);

-- Set up Row Level Security
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select only their own entries
CREATE POLICY select_own_mood_entries ON public.mood_entries
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own entries
CREATE POLICY insert_own_mood_entries ON public.mood_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update only their own entries
CREATE POLICY update_own_mood_entries ON public.mood_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete only their own entries
CREATE POLICY delete_own_mood_entries ON public.mood_entries
  FOR DELETE USING (auth.uid() = user_id);