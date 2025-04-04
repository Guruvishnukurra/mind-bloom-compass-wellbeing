import { AchievementsList } from '@/components/achievements/AchievementsList';

export default function Achievements() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Achievements</h1>
      <AchievementsList />
    </div>
  );
} 