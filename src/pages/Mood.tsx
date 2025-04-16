import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoodTracker } from '@/components/mood/MoodTracker';
import { MoodChart } from '@/components/mood/MoodChart';
import { MoodCalendar } from '@/components/mood/MoodCalendar';
import { MoodInsights } from '@/components/mood/MoodInsights';
import { MoodFactors } from '@/components/mood/MoodFactors';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function Mood() {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMoodEntries();
    }
  }, [user]);

  const fetchMoodEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Check if the mood_entries table exists
      const { error: tableCheckError } = await supabase
        .from('mood_entries')
        .select('id')
        .limit(1);
        
      if (tableCheckError) {
        console.warn('Mood entries table may not exist yet:', tableCheckError.message);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching mood entries:', error);
      } else {
        // Transform the data to match the expected MoodEntry format
        const transformedData = (data || []).map(entry => {
          // Check if the entry has the expected structure
          if (!entry.factors && entry.mood_score) {
            // Create a default factors object if it doesn't exist
            return {
              ...entry,
              factors: {
                sleep: 3,
                exercise: 3,
                social: 3,
                nutrition: 3,
                stress: 3,
                work: 3
              }
            };
          }
          return entry;
        });
        
        setMoodEntries(transformedData);
      }
    } catch (error) {
      console.error('Exception fetching mood entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSaved = () => {
    fetchMoodEntries();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mood Tracking</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <MoodTracker onMoodSaved={handleMoodSaved} />
          </div>
          <div className="lg:col-span-2">
            <Tabs defaultValue="chart" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chart">Trends</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                <MoodChart entries={moodEntries} />
              </TabsContent>
              <TabsContent value="calendar">
                <MoodCalendar entries={moodEntries} />
              </TabsContent>
              <TabsContent value="insights">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MoodInsights entries={moodEntries} />
                  <MoodFactors entries={moodEntries} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}