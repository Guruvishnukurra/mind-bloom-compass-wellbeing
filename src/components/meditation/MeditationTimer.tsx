import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';

const MEDITATION_TYPES = [
  { id: 'breathing', name: 'Breathing Exercise', duration: 300 }, // 5 minutes
  { id: 'mindfulness', name: 'Mindfulness Meditation', duration: 600 }, // 10 minutes
  { id: 'body-scan', name: 'Body Scan', duration: 900 }, // 15 minutes
  { id: 'loving-kindness', name: 'Loving-Kindness', duration: 600 }, // 10 minutes
];

export function MeditationTimer() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState(MEDITATION_TYPES[0]);
  const [timeLeft, setTimeLeft] = useState(selectedType.duration);
  const [isActive, setIsActive] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

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
            duration: selectedType.duration,
            meditation_type: selectedType.id,
            completed: true,
          }
        ]);

      if (error) throw error;

      toast.success('Meditation session completed!');
      setSessionCompleted(true);
    } catch (error) {
      console.error('Error saving meditation session:', error);
      toast.error('Failed to save meditation session');
    }
  }, [user, selectedType]);

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
    setTimeLeft(selectedType.duration);
    setSessionCompleted(false);
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
        </div>

        <div className="text-center">
          <div className="text-6xl font-mono mb-6">{formatTime(timeLeft)}</div>
          
          <div className="space-x-2">
            <Button
              onClick={toggleTimer}
              disabled={sessionCompleted}
              size="lg"
            >
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              disabled={isActive}
            >
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