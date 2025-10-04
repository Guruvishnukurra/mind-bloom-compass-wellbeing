import { Trophy, Star, Target, Flame, Heart, Brain, BookOpen, CheckCircle } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  category: 'meditation' | 'habits' | 'journal' | 'streak' | 'milestone';
  requirement: number;
  unlocked: boolean;
  progress: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Meditation Achievements
  {
    id: 'meditation_beginner',
    title: 'Meditation Beginner',
    description: 'Complete your first meditation session',
    icon: 'brain',
    points: 50,
    category: 'meditation',
    requirement: 1,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'meditation_master',
    title: 'Meditation Master',
    description: 'Complete 100 meditation sessions',
    icon: 'brain',
    points: 500,
    category: 'meditation',
    requirement: 100,
    unlocked: false,
    progress: 0,
  },
  // Habit Achievements
  {
    id: 'habit_starter',
    title: 'Habit Starter',
    description: 'Create your first habit',
    icon: 'target',
    points: 25,
    category: 'habits',
    requirement: 1,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'habit_master',
    title: 'Habit Master',
    description: 'Complete 1000 habit check-ins',
    icon: 'target',
    points: 1000,
    category: 'habits',
    requirement: 1000,
    unlocked: false,
    progress: 0,
  },
  // Streak Achievements
  {
    id: 'streak_3',
    title: '3-Day Streak',
    description: 'Maintain a 3-day meditation streak',
    icon: 'flame',
    points: 100,
    category: 'streak',
    requirement: 3,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'streak_7',
    title: '7-Day Streak',
    description: 'Maintain a 7-day meditation streak',
    icon: 'flame',
    points: 250,
    category: 'streak',
    requirement: 7,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'streak_30',
    title: '30-Day Streak',
    description: 'Maintain a 30-day meditation streak',
    icon: 'flame',
    points: 1000,
    category: 'streak',
    requirement: 30,
    unlocked: false,
    progress: 0,
  },
  // Journal Achievements
  {
    id: 'journal_beginner',
    title: 'Journal Beginner',
    description: 'Write your first journal entry',
    icon: 'book',
    points: 50,
    category: 'journal',
    requirement: 1,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'journal_master',
    title: 'Journal Master',
    description: 'Write 100 journal entries',
    icon: 'book',
    points: 500,
    category: 'journal',
    requirement: 100,
    unlocked: false,
    progress: 0,
  },
  // Milestone Achievements
  {
    id: 'points_1000',
    title: 'Points Collector',
    description: 'Earn 1,000 points',
    icon: 'star',
    points: 0,
    category: 'milestone',
    requirement: 1000,
    unlocked: false,
    progress: 0,
  },
  {
    id: 'points_5000',
    title: 'Points Master',
    description: 'Earn 5,000 points',
    icon: 'star',
    points: 0,
    category: 'milestone',
    requirement: 5000,
    unlocked: false,
    progress: 0,
  },
];

export const getAchievementIcon = (icon: string) => {
  const iconMap: Record<string, JSX.Element> = {
    trophy: <Trophy className="h-6 w-6" />,
    star: <Star className="h-6 w-6" />,
    target: <Target className="h-6 w-6" />,
    flame: <Flame className="h-6 w-6" />,
    heart: <Heart className="h-6 w-6" />,
    brain: <Brain className="h-6 w-6" />,
    book: <BookOpen className="h-6 w-6" />,
    check: <CheckCircle className="h-6 w-6" />,
  };
  return iconMap[icon] || <Trophy className="h-6 w-6" />;
};

export const calculatePoints = (achievements: Achievement[]): number => {
  return achievements.reduce((total, achievement) => {
    return total + (achievement.unlocked ? achievement.points : 0);
  }, 0);
};

export const checkAchievements = (
  currentAchievements: Achievement[],
  stats: {
    meditationSessions: number;
    habitCompletions: number;
    journalEntries: number;
    currentStreak: number;
  }
): Achievement[] => {
  return currentAchievements.map(achievement => {
    let progress = 0;
    let unlocked = achievement.unlocked;

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
        const totalPoints = calculatePoints(currentAchievements);
        progress = totalPoints;
        break;
    }

    if (progress >= achievement.requirement && !unlocked) {
      unlocked = true;
    }

    return {
      ...achievement,
      progress,
      unlocked,
    };
  });
}; 