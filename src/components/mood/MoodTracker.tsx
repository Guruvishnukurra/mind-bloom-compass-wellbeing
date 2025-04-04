import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ACTIVITIES = [
  'Exercise', 'Work', 'Social', 'Family', 'Hobbies',
  'Reading', 'Meditation', 'Nature', 'Music', 'Rest'
];

export function MoodTracker() {
  const { user } = useAuth();
  const [moodScore, setMoodScore] = useState<number>(5);
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      toast.success('Mood tracked successfully!');
      // Reset form
      setMoodScore(5);
      setEnergyLevel(5);
      setSelectedActivities([]);
      setNotes('');
    } catch (error) {
      toast.error('Failed to track mood');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Mood Level: {moodScore}</label>
            <Slider
              value={[moodScore]}
              onValueChange={([value]) => setMoodScore(value)}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Energy Level: {energyLevel}</label>
            <Slider
              value={[energyLevel]}
              onValueChange={([value]) => setEnergyLevel(value)}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Activities</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
            {ACTIVITIES.map(activity => (
              <Button
                key={activity}
                variant={selectedActivities.includes(activity) ? "default" : "outline"}
                onClick={() => handleActivityToggle(activity)}
                className="h-auto py-2"
              >
                {activity}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling? What's on your mind?"
            className="mt-2"
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Tracking...' : 'Track Mood'}
        </Button>
      </CardContent>
    </Card>
  );
}
