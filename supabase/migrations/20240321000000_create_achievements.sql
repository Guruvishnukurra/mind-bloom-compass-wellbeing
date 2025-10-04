-- Create achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- Create function to update achievement progress
CREATE OR REPLACE FUNCTION update_achievement_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update progress for meditation achievements
  IF NEW.meditation_completed = true THEN
    UPDATE user_achievements
    SET progress = progress + 1
    WHERE user_id = NEW.user_id
    AND achievement_id LIKE 'meditation_%';
  END IF;

  -- Update progress for habit achievements
  IF NEW.habit_completed = true THEN
    UPDATE user_achievements
    SET progress = progress + 1
    WHERE user_id = NEW.user_id
    AND achievement_id LIKE 'habit_%';
  END IF;

  -- Update progress for journal achievements
  IF NEW.journal_entry_created = true THEN
    UPDATE user_achievements
    SET progress = progress + 1
    WHERE user_id = NEW.user_id
    AND achievement_id LIKE 'journal_%';
  END IF;

  -- Update progress for streak achievements
  IF NEW.streak_updated = true THEN
    UPDATE user_achievements
    SET progress = NEW.current_streak
    WHERE user_id = NEW.user_id
    AND achievement_id LIKE 'streak_%';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for achievement progress updates
CREATE TRIGGER update_achievement_progress_trigger
AFTER INSERT OR UPDATE ON user_stats
FOR EACH ROW
EXECUTE FUNCTION update_achievement_progress();

-- Create RLS policies
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON user_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON user_achievements
  FOR UPDATE
  USING (auth.uid() = user_id); 