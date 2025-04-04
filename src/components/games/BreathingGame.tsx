
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BreathingGame: React.FC = () => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [counter, setCounter] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [rounds, setRounds] = useState<number>(0);

  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive) {
      interval = window.setInterval(() => {
        setCounter(prevCounter => prevCounter + 1);
        
        // Breathing pattern: inhale 4s, hold 4s, exhale 6s, rest 2s
        if (phase === 'inhale' && counter >= 4) {
          setPhase('hold');
          setCounter(0);
        } else if (phase === 'hold' && counter >= 4) {
          setPhase('exhale');
          setCounter(0);
        } else if (phase === 'exhale' && counter >= 6) {
          setPhase('rest');
          setCounter(0);
          setRounds(prevRounds => prevRounds + 1);
        } else if (phase === 'rest' && counter >= 2) {
          setPhase('inhale');
          setCounter(0);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, phase, counter]);

  const toggleActivity = () => {
    if (!isActive) {
      setPhase('inhale');
      setCounter(0);
      setRounds(0);
    }
    setIsActive(!isActive);
  };

  const getInstructionText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'rest':
        return 'Rest';
      default:
        return 'Press Start';
    }
  };

  const getCircleSize = () => {
    if (phase === 'inhale') {
      // Grow from 50% to 100% during inhale
      const progress = counter / 4;
      return 50 + (50 * progress);
    } else if (phase === 'exhale') {
      // Shrink from 100% to 50% during exhale
      const progress = counter / 6;
      return 100 - (50 * progress);
    }
    // Stay at 100% during hold, 50% during rest
    return phase === 'hold' ? 100 : 50;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-center mb-4">4-4-6 Breathing Exercise</h3>
      <div className="flex flex-col items-center space-y-8">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div 
            className="absolute bg-wellness-blue rounded-full transition-all duration-1000"
            style={{ 
              width: `${getCircleSize()}%`, 
              height: `${getCircleSize()}%`,
              opacity: isActive ? 0.7 : 0.3
            }}
          ></div>
          <div className="z-10 text-2xl font-bold">{isActive ? getInstructionText() : 'Ready'}</div>
        </div>
        
        <div className="space-y-4 w-full">
          <div className="flex justify-between text-sm">
            <span>Completed rounds: {rounds}</span>
            {isActive && <span>Current phase: {phase}</span>}
          </div>
          
          <Button 
            onClick={toggleActivity} 
            className="w-full"
          >
            {isActive ? 'Stop' : 'Start Breathing Exercise'}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            Breathe in for 4 seconds, hold for 4 seconds, exhale for 6 seconds. 
            This exercise can help reduce anxiety and improve focus.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BreathingGame;
