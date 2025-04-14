import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Bell, Play, Pause, RotateCcw, Volume2, VolumeX, Wind, Leaf, Moon, Sun, Heart, Brain, CloudSun, CloudMoon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const MEDITATION_TYPES = [
  { 
    id: 'breathing', 
    name: 'Breathing Exercise', 
    duration: 300, 
    description: 'Focus on your breath to calm your mind',
    icon: <Wind className="h-5 w-5" />,
    color: 'bg-wellness-teal',
    pattern: 'breathe-in-hold-out',
    ambience: 'gentle-waves'
  },
  { 
    id: 'mindfulness', 
    name: 'Mindfulness Meditation', 
    duration: 600, 
    description: 'Stay present in the moment',
    icon: <Leaf className="h-5 w-5" />,
    color: 'bg-wellness-sage',
    pattern: 'observe-acknowledge-return',
    ambience: 'forest-sounds'
  },
  { 
    id: 'body-scan', 
    name: 'Body Scan', 
    duration: 900, 
    description: 'Release tension throughout your body',
    icon: <Moon className="h-5 w-5" />,
    color: 'bg-wellness-lavender',
    pattern: 'notice-relax-move',
    ambience: 'gentle-rain'
  },
  { 
    id: 'loving-kindness', 
    name: 'Loving-Kindness', 
    duration: 600, 
    description: 'Cultivate compassion for yourself and others',
    icon: <Heart className="h-5 w-5" />,
    color: 'bg-wellness-soft-coral',
    pattern: 'self-loved-ones-all',
    ambience: 'soft-chimes'
  },
  { 
    id: 'gratitude', 
    name: 'Gratitude Meditation', 
    duration: 300, 
    description: 'Focus on things you are thankful for',
    icon: <Sun className="h-5 w-5" />,
    color: 'bg-wellness-amber',
    pattern: 'notice-appreciate-feel',
    ambience: 'morning-birds'
  },
  { 
    id: 'sleep', 
    name: 'Sleep Meditation', 
    duration: 1200, 
    description: 'Relax your body and mind for better sleep',
    icon: <CloudMoon className="h-5 w-5" />,
    color: 'bg-wellness-blue',
    pattern: 'relax-release-drift',
    ambience: 'night-sounds'
  },
  { 
    id: 'anxiety', 
    name: 'Anxiety Relief', 
    duration: 600, 
    description: 'Techniques to reduce anxiety and worry',
    icon: <CloudSun className="h-5 w-5" />,
    color: 'bg-wellness-pale-yellow',
    pattern: 'ground-center-release',
    ambience: 'gentle-stream'
  },
  { 
    id: 'focus', 
    name: 'Focus & Concentration', 
    duration: 450, 
    description: 'Improve your ability to concentrate',
    icon: <Brain className="h-5 w-5" />,
    color: 'bg-wellness-purple',
    pattern: 'notice-return-sustain',
    ambience: 'light-bells'
  },
];

// Ambient sound options
const AMBIENT_SOUNDS = [
  { id: 'gentle-waves', name: 'Ocean Waves', url: '/sounds/ocean-waves.mp3' },
  { id: 'forest-sounds', name: 'Forest Ambience', url: '/sounds/forest.mp3' },
  { id: 'gentle-rain', name: 'Gentle Rain', url: '/sounds/rain.mp3' },
  { id: 'soft-chimes', name: 'Wind Chimes', url: '/sounds/chimes.mp3' },
  { id: 'morning-birds', name: 'Morning Birds', url: '/sounds/birds.mp3' },
  { id: 'night-sounds', name: 'Night Sounds', url: '/sounds/night.mp3' },
  { id: 'gentle-stream', name: 'Flowing Stream', url: '/sounds/stream.mp3' },
  { id: 'light-bells', name: 'Tibetan Bells', url: '/sounds/bells.mp3' },
];

