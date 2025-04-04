import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoodTracker } from '@/components/mood/MoodTracker';
import { MoodHistory } from '@/components/mood/MoodHistory';
import { MeditationHistory } from '@/components/meditation/MeditationHistory';
import { JournalList } from '@/components/journal/JournalList';
import { WellbeingScore } from '@/components/analytics/WellbeingScore';
import { Calendar, Brain, BookOpen, Heart, Activity, Award } from 'lucide-react';

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
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold">Welcome back!</h2>
              <p className="text-muted-foreground mt-1">Track your wellbeing journey and discover new ways to improve your mental health.</p>
            </div>
            <div className="flex gap-2">
              <Link to="/meditation">
                <Button>
                  <Brain className="mr-2 h-4 w-4" />
                  Start Meditation
                </Button>
              </Link>
              <Link to="/journal">
                <Button variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Write Journal
                </Button>
              </Link>
            </div>
          </div>

          {/* Wellbeing Score */}
          <WellbeingScore />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mood Today</p>
                    <p className="text-2xl font-bold">Good</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Meditation Streak</p>
                    <p className="text-2xl font-bold">3 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Journal Entries</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Wellbeing Score</p>
                    <p className="text-2xl font-bold">7.5/10</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="mood" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="mood">
                <Activity className="mr-2 h-4 w-4" />
                Mood
              </TabsTrigger>
              <TabsTrigger value="meditation">
                <Brain className="mr-2 h-4 w-4" />
                Meditation
              </TabsTrigger>
              <TabsTrigger value="journal">
                <BookOpen className="mr-2 h-4 w-4" />
                Journal
              </TabsTrigger>
            </TabsList>
            <TabsContent value="mood" className="space-y-6">
              <MoodTracker />
              <MoodHistory />
            </TabsContent>
            <TabsContent value="meditation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meditation History</CardTitle>
                  <CardDescription>Track your meditation sessions and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <MeditationHistory />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="journal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Journal Entries</CardTitle>
                  <CardDescription>Your thoughts and reflections</CardDescription>
                </CardHeader>
                <CardContent>
                  <JournalList limit={3} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Upcoming Events / Reminders */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your scheduled wellbeing activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Daily Meditation</p>
                    <p className="text-sm text-muted-foreground">Today at 8:00 PM</p>
                  </div>
                  <Button variant="outline" size="sm">Start</Button>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Weekly Journal Review</p>
                    <p className="text-sm text-muted-foreground">Sunday at 10:00 AM</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 