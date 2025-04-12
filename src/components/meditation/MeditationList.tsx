import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Brain, Clock } from "lucide-react";

interface MeditationSession {
  id: string;
  created_at: string;
  duration: number;
  type: string;
  notes?: string;
}

interface MeditationListProps {
  limit?: number;
}

export function MeditationList({ limit = 5 }: MeditationListProps) {
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("meditation_sessions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) throw error;
        setSessions(data || []);
      } catch (error) {
        console.error("Error fetching meditation sessions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, [limit]);

  if (loading) {
    return <div className="tranquil-text">Loading meditation sessions...</div>;
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <Brain className="w-12 h-12 text-wellness-blue/20 mx-auto mb-4" />
        <p className="tranquil-text">No meditation sessions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id} className="tranquil-card">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-wellness-blue" />
                <h3 className="tranquil-heading">{session.type}</h3>
              </div>
              <div className="flex items-center space-x-2 text-wellness-blue/70">
                <Clock className="w-4 h-4" />
                <span className="tranquil-text">{session.duration} minutes</span>
              </div>
            </div>
            {session.notes && (
              <p className="tranquil-text text-sm mt-2">{session.notes}</p>
            )}
            <p className="tranquil-text text-xs mt-2">
              {new Date(session.created_at).toLocaleDateString()}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
} 