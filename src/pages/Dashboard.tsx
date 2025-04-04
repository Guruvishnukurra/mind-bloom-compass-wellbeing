import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MoodTracker } from '@/components/mood/MoodTracker';
import { MoodHistory } from '@/components/mood/MoodHistory';

export function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mind Bloom</h1>
          <nav className="flex items-center gap-4">
            <Link to="/journal">
              <Button variant="ghost">Journal</Button>
            </Link>
            <Link to="/meditation">
              <Button variant="ghost">Meditation</Button>
            </Link>
            <Link to="/resources">
              <Button variant="ghost">Resources</Button>
            </Link>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" onClick={signOut}>Sign Out</Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-8">
          <MoodTracker />
          <MoodHistory />
        </div>
      </main>
    </div>
  );
} 