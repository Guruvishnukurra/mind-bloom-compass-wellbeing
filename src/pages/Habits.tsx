import { useState, useEffect } from 'react';
import { HabitTracker } from '@/components/habits/HabitTracker';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Habits() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for a smoother experience
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Leaf className="h-7 w-7 text-sage-500" />
            <h1 className="text-3xl font-bold text-deep-ocean-600 font-heading">Habit Builder</h1>
          </div>
          <p className="text-deep-ocean-600/70 mb-8 max-w-2xl">
            Plant, nurture, and watch your habits bloom. Track your daily progress and build lasting positive routines.
          </p>
        </motion.div>
        
        <HabitTracker />
      </div>
    </div>
  );
}