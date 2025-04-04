import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Achievement, achievements, getAchievementProgress } from '@/utils/achievements';
import { supabase } from '@/lib/supabase';

interface UserAchievement {
  achievement_id: string;
  user_id: string;
  earned_at: string;
}

export function AchievementsList() {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAchievements();
  }, []);

  async function fetchUserAchievements() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  }

  const earnedAchievementIds = new Set(userAchievements.map(a => a.achievement_id));

  // Group achievements by category
  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<Achievement['category'], Achievement[]>);

  if (loading) {
    return <div>Loading achievements...</div>;
  }

  return (
    <div className="space-y-6">
      {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="capitalize">{category} Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryAchievements.map((achievement) => {
                const isEarned = earnedAchievementIds.has(achievement.id);
                const progress = getAchievementProgress(
                  achievement.category,
                  userAchievements.filter(a => a.achievement_id.startsWith(achievement.category)).length
                );

                return (
                  <div key={achievement.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h3 className="font-medium">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{achievement.points} pts</span>
                        {isEarned && (
                          <span className="ml-2 text-green-500">✓</span>
                        )}
                      </div>
                    </div>
                    {!isEarned && progress.nextAchievement && (
                      <div className="space-y-1">
                        <Progress value={progress.progress} />
                        <p className="text-xs text-muted-foreground">
                          Progress: {Math.round(progress.progress)}%
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 