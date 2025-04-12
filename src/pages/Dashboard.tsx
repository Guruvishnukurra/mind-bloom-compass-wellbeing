import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuotes } from "@/hooks/useQuotes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeditationList } from "@/components/meditation/MeditationList";
import JournalList from "@/components/journal/JournalList";
import { AchievementsList } from "@/components/achievements/AchievementsList";
import { Calendar, Brain, BookOpen, Trophy, Quote, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const quote = useQuotes();

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with animated gradient text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-wellness-blue via-wellness-lavender to-wellness-teal bg-clip-text text-transparent">
          Mind Bloom
        </h1>
        <p className="text-muted-foreground mt-2">Your journey to mental wellness</p>
      </motion.div>

      {/* Featured Quote Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-xl glass-effect p-6 mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-wellness-blue/20 to-wellness-lavender/20" />
        <div className="relative z-10">
          <Quote className="w-8 h-8 text-wellness-lavender mb-4" />
          <p className="text-xl font-medium mb-2">{quote.text}</p>
          <p className="text-muted-foreground">- {quote.author}</p>
        </div>
      </motion.div>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="tranquil-card p-6"
      >
        <h2 className="text-2xl font-semibold mb-2">Welcome back, {user?.email?.split("@")[0]}</h2>
        <p className="text-muted-foreground">Continue your wellness journey today</p>
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
          className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-wellness-blue/10 hover:border-wellness-blue transition-all duration-300"
          onClick={() => navigate("/meditation")}
        >
          <Brain className="w-6 h-6 text-wellness-blue" />
          <span>Meditate</span>
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
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs defaultValue="meditation" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="meditation" className="data-[state=active]:bg-wellness-blue/10 data-[state=active]:text-wellness-blue">
              Meditation
            </TabsTrigger>
            <TabsTrigger value="journal" className="data-[state=active]:bg-wellness-green/10 data-[state=active]:text-wellness-green">
              Journal
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-wellness-amber/10 data-[state=active]:text-wellness-amber">
              Achievements
            </TabsTrigger>
          </TabsList>
          <TabsContent value="meditation" className="space-y-4">
            <Card className="p-4">
              <MeditationList limit={3} />
            </Card>
          </TabsContent>
          <TabsContent value="journal" className="space-y-4">
            <Card className="p-4">
              <JournalList limit={3} />
            </Card>
          </TabsContent>
          <TabsContent value="achievements" className="space-y-4">
            <Card className="p-4">
              <AchievementsList />
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}