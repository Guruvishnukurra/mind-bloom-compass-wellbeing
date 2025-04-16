import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, Cloud, Sun, Moon, Heart, Wind, CloudRain, Music } from 'lucide-react';

// Fallback audio context for generating sounds if MP3 files are not available
let audioContext: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;

// Function to create a synthesized sound as fallback
const createSynthSound = (type: OscillatorType = 'sine', frequency = 440, volume = 0.1) => {
  try {
    // Initialize audio context if not already done
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
    }
    
    // Stop any existing oscillator
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
    }
    
    // Create and configure new oscillator
    oscillator = audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(gainNode!);
    
    // Set volume
    gainNode!.gain.setValueAtTime(volume, audioContext.currentTime);
    
    // Start oscillator
    oscillator.start();
    return true;
  } catch (error) {
    console.error('Error creating synthesized sound:', error);
    return false;
  }
};

// Function to stop synthesized sound
const stopSynthSound = () => {
  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
    oscillator = null;
  }
};

const SOUND_OPTIONS = [
  { id: 'rain', name: 'Rain', icon: <CloudRain className="h-6 w-6" />, url: '/sounds/rain.mp3' },
  { id: 'birds', name: 'Birds', icon: <Sun className="h-6 w-6" />, url: '/sounds/birds.mp3' },
  { id: 'night', name: 'Night', icon: <Moon className="h-6 w-6" />, url: '/sounds/night.mp3' },
  { id: 'ocean-waves', name: 'Ocean', icon: <Heart className="h-6 w-6" />, url: '/sounds/ocean-waves.mp3' },
  { id: 'forest', name: 'Forest', icon: <Wind className="h-6 w-6" />, url: '/sounds/forest.mp3' },
  { id: 'stream', name: 'Stream', icon: <Cloud className="h-6 w-6" />, url: '/sounds/stream.mp3' },
  { id: 'chimes', name: 'Chimes', icon: <Music className="h-6 w-6" />, url: '/sounds/chimes.mp3' },
  { id: 'bells', name: 'Bells', icon: <Music className="h-6 w-6" />, url: '/sounds/bells.mp3' },
];

export function CalmingSounds() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Also stop any synthesized sound
      stopSynthSound();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
    
    // Also adjust synthesized sound volume if it's playing
    if (gainNode) {
      gainNode.gain.setValueAtTime(isMuted ? 0 : volume / 100 * 0.2, audioContext?.currentTime || 0);
    }
  }, [volume, isMuted]);

  const toggleSound = (soundId: string) => {
    if (playing === soundId) {
      // Stop the current sound
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Also stop any synthesized sound
      stopSynthSound();
      setPlaying(null);
    } else {
      // Play a new sound
      const sound = SOUND_OPTIONS.find(s => s.id === soundId);
      if (sound) {
        // Stop current sound if any
        if (audioRef.current) {
          audioRef.current.pause();
        }
        stopSynthSound();
        
        // Try to play the MP3 file
        if (audioRef.current) {
          audioRef.current.src = sound.url;
          audioRef.current.volume = isMuted ? 0 : volume / 100;
          
          // Add event listener for when audio is loaded
          audioRef.current.onloadeddata = () => {
            // Check if the audio duration is very short (likely a placeholder)
            if (audioRef.current && audioRef.current.duration < 2) {
              console.warn(`Sound file ${sound.name} is too short (${audioRef.current.duration}s), likely a placeholder`);
              
              // Use synthesized sound as fallback
              let synthType: OscillatorType = 'sine';
              let frequency = 440;
              
              // Different sounds for different options
              switch(sound.id) {
                case 'rain':
                  synthType = 'noise'; // Not standard, will fall back to 'sine'
                  frequency = 100;
                  break;
                case 'birds':
                  synthType = 'sine';
                  frequency = 800;
                  break;
                case 'night':
                  synthType = 'triangle';
                  frequency = 200;
                  break;
                case 'ocean-waves':
                  synthType = 'sine';
                  frequency = 150;
                  break;
                case 'forest':
                  synthType = 'sine';
                  frequency = 350;
                  break;
                case 'stream':
                  synthType = 'sine';
                  frequency = 250;
                  break;
                case 'chimes':
                  synthType = 'sine';
                  frequency = 600;
                  break;
                case 'bells':
                  synthType = 'sine';
                  frequency = 500;
                  break;
                case 'meditation-bell':
                  synthType = 'sine';
                  frequency = 400;
                  break;
              }
              
              // Create synthesized sound
              const synthSuccess = createSynthSound(
                synthType as OscillatorType, 
                frequency, 
                isMuted ? 0 : volume / 100 * 0.2
              );
              
              if (synthSuccess) {
                import('sonner').then(({ toast }) => {
                  toast.info(`Using synthesized sound for ${sound.name}`, {
                    description: 'Real sound files could not be loaded. Using a simple tone instead.',
                    duration: 3000,
                  });
                });
              }
            }
          };
          
          audioRef.current.play().catch(e => {
            console.error('Error playing sound:', e);
            
            // Try synthesized sound as fallback
            const synthSuccess = createSynthSound('sine', 440, isMuted ? 0 : volume / 100 * 0.2);
            
            if (synthSuccess) {
              import('sonner').then(({ toast }) => {
                toast.info(`Using synthesized sound for ${sound.name}`, {
                  description: 'Could not play the sound file. Using a simple tone instead.',
                  duration: 3000,
                });
              });
            } else {
              // Show error message if both methods fail
              import('sonner').then(({ toast }) => {
                toast.error(`Unable to play ${sound.name}`, {
                  description: 'There was an issue playing any sound. Please check your browser settings.',
                  duration: 3000,
                });
              });
            }
          });
        }
        setPlaying(soundId);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Calming Sounds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {SOUND_OPTIONS.map((sound) => (
            <Button
              key={sound.id}
              variant={playing === sound.id ? "default" : "outline"}
              className={`h-auto py-4 flex flex-col items-center gap-2 ${
                playing === sound.id ? 'bg-wellness-teal hover:bg-wellness-teal/90' : ''
              }`}
              onClick={() => toggleSound(sound.id)}
            >
              {sound.icon}
              <span>{sound.name}</span>
              {playing === sound.id && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse absolute top-2 right-2"></span>
              )}
            </Button>
          ))}
        </div>
        
        {playing && (
          <div className="flex items-center gap-3 mt-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0])}
              className="flex-grow"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}