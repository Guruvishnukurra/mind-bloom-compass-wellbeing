import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

interface MoodEntry {
  created_at: string;
  mood_score: number;
  energy_level: number;
  activities: string[];
  notes: string;
}

export function MoodHistory() {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMoodHistory() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(7);

        if (error) throw error;
        setMoodData(data || []);
      } catch (error) {
        console.error('Error fetching mood history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMoodHistory();
  }, [user]);

  const chartData = moodData
    .map(entry => ({
      date: format(new Date(entry.created_at), 'MMM dd'),
      mood: entry.mood_score,
      energy: entry.energy_level
    }))
    .reverse();

  if (loading) {
    return (
      <Card>
        <CardContent className="h-[300px] flex items-center justify-center">
          Loading...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Mood History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis domain={[1, 10]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#2563eb"
                name="Mood"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="#16a34a"
                name="Energy"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 