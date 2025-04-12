-- Insert mental health articles
INSERT INTO resources (title, description, content_type, content_url, tags) VALUES
('Understanding Anxiety: A Comprehensive Guide', 'Learn about the different types of anxiety disorders, their symptoms, and evidence-based treatment options.', 'article', 'https://www.nimh.nih.gov/health/topics/anxiety-disorders', ARRAY['anxiety', 'mental health', 'education']),
('The Science of Depression', 'A detailed look at depression, its causes, and modern treatment approaches backed by research.', 'article', 'https://www.psychiatry.org/patients-families/depression', ARRAY['depression', 'mental health', 'science']),
('Sleep and Mental Health Connection', 'Explore the crucial relationship between sleep quality and mental wellbeing.', 'article', 'https://www.sleepfoundation.org/mental-health', ARRAY['sleep', 'mental health', 'wellness']),
('Building Resilience in Difficult Times', 'Practical strategies for developing emotional resilience and coping with stress.', 'article', 'https://www.apa.org/topics/resilience', ARRAY['resilience', 'stress', 'coping']),

-- Insert video resources
('Guided Morning Meditation for Beginners', 'Start your day with this calming 10-minute meditation practice.', 'video', 'https://www.youtube.com/watch?v=inpok4MKVLM', ARRAY['meditation', 'mindfulness', 'morning routine']),
('Understanding Cognitive Behavioral Therapy', 'An introduction to CBT techniques and how they can help manage anxiety and depression.', 'video', 'https://www.youtube.com/watch?v=9c_Bv_FBE-c', ARRAY['therapy', 'cbt', 'mental health']),
('Yoga for Stress Relief', 'A gentle 20-minute yoga session designed to reduce stress and anxiety.', 'video', 'https://www.youtube.com/watch?v=hJbRpHZr_d0', ARRAY['yoga', 'stress relief', 'exercise']),
('Mindful Breathing Techniques', 'Learn different breathing exercises for anxiety and stress management.', 'video', 'https://www.youtube.com/watch?v=wfDTp2GogaQ', ARRAY['breathing', 'anxiety', 'mindfulness']),

-- Insert practical exercises
('5-4-3-2-1 Grounding Exercise', 'A simple but effective technique to manage anxiety and panic attacks using your senses.', 'exercise', 'https://www.urmc.rochester.edu/behavioral-health-partners/bhp-blog/april-2018/5-4-3-2-1-coping-technique-for-anxiety.aspx', ARRAY['anxiety', 'grounding', 'coping']),
('Progressive Muscle Relaxation', 'Step-by-step guide to releasing physical tension through progressive muscle relaxation.', 'exercise', 'https://www.healthline.com/health/progressive-muscle-relaxation', ARRAY['relaxation', 'stress', 'body awareness']),
('Gratitude Journal Prompts', 'Daily prompts and exercises to cultivate gratitude and positive thinking.', 'exercise', 'https://positivepsychology.com/gratitude-exercises/', ARRAY['gratitude', 'journaling', 'positive psychology']),
('Thought Record Worksheet', 'A CBT tool to identify and challenge negative thought patterns.', 'exercise', 'https://www.psychologytools.com/resource/thought-record/', ARRAY['cbt', 'thoughts', 'therapy']),

-- Insert helpful tools
('Headspace', 'Popular meditation and mindfulness app with guided sessions for beginners to advanced practitioners.', 'tool', 'https://www.headspace.com/', ARRAY['meditation', 'mindfulness', 'app']),
('Calm', 'App featuring sleep stories, meditation guides, and calming music.', 'tool', 'https://www.calm.com/', ARRAY['sleep', 'meditation', 'relaxation']),
('Moodfit', 'Comprehensive mental health app for tracking mood, building healthy habits, and managing anxiety.', 'tool', 'https://www.getmoodfit.com/', ARRAY['mood tracking', 'mental health', 'habits']),
('Breathwrk', 'App offering science-backed breathing exercises for different purposes.', 'tool', 'https://www.breathwrk.com/', ARRAY['breathing', 'anxiety', 'stress']),

-- Insert crisis resources
('National Suicide Prevention Lifeline', '24/7 free and confidential support for people in distress.', 'article', 'https://988lifeline.org/', ARRAY['crisis', 'suicide prevention', 'emergency']),
('Crisis Text Line', 'Free 24/7 text support with trained crisis counselors.', 'article', 'https://www.crisistextline.org/', ARRAY['crisis', 'support', 'text']),
('SAMHSA Treatment Locator', 'Find mental health treatment facilities and programs.', 'tool', 'https://findtreatment.samhsa.gov/', ARRAY['treatment', 'therapy', 'resources']),
('7 Cups', 'Platform offering online therapy and free emotional support.', 'tool', 'https://www.7cups.com/', ARRAY['therapy', 'support', 'counseling']); 