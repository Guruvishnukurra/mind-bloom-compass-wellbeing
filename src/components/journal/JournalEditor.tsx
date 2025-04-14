import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Image as ImageIcon, Smile, Sparkles, 
  Save, Tag, Trash2, Heading1, Heading2, Quote, AlignLeft, AlignCenter, AlignRight,
  Bookmark, Calendar, Sun, Moon, Cloud, CloudRain, Heart, Star, Palette
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Journal prompts
const JOURNAL_PROMPTS = [
  "What made you smile today?",
  "What's something you're looking forward to?",
  "What's a challenge you're facing, and how might you overcome it?",
  "What are three things you're grateful for today?",
  "What's something new you learned recently?",
  "What's a goal you're working towards?",
  "Describe a moment that brought you joy today.",
  "What's something you'd like to improve about yourself?",
  "What's a memory that makes you happy?",
  "What's something kind you did for someone else recently?",
  "What's something kind someone did for you recently?",
  "What's a place you'd like to visit someday?",
  "What's a skill you'd like to learn or improve?",
  "What's something that challenged you today and how did you handle it?",
  "What's something you're proud of accomplishing?",
];



// Mood emojis
const MOOD_EMOJIS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "🤔", label: "Thoughtful" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😤", label: "Frustrated" },
  { emoji: "😴", label: "Tired" },
  { emoji: "🥳", label: "Excited" },
  { emoji: "😎", label: "Confident" },
  { emoji: "🙃", label: "Silly" },
  { emoji: "😇", label: "Grateful" },
  { emoji: "🧠", label: "Focused" },
  { emoji: "💭", label: "Reflective" },
];

// Stickers
const STICKERS = [
  { src: "/stickers/plant.svg", alt: "Plant" },
  { src: "/stickers/star.svg", alt: "Star" },
  { src: "/stickers/heart.svg", alt: "Heart" },
  { src: "/stickers/moon.svg", alt: "Moon" },
  { src: "/stickers/sun.svg", alt: "Sun" },
  { src: "/stickers/cloud.svg", alt: "Cloud" },
  { src: "/stickers/rainbow.svg", alt: "Rainbow" },
  { src: "/stickers/flower.svg", alt: "Flower" },
  { src: "/stickers/leaf.svg", alt: "Leaf" },
  { src: "/stickers/mountain.svg", alt: "Mountain" },
  { src: "/stickers/wave.svg", alt: "Wave" },
  { src: "/stickers/fire.svg", alt: "Fire" },
];

// Color palette
const COLORS = [
  "#000000", // Black
  "#718096", // Gray
  "#E53E3E", // Red
  "#DD6B20", // Orange
  "#D69E2E", // Yellow
  "#38A169", // Green
  "#319795", // Teal
  "#3182CE", // Blue
  "#5A67D8", // Indigo
  "#805AD5", // Purple
  "#D53F8C", // Pink
];

// Journal templates
const TEMPLATES = [
  {
    name: "Gratitude Journal",
    icon: <Heart className="h-4 w-4" />,
    content: `<h2>Gratitude Journal</h2>
<p>Today, I am grateful for:</p>
<ol>
  <li></li>
  <li></li>
  <li></li>
</ol>
<p>One small moment that brought me joy today:</p>
<p></p>`
  },
  {
    name: "Reflection",
    icon: <Moon className="h-4 w-4" />,
    content: `<h2>Daily Reflection</h2>
<p>Three words to describe today:</p>
<p></p>
<p>Something I learned:</p>
<p></p>
<p>Something I want to improve:</p>
<p></p>`
  },
  {
    name: "Goal Setting",
    icon: <Star className="h-4 w-4" />,
    content: `<h2>Goal Setting</h2>
<p>My main goal for today:</p>
<p></p>
<p>Steps to achieve it:</p>
<ol>
  <li></li>
  <li></li>
  <li></li>
</ol>
<p>Potential obstacles and how I'll overcome them:</p>
<p></p>`
  },
  {
    name: "Mood Tracker",
    icon: <Sun className="h-4 w-4" />,
    content: `<h2>Mood Tracker</h2>
<p>My mood today:</p>
<p></p>
<p>What influenced my mood:</p>
<p></p>
<p>How I can nurture my emotional wellbeing:</p>
<p></p>`
  },
  {
    name: "Free Write",
    icon: <Cloud className="h-4 w-4" />,
    content: `<h2>Free Writing</h2>
<p>Today I want to write about...</p>
<p></p>`
  },
];

