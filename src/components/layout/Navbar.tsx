import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, User, Moon, Sun, MessageSquare, Trophy, BookOpen, Home, LogOut, BarChart2, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast.success(theme === 'dark' ? "Light mode activated" : "Dark mode activated", {
      description: "Your preference has been saved.",
      duration: 2000,
    });
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-warm-yellow-500 to-warm-yellow-600 dark:from-deep-ocean-600 dark:to-deep-ocean-700 backdrop-blur-md border-b border-warm-yellow-400 dark:border-deep-ocean-500 shadow-md">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 relative bg-white/10 rounded-full flex items-center justify-center shadow-inner">
              <div className="w-6 h-6 bg-gradient-to-br from-soft-teal-400 to-terracotta-400 rounded-full animate-pulse-slow"></div>
            </div>
            <span className="text-xl font-heading font-semibold text-deep-slate-800 dark:text-white">MindBloom</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          <Link
            to="/"
            className="text-deep-slate-800/80 hover:text-deep-slate-800 hover:bg-deep-slate-800/10 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center"
          >
            <Home className="h-5 w-5 mr-1.5" />
            Home
          </Link>
          <Link
            to="/resources"
            className="text-deep-slate-800/80 hover:text-deep-slate-800 hover:bg-deep-slate-800/10 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center"
          >
            <BookOpen className="h-5 w-5 mr-1.5" />
            Resources
          </Link>
          <Link
            to="/mood"
            className="text-deep-slate-800/80 hover:text-deep-slate-800 hover:bg-deep-slate-800/10 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center"
          >
            <BarChart2 className="h-5 w-5 mr-1.5" />
            Mood
          </Link>
          <Link
            to="/habits"
            className="text-deep-slate-800/80 hover:text-deep-slate-800 hover:bg-deep-slate-800/10 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center"
          >
            <CheckSquare className="h-5 w-5 mr-1.5" />
            Habits
          </Link>
          <Link
            to="/achievements"
            className="text-deep-slate-800/80 hover:text-deep-slate-800 hover:bg-deep-slate-800/10 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center"
          >
            <Trophy className="h-5 w-5 mr-1.5" />
            Achievements
          </Link>
          <Link
            to="/chat"
            className="text-deep-slate-800/80 hover:text-deep-slate-800 hover:bg-deep-slate-800/10 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center"
          >
            <MessageSquare className="h-5 w-5 mr-1.5" />
            Chat
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="text-deep-slate-800/80 dark:text-white/80 hover:text-deep-slate-800 dark:hover:text-white hover:bg-deep-slate-800/10 dark:hover:bg-white/10 rounded-full"
          >
            {mounted && (theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />)}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-deep-slate-800/80 hover:text-deep-slate-800 hover:bg-deep-slate-800/10 rounded-full"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </Button>
          
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="bg-deep-slate-800/10 text-deep-slate-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center">
                <User className="h-4 w-4 mr-1.5 opacity-70" />
                <span className="truncate max-w-[120px]">{user.email}</span>
              </div>
              <Button
                onClick={signOut}
                className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full shadow-md"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden md:flex bg-soft-teal-500 hover:bg-soft-teal-600 text-deep-slate-800 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
