import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Brain, BookOpen, Heart, TrendingUp } from 'lucide-react';

interface WellbeingMetrics {
  moodScore: number;
  meditationMinutes: number;
  journalEntries: number;
  streak: number;
}

export function WellbeingScore() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<WellbeingMetrics>({
    moodScore: 0,
    meditationMinutes: 0,
    journalEntries: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [overallScore, setOverallScore] = useState(0);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [previousScore, setPreviousScore] = useState(0);

  useEffect(() => {
    async function fetchMetrics() {
      if (!user) return;

      try {
        // Fetch mood entries from the last 7 days
        const { data: moodData, error: moodError } = await supabase
          .from('mood_entries')
          .select('mood_score')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (moodError) throw moodError;

        // Fetch meditation sessions from the last 7 days
        const { data: meditationData, error: meditationError } = await supabase
          .from('meditation_sessions')
          .select('duration')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (meditationError) throw meditationError;

        // Fetch journal entries from the last 7 days
        const { data: journalData, error: journalError } = await supabase
          .from('journal_entries')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (journalError) throw journalError;

        // Calculate average mood score
        const moodScore = moodData.length > 0
          ? moodData.reduce((sum, entry) => sum + entry.mood_score, 0) / moodData.length
          : 0;

        // Calculate total meditation minutes
        const meditationMinutes = meditationData.length > 0
          ? meditationData.reduce((sum, session) => sum + session.duration, 0) / 60
          : 0;

        // Count journal entries
        const journalEntries = journalData.length;

        // Calculate streak (consecutive days with activity)
        const streak = calculateStreak(moodData, meditationData, journalData);

        setMetrics({
          moodScore,
          meditationMinutes,
          journalEntries,
          streak,
        });

        // Calculate overall score (0-100)
        const score = calculateOverallScore(moodScore, meditationMinutes, journalEntries, streak);
        setOverallScore(score);

        // Fetch previous week's score for trend comparison
        const { data: previousMoodData } = await supabase
          .from('mood_entries')
          .select('mood_score')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
          .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        const { data: previousMeditationData } = await supabase
          .from('meditation_sessions')
          .select('duration')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
          .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        const { data: previousJournalData } = await supabase
          .from('journal_entries')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
          .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        const previousMoodScore = previousMoodData.length > 0
          ? previousMoodData.reduce((sum, entry) => sum + entry.mood_score, 0) / previousMoodData.length
          : 0;

        const previousMeditationMinutes = previousMeditationData.length > 0
          ? previousMeditationData.reduce((sum, session) => sum + session.duration, 0) / 60
          : 0;

        const previousJournalEntries = previousJournalData.length;
        const previousStreak = calculateStreak(previousMoodData, previousMeditationData, previousJournalData);

        const prevScore = calculateOverallScore(
          previousMoodScore,
          previousMeditationMinutes,
          previousJournalEntries,
          previousStreak
        );
        setPreviousScore(prevScore);

        // Determine trend
        if (score > prevScore + 5) {
          setTrend('up');
        } else if (score < prevScore - 5) {
          setTrend('down');
        } else {
          setTrend('stable');
        }
      } catch (error) {
        console.error('Error fetching wellbeing metrics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [user]);

  // Helper function to calculate streak
  function calculateStreak(moodData: any[], meditationData: any[], journalData: any[]) {
    // This is a simplified streak calculation
    // In a real app, you'd want to check for consecutive days with activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const hasActivityToday = 
      moodData.some(entry => new Date(entry.created_at).setHours(0, 0, 0, 0) === today.getTime()) ||
      meditationData.some(session => new Date(session.created_at).setHours(0, 0, 0, 0) === today.getTime()) ||
      journalData.some(entry => new Date(entry.created_at).setHours(0, 0, 0, 0) === today.getTime());
    
    if (!hasActivityToday) return 0;
    
    // Count consecutive days with activity
    let streak = 1;
    let currentDate = new Date(today);
    
    for (let i = 1; i <= 30; i++) {
      currentDate.setDate(currentDate.getDate() - 1);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const hasActivityOnDate = 
        moodData.some(entry => entry.created_at.startsWith(dateStr)) ||
        meditationData.some(session => session.created_at.startsWith(dateStr)) ||
        journalData.some(entry => entry.created_at.startsWith(dateStr));
      
      if (hasActivityOnDate) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  // Helper function to calculate overall score
  function calculateOverallScore(moodScore: number, meditationMinutes: number, journalEntries: number, streak: number) {
    // Mood score (0-10) contributes 40% to overall score
    const moodContribution = (moodScore / 10) * 40;
    
    // Meditation minutes (target: 10 minutes per day = 70 minutes per week) contributes 30%
    const meditationContribution = Math.min(meditationMinutes / 70, 1) * 30;
    
    // Journal entries (target: 3 entries per week) contributes 20%
    const journalContribution = Math.min(journalEntries / 3, 1) * 20;
    
    // Streak (target: 7 days) contributes 10%
    const streakContribution = Math.min(streak / 7, 1) * 10;
    
    return Math.round(moodContribution + meditationContribution + journalContribution + streakContribution);
  }

  if (loading) {
    return <div>Calculating your wellbeing score...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Wellbeing Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-3xl font-bold">{overallScore}/100</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                {trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                {trend === 'stable' && <TrendingUp className="h-4 w-4 text-yellow-500 rotate-90" />}
                <span>
                  {trend === 'up' && `Up ${overallScore - previousScore} points from last week`}
                  {trend === 'down' && `Down ${previousScore - overallScore} points from last week`}
                  {trend === 'stable' && 'Stable compared to last week'}
                </span>
              </div>
            </div>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold">{overallScore}</span>
            </div>
          </div>

          <Progress value={overallScore} className="h-2" />

          <Tabs defaultValue="mood">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="mood">
                <Heart className="h-4 w-4 mr-1" />
                Mood
              </TabsTrigger>
              <TabsTrigger value="meditation">
                <Brain className="h-4 w-4 mr-1" />
                Meditation
              </TabsTrigger>
              <TabsTrigger value="journal">
                <BookOpen className="h-4 w-4 mr-1" />
                Journal
              </TabsTrigger>
              <TabsTrigger value="streak">
                <TrendingUp className="h-4 w-4 mr-1" />
                Streak
              </TabsTrigger>
            </TabsList>
            <TabsContent value="mood" className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Average Mood</span>
                  <span className="text-sm font-medium">{metrics.moodScore.toFixed(1)}/10</span>
                </div>
                <Progress value={(metrics.moodScore / 10) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Based on {metrics.moodScore > 0 ? 'your recent mood entries' : 'no mood entries yet'}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="meditation" className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Meditation Minutes</span>
                  <span className="text-sm font-medium">{Math.round(metrics.meditationMinutes)}/70 min</span>
                </div>
                <Progress value={(metrics.meditationMinutes / 70) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Target: 10 minutes per day (70 minutes per week)
                </p>
              </div>
            </TabsContent>
            <TabsContent value="journal" className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Journal Entries</span>
                  <span className="text-sm font-medium">{metrics.journalEntries}/3 entries</span>
                </div>
                <Progress value={(metrics.journalEntries / 3) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Target: 3 journal entries per week
                </p>
              </div>
            </TabsContent>
            <TabsContent value="streak" className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Activity Streak</span>
                  <span className="text-sm font-medium">{metrics.streak}/7 days</span>
                </div>
                <Progress value={(metrics.streak / 7) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Consecutive days with any wellbeing activity
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
} 