
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
import { ArrowUp, ArrowRight, ArrowDown, Calendar, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MoodEntry, getMoodEntries, getAnalyticsData } from '@/utils/storageUtils';
import { useToast } from '@/hooks/use-toast';

const MoodAnalytics = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [analytics, setAnalytics] = useState<ReturnType<typeof getAnalyticsData>>(getAnalyticsData());
  const { toast } = useToast();
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = () => {
    const entries = getMoodEntries();
    setMoodEntries(entries);
    setAnalytics(getAnalyticsData());
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
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7)
      .reverse();
      
    return sortedEntries.map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
      mood: entry.mood
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
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            Start tracking your mood to see analytics here.
          </p>
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
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Weekly Mood</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData()}>
                    <XAxis dataKey="date" />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                    <RechartsTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#8884d8" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Mood Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodDistribution}>
                    <XAxis dataKey="mood" />
                    <YAxis />
                    <RechartsTooltip 
                      formatter={(value: number, name: string) => [`${value} entries`, 'Count']}
                    />
                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default MoodAnalytics;
