import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { statsService, UserStats } from '@/lib/stats-service';
import { achievementService } from '@/lib/achievement-service';

interface StatsContextType {
  stats: UserStats | null;
  loading: boolean;
  incrementMeditationSessions: () => Promise<void>;
  incrementHabitCompletions: () => Promise<void>;
  incrementJournalEntries: () => Promise<void>;
  resetStreak: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};

interface StatsProviderProps {
  children: React.ReactNode;
}

export const StatsProvider: React.FC<StatsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userStats = await statsService.getUserStats(user.id);
      setStats(userStats);

      if (userStats) {
        await achievementService.checkAndUnlockAchievements(user.id, {
          meditationSessions: userStats.meditation_sessions,
          habitCompletions: userStats.habit_completions,
          journalEntries: userStats.journal_entries,
          currentStreak: userStats.current_streak,
        });
      }
    } catch (error) {
      console.error('Error refreshing stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementMeditationSessions = async () => {
    if (!user) return;

    try {
      await statsService.incrementMeditationSessions(user.id);
      await refreshStats();
    } catch (error) {
      console.error('Error incrementing meditation sessions:', error);
    }
  };

  const incrementHabitCompletions = async () => {
    if (!user) return;

    try {
      await statsService.incrementHabitCompletions(user.id);
      await refreshStats();
    } catch (error) {
      console.error('Error incrementing habit completions:', error);
    }
  };

  const incrementJournalEntries = async () => {
    if (!user) return;

    try {
      await statsService.incrementJournalEntries(user.id);
      await refreshStats();
    } catch (error) {
      console.error('Error incrementing journal entries:', error);
    }
  };

  const resetStreak = async () => {
    if (!user) return;

    try {
      await statsService.resetStreak(user.id);
      await refreshStats();
    } catch (error) {
      console.error('Error resetting streak:', error);
    }
  };

  useEffect(() => {
    if (user) {
      refreshStats();
    }
  }, [user]);

  const value = {
    stats,
    loading,
    incrementMeditationSessions,
    incrementHabitCompletions,
    incrementJournalEntries,
    resetStreak,
    refreshStats,
  };

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
}; 