-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'custom')),
  frequency_value INTEGER,
  frequency_unit TEXT CHECK (frequency_unit IN ('day', 'week', 'month')),
  time_of_day TIME,
  reminder BOOLEAN DEFAULT false,
  reminder_time TIME,
  color TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  streak INTEGER DEFAULT 0,
  last_completed TIMESTAMP WITH TIME ZONE
);

-- Create habit_completions table
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_completed_at ON habit_completions(completed_at);

-- Create function to update habit streak
CREATE OR REPLACE FUNCTION update_habit_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_completion_date DATE;
  current_streak INTEGER;
BEGIN
  -- Get the last completion date for this habit
  SELECT MAX(completed_at::date) INTO last_completion_date
  FROM habit_completions
  WHERE habit_id = NEW.habit_id
  AND completed_at < NEW.completed_at;

  -- If there's no previous completion, start streak at 1
  IF last_completion_date IS NULL THEN
    current_streak := 1;
  -- If the last completion was yesterday, increment streak
  ELSIF last_completion_date = NEW.completed_at::date - INTERVAL '1 day' THEN
    SELECT streak INTO current_streak
    FROM habits
    WHERE id = NEW.habit_id;
    current_streak := current_streak + 1;
  -- If the last completion was today, keep the same streak
  ELSIF last_completion_date = NEW.completed_at::date THEN
    SELECT streak INTO current_streak
    FROM habits
    WHERE id = NEW.habit_id;
  -- Otherwise, reset streak to 1
  ELSE
    current_streak := 1;
  END IF;

  -- Update the habit's streak and last_completed
  UPDATE habits
  SET streak = current_streak,
      last_completed = NEW.completed_at
  WHERE id = NEW.habit_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for streak updates
CREATE TRIGGER update_habit_streak_trigger
AFTER INSERT ON habit_completions
FOR EACH ROW
EXECUTE FUNCTION update_habit_streak();

-- Create RLS policies
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- Habits policies
CREATE POLICY "Users can view their own habits"
  ON habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
  ON habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
  ON habits FOR DELETE
  USING (auth.uid() = user_id);

-- Habit completions policies
CREATE POLICY "Users can view their own habit completions"
  ON habit_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit completions"
  ON habit_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit completions"
  ON habit_completions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit completions"
  ON habit_completions FOR DELETE
  USING (auth.uid() = user_id); 