export function JournalEditor() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Initialize editor with extended features
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your thoughts here...',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      // Count words
      const text = editor.getText();
      setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
    },
  });

  // Load user streak on component mount
  useEffect(() => {
    const loadStreak = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_achievements')
          .select('journal_streak')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error('Error loading streak:', error);
          return;
        }
        
        if (data) {
          setStreakCount(data.journal_streak || 0);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };
    
    loadStreak();
    
    // Generate a random prompt
    const randomPrompt = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
    setCurrentPrompt(randomPrompt);
  }, [user]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!user || !editor) return;

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (editor.isEmpty) {
      toast.error('Please write some content');
      return;
    }

    setIsSaving(true);

    try {
      const content = editor.getHTML();
      const { error } = await supabase
        .from('journal_entries')
        .insert([
          {
            user_id: user.id,
            title: title.trim(),
            content,
            tags,
            mood: selectedMood,
            word_count: wordCount,
          }
        ]);

      if (error) throw error;

      // Update streak
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);
      
      // Update user achievements
      await supabase
        .from('user_achievements')
        .upsert([
          {
            user_id: user.id,
            journal_streak: newStreak,
            last_journal: new Date().toISOString()
          }
        ]);

      // Show success animation
      setShowSuccess(true);
      
      // Trigger confetti for milestone streaks (5, 10, etc)
      if (newStreak % 5 === 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      setTimeout(() => {
        setShowSuccess(false);
        // Reset form
        setTitle('');
        setTags([]);
        setSelectedMood(null);
        editor.commands.clearContent();
        
        // Generate a new random prompt
        const randomPrompt = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
        setCurrentPrompt(randomPrompt);
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to save journal entry');
      console.error('Error:', error);
      setIsSaving(false);
    }
  };

  const insertSticker = (src: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src }).run();
    }
  };

  const useTemplate = (template: typeof TEMPLATES[0]) => {
    if (editor) {
      editor.commands.clearContent();
      editor.commands.setContent(template.content);
      setShowTemplates(false);
    }
  };

  const toggleFullscreen = () => {
    if (editorContainerRef.current) {
      if (!isFullscreen) {
        if (editorContainerRef.current.requestFullscreen) {
          editorContainerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const insertPrompt = () => {
    if (editor) {
      editor.chain().focus().insertContent(`<blockquote>${currentPrompt}</blockquote>`).run();
      setShowPrompt(false);
    }
  };

  return (
    <div ref={editorContainerRef} className="relative">
      <Card className={`w-full max-w-4xl mx-auto ${isFullscreen ? 'h-screen' : ''}`}>
        <CardHeader className="bg-gradient-to-r from-wellness-sage to-wellness-teal text-white">
          <CardTitle>Journal Entry</CardTitle>
          <CardDescription className="text-white/80">
            Express yourself freely and capture your thoughts
          </CardDescription>
        </CardHeader>
        
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 p-8"
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-wellness-teal mb-2">Journal Entry Saved!</h3>
              <p className="text-center text-muted-foreground mb-4">
                You've written {wordCount} words. Keep up the great work!
              </p>
              <div className="flex items-center gap-2 bg-wellness-teal/10 px-4 py-2 rounded-full">
                <Bookmark className="h-5 w-5 text-wellness-teal" />
                <span className="font-medium">Current streak: {streakCount} days</span>
              </div>
            </motion.div>
          ) : (
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Entry Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-lg font-semibold"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Smile className="h-4 w-4" />
                          <span>{selectedMood ? selectedMood : "Add Mood"}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid grid-cols-4 gap-2 p-2">
                          {MOOD_EMOJIS.map((mood) => (
                            <Button
                              key={mood.label}
                              variant="ghost"
                              className="flex flex-col items-center p-2 h-auto"
                              onClick={() => setSelectedMood(mood.label)}
                            >
                              <span className="text-2xl">{mood.emoji}</span>
                              <span className="text-xs mt-1">{mood.label}</span>
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date().toLocaleDateString()}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <div className="p-4">
                          <div className="font-medium">Today is</div>
                          <div className="text-2xl">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span>Tags</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="flex gap-2 items-center mb-2">
                        <Input
                          type="text"
                          placeholder="Add tags..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddTag}
                          variant="outline"
                          size="sm"
                        >
                          Add
                        </Button>
                      </div>
                      
                      {tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-wellness-teal/10 text-wellness-teal rounded-full text-sm flex items-center gap-1"
                            >
                              {tag}
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:text-destructive"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No tags added yet</p>
                      )}
                    </PopoverContent>
                  </Popover>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => setShowPrompt(true)}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Writing Prompt</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => setShowTemplates(true)}
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>Templates</span>
                  </Button>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>Stickers</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid grid-cols-4 gap-2">
                        {STICKERS.map((sticker, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className="h-16 w-16 p-2"
                            onClick={() => insertSticker(sticker.src)}
                          >
                            <img src={sticker.src} alt={sticker.alt} className="w-full h-full object-contain" />
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <div className="ml-auto flex items-center text-sm text-muted-foreground">
                    <span>{wordCount} words</span>
                  </div>
                </div>

                <div className="border rounded-md relative">
                  {editor && (
                    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                      <div className="flex items-center bg-white shadow-lg rounded-lg border overflow-hidden">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editor.chain().focus().toggleBold().run()}
                          className={editor.isActive('bold') ? 'bg-muted' : ''}
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editor.chain().focus().toggleItalic().run()}
                          className={editor.isActive('italic') ? 'bg-muted' : ''}
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editor.chain().focus().toggleUnderline().run()}
                          className={editor.isActive('underline') ? 'bg-muted' : ''}
                        >
                          <UnderlineIcon className="h-4 w-4" />
                        </Button>
                        
                        <div className="h-4 w-px bg-gray-200 mx-1"></div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                          className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
                        >
                          <Heading1 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                          className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                        >
                          <Heading2 className="h-4 w-4" />
                        </Button>
                        
                        <div className="h-4 w-px bg-gray-200 mx-1"></div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editor.chain().focus().toggleBulletList().run()}
                          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editor.chain().focus().toggleOrderedList().run()}
                          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                        >
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editor.chain().focus().toggleBlockquote().run()}
                          className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                        >
                          <Quote className="h-4 w-4" />
                        </Button>
                        
                        <div className="h-4 w-px bg-gray-200 mx-1"></div>
                        
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Palette className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2">
                            <div className="flex flex-wrap gap-1">
                              {COLORS.map(color => (
                                <Button
                                  key={color}
                                  variant="ghost"
                                  className="w-6 h-6 p-0 rounded-full"
                                  style={{ backgroundColor: color }}
                                  onClick={() => editor.chain().focus().setColor(color).run()}
                                />
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        
                        <div className="h-4 w-px bg-gray-200 mx-1"></div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editor.chain().focus().setTextAlign('left').run()}
                          className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}
                        >
                          <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editor.chain().focus().setTextAlign('center').run()}
                          className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
                        >
                          <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editor.chain().focus().setTextAlign('right').run()}
                          className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
                        >
                          <AlignRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </BubbleMenu>
                  )}
                  
                  <div className="min-h-[300px] paper-texture">
                    <EditorContent editor={editor} />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (editor) {
                        editor.commands.clearContent();
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear
                  </Button>
                  
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="bg-wellness-teal hover:bg-wellness-teal/90 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Entry'}
                  </Button>
                </div>
                
                {streakCount > 0 && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                    <Bookmark className="h-4 w-4" />
                    <span>Journal streak: {streakCount} days</span>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </AnimatePresence>
      </Card>
      
      {/* Writing Prompt Dialog */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-wellness-teal">Writing Prompt</h3>
              <p className="text-lg mb-6 italic">"{currentPrompt}"</p>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const randomPrompt = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
                    setCurrentPrompt(randomPrompt);
                  }}
                >
                  New Prompt
                </Button>
                <Button 
                  className="bg-wellness-teal hover:bg-wellness-teal/90"
                  onClick={insertPrompt}
                >
                  Use This Prompt
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Templates Dialog */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-wellness-teal">Journal Templates</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose a template to get started with your journal entry
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {TEMPLATES.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex items-start gap-3 justify-start"
                    onClick={() => useTemplate(template)}
                  >
                    <div className="w-8 h-8 rounded-full bg-wellness-teal/10 flex items-center justify-center text-wellness-teal">
                      {template.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {template.content.split('</h2>')[0].replace('<h2>', '')}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowTemplates(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 