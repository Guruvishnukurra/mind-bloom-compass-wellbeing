import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Heart, Plus, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface GratitudeEntry {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export function GratitudeJournal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [todayEntry, setTodayEntry] = useState<GratitudeEntry | null>(null);

  useEffect(() => {
    async function fetchEntries() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('gratitude_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(30);

        if (error) throw error;

        setEntries(data || []);

        // Check if user already has an entry for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        const todayEntry = data?.find(entry => 
          entry.created_at.startsWith(todayStr)
        );

        setTodayEntry(todayEntry || null);
      } catch (error) {
        console.error('Error fetching gratitude entries:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, [user]);

  const handleAddEntry = async () => {
    if (!user || !newEntry.trim()) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('gratitude_entries')
        .insert([
          {
            user_id: user.id,
            content: newEntry.trim(),
          }
        ])
        .select();

      if (error) throw error;

      toast.success('Gratitude entry added!');
      setNewEntry('');
      setEntries([data[0], ...entries]);
      setTodayEntry(data[0]);
    } catch (error) {
      console.error('Error adding gratitude entry:', error);
      toast.error('Failed to add entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('gratitude_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Entry deleted');
      setEntries(entries.filter(entry => entry.id !== id));
      
      // If we deleted today's entry, update the state
      if (todayEntry?.id === id) {
        setTodayEntry(null);
      }
    } catch (error) {
      console.error('Error deleting gratitude entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  if (loading) {
    return <div>Loading gratitude journal...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Gratitude Journal
          </CardTitle>
          <CardDescription>
            Take a moment each day to reflect on what you're grateful for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayEntry ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-muted-foreground">
                    Today's Entry
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteEntry(todayEntry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2">{todayEntry.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(todayEntry.created_at), 'h:mm a')}
                </p>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <Check className="h-4 w-4 inline mr-1 text-green-500" />
                You've already expressed gratitude today. Come back tomorrow!
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                placeholder="What are you grateful for today?"
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                onClick={handleAddEntry}
                disabled={saving || !newEntry.trim()}
                className="w-full"
              >
                {saving ? 'Saving...' : 'Add Gratitude Entry'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Previous Entries</CardTitle>
          <CardDescription>
            Your gratitude journey over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries.length > 0 ? (
              entries.map(entry => (
                <div
                  key={entry.id}
                  className="p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">
                      {format(new Date(entry.created_at), 'MMMM d, yyyy')}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2">{entry.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No gratitude entries yet. Start by adding your first entry!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 