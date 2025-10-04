import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAchievements } from '@/contexts/AchievementContext';
import { useStats } from '@/contexts/StatsContext';
import { AchievementsList } from '@/components/achievements/AchievementsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Brain, Target, BookOpen, Flame } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { totalPoints, loading: achievementsLoading } = useAchievements();
  const { stats, loading: statsLoading } = useStats();

  if (statsLoading || achievementsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Points Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints}</div>
            <Progress value={33} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Keep going to earn more points!
            </p>
          </CardContent>
        </Card>

        {/* Meditation Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meditation Sessions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.meditation_sessions || 0}</div>
            <Progress value={33} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              +50 points per session
            </p>
          </CardContent>
        </Card>

        {/* Habit Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Habit Completions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.habit_completions || 0}</div>
            <Progress value={33} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              +25 points per completion
            </p>
          </CardContent>
        </Card>

        {/* Journal Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.journal_entries || 0}</div>
            <Progress value={33} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              +50 points per entry
            </p>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.current_streak || 0} days</div>
            <Progress value={33} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Keep your streak going!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Achievements</h2>
        <AchievementsList
          stats={{
            meditationSessions: stats?.meditation_sessions || 0,
            habitCompletions: stats?.habit_completions || 0,
            journalEntries: stats?.journal_entries || 0,
            currentStreak: stats?.current_streak || 0,
          }}
        />
      </div>
    </div>
  );
};