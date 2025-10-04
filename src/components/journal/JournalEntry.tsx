import React, { useState } from 'react';
import { useStats } from '@/contexts/StatsContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface JournalEntryProps {
  onSave?: () => void;
}

export const JournalEntry: React.FC<JournalEntryProps> = ({ onSave }) => {
  const [content, setContent] = useState('');
  const { incrementJournalEntries } = useStats();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!content.trim()) {
      toast({
        title: 'Empty Entry',
        description: 'Please write something before saving.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Save to database or local storage
      await incrementJournalEntries();
      toast({
        title: 'Entry Saved!',
        description: 'Great job! You\'ve earned 50 points.',
      });
      setContent('');
      onSave?.();
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to save journal entry.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Journal Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="How are you feeling today? What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
          <div className="flex justify-end">
            <Button onClick={handleSave}>
              Save Entry
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 