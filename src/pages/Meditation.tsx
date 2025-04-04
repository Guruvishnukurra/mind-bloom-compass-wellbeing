import { MeditationTimer } from '@/components/meditation/MeditationTimer';
import { MeditationHistory } from '@/components/meditation/MeditationHistory';

export function Meditation() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Meditation</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <MeditationTimer />
          </div>
          <div>
            <MeditationHistory />
          </div>
        </div>
      </div>
    </div>
  );
} 