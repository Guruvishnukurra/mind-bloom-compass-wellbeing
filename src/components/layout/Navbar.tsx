import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, User, Moon, Sun, MessageSquare, Trophy, BookOpen, Home, LogOut, BarChart2, CheckSquare, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // After mounting, we can safely show the UI that depends on the theme
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast.success(theme === 'dark' ? 'Light mode activated' : 'Dark mode activated', {
      description: 'Your preference has been saved.',
      duration: 2000,
    });
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Resources', path: '/resources' },
    { icon: BarChart2, label: 'Mood', path: '/mood' },
    { icon: CheckSquare, label: 'Habits', path: '/habits' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/mindbloom-logo.svg" alt="MindBloom Logo" className="w-10 h-10" />
            <span className="text-xl font-heading font-semibold text-foreground">MindBloom</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center"
            >
              <item.icon className="h-5 w-5 mr-1.5" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-2 px-4 py-2 text-lg font-medium hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
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
