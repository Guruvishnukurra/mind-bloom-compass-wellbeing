import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuotes } from "@/hooks/useQuotes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, BookOpen, MessageSquare, Heart } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const quote = useQuotes();
  const [isLoading, setIsLoading] = useState(true);
  const [streakCount, setStreakCount] = useState(7); // Example streak count

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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium">
              Welcome back, {user?.email ? user.email.split("@")[0] : 'Guest'}
            </h1>
            <p className="text-muted-foreground mt-1">How are you feeling today?</p>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-full flex items-center gap-2">
            <span className="text-blue-600 font-medium">{streakCount} day streak! ⚡</span>
          </div>
        </div>

        {/* Daily Quote */}
        <Card className="p-6 bg-white border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-lg text-gray-600 italic">"{quote?.text || 'The only way to do great work is to love what you do.'}"</p>
            </div>
            <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </Card>

        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Meditate Card */}
          <Card className="p-6 bg-white border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Meditate</h3>
                <p className="text-sm text-muted-foreground">12 minutes today</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </Card>

          {/* Habits Card */}
          <Card className="p-6 bg-white border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Habits</h3>
                <p className="text-sm text-muted-foreground">3/4 completed</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </Card>

          {/* Need Help Card */}
          <Card className="p-6 bg-white border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-rose-50 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-medium">Need Help?</h3>
                <p className="text-sm text-muted-foreground">Chat with us</p>
              </div>
            </div>
            <Button className="w-full mt-4 bg-rose-500 hover:bg-rose-600 text-white">
              Call Helpline
            </Button>
          </Card>
        </div>

        {/* Today's Mood */}
        <Card className="p-6 bg-white border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Today's Mood</h3>
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 py-6 hover:bg-blue-50 hover:border-blue-200">
              <span className="text-2xl">😊</span>
              <span className="ml-2">Great</span>
            </Button>
            <Button variant="outline" className="flex-1 py-6 hover:bg-blue-50 hover:border-blue-200">
              <span className="text-2xl">😐</span>
              <span className="ml-2">Okay</span>
            </Button>
            <Button variant="outline" className="flex-1 py-6 hover:bg-blue-50 hover:border-blue-200">
              <span className="text-2xl">😔</span>
              <span className="ml-2">Down</span>
            </Button>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-6 bg-white border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Achievements</h3>
          <div className="flex gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center flex-1">
              <span className="text-sm font-medium text-blue-600">Meditation Master</span>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center flex-1">
              <span className="text-sm font-medium text-green-600">Streak Champion</span>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg text-center flex-1">
              <span className="text-sm font-medium text-amber-600">Early Bird</span>
            </div>
          </div>
        </Card>

        {/* Chat Support */}
        <Card className="p-6 bg-white border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Chat Support</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <input
              type="text"
              placeholder="Type your message here..."
              className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}