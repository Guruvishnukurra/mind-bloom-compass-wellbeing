import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoodEntry } from './MoodTracker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MoodFactorsProps {
  entries: MoodEntry[];
}

export function MoodFactors({ entries }: MoodFactorsProps) {
  const [timeRange, setTimeRange] = useState('all');
  const [factorData, setFactorData] = useState<any[]>([]);

  const factorLabels: Record<string, string> = {
    sleep: 'Sleep Quality',
    exercise: 'Physical Activity',
    social: 'Social Interaction',
    nutrition: 'Nutrition',
    stress: 'Stress Level',
    work: 'Work/Study',
  };

  useEffect(() => {
    if (!entries.length) {
      setFactorData([]);
      return;
    }

    // Filter entries based on selected time range
    const now = new Date();
    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      if (timeRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return entryDate >= weekAgo;
      } else if (timeRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return entryDate >= monthAgo;
      }
      return true; // 'all' option
    });

    // Calculate average factor ratings
    const factorSums: Record<string, number> = {
      sleep: 0,
      exercise: 0,
      social: 0,
      nutrition: 0,
      stress: 0,
      work: 0,
    };
    
    const factorCounts: Record<string, number> = {
      sleep: 0,
      exercise: 0,
      social: 0,
      nutrition: 0,
      stress: 0,
      work: 0,
    };
    
    filteredEntries.forEach(entry => {
      Object.entries(entry.factors).forEach(([factor, value]) => {
        if (factor in factorSums) {
          factorSums[factor] += value;
          factorCounts[factor]++;
        }
      });
    });
    
    const factorAverages = Object.entries(factorSums).map(([factor, sum]) => ({
      factor,
      label: factorLabels[factor] || factor,
      average: factorCounts[factor] > 0 ? Math.round((sum / factorCounts[factor]) * 10) / 10 : 0,
    }));
    
    // Sort by average rating (descending)
    factorAverages.sort((a, b) => b.average - a.average);
    
    setFactorData(factorAverages);
  }, [entries, timeRange]);

  // Calculate correlation between each factor and mood
  const calculateCorrelations = () => {
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
        label: factorLabels[factor] || factor,
        correlation: Math.round(correlation * 100) / 100
      });
    }
    
    return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  };

  const correlations = calculateCorrelations();

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{payload[0].payload.label}</p>
          <p>Average: {payload[0].value}/5</p>
          {correlations.find(c => c.factor === payload[0].payload.factor) && (
            <p>
              Correlation with mood: {
                correlations.find(c => c.factor === payload[0].payload.factor)?.correlation
              }
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Get color based on correlation
  const getCorrelationColor = (factor: string) => {
    const correlation = correlations.find(c => c.factor === factor)?.correlation || 0;
    if (correlation > 0.5) return '#22c55e'; // Strong positive (green)
    if (correlation > 0.2) return '#84cc16'; // Moderate positive (lime)
    if (correlation > -0.2 && correlation < 0.2) return '#64748b'; // Weak/no correlation (slate)
    if (correlation > -0.5) return '#f97316'; // Moderate negative (orange)
    return '#ef4444'; // Strong negative (red)
  };

  if (!entries.length) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Mood Factors</CardTitle>
          <CardDescription>
            See how different factors affect your mood
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-muted-foreground">No mood data available yet.</p>
          <p className="text-sm text-muted-foreground">Complete your first mood check-in to see factor analysis.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Mood Factors</CardTitle>
            <CardDescription>
              See how different factors affect your mood
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={factorData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 5]} />
              <YAxis 
                type="category" 
                dataKey="label" 
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="average" name="Average Rating">
                {factorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCorrelationColor(entry.factor)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Correlation with Mood</h3>
          <div className="space-y-1">
            {correlations.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{item.label}</span>
                <div className="flex items-center">
                  <div 
                    className="w-16 h-2 rounded-full" 
                    style={{ 
                      background: `linear-gradient(to ${item.correlation >= 0 ? 'right' : 'left'}, #f3f4f6, ${getCorrelationColor(item.factor)})` 
                    }}
                  ></div>
                  <span className="text-sm ml-2" style={{ color: getCorrelationColor(item.factor) }}>
                    {item.correlation}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            Values closer to 1 or -1 indicate stronger correlations. Positive values mean the factor improves mood, negative values mean it may decrease mood.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}