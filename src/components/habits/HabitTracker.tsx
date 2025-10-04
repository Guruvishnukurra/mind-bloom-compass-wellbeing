import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HabitList } from './HabitList';
import { HabitForm } from './HabitForm';
import { HabitStats } from './HabitStats';
import { HabitSuggestions } from './HabitSuggestions';
import { Loader2, Plus, Leaf, Trees, Sprout, Award, Sparkles, Droplets } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useStats } from '@/contexts/StatsContext';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { habitService, Habit, HabitCompletion } from '@/lib/habit-service';

export function HabitTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [newHabitName, setNewHabitName] = useState('');
  const { incrementHabitCompletions } = useStats();

  useEffect(() => {
    if (user) {
      loadHabits();
      loadCompletions();
    }
  }, [user]);

  const loadHabits = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userHabits = await habitService.getHabits(user.id);
      setHabits(userHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
      toast({
        title: 'Error',
        description: 'Failed to load habits',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCompletions = async () => {
    if (!user) return;

    try {
      const userCompletions = await habitService.getHabitCompletions(user.id);
      setCompletions(userCompletions);
    } catch (error) {
      console.error('Error loading completions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load habit completions',
        variant: 'destructive',
      });
    }
  };

  const handleHabitCreated = async (newHabit: Omit<Habit, 'id'>) => {
    if (!user) return;

    try {
      const createdHabit = await habitService.createHabit({
        ...newHabit,
        user_id: user.id,
      });

      if (createdHabit) {
        setHabits(prev => [...prev, createdHabit]);
        setShowForm(false);
        
        // Show celebration for new habit
        setCelebrationMessage('🌱 New habit planted in your garden!');
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to create habit',
        variant: 'destructive',
      });
    }
  };

  const handleHabitUpdated = async (habitId: string, updates: Partial<Habit>) => {
    try {
      const updatedHabit = await habitService.updateHabit(habitId, updates);
      if (updatedHabit) {
        setHabits(prev => prev.map(h => h.id === habitId ? updatedHabit : h));
        setShowForm(false);
        setEditingHabit(undefined);
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to update habit',
        variant: 'destructive',
      });
    }
  };

  const handleHabitCompleted = async (habitId: string) => {
    if (!user) return;

    try {
      const completion = await habitService.completeHabit(habitId, user.id);
      if (completion) {
        setCompletions(prev => [...prev, completion]);
        
        // Update habit streak
        const streak = await habitService.getHabitStreak(habitId);
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          await handleHabitUpdated(habitId, { streak });
        }

        // Show celebration for completion
        setCelebrationMessage('✨ Great job completing your habit!');
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } catch (error) {
      console.error('Error completing habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete habit',
        variant: 'destructive',
      });
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleArchiveHabit = async (habitId: string) => {
    try {
      await handleHabitUpdated(habitId, { archived: true });
    } catch (error) {
      console.error('Error archiving habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to archive habit',
        variant: 'destructive',
      });
    }
  };

  const handleRestoreHabit = async (habitId: string) => {
    try {
      await handleHabitUpdated(habitId, { archived: false });
    } catch (error) {
      console.error('Error restoring habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to restore habit',
        variant: 'destructive',
      });
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      await habitService.deleteHabit(habitId);
      setHabits(prev => prev.filter(h => h.id !== habitId));
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete habit',
        variant: 'destructive',
      });
    }
  };

  const getGrowthStageIcon = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return <Leaf className="h-5 w-5 text-deep-ocean-400" />;
    
    const streak = habit.streak || 0;
    if (streak >= 100) return <Award className="h-5 w-5 text-gold-500" />;
    if (streak >= 30) return <Trees className="h-5 w-5 text-wellness-green" />;
    if (streak >= 7) return <Sprout className="h-5 w-5 text-sage-500" />;
    return <Leaf className="h-5 w-5 text-deep-ocean-400" />;
  };

  const checkForMilestones = (habitId: string) => {
    // Get all completions for this habit
    const habitCompletions = completions.filter(c => c.habit_id === habitId);
    
    // Add the new completion
    const totalCompletions = habitCompletions.length + 1;
    
    // Find the habit name
    const habit = habits.find(h => h.id === habitId);
    const habitName = habit ? habit.name : 'Habit';
    
    // Clear any existing celebration timeout
    if (showCelebration) {
      setShowCelebration(false);
    }
    
    // Check for milestone achievements with garden metaphors
    if (totalCompletions === 1) {
      setCelebrationMessage(`🌱 First sprout! "${habitName}" has begun to grow!`);
      setShowCelebration(true);
    } else if (totalCompletions === 3) {
      setCelebrationMessage(`🌿 "${habitName}" is developing strong roots!`);
      setShowCelebration(true);
    } else if (totalCompletions === 7) {
      setCelebrationMessage(`🌿 One week of growth! "${habitName}" is flourishing!`);
      setShowCelebration(true);
    } else if (totalCompletions === 21) {
      setCelebrationMessage(`🌸 "${habitName}" is blooming beautifully after 21 days!`);
      setShowCelebration(true);
    } else if (totalCompletions === 30) {
      setCelebrationMessage(`🌳 "${habitName}" has grown into a strong tree! 30 completions!`);
      setShowCelebration(true);
    } else if (totalCompletions === 100) {
      setCelebrationMessage(`🌺 "${habitName}" has become a magnificent garden! 100 completions!`);
      setShowCelebration(true);
    } else if (totalCompletions % 50 === 0) {
      setCelebrationMessage(`🌲 "${habitName}" is a towering achievement! ${totalCompletions} completions!`);
      setShowCelebration(true);
    }
    
    // Check for streaks
    const streak = calculateStreak(habitId);
    if (streak === 7) {
      setCelebrationMessage(`🔥 7-day streak! "${habitName}" is thriving with your consistent care!`);
      setShowCelebration(true);
    } else if (streak === 30) {
      setCelebrationMessage(`⚡ 30-day streak! "${habitName}" has become part of your garden's ecosystem!`);
      setShowCelebration(true);
    } else if (streak === 100) {
      setCelebrationMessage(`👑 100-day streak! "${habitName}" is the crown jewel of your garden!`);
      setShowCelebration(true);
    } else if (streak % 50 === 0 && streak > 0) {
      setCelebrationMessage(`🌈 ${streak}-day streak! "${habitName}" is creating a rainbow of benefits in your life!`);
      setShowCelebration(true);
    }
    
    // Set timeout to hide celebration after 3 seconds
    const timeoutId = setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
    
    // Cleanup timeout on component unmount or when new celebration is triggered
    return () => clearTimeout(timeoutId);
  };

  const calculateStreak = (habitId: string): number => {
    const habitCompletions = completions
      .filter(c => c.habit_id === habitId)
      .map(c => {
        const date = new Date(c.completed_at);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
      })
      .sort();
    
    if (habitCompletions.length === 0) return 0;
    
    // Check if there's a completion today
    const today = new Date();
    const todayStr = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const hasCompletionToday = habitCompletions.includes(todayStr);
    
    if (!hasCompletionToday) return 0;
    
    // Count consecutive days
    let streak = 1;
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - 1);
    
    while (true) {
      const dateStr = new Date(
        currentDate.getFullYear(), 
        currentDate.getMonth(), 
        currentDate.getDate()
      ).toISOString();
      
      if (habitCompletions.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-deep-ocean-500" />
      </div>
    );
  }

  const activeHabits = habits.filter(habit => !habit.archived);
  const archivedHabits = habits.filter(habit => habit.archived);

  return (
    <Card className="w-full border border-sage-200 shadow-lg bg-gradient-to-br from-cream-50 to-white">
      <CardHeader className="border-b border-sage-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-deep-ocean-600 font-heading">
              Your Habit Garden
            </CardTitle>
            <CardDescription className="text-deep-ocean-600/70">
              Nurture your habits and watch them grow
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Quick add habit..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="max-w-[200px]"
            />
            <Button
              onClick={() => {
                if (newHabitName.trim()) {
                  handleHabitCreated({
                    user_id: user?.id || '',
                    name: newHabitName.trim(),
                    description: '',
                    category: '',
                    frequency: 'daily',
                    color: '#4AD295',
                    icon: 'leaf',
                    created_at: new Date().toISOString(),
                    archived: false,
                    completed: false,
                    streak: 0,
                    lastCompleted: null,
                    reminder: false,
                  });
                  setNewHabitName('');
                }
              }}
              className="bg-wellness-green hover:bg-wellness-green-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 rounded-lg bg-wellness-green/10 border border-wellness-green/20"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎉</div>
              <p className="text-lg text-deep-ocean-600/80">{celebrationMessage}</p>
            </div>
          </motion.div>
        )}
      
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4 p-4 rounded-lg bg-sage-50 border border-sage-200">
              <h3 className="text-lg font-medium flex items-center gap-2 mb-2 text-deep-ocean-600 font-heading">
                <Leaf className="h-5 w-5 text-sage-500" />
                {editingHabit ? 'Tend to Your Habit' : 'Plant a New Habit'}
              </h3>
              <p className="text-sm text-deep-ocean-600/70">
                {editingHabit 
                  ? 'Adjust and nurture your existing habit to help it thrive.' 
                  : 'Choose a habit to cultivate in your wellness garden.'}
              </p>
            </div>
            <HabitForm 
              onHabitCreated={handleHabitCreated} 
              onHabitUpdated={handleHabitUpdated}
              existingHabit={editingHabit}
            />
          </motion.div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="active" className="data-[state=active]:bg-sage-500/10 data-[state=active]:text-sage-600">
                Growing Garden
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-deep-ocean-500/10 data-[state=active]:text-deep-ocean-600">
                Garden Stats
              </TabsTrigger>
              <TabsTrigger value="archived" className="data-[state=active]:bg-gold-500/10 data-[state=active]:text-gold-600">
                Dormant Plants
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <HabitList
                habits={activeHabits}
                completions={completions}
                onComplete={handleHabitCompleted}
                onEdit={handleEditHabit}
                onArchive={handleArchiveHabit}
                getGrowthStageIcon={getGrowthStageIcon}
              />
            </TabsContent>

            <TabsContent value="stats">
              <HabitStats habits={habits} completions={completions} />
            </TabsContent>

            <TabsContent value="archived">
              <HabitList
                habits={archivedHabits}
                completions={completions}
                onComplete={handleHabitCompleted}
                onEdit={handleEditHabit}
                onArchive={handleArchiveHabit}
                onRestore={handleRestoreHabit}
                isArchiveView
                getGrowthStageIcon={getGrowthStageIcon}
              />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}