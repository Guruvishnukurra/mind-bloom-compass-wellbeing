import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
}

export function JournalList() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEntries(data || []);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, [user]);

  if (loading) {
    return <div>Loading entries...</div>;
  }

  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <Card key={entry.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{entry.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(entry.created_at), 'PPP')}
                </p>
              </div>
              {entry.tags.length > 0 && (
                <div className="flex gap-2">
                  {entry.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary/10 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm"
              dangerouslySetInnerHTML={{ __html: entry.content }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 