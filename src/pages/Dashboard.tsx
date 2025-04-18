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
import { Calendar, Brain, BookOpen, Trophy, Quote, ChevronRight, BarChart2, Loader2, Heart, CheckSquare } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const quote = useQuotes();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for components to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with animated gradient text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-wellness-light-blue via-wellness-lavender to-wellness-teal bg-clip-text text-transparent">
          Mind Bloom
        </h1>
        <p className="text-muted-foreground mt-2">Your journey to mental wellness</p>
      </motion.div>
      
      {/* Daily Quote Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-xl glass-effect p-6 mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-wellness-lavender/20 to-wellness-light-blue/20" />
        <div className="relative z-10">
          <h3 className="text-xl font-medium mb-2 flex items-center gap-2">
            <Quote className="w-5 h-5 text-wellness-light-blue" />
            Daily Inspiration
          </h3>
          <p className="italic text-lg">{quote?.text || "The journey of a thousand miles begins with a single step."}</p>
          <p className="text-sm text-muted-foreground mt-2">— {quote?.author || "Lao Tzu"}</p>
        </div>
      </motion.div>



      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="tranquil-card p-6"
      >
        <h2 className="text-2xl font-semibold mb-2">
          Welcome back, {user?.email ? user.email.split("@")[0] : 'Guest'}
        </h2>
        <p className="text-muted-foreground">Continue your wellness journey today</p>
      </motion.div>

      {/* Meditation Start Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Button
          variant="default"
          size="lg"
          className="w-full py-8 bg-wellness-light-blue hover:bg-wellness-light-blue/90 text-white flex items-center justify-center gap-3 text-lg font-medium rounded-xl shadow-lg"
          onClick={() => navigate("/meditation")}
        >
          <Brain className="w-7 h-7" />
          Start Meditation Session
        </Button>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-wellness-light-blue/10 hover:border-wellness-light-blue transition-all duration-300"
          onClick={() => navigate("/meditation")}
        >
          <Brain className="w-6 h-6 text-wellness-light-blue" />
          <span>All Meditations</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-wellness-green/10 hover:border-wellness-green transition-all duration-300"
          onClick={() => navigate("/journal")}
        >
          <BookOpen className="w-6 h-6 text-wellness-green" />
          <span>Journal</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-wellness-amber/10 hover:border-wellness-amber transition-all duration-300"
          onClick={() => navigate("/achievements")}
        >
          <Trophy className="w-6 h-6 text-wellness-amber" />
          <span>Achievements</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-wellness-purple/10 hover:border-wellness-purple transition-all duration-300"
          onClick={() => navigate("/mood")}
        >
          <BarChart2 className="w-6 h-6 text-wellness-purple" />
          <span>Mood Tracking</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-wellness-teal/10 hover:border-wellness-teal transition-all duration-300"
          onClick={() => navigate("/habits")}
        >
          <CheckSquare className="w-6 h-6 text-wellness-teal" />
          <span>Habit Builder</span>
        </Button>
      </motion.div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Your Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-wellness-teal/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-wellness-teal mb-2">250</div>
              <div className="text-sm text-muted-foreground">Wellness Points</div>
            </div>
            <div className="bg-wellness-lavender/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-wellness-lavender mb-2">5</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div className="bg-wellness-amber/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-wellness-amber mb-2">8</div>
              <div className="text-sm text-muted-foreground">Badges Earned</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Calming Sounds Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <OpenAIChatBot />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs defaultValue="meditation" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="meditation" className="data-[state=active]:bg-wellness-light-blue/10 data-[state=active]:text-wellness-light-blue">
              Meditation
            </TabsTrigger>
            <TabsTrigger value="journal" className="data-[state=active]:bg-wellness-green/10 data-[state=active]:text-wellness-green">
              Journal
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-wellness-amber/10 data-[state=active]:text-wellness-amber">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-wellness-purple/10 data-[state=active]:text-wellness-purple">
              Resources
            </TabsTrigger>
          </TabsList>
          <TabsContent value="meditation" className="space-y-4">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Meditations</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate("/meditation")} className="text-wellness-light-blue">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <MeditationList limit={3} />
            </Card>
          </TabsContent>
          <TabsContent value="journal" className="space-y-4">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Journal Entries</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate("/journal")} className="text-wellness-green">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <JournalList limit={3} />
            </Card>
          </TabsContent>
          <TabsContent value="achievements" className="space-y-4">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Achievements</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate("/achievements")} className="text-wellness-amber">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <AchievementsList limit={3} />
            </Card>
          </TabsContent>
          <TabsContent value="resources" className="space-y-4">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Featured Resources</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate("/resources")} className="text-wellness-purple">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <ResourcesList limit={3} />
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      {/* Mental Health Helpline Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative overflow-hidden rounded-xl glass-effect p-6 mt-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-wellness-purple/20 to-wellness-teal/20" />
        <div className="relative z-10">
          <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-wellness-teal" />
            Indian Mental Health Helplines
          </h3>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <span className="font-medium">NIMHANS:</span> 080-46110007
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Vandrevala Foundation:</span> 9999-666-555
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">iCall:</span> 022-25521111
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              These helplines provide free counseling and support 24/7
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}