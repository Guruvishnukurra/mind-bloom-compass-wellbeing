import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, User, Moon, Sun, MessageSquare, Trophy, BookOpen, Home, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { user, signOut } = useAuth();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    toast({
      title: isDarkMode ? "Light mode activated" : "Dark mode activated",
      description: "Your preference has been saved.",
      duration: 2000,
    });
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-wellness-blue to-wellness-green"></div>
            <span className="text-lg font-semibold">MindBloom</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/"
            className="text-neutral-blue hover:text-primary-teal px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            <Home className="h-5 w-5 inline-block mr-1" />
            Home
          </Link>
          <Link
            to="/resources"
            className="text-neutral-blue hover:text-primary-teal px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            <BookOpen className="h-5 w-5 inline-block mr-1" />
            Resources
          </Link>
          <Link
            to="/achievements"
            className="text-neutral-blue hover:text-primary-teal px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            <Trophy className="h-5 w-5 inline-block mr-1" />
            Achievements
          </Link>
          <Link
            to="/api-test"
            className="text-neutral-blue hover:text-primary-teal px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            API Test
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="hidden md:flex"
            aria-label="User profile"
          >
            <User size={20} />
          </Button>
        </div>

        <div className="flex items-center">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-neutral-blue text-sm font-medium">
                <User className="h-5 w-5 inline-block mr-1" />
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="bg-primary-teal hover:bg-primary-teal/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <LogOut className="h-5 w-5 inline-block mr-1" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-primary-teal hover:bg-primary-teal/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
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
