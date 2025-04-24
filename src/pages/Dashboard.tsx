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
    <div className="min-h-screen p-4 space-y-6 bg-background">
      {/* Enhanced Header with animated gradient text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15,
          duration: 0.7 
        }}
        className="text-center mb-10 container mx-auto relative"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-warm-yellow-100/30 to-soft-teal-100/30 rounded-full blur-3xl opacity-70 transform -translate-y-1/2"></div>
        <motion.h1 
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-warm-yellow-500 via-terracotta-400 to-soft-teal-500 bg-clip-text text-transparent font-heading tracking-tight"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Mind Bloom
        </motion.h1>
        <motion.p 
          className="text-deep-slate-800/80 mt-3 font-body text-lg md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Your journey to mental wellness
        </motion.p>
      </motion.div>
      
      {/* Enhanced Daily Quote Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          delay: 0.2, 
          type: "spring", 
          stiffness: 100, 
          damping: 20 
        }}
        className="relative overflow-hidden rounded-3xl p-8 mb-10 container mx-auto shadow-lg border border-warm-yellow-200 group"
        style={{
          backgroundImage: "url('/yoga-inspo.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Enhanced layered overlays for depth and visual interest */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-warm-yellow-50/80 to-warm-yellow-100/80 backdrop-blur-sm"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-soft-teal-200/20 to-warm-yellow-200/20 opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)]" />
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 30%, rgba(255, 206, 60, 0.15), transparent 70%)",
              "radial-gradient(circle at 70% 60%, rgba(255, 206, 60, 0.15), transparent 70%)",
              "radial-gradient(circle at 40% 80%, rgba(255, 206, 60, 0.15), transparent 70%)",
              "radial-gradient(circle at 20% 30%, rgba(255, 206, 60, 0.15), transparent 70%)"
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="relative z-10 py-2">
          <motion.div 
            className="flex items-center gap-2 mb-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white/30 backdrop-blur-md p-2 rounded-full shadow-sm">
              <Quote className="w-5 h-5 text-terracotta-500 animate-bounce-gentle" />
            </div>
            <h3 className="text-xl font-medium font-heading text-deep-slate-800 text-shadow-sm">
              Daily Inspiration
            </h3>
          </motion.div>
          
          <motion.div
            className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30 shadow-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <p className="italic text-2xl md:text-3xl font-accent text-deep-slate-800 text-shadow-sm font-semibold leading-relaxed">
              {quote?.text || "The journey of a thousand miles begins with a single step."}
            </p>
            <p className="text-sm text-deep-slate-700/90 mt-3 font-accent font-medium text-right pr-4">
              — {quote?.author || "Lao Tzu"}
            </p>
          </motion.div>
        </div>
      </motion.div>



      {/* Enhanced Welcome Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          delay: 0.3,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="p-7 rounded-3xl shadow-lg bg-gradient-to-br from-white via-warm-yellow-50 to-cream-100 border border-warm-yellow-200 relative overflow-hidden"
        whileHover={{ 
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
          transition: { duration: 0.2 }
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-warm-yellow-200/20 to-soft-teal-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-terracotta-200/20 to-lavender-200/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="bg-gradient-to-br from-warm-yellow-100 to-warm-yellow-200 p-2 rounded-full shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warm-yellow-600">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-heading text-deep-slate-800 bg-gradient-to-r from-deep-slate-800 to-deep-slate-600 bg-clip-text text-transparent">
              Welcome back, {user?.email ? user.email.split("@")[0] : 'Guest'}
            </h2>
          </motion.div>
          
          <motion.p 
            className="text-deep-slate-800/70 font-body ml-10 border-l-2 border-warm-yellow-300 pl-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Continue your wellness journey today with personalized activities
          </motion.p>
        </div>
      </motion.div>

      {/* Enhanced Meditation Start Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          delay: 0.4,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="mb-8 relative"
      >
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-primary-blue-500/20 blur-3xl rounded-full transform scale-90 -z-10"></div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative"
        >
          <Button
            variant="default"
            size="lg"
            className="w-full py-9 bg-gradient-to-r from-primary-blue-500 via-deep-ocean-500 to-dark-blue-600 hover:from-primary-blue-600 hover:via-deep-ocean-600 hover:to-dark-blue-700 text-white flex items-center justify-center gap-4 text-xl font-medium rounded-3xl shadow-xl border border-primary-blue-400/30 relative overflow-hidden group"
            onClick={() => navigate("/meditation")}
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_70%)]"></div>
            <motion.div 
              className="absolute inset-0 opacity-20"
              animate={{ 
                background: [
                  "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15), transparent 60%)",
                  "radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.15), transparent 60%)",
                  "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15), transparent 60%)"
                ]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300 shadow-inner">
              <Brain className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="inline-block relative">
              Start Meditation Session
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-white/40 rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Enhanced Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 0.4,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="container mx-auto"
      >
        <div className="relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-sage-100/50 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-lavender-100/50 rounded-full blur-3xl"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gradient-to-br from-cream-50 via-white to-warm-yellow-50/50 rounded-2xl shadow-lg border border-sage-100 backdrop-blur-sm relative z-10">
            <div className="col-span-1 md:col-span-3 mb-2">
              <h3 className="text-xl font-semibold text-deep-slate-800 font-heading flex items-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-warm-yellow-400 to-terracotta-400 rounded-full"></div>
                Wellness Activities
              </h3>
            </div>
            
            {/* Meditation Button */}
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative"
            >
              <Button
                variant="ghost"
                className="h-32 w-full flex flex-col items-center justify-center gap-3 hover:bg-deep-ocean-50/80 rounded-xl transition-all duration-300 group border border-transparent hover:border-deep-ocean-100 shadow-sm hover:shadow-md backdrop-blur-sm"
                onClick={() => navigate("/meditation")}
              >
                <div className="absolute inset-0 bg-deep-ocean-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-18 h-18 rounded-full bg-gradient-to-br from-deep-ocean-400 to-deep-ocean-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg p-4 relative">
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-ping-slow opacity-70"></div>
                  <Brain className="w-9 h-9 text-white group-hover:animate-pulse-slow" />
                </div>
                <span className="font-heading text-deep-ocean-600 text-lg mt-2 group-hover:font-medium transition-all duration-300">Meditation</span>
                <span className="text-xs text-deep-ocean-400/70 max-w-[80%] text-center">Find peace with guided sessions</span>
              </Button>
            </motion.div>
            
            {/* Journal Button */}
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative"
            >
              <Button
                variant="ghost"
                className="h-32 w-full flex flex-col items-center justify-center gap-3 hover:bg-sage-50/80 rounded-xl transition-all duration-300 group border border-transparent hover:border-sage-100 shadow-sm hover:shadow-md backdrop-blur-sm"
                onClick={() => navigate("/journal")}
              >
                <div className="absolute inset-0 bg-sage-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-18 h-18 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg p-4 relative">
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-ping-slow opacity-70"></div>
                  <BookOpen className="w-9 h-9 text-white group-hover:animate-pulse-slow" />
                </div>
                <span className="font-heading text-deep-ocean-600 text-lg mt-2 group-hover:font-medium transition-all duration-300">Journal</span>
                <span className="text-xs text-sage-600/70 max-w-[80%] text-center">Record your thoughts and feelings</span>
              </Button>
            </motion.div>
            
            {/* Achievements Button */}
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative"
            >
              <Button
                variant="ghost"
                className="h-32 w-full flex flex-col items-center justify-center gap-3 hover:bg-gold-50/80 rounded-xl transition-all duration-300 group border border-transparent hover:border-gold-100 shadow-sm hover:shadow-md backdrop-blur-sm"
                onClick={() => navigate("/achievements")}
              >
                <div className="absolute inset-0 bg-gold-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-18 h-18 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg p-4 relative">
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-ping-slow opacity-70"></div>
                  <Trophy className="w-9 h-9 text-white group-hover:animate-pulse-slow" />
                </div>
                <span className="font-heading text-deep-ocean-600 text-lg mt-2 group-hover:font-medium transition-all duration-300">Achievements</span>
                <span className="text-xs text-gold-600/70 max-w-[80%] text-center">Track your wellness milestones</span>
              </Button>
            </motion.div>
            
            {/* Mood Tracking Button */}
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative"
            >
              <Button
                variant="ghost"
                className="h-32 w-full flex flex-col items-center justify-center gap-3 hover:bg-lavender-50/80 rounded-xl transition-all duration-300 group border border-transparent hover:border-lavender-100 shadow-sm hover:shadow-md backdrop-blur-sm"
                onClick={() => navigate("/mood")}
              >
                <div className="absolute inset-0 bg-lavender-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-18 h-18 rounded-full bg-gradient-to-br from-lavender-400 to-lavender-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg p-4 relative">
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-ping-slow opacity-70"></div>
                  <BarChart2 className="w-9 h-9 text-white group-hover:animate-pulse-slow" />
                </div>
                <span className="font-heading text-deep-ocean-600 text-lg mt-2 group-hover:font-medium transition-all duration-300">Mood Tracking</span>
                <span className="text-xs text-lavender-600/70 max-w-[80%] text-center">Monitor your emotional wellbeing</span>
              </Button>
            </motion.div>
            
            {/* Habit Builder Button */}
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative"
            >
              <Button
                variant="ghost"
                className="h-32 w-full flex flex-col items-center justify-center gap-3 hover:bg-terracotta-50/80 rounded-xl transition-all duration-300 group border border-transparent hover:border-terracotta-100 shadow-sm hover:shadow-md backdrop-blur-sm"
                onClick={() => navigate("/habits")}
              >
                <div className="absolute inset-0 bg-terracotta-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-18 h-18 rounded-full bg-gradient-to-br from-terracotta-400 to-terracotta-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg p-4 relative">
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-ping-slow opacity-70"></div>
                  <CheckSquare className="w-9 h-9 text-white group-hover:animate-pulse-slow" />
                </div>
                <span className="font-heading text-deep-ocean-600 text-lg mt-2 group-hover:font-medium transition-all duration-300">Habit Builder</span>
                <span className="text-xs text-terracotta-600/70 max-w-[80%] text-center">Develop positive daily routines</span>
              </Button>
            </motion.div>
            
            {/* Chat Assistant Button */}
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative"
            >
              <Button
                variant="ghost"
                className="h-32 w-full flex flex-col items-center justify-center gap-3 hover:bg-deep-ocean-50/80 rounded-xl transition-all duration-300 group border border-transparent hover:border-deep-ocean-100 shadow-sm hover:shadow-md backdrop-blur-sm"
                onClick={() => navigate("/chat")}
              >
                <div className="absolute inset-0 bg-deep-ocean-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-18 h-18 rounded-full bg-gradient-to-br from-deep-ocean-300 to-lavender-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg p-4 relative">
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-ping-slow opacity-70"></div>
                  <MessageSquare className="w-9 h-9 text-white group-hover:animate-pulse-slow" />
                </div>
                <span className="font-heading text-deep-ocean-600 text-lg mt-2 group-hover:font-medium transition-all duration-300">Chat Assistant</span>
                <span className="text-xs text-deep-ocean-400/70 max-w-[80%] text-center">Get personalized wellness guidance</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Achievements Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-10"
      >
        <Card className="p-8 border-sage-200 shadow-lg bg-gradient-to-br from-cream-50 via-white to-warm-yellow-50 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sage-100/30 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-gradient-to-b from-gold-400 to-gold-600 rounded-full"></div>
              <h2 className="text-2xl font-bold font-heading bg-gradient-to-r from-gold-600 to-gold-800 bg-clip-text text-transparent">
                Your Achievements
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Wellness Points Card */}
              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sage-200 to-sage-300 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300 transform scale-95"></div>
                <div className="bg-gradient-to-br from-sage-50 to-sage-100 rounded-xl p-6 text-center border border-sage-200 shadow-md relative backdrop-blur-sm">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sage-400 to-sage-600 rounded-t-xl"></div>
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-sage-400 to-sage-600 rounded-full flex items-center justify-center mb-3 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div className="text-4xl font-bold text-sage-600 mb-2 font-heading">250</div>
                  <div className="text-sm text-deep-ocean-600/70 font-medium">Wellness Points</div>
                </div>
              </motion.div>
              
              {/* Day Streak Card */}
              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-lavender-200 to-lavender-300 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300 transform scale-95"></div>
                <div className="bg-gradient-to-br from-lavender-50 to-lavender-100 rounded-xl p-6 text-center border border-lavender-200 shadow-md relative backdrop-blur-sm">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lavender-400 to-lavender-600 rounded-t-xl"></div>
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-full flex items-center justify-center mb-3 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M2 12h20M12 2v20"></path>
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </div>
                  <div className="text-4xl font-bold text-lavender-600 mb-2 font-heading">5</div>
                  <div className="text-sm text-deep-ocean-600/70 font-medium">Day Streak</div>
                </div>
              </motion.div>
              
              {/* Badges Earned Card */}
              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold-200 to-gold-300 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300 transform scale-95"></div>
                <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl p-6 text-center border border-gold-200 shadow-md relative backdrop-blur-sm">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-t-xl"></div>
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mb-3 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <circle cx="12" cy="8" r="6"></circle>
                      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                    </svg>
                  </div>
                  <div className="text-4xl font-bold text-gold-600 mb-2 font-heading">8</div>
                  <div className="text-sm text-deep-ocean-600/70 font-medium">Badges Earned</div>
                </div>
              </motion.div>
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
      
      {/* Enhanced Mental Health Helpline Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          delay: 0.6,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-terracotta-50 via-cream-50 to-lavender-50 p-8 mt-10 border border-terracotta-200 shadow-lg"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-terracotta-100/20 to-lavender-100/20 opacity-50" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-terracotta-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-lavender-100/30 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-terracotta-400 to-terracotta-600 p-3 rounded-xl shadow-md">
              <Heart className="w-6 h-6 text-white fill-terracotta-200" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-heading bg-gradient-to-r from-terracotta-600 to-terracotta-800 bg-clip-text text-transparent">
                Mental Health Helplines
              </h3>
              <p className="text-sm text-deep-ocean-600/70">Reach out when you need support</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* NIMHANS Card */}
            <motion.div
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white/80 rounded-xl blur-sm opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-terracotta-100 shadow-md relative group-hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-terracotta-400 to-terracotta-500 rounded-t-xl"></div>
                <div className="flex flex-col items-center text-center">
                  <span className="font-semibold text-deep-ocean-600 text-lg mb-1">NIMHANS</span> 
                  <span className="text-deep-ocean-600/80 font-medium bg-terracotta-50 px-3 py-1 rounded-full text-sm">080-46110007</span>
                  <span className="text-xs text-deep-ocean-600/60 mt-2">National Institute of Mental Health</span>
                </div>
              </div>
            </motion.div>
            
            {/* Vandrevala Foundation Card */}
            <motion.div
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white/80 rounded-xl blur-sm opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-terracotta-100 shadow-md relative group-hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-terracotta-400 to-terracotta-500 rounded-t-xl"></div>
                <div className="flex flex-col items-center text-center">
                  <span className="font-semibold text-deep-ocean-600 text-lg mb-1">Vandrevala Foundation</span> 
                  <span className="text-deep-ocean-600/80 font-medium bg-terracotta-50 px-3 py-1 rounded-full text-sm">9999-666-555</span>
                  <span className="text-xs text-deep-ocean-600/60 mt-2">24/7 Crisis Intervention</span>
                </div>
              </div>
            </motion.div>
            
            {/* iCall Card */}
            <motion.div
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white/80 rounded-xl blur-sm opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-terracotta-100 shadow-md relative group-hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-terracotta-400 to-terracotta-500 rounded-t-xl"></div>
                <div className="flex flex-col items-center text-center">
                  <span className="font-semibold text-deep-ocean-600 text-lg mb-1">iCall</span> 
                  <span className="text-deep-ocean-600/80 font-medium bg-terracotta-50 px-3 py-1 rounded-full text-sm">022-25521111</span>
                  <span className="text-xs text-deep-ocean-600/60 mt-2">Psychosocial Helpline</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-5 bg-white/70 p-4 rounded-xl border border-terracotta-100 shadow-sm backdrop-blur-sm"
          >
            <p className="text-sm text-deep-ocean-600/80 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta-500">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              These helplines provide free counseling and support 24/7. Don't hesitate to reach out if you're feeling overwhelmed.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}