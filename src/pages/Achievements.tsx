import { AchievementsList } from '@/components/achievements/AchievementsList';

export default function Achievements() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-deep-ocean-600 font-heading">Your Achievements</h1>
        <p className="text-muted-foreground mb-8">Track your progress and celebrate your wellness journey milestones.</p>
        <AchievementsList />
      </div>
    </div>
  );
} 