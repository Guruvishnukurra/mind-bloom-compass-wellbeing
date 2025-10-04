import { supabase } from '@/lib/supabase';
import { Achievement, ACHIEVEMENTS } from '@/lib/achievements';

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  progress: number;
}

export const achievementService = {
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }

    return data || [];
  },

  async updateAchievementProgress(
    userId: string,
    achievementId: string,
    progress: number
  ): Promise<void> {
    const { error } = await supabase
      .from('user_achievements')
      .upsert({
        user_id: userId,
        achievement_id: achievementId,
        progress,
      });

    if (error) {
      console.error('Error updating achievement progress:', error);
    }
  },

  async unlockAchievement(
    userId: string,
    achievementId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('user_achievements')
      .upsert({
        user_id: userId,
        achievement_id: achievementId,
        unlocked_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error unlocking achievement:', error);
    }
  },

  async getAchievementProgress(
    userId: string,
    category: Achievement['category']
  ): Promise<number> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('progress')
      .eq('user_id', userId)
      .like('achievement_id', `${category}_%`)
      .order('progress', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching achievement progress:', error);
      return 0;
    }

    return data?.[0]?.progress || 0;
  },

  async initializeUserAchievements(userId: string): Promise<void> {
    const achievements = ACHIEVEMENTS.map(achievement => ({
      user_id: userId,
      achievement_id: achievement.id,
      progress: 0,
    }));

    const { error } = await supabase
      .from('user_achievements')
      .upsert(achievements, { onConflict: 'user_id,achievement_id' });

    if (error) {
      console.error('Error initializing user achievements:', error);
    }
  },

  async checkAndUnlockAchievements(
    userId: string,
    stats: {
      meditationSessions: number;
      habitCompletions: number;
      journalEntries: number;
      currentStreak: number;
    }
  ): Promise<void> {
    const userAchievements = await this.getUserAchievements(userId);
    const unlockedAchievementIds = new Set(
      userAchievements
        .filter(a => a.unlocked_at)
        .map(a => a.achievement_id)
    );

    for (const achievement of ACHIEVEMENTS) {
      if (unlockedAchievementIds.has(achievement.id)) continue;

      let progress = 0;
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
          const totalPoints = userAchievements.reduce(
            (total, a) => total + (a.unlocked_at ? ACHIEVEMENTS.find(ach => ach.id === a.achievement_id)?.points || 0 : 0),
            0
          );
          progress = totalPoints;
          break;
      }

      if (progress >= achievement.requirement) {
        await this.unlockAchievement(userId, achievement.id);
      } else {
        await this.updateAchievementProgress(userId, achievement.id, progress);
      }
    }
  },
}; 