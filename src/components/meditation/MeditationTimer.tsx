import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Bell, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const MEDITATION_TYPES = [
  { id: 'breathing', name: 'Breathing Exercise', duration: 300, description: 'Focus on your breath to calm your mind' }, // 5 minutes
  { id: 'mindfulness', name: 'Mindfulness Meditation', duration: 600, description: 'Stay present in the moment' }, // 10 minutes
  { id: 'body-scan', name: 'Body Scan', duration: 900, description: 'Release tension throughout your body' }, // 15 minutes
  { id: 'loving-kindness', name: 'Loving-Kindness', duration: 600, description: 'Cultivate compassion for yourself and others' }, // 10 minutes
  { id: 'gratitude', name: 'Gratitude Meditation', duration: 300, description: 'Focus on things you are thankful for' }, // 5 minutes
  { id: 'sleep', name: 'Sleep Meditation', duration: 1200, description: 'Relax your body and mind for better sleep' }, // 20 minutes
  { id: 'anxiety', name: 'Anxiety Relief', duration: 600, description: 'Techniques to reduce anxiety and worry' }, // 10 minutes
  { id: 'focus', name: 'Focus & Concentration', duration: 450, description: 'Improve your ability to concentrate' }, // 7.5 minutes
];

// Guided meditation audio URLs (these would be replaced with actual URLs in production)
const GUIDED_MEDITATIONS = {
  'breathing': 'https://example.com/audio/breathing-meditation.mp3',
  'mindfulness': 'https://example.com/audio/mindfulness-meditation.mp3',
  'body-scan': 'https://example.com/audio/body-scan-meditation.mp3',
  'loving-kindness': 'https://example.com/audio/loving-kindness-meditation.mp3',
  'gratitude': 'https://example.com/audio/gratitude-meditation.mp3',
  'sleep': 'https://example.com/audio/sleep-meditation.mp3',
  'anxiety': 'https://example.com/audio/anxiety-relief-meditation.mp3',
  'focus': 'https://example.com/audio/focus-meditation.mp3',
};

export function MeditationTimer() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState(MEDITATION_TYPES[0]);
  const [timeLeft, setTimeLeft] = useState(selectedType.duration);
  const [isActive, setIsActive] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [useGuided, setUseGuided] = useState(false);
  const [customDuration, setCustomDuration] = useState(selectedType.duration);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle meditation completion
  const handleCompletion = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('meditation_sessions')
        .insert([
          {
            user_id: user.id,
            duration: customDuration,
            meditation_type: selectedType.id,
            completed: true,
            guided: useGuided,
          }
        ]);

      if (error) throw error;

      toast.success('Meditation session completed!');
      setSessionCompleted(true);
    } catch (error) {
      console.error('Error saving meditation session:', error);
      toast.error('Failed to save meditation session');
    }
  }, [user, selectedType, customDuration, useGuided]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            handleCompletion();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleCompletion]);

  // Handle meditation type change
  const handleTypeChange = (value: string) => {
    const newType = MEDITATION_TYPES.find(type => type.id === value) || MEDITATION_TYPES[0];
    setSelectedType(newType);
    setTimeLeft(newType.duration);
    setCustomDuration(newType.duration);
    setIsActive(false);
    setSessionCompleted(false);
  };

  // Handle start/pause
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Handle reset
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(customDuration);
    setSessionCompleted(false);
  };

  // Handle custom duration change
  const handleDurationChange = (value: number[]) => {
    setCustomDuration(value[0]);
    setTimeLeft(value[0]);
  };

  // Toggle guided meditation
  const toggleGuided = () => {
    setUseGuided(!useGuided);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Meditation Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Meditation Type</label>
          <Select
            value={selectedType.id}
            onValueChange={handleTypeChange}
            disabled={isActive}
          >
            <SelectTrigger>
              <SelectValue>{selectedType.name}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {MEDITATION_TYPES.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name} ({formatTime(type.duration)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">{selectedType.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Custom Duration</label>
            <span className="text-sm">{formatTime(customDuration)}</span>
          </div>
          <Slider
            value={[customDuration]}
            onValueChange={handleDurationChange}
            min={60}
            max={1800}
            step={30}
            disabled={isActive}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleGuided}
              disabled={isActive}
              className={useGuided ? "bg-primary/10" : ""}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <span className="text-sm">{useGuided ? "Guided" : "Silent"}</span>
          </div>
          {useGuided && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                min={0}
                max={100}
                step={1}
                className="w-24"
                disabled={isMuted}
              />
            </div>
          )}
        </div>

        <div className="text-center">
          <div className="text-6xl font-mono mb-6">{formatTime(timeLeft)}</div>
          
          <div className="space-x-2">
            <Button
              onClick={toggleTimer}
              disabled={sessionCompleted}
              size="lg"
            >
              {isActive ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </>
              )}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              disabled={isActive}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {sessionCompleted && (
          <div className="text-center text-green-600 dark:text-green-400">
            <Bell className="w-6 h-6 mx-auto mb-2" />
            Session completed! Great job!
          </div>
        )}
      </CardContent>
    </Card>
  );
} 