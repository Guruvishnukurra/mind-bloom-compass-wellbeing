import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuotes } from "@/hooks/useQuotes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeditationList } from "@/components/meditation/MeditationList";
import JournalList from "@/components/journal/JournalList";
import { AchievementsList } from "@/components/achievements/AchievementsList";
import { ResourcesList } from "@/components/resources/ResourcesList";
import { OpenAIChatBot } from "@/components/chat/OpenAIChatBot";
import { Calendar, Brain, BookOpen, Trophy, Quote, ChevronRight, BarChart2, Loader2, Heart, CheckSquare, MessageSquare, Home, Inbox, Layout, TrendingUp, Building2, CreditCard, Link2, Target } from "lucide-react";

// Sidebar navigation items
const sidebarItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Inbox, label: "Inbox", href: "/inbox" },
  { icon: BarChart2, label: "Reports", href: "/reports" },
];

const analyticsItems = [
  { icon: Layout, label: "Dashboard", href: "/dashboard" },
  { icon: TrendingUp, label: "Trends", href: "/trends" },
  { icon: Target, label: "Campaigns", href: "/campaigns" },
];

const settingsItems = [
  { icon: Building2, label: "Company", href: "/company" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: Link2, label: "Integrations", href: "/integrations" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const quote = useQuotes();
  const [isLoading, setIsLoading] = useState(true);
  const [streakCount, setStreakCount] = useState(7); // Example streak count

  useEffect(() => {
    // Simulate loading time for components to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const SidebarItem = ({ icon: Icon, label, href }: { icon: any; label: string; href: string }) => (
    <Button
      variant="ghost"
      className="w-full justify-start gap-2 font-normal hover:bg-slate-100"
      onClick={() => navigate(href)}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-foreground mb-2">Mind Bloom</h1>
          <p className="text-sm text-muted-foreground">Wellness Dashboard</p>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 px-2">MENU</p>
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <SidebarItem key={item.label} {...item} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 px-2">ANALYTICS</p>
            <div className="space-y-1">
              {analyticsItems.map((item) => (
                <SidebarItem key={item.label} {...item} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 px-2">SETTINGS</p>
            <div className="space-y-1">
              {settingsItems.map((item) => (
                <SidebarItem key={item.label} {...item} />
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <Button variant="outline" className="w-full">
            Profile
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background">
        <div className="p-8 max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Welcome back, {user?.email ? user.email.split("@")[0] : 'Guest'}
                </h1>
                <p className="text-muted-foreground">How are you feeling today?</p>
              </div>
              <div className="bg-primary/10 px-4 py-2 rounded-full flex items-center gap-2">
                <span className="text-primary font-medium">{streakCount} day streak! ⚡</span>
              </div>
            </div>
          </div>

          {/* Daily Quote */}
          <Card className="mb-8 p-6 bg-card">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-foreground mb-2">Daily Quote</h3>
                <p className="text-muted-foreground italic">"{quote?.text || 'The only way to do great work is to love what you do.'}"</p>
              </div>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </Card>

          {/* Activity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Meditate Card */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Meditate</h3>
                  <p className="text-sm text-muted-foreground">12 minutes today</p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </Card>

            {/* Habits Card */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-secondary/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Habits</h3>
                  <p className="text-sm text-muted-foreground">3/4 completed</p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div className="bg-secondary h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </Card>

            {/* Need Help Card */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-accent/10 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">Chat with us</p>
                </div>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Call Helpline
              </Button>
            </Card>
          </div>

          {/* Today's Mood */}
          <Card className="mb-8 p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Today's Mood</h3>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 py-8 hover:bg-primary/10">
                <span className="text-2xl">😊</span>
                <span className="ml-2 text-foreground">Great</span>
              </Button>
              <Button variant="outline" className="flex-1 py-8 hover:bg-primary/10">
                <span className="text-2xl">😐</span>
                <span className="ml-2 text-foreground">Okay</span>
              </Button>
              <Button variant="outline" className="flex-1 py-8 hover:bg-primary/10">
                <span className="text-2xl">😔</span>
                <span className="ml-2 text-foreground">Down</span>
              </Button>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="mb-8 p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Achievements</h3>
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-lg text-center">
                <Trophy className="h-6 w-6 text-primary mx-auto mb-2" />
                <span className="text-sm text-foreground">Meditation Master</span>
              </div>
              <div className="bg-secondary/10 p-3 rounded-lg text-center">
                <Trophy className="h-6 w-6 text-secondary mx-auto mb-2" />
                <span className="text-sm text-foreground">Streak Champion</span>
              </div>
              <div className="bg-accent/10 p-3 rounded-lg text-center">
                <Trophy className="h-6 w-6 text-accent mx-auto mb-2" />
                <span className="text-sm text-foreground">Early Bird</span>
              </div>
            </div>
          </Card>

          {/* Chat Support */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Chat Support</h3>
            <div className="bg-muted p-4 rounded-lg">
              <input
                type="text"
                placeholder="Type your message here..."
                className="w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}