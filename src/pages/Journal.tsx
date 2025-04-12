import { useState } from 'react';
import { JournalEditor } from '@/components/journal/JournalEditor';
import JournalList from '@/components/journal/JournalList';
import { Button } from '@/components/ui/button';

export function Journal() {
  const [view, setView] = useState<'write' | 'list'>('write');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Journal</h1>
          <div className="flex gap-2">
            <Button
              variant={view === 'write' ? 'default' : 'outline'}
              onClick={() => setView('write')}
            >
              Write
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              onClick={() => setView('list')}
            >
              My Entries
            </Button>
          </div>
        </div>

        {view === 'write' ? <JournalEditor /> : <JournalList />}
      </div>
    </div>
  );
} 