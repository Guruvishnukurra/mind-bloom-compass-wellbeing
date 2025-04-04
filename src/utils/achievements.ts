export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  category: 'meditation' | 'journal' | 'mood' | 'gratitude' | 'streak';
  requirement: number;
}

export const achievements: Achievement[] = [
  // Meditation Achievements
  {
    id: 'meditation_beginner',
    title: 'Meditation Beginner',
    description: 'Complete your first meditation session',
    points: 50,
    icon: '🧘',
    category: 'meditation',
    requirement: 1
  },
  {
    id: 'meditation_master',
    title: 'Meditation Master',
    description: 'Complete 10 meditation sessions',
    points: 100,
    icon: '🌟',
    category: 'meditation',
    requirement: 10
  },
  
  // Journal Achievements
  {
    id: 'journal_beginner',
    title: 'Journaling Journey',
    description: 'Write your first journal entry',
    points: 50,
    icon: '📝',
    category: 'journal',
    requirement: 1
  },
  {
    id: 'journal_expert',
    title: 'Journal Expert',
    description: 'Write 10 journal entries',
    points: 100,
    icon: '📚',
    category: 'journal',
    requirement: 10
  },
  
  // Mood Tracking Achievements
  {
    id: 'mood_tracker',
    title: 'Mood Tracker',
    description: 'Track your mood for 5 consecutive days',
    points: 75,
    icon: '📊',
    category: 'mood',
    requirement: 5
  },
  {
    id: 'mood_master',
    title: 'Mood Master',
    description: 'Track your mood for 30 days',
    points: 150,
    icon: '🎯',
    category: 'mood',
    requirement: 30
  },
  
  // Gratitude Achievements
  {
    id: 'gratitude_beginner',
    title: 'Gratitude Starter',
    description: 'Write your first gratitude entry',
    points: 50,
    icon: '🙏',
    category: 'gratitude',
    requirement: 1
  },
  {
    id: 'gratitude_expert',
    title: 'Gratitude Expert',
    description: 'Write 20 gratitude entries',
    points: 150,
    icon: '💝',
    category: 'gratitude',
    requirement: 20
  },
  
  // Streak Achievements
  {
    id: 'streak_3',
    title: '3-Day Streak',
    description: 'Maintain a 3-day activity streak',
    points: 100,
    icon: '🔥',
    category: 'streak',
    requirement: 3
  },
  {
    id: 'streak_7',
    title: '7-Day Streak',
    description: 'Maintain a 7-day activity streak',
    points: 200,
    icon: '⚡',
    category: 'streak',
    requirement: 7
  },
  {
    id: 'streak_30',
    title: '30-Day Streak',
    description: 'Maintain a 30-day activity streak',
    points: 500,
    icon: '🏆',
    category: 'streak',
    requirement: 30
  }
];

export function calculatePoints(achievements: Achievement[]): number {
  return achievements.reduce((total, achievement) => total + achievement.points, 0);
}

export function getAchievementProgress(
  category: Achievement['category'],
  currentValue: number
): { nextAchievement: Achievement | null; progress: number } {
  const categoryAchievements = achievements
    .filter(a => a.category === category)
    .sort((a, b) => a.requirement - b.requirement);
  
  const nextAchievement = categoryAchievements.find(a => a.requirement > currentValue) || null;
  
  if (!nextAchievement) {
    return {
      nextAchievement: null,
      progress: 100
    };
  }
  
  const progress = (currentValue / nextAchievement.requirement) * 100;
  
  return {
    nextAchievement,
    progress: Math.min(progress, 100)
  };
}
 