-- Create habits table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'custom')),
  frequency_value INTEGER,
  frequency_unit TEXT CHECK (frequency_unit IN ('day', 'week', 'month')),
  time_of_day TEXT,
  reminder BOOLEAN NOT NULL DEFAULT FALSE,
  reminder_time TEXT,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Create habit_completions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS habits_user_id_idx ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS habits_created_at_idx ON public.habits(created_at);
CREATE INDEX IF NOT EXISTS habit_completions_habit_id_idx ON public.habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS habit_completions_user_id_idx ON public.habit_completions(user_id);
CREATE INDEX IF NOT EXISTS habit_completions_completed_at_idx ON public.habit_completions(completed_at);

-- Set up Row Level Security for habits table
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select only their own habits
CREATE POLICY select_own_habits ON public.habits
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own habits
CREATE POLICY insert_own_habits ON public.habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update only their own habits
CREATE POLICY update_own_habits ON public.habits
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete only their own habits
CREATE POLICY delete_own_habits ON public.habits
  FOR DELETE USING (auth.uid() = user_id);

-- Set up Row Level Security for habit_completions table
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select only their own habit completions
CREATE POLICY select_own_habit_completions ON public.habit_completions
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own habit completions
CREATE POLICY insert_own_habit_completions ON public.habit_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update only their own habit completions
CREATE POLICY update_own_habit_completions ON public.habit_completions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete only their own habit completions
CREATE POLICY delete_own_habit_completions ON public.habit_completions
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_habits_updated_at
BEFORE UPDATE ON public.habits
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();