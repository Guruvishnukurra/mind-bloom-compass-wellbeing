import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Achievement, achievements, getAchievementProgress } from '@/utils/achievements';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

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
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-lavender-100 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 rounded-full bg-lavender-500 animate-ping"></div>
        </div>
        <p className="text-lg font-medium text-deep-ocean-600">Loading your achievements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
        <Card key={category} className="overflow-hidden border-primary/10 shadow-md bg-cream-50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-deep-ocean-500 to-deep-ocean-600 text-white">
            <CardTitle className="capitalize font-heading">{category} Achievements</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
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
                    <div key={achievement.id} className="space-y-3 p-4 rounded-xl hover:bg-cream-100 transition-all duration-300 border border-transparent hover:border-lavender-200 shadow-sm hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isEarned ? 'bg-gradient-to-br from-lavender-400 to-lavender-600 text-white' : 'bg-muted'} transition-all duration-500 shadow-md`}>
                            <span className={`text-2xl ${isEarned ? 'animate-bounce-gentle' : ''}`}>{achievement.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-medium font-heading text-deep-ocean-600">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground font-body">{achievement.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full ${isEarned ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-deep-ocean-700' : 'bg-muted/50 text-muted-foreground'} shadow-sm`}>
                            <span className="font-medium">{achievement.points} pts</span>
                          </div>
                        </div>
                      </div>
                      {!isEarned && progress.nextAchievement ? (
                        <div className="space-y-2">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary/60 to-primary"
                              style={{ width: `${progress.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progress: {Math.round(progress.progress)}%</span>
                            <span className="text-primary font-medium">{Math.round(progress.progress)}/100</span>
                          </div>
                        </div>
                      ) : isEarned ? (
                        <div className="flex items-center justify-center p-2">
                          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-sage-400 to-sage-500 text-white text-sm shadow-md">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Achievement Unlocked!
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