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
import { Calendar, Brain, BookOpen, Trophy, Quote, ChevronRight, BarChart2, Loader2, Heart, CheckSquare, MessageSquare } from "lucide-react";

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
    <div className="min-h-screen p-4 space-y-6">
      {/* Header with animated gradient text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 container mx-auto"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-warm-yellow-500 to-soft-teal-500 bg-clip-text text-transparent font-heading">
          Mind Bloom
        </h1>
        <p className="text-deep-slate-800/80 mt-2 font-body">Your journey to mental wellness</p>
      </motion.div>
      
      {/* Daily Quote Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-3xl p-6 mb-8 container mx-auto shadow-md border border-warm-yellow-200"
        style={{
          backgroundImage: "url('/yoga-inspo.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Semi-transparent overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-warm-yellow-50/80 to-warm-yellow-100/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-r from-soft-teal-200/20 to-warm-yellow-200/20 opacity-50" />
        <div className="absolute inset-0 opacity-10 animate-float" />
        <div className="relative z-10">
          <h3 className="text-xl font-medium mb-2 flex items-center gap-2 font-heading text-deep-slate-800 text-shadow-sm">
            <Quote className="w-5 h-5 text-terracotta-500 animate-bounce-gentle" />
            Daily Inspiration
          </h3>
          <p className="italic text-2xl font-accent text-deep-slate-800 text-shadow-sm font-semibold">{quote?.text || "The journey of a thousand miles begins with a single step."}</p>
          <p className="text-sm text-deep-slate-700/90 mt-2 font-accent font-medium">— {quote?.author || "Lao Tzu"}</p>
        </div>
      </motion.div>



      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-3xl shadow-md bg-gradient-to-br from-white to-warm-yellow-50 border border-warm-yellow-200"
      >
        <h2 className="text-2xl font-semibold mb-2 font-heading text-deep-slate-800">
          Welcome back, {user?.email ? user.email.split("@")[0] : 'Guest'}
        </h2>
        <p className="text-deep-slate-800/70 font-body">Continue your wellness journey today</p>
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
          className="w-full py-8 bg-gradient-to-r from-primary-blue-500 to-dark-blue-600 hover:from-primary-blue-600 hover:to-dark-blue-700 text-white flex items-center justify-center gap-3 text-lg font-medium rounded-3xl shadow-lg"
          onClick={() => navigate("/meditation")}
        >
          <Brain className="w-7 h-7" />
          <span className="inline-block">Start Meditation Session</span>
        </Button>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="container mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-br from-cream-50 to-white rounded-xl shadow-md border border-sage-100">
          <Button
            variant="ghost"
            className="h-28 flex flex-col items-center justify-center gap-3 hover:bg-deep-ocean-50 rounded-xl transition-all duration-300 group border border-transparent hover:border-deep-ocean-100"
            onClick={() => navigate("/meditation")}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-deep-ocean-400 to-deep-ocean-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Brain className="w-8 h-8 text-white group-hover:animate-pulse-slow" />
            </div>
            <span className="font-heading text-deep-ocean-600">Meditation</span>
          </Button>
          <Button
            variant="ghost"
            className="h-28 flex flex-col items-center justify-center gap-3 hover:bg-sage-50 rounded-xl transition-all duration-300 group border border-transparent hover:border-sage-100"
            onClick={() => navigate("/journal")}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <BookOpen className="w-8 h-8 text-white group-hover:animate-pulse-slow" />
            </div>
            <span className="font-heading text-deep-ocean-600">Journal</span>
          </Button>
          <Button
            variant="ghost"
            className="h-28 flex flex-col items-center justify-center gap-3 hover:bg-gold-50 rounded-xl transition-all duration-300 group border border-transparent hover:border-gold-100"
            onClick={() => navigate("/achievements")}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Trophy className="w-8 h-8 text-white group-hover:animate-pulse-slow" />
            </div>
            <span className="font-heading text-deep-ocean-600">Achievements</span>
          </Button>
          <Button
            variant="ghost"
            className="h-28 flex flex-col items-center justify-center gap-3 hover:bg-lavender-50 rounded-xl transition-all duration-300 group border border-transparent hover:border-lavender-100"
            onClick={() => navigate("/mood")}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-lavender-400 to-lavender-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <BarChart2 className="w-8 h-8 text-white group-hover:animate-pulse-slow" />
            </div>
            <span className="font-heading text-deep-ocean-600">Mood Tracking</span>
          </Button>
          <Button
            variant="ghost"
            className="h-28 flex flex-col items-center justify-center gap-3 hover:bg-terracotta-50 rounded-xl transition-all duration-300 group border border-transparent hover:border-terracotta-100"
            onClick={() => navigate("/habits")}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-terracotta-400 to-terracotta-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <CheckSquare className="w-8 h-8 text-white group-hover:animate-pulse-slow" />
            </div>
            <span className="font-heading text-deep-ocean-600">Habit Builder</span>
          </Button>
          <Button
            variant="ghost"
            className="h-28 flex flex-col items-center justify-center gap-3 hover:bg-deep-ocean-50 rounded-xl transition-all duration-300 group border border-transparent hover:border-deep-ocean-100"
            onClick={() => navigate("/chat")}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-deep-ocean-300 to-lavender-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <MessageSquare className="w-8 h-8 text-white group-hover:animate-pulse-slow" />
            </div>
            <span className="font-heading text-deep-ocean-600">Chat Assistant</span>
          </Button>
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <Card className="p-6 border-sage-200 shadow-md bg-gradient-to-br from-cream-50 to-white">
          <h2 className="text-xl font-bold mb-4 font-heading text-deep-ocean-600">Your Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-sage-50 to-sage-100 rounded-lg p-4 text-center border border-sage-200 shadow-sm">
              <div className="text-3xl font-bold text-sage-600 mb-2">250</div>
              <div className="text-sm text-deep-ocean-600/70">Wellness Points</div>
            </div>
            <div className="bg-gradient-to-br from-lavender-50 to-lavender-100 rounded-lg p-4 text-center border border-lavender-200 shadow-sm">
              <div className="text-3xl font-bold text-lavender-600 mb-2">5</div>
              <div className="text-sm text-deep-ocean-600/70">Day Streak</div>
            </div>
            <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-lg p-4 text-center border border-gold-200 shadow-sm">
              <div className="text-3xl font-bold text-gold-600 mb-2">8</div>
              <div className="text-sm text-deep-ocean-600/70">Badges Earned</div>
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
            <TabsTrigger value="meditation" className="data-[state=active]:bg-deep-ocean-500/10 data-[state=active]:text-deep-ocean-600">
              Meditation
            </TabsTrigger>
            <TabsTrigger value="journal" className="data-[state=active]:bg-sage-500/10 data-[state=active]:text-sage-600">
              Journal
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-gold-500/10 data-[state=active]:text-gold-600">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-lavender-500/10 data-[state=active]:text-lavender-600">
              Resources
            </TabsTrigger>
          </TabsList>
          <TabsContent value="meditation" className="space-y-4">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Meditations</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate("/meditation")} className="text-deep-ocean-600 hover:text-deep-ocean-700">
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
                <Button variant="ghost" size="sm" onClick={() => navigate("/journal")} className="text-sage-600 hover:text-sage-700">
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
                <Button variant="ghost" size="sm" onClick={() => navigate("/achievements")} className="text-gold-600 hover:text-gold-700">
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
                <Button variant="ghost" size="sm" onClick={() => navigate("/resources")} className="text-lavender-600 hover:text-lavender-700">
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
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-terracotta-50 to-cream-100 p-6 mt-8 border border-terracotta-200 shadow-md"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-terracotta-100/20 to-lavender-100/20 opacity-50" />
        <div className="relative z-10">
          <h3 className="text-xl font-medium mb-4 flex items-center gap-2 font-heading text-deep-ocean-600">
            <Heart className="w-6 h-6 text-terracotta-500 fill-terracotta-200" />
            Mental Health Helplines
          </h3>
          <div className="space-y-3">
            <p className="flex items-center gap-2 bg-white/50 p-2 rounded-lg border border-terracotta-100">
              <span className="font-medium text-deep-ocean-600">NIMHANS:</span> 
              <span className="text-deep-ocean-600/80">080-46110007</span>
            </p>
            <p className="flex items-center gap-2 bg-white/50 p-2 rounded-lg border border-terracotta-100">
              <span className="font-medium text-deep-ocean-600">Vandrevala Foundation:</span> 
              <span className="text-deep-ocean-600/80">9999-666-555</span>
            </p>
            <p className="flex items-center gap-2 bg-white/50 p-2 rounded-lg border border-terracotta-100">
              <span className="font-medium text-deep-ocean-600">iCall:</span> 
              <span className="text-deep-ocean-600/80">022-25521111</span>
            </p>
            <p className="text-sm text-deep-ocean-600/70 mt-2 bg-white/70 p-2 rounded-lg border border-terracotta-100">
              These helplines provide free counseling and support 24/7
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}