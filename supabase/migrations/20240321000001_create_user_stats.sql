-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  meditation_sessions INTEGER DEFAULT 0,
  habit_completions INTEGER DEFAULT 0,
  journal_entries INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_user_stats_updated_at
BEFORE UPDATE ON user_stats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stats"
  ON user_stats
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON user_stats
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON user_stats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id); 