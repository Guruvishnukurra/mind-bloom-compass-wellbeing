import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Achievement, achievements, getAchievementProgress } from '@/utils/achievements';

export interface UserAchievement extends Achievement {
  earned_at: string;
}

export function useAchievements() {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAchievements();
  }, []);

  const fetchUserAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const earnedAchievements = data.map(ua => {
        const achievement = achievements.find(a => a.id === ua.achievement_id);
        return {
          ...achievement!,
          earned_at: ua.earned_at
        };
      });

      setUserAchievements(earnedAchievements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  const awardAchievement = async (achievementId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId,
          earned_at: new Date().toISOString()
        });

      if (error) throw error;

      await fetchUserAchievements();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to award achievement');
    }
  };

  const getProgress = (category: Achievement['category'], currentValue: number) => {
    return getAchievementProgress(category, currentValue);
  };

  return {
    userAchievements,
    loading,
    error,
    awardAchievement,
    getProgress
  };
} 