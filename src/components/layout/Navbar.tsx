import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, User, Moon, Sun, MessageSquare, Trophy, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Navbar: React.FC = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

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
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/meditation" className="text-sm font-medium hover:text-primary transition-colors">Meditate</Link>
          <Link to="/journal" className="text-sm font-medium hover:text-primary transition-colors">Journal</Link>
          <Link to="/gratitude" className="text-sm font-medium hover:text-primary transition-colors">Gratitude</Link>
          <Link to="/resources" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
            <BookOpen size={16} />
            Resources
          </Link>
          <Link to="/chat" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
            <MessageSquare size={16} />
            Chat
          </Link>
          <Link
            to="/achievements"
            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent"
          >
            <Trophy className="h-5 w-5" />
            <span>Achievements</span>
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
      </div>
    </nav>
  );
};

export default Navbar;
