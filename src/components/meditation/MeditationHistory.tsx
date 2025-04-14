import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface MeditationSession {
  id: string;
  user_id: string;
  meditation_type: string;
  duration: number;
  completed: boolean;
  notes: string | null;
  created_at: string;
}

export function MeditationHistory() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('meditation_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setSessions(data || []);
      } catch (error) {
        console.error('Error fetching meditation sessions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, [user]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map(session => (
            <div
              key={session.id}
              className="flex justify-between items-center p-4 rounded-lg bg-muted/50"
            >
              <div>
                <h3 className="font-medium capitalize">
                  {session.meditation_type.replace('-', ' ')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(session.created_at), 'PPp')}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">
                  {formatDuration(session.duration)}
                </span>
              </div>
            </div>
          ))}

          {sessions.length === 0 && (
            <p className="text-center text-muted-foreground">
              No meditation sessions yet. Start your first session!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 