// Guided meditation audio URLs (these would be replaced with actual URLs in production)
const GUIDED_MEDITATIONS = {
  'breathing': '/sounds/guided-breathing.mp3',
  'mindfulness': '/sounds/guided-mindfulness.mp3',
  'body-scan': '/sounds/guided-body-scan.mp3',
  'loving-kindness': '/sounds/guided-loving-kindness.mp3',
  'gratitude': '/sounds/guided-gratitude.mp3',
  'sleep': '/sounds/guided-sleep.mp3',
  'anxiety': '/sounds/guided-anxiety.mp3',
  'focus': '/sounds/guided-focus.mp3',
};

// Breathing patterns
const BREATHING_PATTERNS = {
  'breathe-in-hold-out': { in: 4, hold: 2, out: 6, pause: 0 },
  'observe-acknowledge-return': { in: 4, hold: 0, out: 4, pause: 2 },
  'notice-relax-move': { in: 5, hold: 2, out: 5, pause: 0 },
  'self-loved-ones-all': { in: 6, hold: 1, out: 6, pause: 1 },
  'notice-appreciate-feel': { in: 4, hold: 4, out: 4, pause: 0 },
  'relax-release-drift': { in: 4, hold: 0, out: 7, pause: 0 },
  'ground-center-release': { in: 4, hold: 2, out: 6, pause: 0 },
  'notice-return-sustain': { in: 5, hold: 2, out: 5, pause: 0 },
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
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [breathingProgress, setBreathingProgress] = useState(0);
  const [showBreathingGuide, setShowBreathingGuide] = useState(true);
  const [selectedAmbience, setSelectedAmbience] = useState(AMBIENT_SOUNDS[0]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const bellRef = useRef<HTMLAudioElement | null>(null);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Load user streak on component mount
  useEffect(() => {
    const loadStreak = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_achievements')
          .select('meditation_streak')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error('Error loading streak:', error);
          return;
        }
        
        if (data) {
          setStreakCount(data.meditation_streak || 0);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };
    
    loadStreak();
  }, [user]);

  // Handle meditation completion
  const handleCompletion = useCallback(async () => {
    if (!user) return;

    try {
      // Play completion bell sound
      if (bellRef.current) {
        bellRef.current.volume = isMuted ? 0 : volume / 100;
        bellRef.current.play().catch(e => console.error('Error playing bell:', e));
      }
      
      // Stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      if (ambienceRef.current) {
        // Fade out ambience
        const fadeInterval = setInterval(() => {
          if (ambienceRef.current && ambienceRef.current.volume > 0.1) {
            ambienceRef.current.volume -= 0.1;
          } else {
            if (ambienceRef.current) {
              ambienceRef.current.pause();
            }
            clearInterval(fadeInterval);
          }
        }, 100);
      }

      // Save session to database
      const { error } = await supabase
        .from('meditation_sessions')
        .insert([
          {
            user_id: user.id,
            duration: customDuration,
            meditation_type: selectedType.id,
            completed: true,
            notes: useGuided ? 'Guided meditation' : 'Silent meditation',
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
            meditation_streak: newStreak,
            last_meditation: new Date().toISOString()
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
        setSessionCompleted(true);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving meditation session:', error);
      toast.error('Failed to save meditation session');
    }
  }, [user, selectedType, customDuration, useGuided, volume, isMuted, streakCount]);

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

  // Breathing animation effect
  useEffect(() => {
    if (!isActive || !showBreathingGuide) return;
    
    const pattern = BREATHING_PATTERNS[selectedType.pattern as keyof typeof BREATHING_PATTERNS];
    let interval: NodeJS.Timeout;
    
    const breathingCycle = () => {
      // Inhale phase
      setBreathingPhase('inhale');
      let progress = 0;
      
      interval = setInterval(() => {
        progress += 1;
        setBreathingProgress(progress / pattern.in);
        
        if (progress >= pattern.in) {
          clearInterval(interval);
          
          // Hold phase (if applicable)
          if (pattern.hold > 0) {
            setBreathingPhase('hold');
            progress = 0;
            
            interval = setInterval(() => {
              progress += 1;
              setBreathingProgress(progress / pattern.hold);
              
              if (progress >= pattern.hold) {
                clearInterval(interval);
                
                // Exhale phase
                setBreathingPhase('exhale');
                progress = 0;
                
                interval = setInterval(() => {
                  progress += 1;
                  setBreathingProgress(progress / pattern.out);
                  
                  if (progress >= pattern.out) {
                    clearInterval(interval);
                    
                    // Pause phase (if applicable)
                    if (pattern.pause > 0) {
                      setBreathingPhase('pause');
                      progress = 0;
                      
                      interval = setInterval(() => {
                        progress += 1;
                        setBreathingProgress(progress / pattern.pause);
                        
                        if (progress >= pattern.pause) {
                          clearInterval(interval);
                          breathingCycle(); // Restart cycle
                        }
                      }, 1000);
                    } else {
                      breathingCycle(); // Restart cycle
                    }
                  }
                }, 1000);
              }
            }, 1000);
          } else {
            // Skip hold, go straight to exhale
            setBreathingPhase('exhale');
            progress = 0;
            
            interval = setInterval(() => {
              progress += 1;
              setBreathingProgress(progress / pattern.out);
              
              if (progress >= pattern.out) {
                clearInterval(interval);
                
                // Pause phase (if applicable)
                if (pattern.pause > 0) {
                  setBreathingPhase('pause');
                  progress = 0;
                  
                  interval = setInterval(() => {
                    progress += 1;
                    setBreathingProgress(progress / pattern.pause);
                    
                    if (progress >= pattern.pause) {
                      clearInterval(interval);
                      breathingCycle(); // Restart cycle
                    }
                  }, 1000);
                } else {
                  breathingCycle(); // Restart cycle
                }
              }
            }, 1000);
          }
        }
      }, 1000);
    };
    
    breathingCycle();
    
    return () => {
      clearInterval(interval);
    };
  }, [isActive, showBreathingGuide, selectedType.pattern]);

  // Audio effect
  useEffect(() => {
    // Create audio elements
    audioRef.current = new Audio();
    ambienceRef.current = new Audio();
    bellRef.current = new Audio('/sounds/meditation-bell.mp3');
    
    return () => {
      // Clean up audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      if (ambienceRef.current) {
        ambienceRef.current.pause();
      }
      
      if (bellRef.current) {
        bellRef.current.pause();
      }
    };
  }, []);

  // Handle audio playback when meditation starts/stops
  useEffect(() => {
    if (isActive) {
      // Start appropriate audio
      if (useGuided && audioRef.current) {
        audioRef.current.src = GUIDED_MEDITATIONS[selectedType.id as keyof typeof GUIDED_MEDITATIONS] || '';
        audioRef.current.loop = false;
        audioRef.current.volume = isMuted ? 0 : volume / 100;
        audioRef.current.play().catch(e => console.error('Error playing guided audio:', e));
      }
      
      // Start ambient sound
      if (ambienceRef.current) {
        const ambienceForType = AMBIENT_SOUNDS.find(sound => sound.id === selectedType.ambience) || AMBIENT_SOUNDS[0];
        ambienceRef.current.src = ambienceForType.url;
        ambienceRef.current.loop = true;
        ambienceRef.current.volume = isMuted ? 0 : (volume / 100) * 0.5; // Ambient sound at 50% of main volume
        ambienceRef.current.play().catch(e => console.error('Error playing ambience:', e));
      }
    } else {
      // Pause audio when meditation is paused
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      if (ambienceRef.current && !sessionCompleted) {
        ambienceRef.current.pause();
      }
    }
  }, [isActive, useGuided, selectedType.id, volume, isMuted, selectedType.ambience, sessionCompleted]);

  // Update audio volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
    
    if (ambienceRef.current) {
      ambienceRef.current.volume = isMuted ? 0 : (volume / 100) * 0.5;
    }
  }, [volume, isMuted]);

  // Handle meditation type change
  const handleTypeChange = (value: string) => {
    const newType = MEDITATION_TYPES.find(type => type.id === value) || MEDITATION_TYPES[0];
    setSelectedType(newType);
    setTimeLeft(newType.duration);
    setCustomDuration(newType.duration);
    setIsActive(false);
    setSessionCompleted(false);
    
    // Update ambience selection based on meditation type
    const ambienceForType = AMBIENT_SOUNDS.find(sound => sound.id === newType.ambience) || AMBIENT_SOUNDS[0];
    setSelectedAmbience(ambienceForType);
  };

  // Handle start/pause
  const toggleTimer = () => {
    if (!isActive && timeLeft === 0) {
      // If timer is completed, reset it first
      resetTimer();
    }
    
    // Start the timer and audio
    if (!isActive) {
      // Play the bell sound to indicate start
      if (bellRef.current) {
        bellRef.current.volume = isMuted ? 0 : volume / 100;
        bellRef.current.play().catch(e => {
          console.error('Error playing bell:', e);
          if (e.name === 'NotSupportedError' || e.name === 'NotFoundError') {
            toast.error('Meditation bell sound file not found', {
              description: 'Please download sound files as described in the documentation.',
            });
          }
        });
      }
      
      // Start ambient sound
      if (ambienceRef.current) {
        const ambienceForType = AMBIENT_SOUNDS.find(sound => sound.id === selectedType.ambience) || AMBIENT_SOUNDS[0];
        ambienceRef.current.src = ambienceForType.url;
        ambienceRef.current.loop = true;
        ambienceRef.current.volume = isMuted ? 0 : (volume / 100) * 0.5;
        ambienceRef.current.play().catch(e => {
          console.error('Error playing ambience:', e);
          if (e.name === 'NotSupportedError' || e.name === 'NotFoundError') {
            toast.error(`Ambient sound file not found: ${ambienceForType.name}`, {
              description: 'Please download sound files as described in the documentation.',
            });
          }
        });
      }
    } else {
      // Pause audio when meditation is paused
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      if (ambienceRef.current) {
        ambienceRef.current.pause();
      }
    }
    
    setIsActive(!isActive);
  };

  // Handle reset
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(customDuration);
    setSessionCompleted(false);
    setShowSuccess(false);
    
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if (ambienceRef.current) {
      ambienceRef.current.pause();
    }
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

  // Toggle breathing guide
  const toggleBreathingGuide = () => {
    setShowBreathingGuide(!showBreathingGuide);
  };

  // Get breathing instruction text
  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'pause': return 'Pause';
      default: return '';
    }
  };

  // Calculate circle size for breathing animation
  const getCircleSize = () => {
    if (breathingPhase === 'inhale') {
      return 40 + (60 * breathingProgress); // Grow from 40% to 100%
    } else if (breathingPhase === 'exhale') {
      return 100 - (60 * breathingProgress); // Shrink from 100% to 40%
    }
    return 100; // Hold and pause at 100%
  };

  return (
    <Card className="w-full max-w-md mx-auto relative overflow-hidden">
      <CardHeader className={`${selectedType.color} text-white`}>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          {selectedType.icon}
          <span>{selectedType.name}</span>
        </CardTitle>
        <CardDescription className="text-white/80 text-center">
          {selectedType.description}
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
            <h3 className="text-xl font-bold text-wellness-teal mb-2">Meditation Complete!</h3>
            <p className="text-center text-muted-foreground mb-4">
              You've completed {Math.floor(customDuration / 60)} minutes of meditation.
            </p>
            <div className="flex items-center gap-2 bg-wellness-teal/10 px-4 py-2 rounded-full">
              <Bell className="h-5 w-5 text-wellness-teal" />
              <span className="font-medium">Current streak: {streakCount} days</span>
            </div>
          </motion.div>
        ) : (
          <CardContent className="p-6">
            <div className="space-y-6">
              {!isActive && !sessionCompleted && (
                <div className="space-y-4">
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
                          <SelectItem key={type.id} value={type.id} className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${type.color}`}></div>
                              {type.name} ({formatTime(type.duration)})
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Duration</label>
                      <span className="text-sm">{formatTime(customDuration)}</span>
                    </div>
                    <Slider
                      value={[customDuration]}
                      onValueChange={handleDurationChange}
                      min={60}
                      max={1800}
                      step={30}
                      disabled={isActive}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 min</span>
                      <span>30 min</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={useGuided ? "default" : "outline"}
                      size="sm"
                      onClick={toggleGuided}
                      disabled={isActive}
                      className={`flex items-center gap-2 ${useGuided ? selectedType.color : ""}`}
                    >
                      <Volume2 className="h-4 w-4" />
                      <span>{useGuided ? "Guided" : "Add Voice Guidance"}</span>
                    </Button>
                    
                    <Button
                      variant={showBreathingGuide ? "default" : "outline"}
                      size="sm"
                      onClick={toggleBreathingGuide}
                      disabled={isActive}
                      className={`flex items-center gap-2 ${showBreathingGuide ? selectedType.color : ""}`}
                    >
                      <Wind className="h-4 w-4" />
                      <span>{showBreathingGuide ? "Breathing Guide On" : "Add Breathing Guide"}</span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Volume</label>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="h-8 w-8"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Slider
                      value={[volume]}
                      onValueChange={(value) => setVolume(value[0])}
                      min={0}
                      max={100}
                      step={1}
                      className="w-32"
                      disabled={isMuted}
                    />
                  </div>
                  
                  {/* Prominent Start Button */}
                  <Button
                    onClick={toggleTimer}
                    size="lg"
                    className="w-full py-8 mt-6 text-lg font-medium bg-wellness-blue hover:bg-wellness-blue/90 text-white"
                  >
                    <Play className="mr-2 h-6 w-6" />
                    Start Meditation
                  </Button>
                </div>
              )}

              {(isActive || sessionCompleted) && (
                <div className="flex flex-col items-center justify-center">
                  {showBreathingGuide && isActive && (
                    <div className="mb-6 flex flex-col items-center">
                      <motion.div 
                        className={`rounded-full flex items-center justify-center ${selectedType.color}`}
                        style={{ 
                          width: '150px', 
                          height: '150px',
                          scale: getCircleSize() / 100
                        }}
                        animate={{ scale: getCircleSize() / 100 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      >
                        <motion.div 
                          className="text-white text-lg font-medium"
                          animate={{ opacity: [0, 1, 1, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          {getBreathingInstruction()}
                        </motion.div>
                      </motion.div>
                    </div>
                  )}
                  
                  <div className="text-6xl font-mono mb-6">{formatTime(timeLeft)}</div>
                  
                  <div className="space-x-4">
                    <Button
                      onClick={toggleTimer}
                      disabled={sessionCompleted}
                      size="lg"
                      className={selectedType.color}
                    >
                      {isActive ? (
                        <>
                          <Pause className="mr-2 h-5 w-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" />
                          {timeLeft === 0 ? 'Restart' : 'Start'}
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={resetTimer}
                      variant="outline"
                      size="lg"
                      disabled={isActive}
                    >
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Reset
                    </Button>
                  </div>
                </div>
              )}

              {sessionCompleted && (
                <motion.div 
                  className="text-center mt-6 p-4 rounded-lg bg-wellness-teal/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Bell className="w-6 h-6 mx-auto mb-2 text-wellness-teal" />
                  <h3 className="font-medium text-wellness-teal mb-1">Session completed!</h3>
                  <p className="text-sm text-muted-foreground">
                    Take a moment to notice how you feel right now.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={resetTimer}
                      className="text-wellness-teal border-wellness-teal/30 hover:bg-wellness-teal/10"
                    >
                      Start Another Session
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {!isActive && !sessionCompleted && streakCount > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                  <Bell className="h-4 w-4" />
                  <span>Current streak: {streakCount} days</span>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </AnimatePresence>
    </Card>
  );
} 