import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuotes } from "@/hooks/useQuotes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, BookOpen, MessageSquare, Heart, Smile, Trophy } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const quote = useQuotes();
  const [isLoading, setIsLoading] = useState(true);
  const [streakCount, setStreakCount] = useState(7);

  useEffect(() => {
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

  const features = [
    {
      name: "Meditate",
      icon: Brain,
      color: "bg-blue-500 dark:bg-blue-600",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      progress: 60,
      route: "/meditation",
      description: "12 minutes today"
    },
    {
      name: "Mood",
      icon: Smile,
      color: "bg-green-500 dark:bg-green-600",
      textColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950",
      route: "/mood",
      description: "Track your mood"
    },
    {
      name: "Journal",
      icon: BookOpen,
      color: "bg-purple-500 dark:bg-purple-600",
      textColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      route: "/journal",
      description: "Express yourself"
    },
    {
      name: "Resources",
      icon: Heart,
      color: "bg-rose-500 dark:bg-rose-600",
      textColor: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-950",
      route: "/resources",
      description: "Helpful content"
    },
    {
      name: "Achievements",
      icon: Trophy,
      color: "bg-amber-500 dark:bg-amber-600",
      textColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950",
      route: "/achievements",
      description: "View your progress"
    },
    {
      name: "Support",
      icon: MessageSquare,
      color: "bg-indigo-500 dark:bg-indigo-600",
      textColor: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
      route: "/support",
      description: "Get help"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-foreground">
              Welcome back, {user?.email ? user.email.split("@")[0] : 'Guest'}
            </h1>
            <p className="text-muted-foreground mt-1">How are you feeling today?</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-medium">{streakCount} day streak! ⚡</span>
          </div>
        </div>

        {/* Daily Quote */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-lg text-foreground italic">"{quote?.text || 'The only way to do great work is to love what you do.'}"</p>
            </div>
            <Button variant="ghost" size="icon" className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Button
              key={feature.name}
              variant="outline"
              className={`h-auto p-6 flex flex-col items-center gap-4 ${feature.bgColor} border-2 border-border hover:border-ring transition-colors`}
              onClick={() => navigate(feature.route)}
            >
              <div className={`${feature.color} p-4 rounded-full`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className={`font-medium ${feature.textColor} mb-1`}>{feature.name}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
              {feature.progress && (
                <div className="w-full">
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                    <div 
                      className={`${feature.color} h-1.5 rounded-full`} 
                      style={{ width: `${feature.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}