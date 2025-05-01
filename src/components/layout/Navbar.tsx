import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, User, Moon, Sun, MessageSquare, Trophy, BookOpen, Home, LogOut, BarChart2, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // After mounting, we can safely show the UI that depends on the theme
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast.success(theme === 'dark' ? "Light mode activated" : "Dark mode activated", {
      description: "Your preference has been saved.",
      duration: 2000,
    });
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/mindbloom-logo.svg" alt="MindBloom Logo" className="w-10 h-10" />
            <span className="text-xl font-heading font-semibold text-foreground">MindBloom</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          <Link
            to="/"
            className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center"
          >
            <Home className="h-5 w-5 mr-1.5" />
            Home
          </Link>
          <Link
            to="/resources"
            className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center"
          >
            <BookOpen className="h-5 w-5 mr-1.5" />
            Resources
          </Link>
          <Link
            to="/mood"
            className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center"
          >
            <BarChart2 className="h-5 w-5 mr-1.5" />
            Mood
          </Link>
          <Link
            to="/habits"
            className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center"
          >
            <CheckSquare className="h-5 w-5 mr-1.5" />
            Habits
          </Link>
          <Link
            to="/achievements"
            className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center"
          >
            <Trophy className="h-5 w-5 mr-1.5" />
            Achievements
          </Link>
          <Link
            to="/chat"
            className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center"
          >
            <MessageSquare className="h-5 w-5 mr-1.5" />
            Chat
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              className="text-foreground"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-foreground hover:bg-foreground/10 rounded-full"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </Button>
          
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="bg-foreground/10 text-foreground px-3 py-1.5 rounded-full text-sm font-medium flex items-center">
                <User className="h-4 w-4 mr-1.5 opacity-70" />
                <span className="truncate max-w-[120px]">{user.email}</span>
              </div>
              <Button
                onClick={signOut}
                className="bg-accent hover:bg-accent-foreground text-foreground rounded-full shadow-md"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex bg-accent hover:bg-accent-foreground text-foreground px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md"
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
