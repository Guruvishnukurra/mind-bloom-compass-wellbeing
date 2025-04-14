import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, Cloud, Sun, Moon, Heart, Wind, CloudRain, Music } from 'lucide-react';

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
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const toggleSound = (soundId: string) => {
    if (playing === soundId) {
      // Stop the current sound
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlaying(null);
    } else {
      // Play a new sound
      const sound = SOUND_OPTIONS.find(s => s.id === soundId);
      if (sound && audioRef.current) {
        // Stop current sound if any
        audioRef.current.pause();
        
        // Play new sound
        audioRef.current.src = sound.url;
        audioRef.current.volume = isMuted ? 0 : volume / 100;
        audioRef.current.play().catch(e => {
          console.error('Error playing sound:', e);
          
          // Show a more helpful error message
          import('sonner').then(({ toast }) => {
            toast.error(`Unable to play ${sound.name}`, {
              description: 'There was an issue playing the sound file. Please try again.',
              duration: 3000,
            });
          });
        });
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