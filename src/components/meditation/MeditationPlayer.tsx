
import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MeditationPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  meditation: {
    title: string;
    description: string;
    duration: number;
  } | null;
}

// Meditation audio tracks
const meditationSounds = {
  ambient: "/sounds/bells.mp3",
  nature: "/sounds/forest.mp3",
  ocean: "/sounds/ocean-waves.mp3",
  rainfall: "/sounds/rain.mp3",
  default: "/sounds/meditation-bell.mp3"
};

const MeditationPlayer: React.FC<MeditationPlayerProps> = ({ isOpen, onClose, meditation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element when component mounts
  useEffect(() => {
    audioRef.current = new Audio(meditationSounds.default);
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle dialog open/close
  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setCurrentTime(0);
      setIsPlaying(false);
      
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.pause();
      }
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isOpen]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    if (isPlaying) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error("Audio playback error:", error);
        });
      }
      
      intervalRef.current = window.setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime + 1;
          const totalSeconds = meditation ? meditation.duration * 60 : 0;
          const newProgress = (newTime / totalSeconds) * 100;
          
          setProgress(newProgress);
          
          if (newTime >= totalSeconds) {
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
            }
            
            if (audioRef.current) {
              audioRef.current.pause();
            }
            
            setIsPlaying(false);
            return totalSeconds;
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = meditation ? formatTime(meditation.duration * 60) : "00:00";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{meditation?.title || "Meditation Session"}</DialogTitle>
          <DialogDescription>
            {meditation?.description || "Take a moment to focus on your breath"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full bg-wellness-light-blue flex items-center justify-center">
              <div className={`w-24 h-24 rounded-full bg-wellness-blue ${isPlaying ? 'animate-pulse' : ''}`}></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{totalTime}</span>
              </div>
            </div>

            <div className="flex justify-center py-2">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full h-14 w-14"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
            </div>

            <div className="flex items-center gap-3">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeditationPlayer;
