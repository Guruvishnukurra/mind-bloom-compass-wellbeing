import { supabase } from '@/lib/supabase';

export interface UserStats {
  user_id: string;
  meditation_sessions: number;
  habit_completions: number;
  journal_entries: number;
  current_streak: number;
  last_activity_date: string;
  total_points: number;
}

export const statsService = {
  async getUserStats(userId: string): Promise<UserStats | null> {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }

    return data;
  },

  async updateUserStats(
    userId: string,
    updates: Partial<Omit<UserStats, 'user_id'>>
  ): Promise<void> {
    const { error } = await supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        ...updates,
        last_activity_date: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating user stats:', error);
    }
  },

  async incrementMeditationSessions(userId: string): Promise<void> {
    const stats = await this.getUserStats(userId);
    if (!stats) {
      await this.updateUserStats(userId, {
        meditation_sessions: 1,
        current_streak: 1,
        total_points: 50, // Points for first meditation
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = new Date(stats.last_activity_date).toISOString().split('T')[0];
    const isConsecutiveDay = today === lastActivity || 
      new Date(today).getTime() - new Date(lastActivity).getTime() === 86400000;

    await this.updateUserStats(userId, {
      meditation_sessions: stats.meditation_sessions + 1,
      current_streak: isConsecutiveDay ? stats.current_streak + 1 : 1,
      total_points: stats.total_points + 50,
    });
  },

  async incrementHabitCompletions(userId: string): Promise<void> {
    const stats = await this.getUserStats(userId);
    if (!stats) {
      await this.updateUserStats(userId, {
        habit_completions: 1,
        total_points: 25,
      });
      return;
    }

    await this.updateUserStats(userId, {
      habit_completions: stats.habit_completions + 1,
      total_points: stats.total_points + 25,
    });
  },

  async incrementJournalEntries(userId: string): Promise<void> {
    const stats = await this.getUserStats(userId);
    if (!stats) {
      await this.updateUserStats(userId, {
        journal_entries: 1,
        total_points: 50,
      });
      return;
    }

    await this.updateUserStats(userId, {
      journal_entries: stats.journal_entries + 1,
      total_points: stats.total_points + 50,
    });
  },

  async resetStreak(userId: string): Promise<void> {
    const stats = await this.getUserStats(userId);
    if (!stats) return;

    await this.updateUserStats(userId, {
      current_streak: 0,
    });
  },

  async initializeUserStats(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        meditation_sessions: 0,
        habit_completions: 0,
        journal_entries: 0,
        current_streak: 0,
        total_points: 0,
        last_activity_date: new Date().toISOString(),
      });

    if (error) {
      console.error('Error initializing user stats:', error);
    }
  },
}; 