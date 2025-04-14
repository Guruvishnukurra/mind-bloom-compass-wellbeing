import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { BookOpen, Calendar } from "lucide-react";

interface JournalEntry {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  tags: string[] | null;
  sentiment_score: number | null;
}

interface JournalEntriesProps {
  limit?: number;
}

export function JournalEntries({ limit = 5 }: JournalEntriesProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("journal_entries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) throw error;
        setEntries(data || []);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, [limit]);

  if (loading) {
    return <div className="tranquil-text">Loading journal entries...</div>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="w-12 h-12 text-wellness-blue/20 mx-auto mb-4" />
        <p className="tranquil-text">No journal entries yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry.id} className="tranquil-card">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-wellness-blue" />
                <h3 className="tranquil-heading">{entry.title}</h3>
              </div>
              <div className="flex items-center space-x-2 text-wellness-blue/70">
                <Calendar className="w-4 h-4" />
                <span className="tranquil-text">
                  {new Date(entry.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="tranquil-text text-sm mt-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: entry.content.substring(0, 150) + (entry.content.length > 150 ? '...' : '') }} />
            <div className="mt-2 flex flex-wrap gap-2">
              {entry.sentiment_score !== null && (
                <span className="text-xs bg-wellness-blue/10 text-wellness-blue px-2 py-1 rounded-full">
                  Sentiment: {entry.sentiment_score.toFixed(1)}
                </span>
              )}
              {entry.tags && entry.tags.map(tag => (
                <span key={tag} className="text-xs bg-wellness-lavender/10 text-wellness-lavender px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 