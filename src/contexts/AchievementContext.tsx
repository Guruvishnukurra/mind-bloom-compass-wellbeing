import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { achievementService, UserAchievement } from '@/lib/achievement-service';
import { Achievement, ACHIEVEMENTS } from '@/lib/achievements';

interface AchievementContextType {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  totalPoints: number;
  loading: boolean;
  refreshAchievements: () => Promise<void>;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};

interface AchievementProviderProps {
  children: React.ReactNode;
}

export const AchievementProvider: React.FC<AchievementProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAchievements = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const achievements = await achievementService.getUserAchievements(user.id);
      setUserAchievements(achievements);
    } catch (error) {
      console.error('Error refreshing achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshAchievements();
    }
  }, [user]);

  const totalPoints = userAchievements.reduce((total, userAchievement) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === userAchievement.achievement_id);
    return total + (achievement && userAchievement.unlocked_at ? achievement.points : 0);
  }, 0);

  const value = {
    achievements: ACHIEVEMENTS,
    userAchievements,
    totalPoints,
    loading,
    refreshAchievements,
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  );
}; 