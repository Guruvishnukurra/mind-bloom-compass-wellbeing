import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MoodEntry } from './MoodChart';
import { Smile, Frown, TrendingUp, TrendingDown, Calendar, ArrowRight } from 'lucide-react';

interface MoodInsightsProps {
  entries: MoodEntry[];
}

export function MoodInsights({ entries }: MoodInsightsProps) {
  const [averageMood, setAverageMood] = useState<number | null>(null);
  const [moodTrend, setMoodTrend] = useState<'up' | 'down' | 'stable' | null>(null);
  const [bestDay, setBestDay] = useState<string | null>(null);
  const [worstDay, setWorstDay] = useState<string | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    if (!entries.length) return;

    // Calculate average mood
    const sum = entries.reduce((acc, entry) => acc + entry.mood_score, 0);
    const avg = sum / entries.length;
    setAverageMood(Math.round(avg * 10) / 10);

    // Calculate mood trend (comparing last 7 days to previous 7 days)
    if (entries.length >= 14) {
      const sortedEntries = [...entries].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      const last7Days = sortedEntries.slice(0, 7);
      const previous7Days = sortedEntries.slice(7, 14);
      
      const last7Avg = last7Days.reduce((acc, entry) => acc + entry.mood_score, 0) / last7Days.length;
      const previous7Avg = previous7Days.reduce((acc, entry) => acc + entry.mood_score, 0) / previous7Days.length;
      
      if (last7Avg > previous7Avg + 0.3) {
        setMoodTrend('up');
      } else if (last7Avg < previous7Avg - 0.3) {
        setMoodTrend('down');
      } else {
        setMoodTrend('stable');
      }
    }

    // Find best and worst days
    const sortedByMood = [...entries].sort((a, b) => b.mood_score - a.mood_score);
    if (sortedByMood.length > 0) {
      const bestEntry = sortedByMood[0];
      const worstEntry = sortedByMood[sortedByMood.length - 1];
      
      setBestDay(new Date(bestEntry.created_at).toLocaleDateString('en-US', { 
        weekday: 'long' 
      }));
      
      setWorstDay(new Date(worstEntry.created_at).toLocaleDateString('en-US', { 
        weekday: 'long' 
      }));
    }

    // Calculate streak
    const sortedByDate = [...entries].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    let currentStreak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const entry of sortedByDate) {
      const entryDate = new Date(entry.created_at);
      entryDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.round((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        currentStreak++;
        currentDate = new Date(entryDate);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    setStreak(currentStreak);

    // Generate insights
    const newInsights = [];
    
    // Correlation insights
    const correlations = calculateCorrelations(entries);
    const topPositiveCorrelation = correlations.find(c => c.correlation > 0.5);
    const topNegativeCorrelation = correlations.find(c => c.correlation < -0.5);
    
    if (topPositiveCorrelation) {
      newInsights.push(`Higher ${topPositiveCorrelation.factor} ratings are strongly associated with better mood.`);
    }
    
    if (topNegativeCorrelation) {
      newInsights.push(`Lower ${topNegativeCorrelation.factor} ratings are associated with better mood.`);
    }
    
    // Pattern insights
    if (bestDay) {
      newInsights.push(`Your mood tends to be highest on ${bestDay}s.`);
    }
    
    if (worstDay) {
      newInsights.push(`Your mood tends to be lowest on ${worstDay}s.`);
    }
    
    // Trend insights
    if (moodTrend === 'up') {
      newInsights.push('Your mood has been improving over the past week.');
    } else if (moodTrend === 'down') {
      newInsights.push('Your mood has been declining over the past week.');
    }
    
    // Streak insights
    if (streak >= 7) {
      newInsights.push(`Great job! You've tracked your mood for ${streak} days in a row.`);
    }
    
    setInsights(newInsights);
  }, [entries]);

  // Calculate correlations between mood and factors
  const calculateCorrelations = (entries: MoodEntry[]) => {
    if (entries.length < 5) return [];
    
    const factors = ['sleep', 'exercise', 'social', 'nutrition', 'stress', 'work'];
    const correlations = [];
    
    for (const factor of factors) {
      const data = entries.map(entry => ({
        mood: entry.mood_score,
        factor: entry.factors[factor as keyof typeof entry.factors]
      }));
      
      // Calculate correlation coefficient
      const n = data.length;
      const sumX = data.reduce((acc, item) => acc + item.mood, 0);
      const sumY = data.reduce((acc, item) => acc + item.factor, 0);
      const sumXY = data.reduce((acc, item) => acc + (item.mood * item.factor), 0);
      const sumXX = data.reduce((acc, item) => acc + (item.mood * item.mood), 0);
      const sumYY = data.reduce((acc, item) => acc + (item.factor * item.factor), 0);
      
      const numerator = n * sumXY - sumX * sumY;
      const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
      
      const correlation = denominator === 0 ? 0 : numerator / denominator;
      
      correlations.push({
        factor,
        correlation
      });
    }
    
    return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  };

  if (!entries.length) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Mood Insights</CardTitle>
          <CardDescription>
            Personalized insights based on your mood patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-muted-foreground">Not enough data for insights yet.</p>
          <p className="text-sm text-muted-foreground">Track your mood regularly to receive personalized insights.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Mood Insights</CardTitle>
        <CardDescription>
          Personalized insights based on your mood patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground mb-1">Average Mood</span>
            <div className="flex items-center">
              {averageMood && averageMood >= 7 ? (
                <Smile className="h-5 w-5 text-green-500 mr-1" />
              ) : (
                <Frown className="h-5 w-5 text-orange-500 mr-1" />
              )}
              <span className="text-2xl font-bold">{averageMood}</span>
              <span className="text-sm text-muted-foreground ml-1">/10</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground mb-1">Current Trend</span>
            <div className="flex items-center">
              {moodTrend === 'up' && (
                <>
                  <TrendingUp className="h-5 w-5 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">Improving</span>
                </>
              )}
              {moodTrend === 'down' && (
                <>
                  <TrendingDown className="h-5 w-5 text-orange-500 mr-1" />
                  <span className="text-orange-500 font-medium">Declining</span>
                </>
              )}
              {moodTrend === 'stable' && (
                <>
                  <ArrowRight className="h-5 w-5 text-blue-500 mr-1" />
                  <span className="text-blue-500 font-medium">Stable</span>
                </>
              )}
              {moodTrend === null && (
                <span className="text-muted-foreground">Need more data</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground mb-1">Best Day</span>
            <span className="font-medium">{bestDay || 'N/A'}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground mb-1">Current Streak</span>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-primary mr-1" />
              <span className="font-medium">{streak} days</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Your Insights</h3>
          {insights.length > 0 ? (
            <ul className="space-y-2">
              {insights.map((insight, index) => (
                <li key={index} className="text-sm bg-muted p-2 rounded-md">
                  {insight}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Continue tracking your mood to receive personalized insights.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}