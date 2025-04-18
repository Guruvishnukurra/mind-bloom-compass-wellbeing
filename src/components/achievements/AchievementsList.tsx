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

interface AchievementsListProps {
  limit?: number;
}

export function AchievementsList({ limit }: AchievementsListProps) {
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
              {categoryAchievements
                .slice(0, limit)
                .map((achievement) => {
                  const isEarned = earnedAchievementIds.has(achievement.id);
                  const progress = getAchievementProgress(
                    achievement.category,
                    userAchievements.filter(a => a.achievement_id.startsWith(achievement.category)).length
                  );

                  return (
                    <div key={achievement.id} className="space-y-3 p-4 rounded-xl hover:bg-primary/5 transition-colors duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isEarned ? 'bg-primary/20' : 'bg-muted'} transition-all duration-500`}>
                            <span className={`text-2xl ${isEarned ? 'animate-bounce-gentle' : ''}`}>{achievement.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-medium font-sans">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground font-body">{achievement.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full ${isEarned ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground'}`}>
                            <span className="font-medium">{achievement.points} pts</span>
                          </div>
                        </div>
                      </div>
                      {!isEarned && progress.nextAchievement ? (
                        <div className="space-y-2">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-primary/60 to-primary"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progress: {Math.round(progress.progress)}%</span>
                            <span className="text-primary font-medium">{Math.round(progress.progress)}/100</span>
                          </div>
                        </div>
                      ) : isEarned ? (
                        <div className="flex items-center justify-center p-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Completed
                          </span>
                        </div>
                      ) : null}
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