import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ACHIEVEMENTS, Achievement, getAchievementIcon } from '@/lib/achievements';

interface AchievementsListProps {
  stats: {
    meditationSessions: number;
    habitCompletions: number;
    journalEntries: number;
    currentStreak: number;
  };
}

export const AchievementsList: React.FC<AchievementsListProps> = ({ stats }) => {
  const [achievements, setAchievements] = React.useState<Achievement[]>(ACHIEVEMENTS);

  React.useEffect(() => {
    const updatedAchievements = achievements.map(achievement => {
      let progress = 0;
      let unlocked = achievement.unlocked;

      switch (achievement.category) {
        case 'meditation':
          progress = stats.meditationSessions;
          break;
        case 'habits':
          progress = stats.habitCompletions;
          break;
        case 'journal':
          progress = stats.journalEntries;
          break;
        case 'streak':
          progress = stats.currentStreak;
          break;
        case 'milestone':
          const totalPoints = achievements.reduce((total, a) => total + (a.unlocked ? a.points : 0), 0);
          progress = totalPoints;
          break;
      }

      if (progress >= achievement.requirement && !unlocked) {
        unlocked = true;
      }

      return {
        ...achievement,
        progress,
        unlocked,
      };
    });

    setAchievements(updatedAchievements);
  }, [stats]);

  const totalPoints = achievements.reduce((total, achievement) => {
    return total + (achievement.unlocked ? achievement.points : 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Achievements</h2>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Total Points:</span>
          <span className="text-2xl font-bold text-primary">{totalPoints}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={achievement.unlocked ? 'border-primary' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {achievement.title}
              </CardTitle>
              <div className={achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}>
                {getAchievementIcon(achievement.icon)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-2">
                {achievement.description}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {achievement.progress} / {achievement.requirement}
                  </span>
                </div>
                <Progress
                  value={(achievement.progress / achievement.requirement) * 100}
                  className={achievement.unlocked ? 'bg-primary/20' : ''}
                />
                {achievement.points > 0 && (
                  <div className="text-sm text-right text-muted-foreground">
                    +{achievement.points} points
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 