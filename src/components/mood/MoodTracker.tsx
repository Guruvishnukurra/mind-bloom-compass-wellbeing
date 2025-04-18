import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Frown, Meh, ThumbsUp, ThumbsDown, Heart, Sun, Cloud, CloudRain, Zap, Coffee, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';

const ACTIVITIES = [
  { name: 'Exercise', icon: <Zap className="h-4 w-4" /> },
  { name: 'Work', icon: <Coffee className="h-4 w-4" /> },
  { name: 'Social', icon: <Heart className="h-4 w-4" /> },
  { name: 'Family', icon: <Heart className="h-4 w-4" /> },
  { name: 'Hobbies', icon: <ThumbsUp className="h-4 w-4" /> },
  { name: 'Reading', icon: <ThumbsUp className="h-4 w-4" /> },
  { name: 'Meditation', icon: <Moon className="h-4 w-4" /> },
  { name: 'Nature', icon: <Sun className="h-4 w-4" /> },
  { name: 'Music', icon: <ThumbsUp className="h-4 w-4" /> },
  { name: 'Rest', icon: <Moon className="h-4 w-4" /> }
];

const MOOD_EMOJIS = [
  { score: 1, icon: <Frown className="h-8 w-8" />, color: 'bg-red-400', label: 'Very Low' },
  { score: 2, icon: <Frown className="h-8 w-8" />, color: 'bg-orange-400', label: 'Low' },
  { score: 3, icon: <Meh className="h-8 w-8" />, color: 'bg-yellow-400', label: 'Neutral' },
  { score: 4, icon: <Smile className="h-8 w-8" />, color: 'bg-lime-400', label: 'Good' },
  { score: 5, icon: <Smile className="h-8 w-8" />, color: 'bg-green-400', label: 'Very Good' },
];

const ENERGY_EMOJIS = [
  { score: 1, icon: <CloudRain className="h-8 w-8" />, color: 'bg-blue-300', label: 'Very Low' },
  { score: 2, icon: <Cloud className="h-8 w-8" />, color: 'bg-blue-400', label: 'Low' },
  { score: 3, icon: <Cloud className="h-8 w-8" />, color: 'bg-blue-500', label: 'Moderate' },
  { score: 4, icon: <Sun className="h-8 w-8" />, color: 'bg-yellow-400', label: 'High' },
  { score: 5, icon: <Sun className="h-8 w-8" />, color: 'bg-yellow-500', label: 'Very High' },
];

// Journal prompts based on mood
const MOOD_PROMPTS = {
  low: [
    "What's one small thing that brought you comfort today?",
    "What would help you feel better right now?",
    "What's a challenge you're facing, and what's one step you could take?",
  ],
  neutral: [
    "What are you looking forward to tomorrow?",
    "What's something you accomplished today, no matter how small?",
    "What's something you're curious about right now?",
  ],
  high: [
    "What contributed to your positive mood today?",
    "How can you carry this energy forward?",
    "What's something you're grateful for in this moment?",
  ]
};

