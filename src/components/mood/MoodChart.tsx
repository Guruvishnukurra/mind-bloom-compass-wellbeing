import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export interface MoodEntry {
  id: string;
  user_id: string;
  mood_score: number;
  notes: string;
  factors: Record<string, number>;
  created_at: string;
}
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface MoodChartProps {
  entries: MoodEntry[];
}

export function MoodChart({ entries }: MoodChartProps) {
  const [timeRange, setTimeRange] = useState('week');
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    if (!entries.length) {
      setChartData([]);
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
      } else if (timeRange === 'year') {
        const yearAgo = new Date();
        yearAgo.setFullYear(now.getFullYear() - 1);
        return entryDate >= yearAgo;
      }
      return true; // 'all' option
    });

    // Format data for charts
    if (timeRange === 'week' || timeRange === 'month') {
      // Daily data points
      const dailyData: Record<string, any> = {};
      
      filteredEntries.forEach(entry => {
        const date = new Date(entry.created_at);
        const dateStr = date.toISOString().split('T')[0];
        
        if (!dailyData[dateStr]) {
          dailyData[dateStr] = {
            date: dateStr,
            mood: entry.mood_score,
            sleep: entry.factors.sleep,
            exercise: entry.factors.exercise,
            social: entry.factors.social,
            nutrition: entry.factors.nutrition,
            stress: entry.factors.stress,
            work: entry.factors.work,
          };
        }
      });
      
      // Convert to array and sort by date
      const formattedData = Object.values(dailyData).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      setChartData(formattedData);
    } else {
      // Monthly averages for year view
      const monthlyData: Record<string, any> = {};
      
      filteredEntries.forEach(entry => {
        const date = new Date(entry.created_at);
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthStr]) {
          monthlyData[monthStr] = {
            date: monthStr,
            mood: entry.mood_score,
            count: 1,
            sleep: entry.factors.sleep,
            exercise: entry.factors.exercise,
            social: entry.factors.social,
            nutrition: entry.factors.nutrition,
            stress: entry.factors.stress,
            work: entry.factors.work,
          };
        } else {
          monthlyData[monthStr].mood += entry.mood_score;
          monthlyData[monthStr].sleep += entry.factors.sleep;
          monthlyData[monthStr].exercise += entry.factors.exercise;
          monthlyData[monthStr].social += entry.factors.social;
          monthlyData[monthStr].nutrition += entry.factors.nutrition;
          monthlyData[monthStr].stress += entry.factors.stress;
          monthlyData[monthStr].work += entry.factors.work;
          monthlyData[monthStr].count += 1;
        }
      });
      
      // Calculate averages
      Object.keys(monthlyData).forEach(month => {
        const data = monthlyData[month];
        data.mood = Math.round((data.mood / data.count) * 10) / 10;
        data.sleep = Math.round((data.sleep / data.count) * 10) / 10;
        data.exercise = Math.round((data.exercise / data.count) * 10) / 10;
        data.social = Math.round((data.social / data.count) * 10) / 10;
        data.nutrition = Math.round((data.nutrition / data.count) * 10) / 10;
        data.stress = Math.round((data.stress / data.count) * 10) / 10;
        data.work = Math.round((data.work / data.count) * 10) / 10;
      });
      
      // Convert to array and sort by date
      const formattedData = Object.values(monthlyData).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      setChartData(formattedData);
    }
  }, [entries, timeRange]);

  const formatXAxis = (tickItem: string) => {
    if (timeRange === 'week' || timeRange === 'month') {
      // For daily view, show day of month
      const date = new Date(tickItem);
      return date.getDate();
    } else {
      // For monthly view, show month abbreviation
      const [year, month] = tickItem.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleString('default', { month: 'short' });
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{formattedDate}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ color: item.color }}>
              {item.name}: {item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Mood Trends</CardTitle>
            <CardDescription>
              Track how your mood changes over time
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Tabs value={chartType} onValueChange={setChartType} className="w-[140px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-muted-foreground">No mood data available yet.</p>
            <p className="text-sm text-muted-foreground">Complete your first mood check-in to see trends.</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatXAxis}
                    minTickGap={15}
                  />
                  <YAxis domain={[0, 5]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    name="Mood"
                  />
                  <Line type="monotone" dataKey="sleep" stroke="#82ca9d" name="Sleep" />
                  <Line type="monotone" dataKey="exercise" stroke="#ffc658" name="Exercise" />
                  <Line type="monotone" dataKey="social" stroke="#ff8042" name="Social" />
                </LineChart>
              ) : (
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatXAxis}
                    minTickGap={15}
                  />
                  <YAxis domain={[0, 5]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="mood" fill="#8884d8" name="Mood" />
                  <Bar dataKey="sleep" fill="#82ca9d" name="Sleep" />
                  <Bar dataKey="exercise" fill="#ffc658" name="Exercise" />
                  <Bar dataKey="social" fill="#ff8042" name="Social" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}