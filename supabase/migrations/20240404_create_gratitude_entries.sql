-- Create gratitude_entries table
CREATE TABLE IF NOT EXISTS gratitude_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS gratitude_entries_user_id_idx ON gratitude_entries(user_id);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS gratitude_entries_created_at_idx ON gratitude_entries(created_at);

-- Set up Row Level Security (RLS)
ALTER TABLE gratitude_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own entries
CREATE POLICY "Users can view their own gratitude entries"
  ON gratitude_entries
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own entries
CREATE POLICY "Users can insert their own gratitude entries"
  ON gratitude_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own entries
CREATE POLICY "Users can update their own gratitude entries"
  ON gratitude_entries
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own entries
CREATE POLICY "Users can delete their own gratitude entries"
  ON gratitude_entries
  FOR DELETE
  USING (auth.uid() = user_id); 