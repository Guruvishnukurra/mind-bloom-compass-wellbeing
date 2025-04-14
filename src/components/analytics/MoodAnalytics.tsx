import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { ArrowUp, ArrowRight, ArrowDown, Calendar, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MoodEntry, getMoodEntries, getAnalyticsData } from '@/utils/storageUtils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
export function MoodAnalytics() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [analytics, setAnalytics] = useState<ReturnType<typeof getAnalyticsData>>(getAnalyticsData());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please sign in to view analytics');
        return;
      }

      const { data: entries, error: entriesError } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (entriesError) throw entriesError;
      
      setMoodEntries(entries || []);
      setAnalytics(getAnalyticsData());  // Remove the parameter
    } catch (err: unknown) {
      console.error('Error loading mood data:', err);
      setError('Failed to load mood data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const exportData = () => {
    // Create data object with all user data
    const exportData = {
      moodEntries: getMoodEntries(),
      journalEntries: JSON.parse(localStorage.getItem('journalEntries') || '[]')
    };
    
    // Convert to JSON string
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set up download
    link.href = url;
    link.download = `mind-bloom-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported successfully",
      description: "Your wellness data has been exported as a JSON file."
    });
  };
  
  // Prepare chart data
  const weeklyData = () => {
    if (moodEntries.length === 0) return [];
    
    // Get last 7 days of data
    const sortedEntries = [...moodEntries]
      .sort((a, b) => new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime())
      .slice(0, 7)
      .reverse();
      
    // Return only mood values without dates
    return sortedEntries.map((entry, index) => ({
      index: index + 1,
      mood: entry.mood_score, // Fix property name to match database schema
      energy: entry.energy_level || 0,
      // Store the date in a separate property for tooltip display
      tooltipDate: new Date(entry.created_at || entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }));
  };
  
  // Mood distribution data
  const moodDistribution = Object.entries(analytics.moodCounts || {}).map(
    ([mood, count]) => ({
      mood: Number(mood),
      count: count
    })
  );
  
  const getTrendIcon = () => {
    switch(analytics.recentTrend) {
      case 'improving':
        return <ArrowUp className="h-6 w-6 text-green-500" />;
      case 'declining':
        return <ArrowDown className="h-6 w-6 text-red-500" />;
      case 'steady':
        return <ArrowRight className="h-6 w-6 text-blue-500" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Wellness Analytics</h2>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={exportData}
        >
          <Save className="h-4 w-4" />
          Export Data
        </Button>
      </div>
      
      {moodEntries.length === 0 ? (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Start tracking your mood to see analytics here.
            </p>
            <Button onClick={() => navigate('/mood')} variant="outline">
              Track Your Mood
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Average Mood</h3>
              <div className="flex items-center">
                <div className="text-3xl font-bold">{analytics.averageMood}</div>
                <span className="text-sm text-muted-foreground ml-2">/ 5</span>
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Recent Trend</h3>
              <div className="flex items-center gap-2">
                {getTrendIcon()}
                <div className="text-lg font-medium capitalize">
                  {analytics.recentTrend !== 'unknown' ? analytics.recentTrend : 'Not enough data'}
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Entries</h3>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold">{moodEntries.length + analytics.journalCount}</div>
                <span className="text-sm text-muted-foreground">
                  ({moodEntries.length} mood, {analytics.journalCount} journal)
                </span>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 overflow-hidden">
              <h3 className="text-lg font-medium mb-4">Your Mood Journey</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData()} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--wellness-teal)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--wellness-teal)" stopOpacity={0.2}/>
                      </linearGradient>
                      <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--wellness-lavender)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--wellness-lavender)" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="index" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: 'var(--wellness-dark-gray)' }}
                      label={{ value: 'Recent Entries', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      domain={[1, 10]} 
                      ticks={[1, 3, 5, 7, 10]} 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--wellness-dark-gray)' }}
                    />
                    <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-md border border-gray-100">
                              <p className="text-sm font-medium">{payload[0].payload.tooltipDate}</p>
                              <p className="text-sm text-wellness-teal">
                                Mood: <span className="font-semibold">{payload[0].value}</span>
                              </p>
                              {payload[1] && (
                                <p className="text-sm text-wellness-lavender">
                                  Energy: <span className="font-semibold">{payload[1].value}</span>
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="var(--wellness-teal)" 
                      strokeWidth={3} 
                      dot={{ r: 6, fill: 'var(--wellness-teal)', strokeWidth: 2, stroke: 'white' }}
                      activeDot={{ r: 8, fill: 'var(--wellness-teal)', strokeWidth: 2, stroke: 'white' }}
                      name="Mood"
                      animationDuration={1500}
                      isAnimationActive={true}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="var(--wellness-lavender)" 
                      strokeWidth={3} 
                      dot={{ r: 6, fill: 'var(--wellness-lavender)', strokeWidth: 2, stroke: 'white' }}
                      activeDot={{ r: 8, fill: 'var(--wellness-lavender)', strokeWidth: 2, stroke: 'white' }}
                      name="Energy"
                      animationDuration={1500}
                      animationBegin={300}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-wellness-teal"></div>
                  <span className="text-sm">Mood</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-wellness-lavender"></div>
                  <span className="text-sm">Energy</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 overflow-hidden">
              <h3 className="text-lg font-medium mb-4">Mood Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--wellness-soft-coral)" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="var(--wellness-pale-yellow)" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="mood" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--wellness-dark-gray)' }}
                      label={{ value: 'Mood Level', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--wellness-dark-gray)' }}
                      label={{ value: 'Number of Entries', angle: -90, position: 'insideLeft' }}
                    />
                    <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-md border border-gray-100">
                              <p className="text-sm font-medium">Mood Level: {payload[0].payload.mood}</p>
                              <p className="text-sm">
                                <span className="font-semibold">{payload[0].value}</span> entries
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="url(#colorGradient)" 
                      radius={[8, 8, 0, 0]}
                      animationDuration={1500}
                      isAnimationActive={true}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-center text-muted-foreground">
                See which mood levels you experience most frequently
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
