import { supabase } from '@/lib/supabase';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  frequency_value?: number;
  frequency_unit?: 'day' | 'week' | 'month';
  time_of_day?: string;
  reminder: boolean;
  reminder_time?: string;
  color: string;
  icon: string;
  created_at: string;
  archived: boolean;
  completed: boolean;
  streak: number;
  lastCompleted: string | null;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  notes?: string;
}

export const habitService = {
  async getHabits(userId: string): Promise<Habit[]> {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching habits:', error);
      return [];
    }
  },

  async createHabit(habit: Omit<Habit, 'id'>): Promise<Habit | null> {
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([habit])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating habit:', error);
      return null;
    }
  },

  async updateHabit(habitId: string, updates: Partial<Habit>): Promise<Habit | null> {
    try {
      const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', habitId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating habit:', error);
      return null;
    }
  },

  async deleteHabit(habitId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  },

  async getHabitCompletions(userId: string): Promise<HabitCompletion[]> {
    try {
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching habit completions:', error);
      return [];
    }
  },

  async completeHabit(habitId: string, userId: string, notes?: string): Promise<HabitCompletion | null> {
    try {
      const completion: Omit<HabitCompletion, 'id'> = {
        habit_id: habitId,
        user_id: userId,
        completed_at: new Date().toISOString(),
        notes,
      };

      const { data, error } = await supabase
        .from('habit_completions')
        .insert([completion])
        .select()
        .single();

      if (error) throw error;

      // Update habit streak
      const { data: habitData, error: habitError } = await supabase
        .from('habits')
        .select('streak, lastCompleted')
        .eq('id', habitId)
        .single();

      if (habitError) throw habitError;

      const lastCompleted = habitData?.lastCompleted ? new Date(habitData.lastCompleted) : null;
      const today = new Date();
      const isConsecutiveDay = lastCompleted && 
        (lastCompleted.toDateString() === today.toDateString() ||
         today.getTime() - lastCompleted.getTime() === 86400000);

      const newStreak = !habitData?.lastCompleted ? 1 :
        isConsecutiveDay ? (habitData.streak || 0) + 1 : 1;

      await supabase
        .from('habits')
        .update({
          streak: newStreak,
          lastCompleted: today.toISOString(),
        })
        .eq('id', habitId);

      return data;
    } catch (error) {
      console.error('Error completing habit:', error);
      return null;
    }
  },

  async getHabitStreak(habitId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('streak')
        .eq('id', habitId)
        .single();

      if (error) throw error;
      return data?.streak || 0;
    } catch (error) {
      console.error('Error getting habit streak:', error);
      return 0;
    }
  },

  async getHabitStats(userId: string): Promise<{
    totalHabits: number;
    activeHabits: number;
    totalCompletions: number;
    bestStreak: number;
    completionRate: number;
  }> {
    try {
      const [habits, completions] = await Promise.all([
        this.getHabits(userId),
        this.getHabitCompletions(userId),
      ]);

      const activeHabits = habits.filter(h => !h.archived);
      const totalCompletions = completions.length;
      const bestStreak = Math.max(...habits.map(h => h.streak || 0));
      const completionRate = activeHabits.length > 0
        ? (totalCompletions / (activeHabits.length * 30)) * 100 // Assuming 30 days
        : 0;

      return {
        totalHabits: habits.length,
        activeHabits: activeHabits.length,
        totalCompletions,
        bestStreak,
        completionRate,
      };
    } catch (error) {
      console.error('Error getting habit stats:', error);
      return {
        totalHabits: 0,
        activeHabits: 0,
        totalCompletions: 0,
        bestStreak: 0,
        completionRate: 0,
      };
    }
  },
}; 