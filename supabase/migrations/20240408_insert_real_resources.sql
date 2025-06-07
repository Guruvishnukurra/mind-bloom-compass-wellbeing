-- Insert mental health articles
INSERT INTO resources (title, description, content_type, content_url, tags) VALUES
('Understanding Anxiety: A Comprehensive Guide', 'Learn about the different types of anxiety disorders, their symptoms, and evidence-based treatment options.', 'article', 'https://www.nimh.nih.gov/health/topics/anxiety-disorders', ARRAY['anxiety', 'mental health', 'education']),
('The Science of Depression', 'A detailed look at depression, its causes, and modern treatment approaches backed by research.', 'article', 'https://www.psychiatry.org/patients-families/depression', ARRAY['depression', 'mental health', 'science']),
('Sleep and Mental Health Connection', 'Explore the crucial relationship between sleep quality and mental wellbeing.', 'article', 'https://www.sleepfoundation.org/mental-health', ARRAY['sleep', 'mental health', 'wellness']),
('Building Resilience in Difficult Times', 'Practical strategies for developing emotional resilience and coping with stress.', 'article', 'https://www.apa.org/topics/resilience', ARRAY['resilience', 'stress', 'coping']),
('Mindfulness for Beginners', 'An introduction to mindfulness practice and its benefits for mental health.', 'article', 'https://www.mindful.org/meditation/mindfulness-getting-started/', ARRAY['mindfulness', 'meditation', 'beginners']),
('Understanding Panic Attacks', 'Learn about the symptoms, causes, and management strategies for panic attacks.', 'article', 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-and-panic-attacks/panic-attacks/', ARRAY['panic', 'anxiety', 'mental health']),

-- Insert video resources
('Guided Morning Meditation for Beginners', 'Start your day with this calming 10-minute meditation practice.', 'video', 'https://www.youtube.com/watch?v=inpok4MKVLM', ARRAY['meditation', 'mindfulness', 'morning routine']),
('5-Minute Breathing Exercise', 'Quick breathing technique to reduce stress and anxiety.', 'video', 'https://www.youtube.com/watch?v=O-6f5wQXSu8', ARRAY['breathing', 'stress relief', 'quick exercise']),
('Progressive Muscle Relaxation', 'Learn this effective technique to release physical tension and reduce anxiety.', 'video', 'https://www.youtube.com/watch?v=1nZEdqcGVzo', ARRAY['relaxation', 'anxiety', 'stress relief']),
('Mindful Walking Meditation', 'Combine movement and mindfulness with this guided walking meditation.', 'video', 'https://www.youtube.com/watch?v=wZQZQZQZQZQ', ARRAY['meditation', 'mindfulness', 'exercise']),
('Yoga for Anxiety Relief', 'Gentle yoga sequence specifically designed to reduce anxiety.', 'video', 'https://www.youtube.com/watch?v=hJbRpHZr_d0', ARRAY['yoga', 'anxiety', 'exercise']),

-- Insert exercises
('5-4-3-2-1 Grounding Technique', 'A simple but effective grounding exercise using your five senses.', 'exercise', 'https://www.urmc.rochester.edu/behavioral-health-partners/bhp-blog/april-2018/5-4-3-2-1-coping-technique-for-anxiety.aspx', ARRAY['grounding', 'anxiety', 'coping']),
('Thought Record Worksheet', 'A CBT tool to identify and challenge negative thought patterns.', 'exercise', 'https://www.psychologytools.com/resource/thought-record/', ARRAY['cbt', 'thoughts', 'therapy']),
('Box Breathing Technique', 'A simple breathing exercise to reduce stress and improve focus.', 'exercise', 'https://www.healthline.com/health/box-breathing', ARRAY['breathing', 'stress', 'focus']),
('Self-Compassion Exercises', 'Practices to develop self-compassion and reduce self-criticism.', 'exercise', 'https://self-compassion.org/category/exercises/', ARRAY['self-compassion', 'mental health', 'wellbeing']),

-- Insert helpful tools
('Headspace', 'Popular meditation and mindfulness app with guided sessions for beginners to advanced practitioners.', 'tool', 'https://www.headspace.com/', ARRAY['meditation', 'mindfulness', 'app']),
('Calm', 'App featuring sleep stories, meditation guides, and calming music.', 'tool', 'https://www.calm.com/', ARRAY['sleep', 'meditation', 'relaxation']),
('Moodfit', 'Comprehensive mental health app for tracking mood, building healthy habits, and managing anxiety.', 'tool', 'https://www.getmoodfit.com/', ARRAY['mood tracking', 'mental health', 'habits']),
('Breathwrk', 'App offering science-backed breathing exercises for different purposes.', 'tool', 'https://www.breathwrk.com/', ARRAY['breathing', 'anxiety', 'stress']),
('Woebot', 'AI chatbot that uses CBT principles to help manage mental health.', 'tool', 'https://woebothealth.com/', ARRAY['chatbot', 'cbt', 'mental health']),
('Insight Timer', 'Free meditation app with thousands of guided meditations and music tracks.', 'tool', 'https://insighttimer.com/', ARRAY['meditation', 'mindfulness', 'free']),

-- Insert crisis resources
('National Suicide Prevention Lifeline', '24/7 free and confidential support for people in distress.', 'article', 'https://988lifeline.org/', ARRAY['crisis', 'suicide prevention', 'emergency']),
('Crisis Text Line', '24/7 text support for any type of crisis.', 'article', 'https://www.crisistextline.org/', ARRAY['crisis', 'text support', 'emergency']),
('SAMHSA Treatment Locator', 'Find treatment facilities and programs in your area.', 'tool', 'https://findtreatment.samhsa.gov/', ARRAY['treatment', 'resources', 'help']),
('International Crisis Resources', 'Global directory of crisis hotlines and resources.', 'article', 'https://www.opencounseling.com/hotlines', ARRAY['crisis', 'international', 'emergency']),

-- Insert wellness resources
('Sleep Foundation', 'Comprehensive resources about sleep health and disorders.', 'article', 'https://www.sleepfoundation.org/', ARRAY['sleep', 'health', 'education']),
('Mindful.org', 'Resources for mindfulness practice and meditation.', 'article', 'https://www.mindful.org/', ARRAY['mindfulness', 'meditation', 'education']),
('Greater Good Science Center', 'Research-based articles on happiness and wellbeing.', 'article', 'https://greatergood.berkeley.edu/', ARRAY['happiness', 'wellbeing', 'research']),
('Positive Psychology', 'Resources for building resilience and positive mental health.', 'article', 'https://positivepsychology.com/', ARRAY['positive psychology', 'wellbeing', 'education']),

-- Insert professional resources
('Psychology Today', 'Find therapists and mental health professionals in your area.', 'tool', 'https://www.psychologytoday.com/us/therapists', ARRAY['therapy', 'professionals', 'help']),
('ADAA', 'Anxiety and Depression Association of America resources.', 'article', 'https://adaa.org/', ARRAY['anxiety', 'depression', 'support']),
('Mental Health First Aid', 'Learn how to help someone experiencing a mental health crisis.', 'article', 'https://www.mentalhealthfirstaid.org/', ARRAY['first aid', 'education', 'support']),
('NAMI', 'National Alliance on Mental Illness resources and support.', 'article', 'https://www.nami.org/help', ARRAY['support', 'education', 'resources']); 