export function MoodTracker({ onMoodSaved }: { onMoodSaved?: () => void }) {
  const { user } = useAuth();
  const [moodScore, setMoodScore] = useState<number>(3);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [journalPrompt, setJournalPrompt] = useState('');
  const [step, setStep] = useState(1);

  // Get a random prompt based on mood
  useEffect(() => {
    let category = 'neutral';
    if (moodScore <= 2) category = 'low';
    else if (moodScore >= 4) category = 'high';
    
    const prompts = MOOD_PROMPTS[category as keyof typeof MOOD_PROMPTS];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setJournalPrompt(randomPrompt);
  }, [moodScore]);

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('mood_entries')
        .insert([
          {
            user_id: user.id,
            mood_score: moodScore,
            energy_level: energyLevel,
            activities: selectedActivities,
            notes
          }
        ]);

      if (error) throw error;

      // Show success animation
      setShowSuccess(true);
      
      // Trigger confetti for positive moods
      if (moodScore >= 4) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      setTimeout(() => {
        setShowSuccess(false);
        // Reset form
        setMoodScore(3);
        setEnergyLevel(3);
        setSelectedActivities([]);
        setNotes('');
        setStep(1);
        
        if (onMoodSaved) {
          onMoodSaved();
        }
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to track mood');
      console.error('Error:', error);
      setIsSubmitting(false);
    }
  };

  const getMoodEmoji = (score: number) => {
    // Map the 1-10 score to our 5 emoji levels
    const index = Math.min(Math.ceil(score / 2) - 1, 4);
    return MOOD_EMOJIS[index];
  };

  const getEnergyEmoji = (score: number) => {
    // Map the 1-10 score to our 5 emoji levels
    const index = Math.min(Math.ceil(score / 2) - 1, 4);
    return ENERGY_EMOJIS[index];
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto relative overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-wellness-sage to-wellness-teal text-white">
        <CardTitle className="text-center">Mood Check-In</CardTitle>
        <CardDescription className="text-white/80 text-center">
          Take a moment to reflect on how you're feeling
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
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-wellness-teal mb-2">Mood Tracked!</h3>
            <p className="text-center text-muted-foreground">
              Thank you for checking in with yourself today.
            </p>
          </motion.div>
        ) : (
          <CardContent className="p-6">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">How's your mood today?</h3>
                    <div className="flex justify-between mb-2">
                      {[1, 2, 3, 4, 5].map((value) => {
                        const isSelected = Math.ceil(moodScore / 2) === value;
                        const emoji = getMoodEmoji(value * 2);
                        return (
                          <motion.div
                            key={value}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex flex-col items-center cursor-pointer`}
                            onClick={() => setMoodScore(value * 2)}
                          >
                            <motion.div 
                              className={`w-14 h-14 rounded-full flex items-center justify-center ${isSelected ? emoji.color : 'bg-gray-100'} transition-colors duration-200 shadow-md`}
                              animate={isSelected ? { 
                                scale: [1, 1.1, 1],
                                boxShadow: ['0 4px 6px rgba(0,0,0,0.1)', '0 10px 15px rgba(0,0,0,0.2)', '0 4px 6px rgba(0,0,0,0.1)']
                              } : {}}
                              transition={isSelected ? { 
                                repeat: Infinity, 
                                duration: 2,
                                repeatType: "reverse"
                              } : {}}
                            >
                              {React.cloneElement(emoji.icon, { 
                                className: `h-7 w-7 ${isSelected ? 'text-white' : 'text-gray-500'}` 
                              })}
                            </motion.div>
                            <span className={`text-sm mt-2 font-sans ${isSelected ? 'font-medium' : 'text-gray-500'}`}>
                              {emoji.label}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                    <Slider
                      value={[moodScore]}
                      onValueChange={([value]) => setMoodScore(value)}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-6"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">How's your energy level?</h3>
                    <div className="flex justify-between mb-2">
                      {[1, 2, 3, 4, 5].map((value) => {
                        const isSelected = Math.ceil(energyLevel / 2) === value;
                        const emoji = getEnergyEmoji(value * 2);
                        return (
                          <motion.div
                            key={value}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex flex-col items-center cursor-pointer`}
                            onClick={() => setEnergyLevel(value * 2)}
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSelected ? emoji.color : 'bg-gray-100'} transition-colors duration-200`}>
                              {React.cloneElement(emoji.icon, { 
                                className: `h-6 w-6 ${isSelected ? 'text-white' : 'text-gray-500'}` 
                              })}
                            </div>
                            <span className={`text-xs mt-1 ${isSelected ? 'font-medium' : 'text-gray-500'}`}>
                              {emoji.label}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                    <Slider
                      value={[energyLevel]}
                      onValueChange={([value]) => setEnergyLevel(value)}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-6"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={nextStep} className="bg-wellness-teal hover:bg-wellness-teal/90">
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">What activities have you done today?</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2">
                    {ACTIVITIES.map(activity => (
                      <motion.div
                        key={activity.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant={selectedActivities.includes(activity.name) ? "default" : "outline"}
                          onClick={() => handleActivityToggle(activity.name)}
                          className={`h-auto py-3 w-full flex flex-col gap-2 items-center justify-center ${
                            selectedActivities.includes(activity.name) 
                              ? 'bg-wellness-teal hover:bg-wellness-teal/90 text-white' 
                              : 'hover:border-wellness-teal/50'
                          }`}
                        >
                          {activity.icon}
                          <span className="text-xs">{activity.name}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Reflection Prompt</h3>
                  <p className="text-muted-foreground mb-4 italic">"{journalPrompt}"</p>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Share your thoughts here..."
                    className="min-h-[120px] border-wellness-teal/20 focus:border-wellness-teal"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="bg-wellness-teal hover:bg-wellness-teal/90"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Mood Entry'}
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        )}
      </AnimatePresence>
    </Card>
  );
}
