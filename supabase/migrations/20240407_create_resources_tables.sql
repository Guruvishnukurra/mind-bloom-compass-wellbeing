-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'exercise', 'tool')),
  content_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create saved_resources table
CREATE TABLE IF NOT EXISTS saved_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, resource_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_resources_content_type ON resources(content_type);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at);
CREATE INDEX IF NOT EXISTS idx_saved_resources_user_id ON saved_resources(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_resources_resource_id ON saved_resources(resource_id);

-- Enable Row Level Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for resources
CREATE POLICY "Resources are viewable by all users"
  ON resources FOR SELECT
  USING (true);

-- Create policies for saved_resources
CREATE POLICY "Users can view their saved resources"
  ON saved_resources FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save resources"
  ON saved_resources FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave resources"
  ON saved_resources FOR DELETE
  USING (auth.uid() = user_id);

-- Insert initial resources
INSERT INTO resources (title, description, content_type, content_url, tags) VALUES
('Understanding Anxiety', 'Learn about the science behind anxiety and evidence-based management strategies.', 'article', 'https://example.com/anxiety-guide', ARRAY['anxiety', 'mental health', 'self-help']),
('Mindfulness Meditation Guide', 'A comprehensive guide to mindfulness meditation practice.', 'article', 'https://example.com/mindfulness-guide', ARRAY['meditation', 'mindfulness', 'stress relief']),
('Deep Breathing Exercise', 'Simple breathing techniques for stress and anxiety relief.', 'exercise', 'https://example.com/breathing-exercise', ARRAY['anxiety', 'stress relief', 'breathing']),
('Sleep Hygiene Tips', 'Evidence-based strategies for better sleep quality.', 'article', 'https://example.com/sleep-guide', ARRAY['sleep', 'health', 'habits']),
('Gratitude Journaling Workshop', 'Learn how to develop a gratitude practice through journaling.', 'video', 'https://example.com/gratitude-workshop', ARRAY['gratitude', 'journaling', 'positive psychology']),
('Progressive Muscle Relaxation', 'Step-by-step guide to release physical tension.', 'exercise', 'https://example.com/pmr-guide', ARRAY['relaxation', 'stress relief', 'anxiety']),
('Mood Tracking Tool', 'Interactive tool for tracking and understanding your moods.', 'tool', 'https://example.com/mood-tracker', ARRAY['mood', 'tracking', 'self-awareness']),
('Crisis Support Resources', 'List of emergency contacts and crisis support services.', 'article', 'https://example.com/crisis-support', ARRAY['crisis', 'support', 'emergency']),
('Cognitive Behavioral Therapy Basics', 'Introduction to CBT principles and techniques.', 'article', 'https://example.com/cbt-basics', ARRAY['therapy', 'cbt', 'mental health']),
('Meditation Timer App', 'Simple and effective meditation timer with guided sessions.', 'tool', 'https://example.com/meditation-timer', ARRAY['meditation', 'mindfulness', 'tools']); 