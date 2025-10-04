import { useState, useEffect } from 'react';
import { Habit, HabitCompletion } from '@/lib/habit-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Calendar as CalendarIcon, 
  Trophy, 
  Award, 
  Star, 
  TrendingUp,
  CheckCircle2,
  Clock,
  Calendar,
  Flame,
  Droplets,
  Sun
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface HabitStatsProps {
  habits: Habit[];
  completions: HabitCompletion[];
}

export function HabitStats({ habits, completions }: HabitStatsProps) {
  const [timeRange, setTimeRange] = useState('week');
  const [chartData, setChartData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [streakData, setStreakData] = useState<any[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalHabits: 0,
    activeHabits: 0,
    totalCompletions: 0,
    completionsThisWeek: 0,
    bestStreak: 0,
    bestStreakHabit: '',
    completionRate: 0,
  });

  useEffect(() => {
    if (!habits.length) return;

    // Calculate total stats
    const activeHabits = habits.filter(h => !h.archived);
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    
    const completionsThisWeek = completions.filter(c => {
      const completionDate = new Date(c.completed_at);
      return completionDate >= weekAgo;
    });
    
    // Calculate best streak
    let bestStreak = 0;
    let bestStreakHabit = '';
    
    activeHabits.forEach(habit => {
      const streak = calculateStreak(habit.id);
      if (streak > bestStreak) {
        bestStreak = streak;
        bestStreakHabit = habit.name;
      }
    });
    
    // Calculate overall completion rate
    const totalDaysTracked = activeHabits.reduce((acc, habit) => {
      const createdDate = new Date(habit.created_at);
      const daysSinceCreation = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return acc + daysSinceCreation;
    }, 0);
    
    const completionRate = totalDaysTracked > 0 
      ? Math.round((completions.length / totalDaysTracked) * 100) 
      : 0;
    
    setTotalStats({
      totalHabits: habits.length,
      activeHabits: activeHabits.length,
      totalCompletions: completions.length,
      completionsThisWeek: completionsThisWeek.length,
      bestStreak,
      bestStreakHabit,
      completionRate,
    });

    // Prepare chart data based on time range
    prepareChartData();
    prepareCategoryData();
    prepareStreakData();
  }, [habits, completions, timeRange]);

  const calculateStreak = (habitId: string): number => {
    const habitCompletions = completions
      .filter(c => c.habit_id === habitId)
      .map(c => {
        const date = new Date(c.completed_at);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
      })
      .sort();
    
    if (habitCompletions.length === 0) return 0;
    
    // Check if there's a completion today
    const today = new Date();
    const todayStr = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const hasCompletionToday = habitCompletions.includes(todayStr);
    
    if (!hasCompletionToday) return 0;
    
    // Count consecutive days
    let streak = 1;
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - 1);
    
    while (true) {
      const dateStr = new Date(
        currentDate.getFullYear(), 
        currentDate.getMonth(), 
        currentDate.getDate()
      ).toISOString();
      
      if (habitCompletions.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const prepareChartData = () => {
    const now = new Date();
    let startDate: Date;
    let dateFormat: string;
    let groupBy: string;
    
    // Set date range based on selected time range
    if (timeRange === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      dateFormat = 'day';
      groupBy = 'day';
    } else if (timeRange === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      dateFormat = 'day';
      groupBy = 'day';
    } else if (timeRange === 'year') {
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      dateFormat = 'month';
      groupBy = 'month';
    } else {
      // all time
      startDate = new Date(0); // beginning of time
      dateFormat = 'month';
      groupBy = 'month';
    }
    
    // Filter completions within the selected time range
    const filteredCompletions = completions.filter(c => {
      const completionDate = new Date(c.completed_at);
      return completionDate >= startDate;
    });
    
    // Group completions by date
    const completionsByDate: Record<string, number> = {};
    
    filteredCompletions.forEach(completion => {
      const date = new Date(completion.completed_at);
      let dateKey: string;
      
      if (groupBy === 'day') {
        dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      } else {
        dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (!completionsByDate[dateKey]) {
        completionsByDate[dateKey] = 0;
      }
      
      completionsByDate[dateKey]++;
    });
    
    // Generate all dates in the range
    const allDates: string[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= now) {
      let dateKey: string;
      
      if (groupBy === 'day') {
        dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        allDates.push(dateKey);
        currentDate.setDate(currentDate.getDate() + 1);
      } else {
        dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        allDates.push(dateKey);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
    
    // Create chart data with all dates
    const data = allDates.map(dateKey => {
      const count = completionsByDate[dateKey] || 0;
      
      // Format date for display
      let displayDate: string;
      const [year, month, day] = dateKey.split('-').map(Number);
      
      if (groupBy === 'day') {
        displayDate = `${month}/${day}`;
      } else {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        displayDate = `${monthNames[month - 1]} ${year}`;
      }
      
      return {
        date: dateKey,
        displayDate,
        count,
      };
    });
    
    setChartData(data);
  };

  const prepareCategoryData = () => {
    // Group habits by category
    const categoryCounts: Record<string, number> = {};
    const categoryCompletions: Record<string, number> = {};
    
    habits.forEach(habit => {
      if (!habit.archived) {
        if (!categoryCounts[habit.category]) {
          categoryCounts[habit.category] = 0;
          categoryCompletions[habit.category] = 0;
        }
        
        categoryCounts[habit.category]++;
        
        // Count completions for this habit
        const habitCompletionCount = completions.filter(c => c.habit_id === habit.id).length;
        categoryCompletions[habit.category] += habitCompletionCount;
      }
    });
    
    // Create chart data
    const data = Object.keys(categoryCounts).map(category => {
      return {
        name: formatCategoryName(category),
        habits: categoryCounts[category],
        completions: categoryCompletions[category],
      };
    });
    
    setCategoryData(data);
  };

  const prepareStreakData = () => {
    // Calculate current streak for each habit
    const streaks = habits
      .filter(habit => !habit.archived)
      .map(habit => {
        const streak = calculateStreak(habit.id);
        return {
          name: habit.name,
          streak,
        };
      })
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5); // Top 5 streaks
    
    setStreakData(streaks);
  };

  const formatCategoryName = (category: string): string => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatXAxis = (tickItem: string) => {
    return tickItem;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{payload[0].payload.displayDate}</p>
          <p>{`Completions: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#ef4444', '#f59e0b', '#06b6d4'];

  const getLastCompletionDate = () => {
    if (completions.length === 0) return 'No completions yet';
    const lastCompletion = completions.sort((a, b) => 
      new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    )[0];
    return new Date(lastCompletion.completed_at).toLocaleDateString();
  };

  if (!habits.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">You don't have any habits yet.</p>
        <p className="text-sm text-muted-foreground">Create your first habit to see statistics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-deep-ocean-600/70">
              Active Habits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-deep-ocean-600">{totalStats.activeHabits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-deep-ocean-600/70">
              Total Completions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-deep-ocean-600">{totalStats.totalCompletions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-deep-ocean-600/70">
              Best Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-deep-ocean-600">{totalStats.bestStreak} days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-deep-ocean-600/70">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-deep-ocean-600">{totalStats.completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-deep-ocean-600">
            Garden Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-deep-ocean-600/70">Overall Progress</span>
              <span className="text-deep-ocean-600">{totalStats.completionRate}%</span>
            </div>
            <Progress value={totalStats.completionRate} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-sage-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-wellness-amber" />
                <span className="text-sm font-medium text-deep-ocean-600">Best Streak</span>
              </div>
              <div className="text-2xl font-bold text-deep-ocean-600">{totalStats.bestStreak} days</div>
            </div>

            <div className="bg-sage-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="h-4 w-4 text-wellness-blue" />
                <span className="text-sm font-medium text-deep-ocean-600">Total Nurturing</span>
              </div>
              <div className="text-2xl font-bold text-deep-ocean-600">{totalStats.totalCompletions} times</div>
            </div>

            <div className="bg-sage-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-4 w-4 text-wellness-amber" />
                <span className="text-sm font-medium text-deep-ocean-600">Last Tended</span>
              </div>
              <div className="text-2xl font-bold text-deep-ocean-600">{getLastCompletionDate()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}