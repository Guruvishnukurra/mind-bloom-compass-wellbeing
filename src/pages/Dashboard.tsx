import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoodTracker } from '@/components/mood/MoodTracker';
import { MoodHistory } from '@/components/mood/MoodHistory';
import { MeditationList } from '@/components/meditation/MeditationList';
import { JournalEntries } from '@/components/journal/JournalEntries';
import { WellbeingScore } from '@/components/analytics/WellbeingScore';
import { Calendar, Brain, BookOpen, Heart, Activity, Award, Sparkles } from 'lucide-react';
import { getRandomQuote } from '@/utils/quotes';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const quote = getRandomQuote();

  return (
    <div className="container mx-auto px-4 py-8">
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

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="tranquil-heading text-3xl mb-2">
          Welcome back, {user?.user_metadata?.full_name || "Friend"}!
        </h1>
        <p className="tranquil-text text-lg">
          {quote.text} - {quote.author}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/meditation">
          <Card className="tranquil-card hover:border-wellness-blue cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-wellness-blue/10 rounded-full">
                <Brain className="w-6 h-6 text-wellness-blue" />
              </div>
              <div>
                <h3 className="tranquil-heading">Meditate</h3>
                <p className="tranquil-text">Find your inner peace</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/journal">
          <Card className="tranquil-card hover:border-wellness-green cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-wellness-green/10 rounded-full">
                <BookOpen className="w-6 h-6 text-wellness-green" />
              </div>
              <div>
                <h3 className="tranquil-heading">Journal</h3>
                <p className="tranquil-text">Express your thoughts</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/mood">
          <Card className="tranquil-card hover:border-wellness-lavender cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-wellness-lavender/10 rounded-full">
                <Heart className="w-6 h-6 text-wellness-lavender" />
              </div>
              <div>
                <h3 className="tranquil-heading">Track Mood</h3>
                <p className="tranquil-text">Monitor your emotions</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="mood" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mood" className="tranquil-text">
            Mood
          </TabsTrigger>
          <TabsTrigger value="meditation" className="tranquil-text">
            Meditation
          </TabsTrigger>
          <TabsTrigger value="journal" className="tranquil-text">
            Journal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mood" className="space-y-4">
          <Card className="tranquil-card">
            <h2 className="tranquil-heading text-xl mb-4">Your Mood Journey</h2>
            <MoodTracker />
          </Card>
        </TabsContent>

        <TabsContent value="meditation" className="space-y-4">
          <Card className="tranquil-card">
            <h2 className="tranquil-heading text-xl mb-4">Recent Meditations</h2>
            <MeditationList limit={5} />
          </Card>
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <Card className="tranquil-card">
            <h2 className="tranquil-heading text-xl mb-4">Recent Journal Entries</h2>
            <JournalEntries limit={5} />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievements Section */}
      <div className="mt-8">
        <Card className="tranquil-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="tranquil-heading text-xl">Your Progress</h2>
            <Link to="/achievements">
              <Button variant="ghost" className="tranquil-text">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-wellness-blue/5 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-wellness-blue" />
                <h3 className="tranquil-heading">Meditation Streak</h3>
              </div>
              <p className="tranquil-text">5 days</p>
            </div>
            <div className="p-4 bg-wellness-green/5 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="w-5 h-5 text-wellness-green" />
                <h3 className="tranquil-heading">Journal Entries</h3>
              </div>
              <p className="tranquil-text">12 this month</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 