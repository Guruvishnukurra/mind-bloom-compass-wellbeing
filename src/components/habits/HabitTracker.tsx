import { useState, useEffect } from 'react';
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

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  frequency_value?: number;
  frequency_unit?: 'day' | 'week' | 'month';
  time_of_day?: string;
  reminder: boolean;
  reminder_time?: string;
  color: string;
  icon: string;
  created_at: string;
  archived: boolean;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  notes?: string;
}

// Local storage keys
const HABITS_STORAGE_KEY = 'mindbloom_habits';
const COMPLETIONS_STORAGE_KEY = 'mindbloom_habit_completions';

export function HabitTracker() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadHabitsFromLocalStorage();
      loadCompletionsFromLocalStorage();
    }
  }, [user]);

  const loadHabitsFromLocalStorage = () => {
    try {
      const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
      if (storedHabits) {
        const parsedHabits = JSON.parse(storedHabits) as Habit[];
        // Filter habits for current user
        const userHabits = parsedHabits.filter(habit => habit.user_id === user?.id);
        setHabits(userHabits);
      }
    } catch (error) {
      console.error('Error loading habits from local storage:', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const loadCompletionsFromLocalStorage = () => {
    try {
      const storedCompletions = localStorage.getItem(COMPLETIONS_STORAGE_KEY);
      if (storedCompletions) {
        const parsedCompletions = JSON.parse(storedCompletions) as HabitCompletion[];
        // Filter completions for current user
        const userCompletions = parsedCompletions.filter(completion => completion.user_id === user?.id);
        setCompletions(userCompletions);
      }
    } catch (error) {
      console.error('Error loading completions from local storage:', error);
    }
  };

  const saveHabitsToLocalStorage = (updatedHabits: Habit[]) => {
    try {
      // Get all habits from storage first
      const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
      let allHabits: Habit[] = [];
      
      if (storedHabits) {
        // Parse stored habits
        allHabits = JSON.parse(storedHabits) as Habit[];
        // Remove current user's habits
        allHabits = allHabits.filter(habit => habit.user_id !== user?.id);
      }
      
      // Add updated habits for current user
      allHabits = [...allHabits, ...updatedHabits];
      
      // Save back to local storage
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(allHabits));
    } catch (error) {
      console.error('Error saving habits to local storage:', error);
    }
  };

  const saveCompletionsToLocalStorage = (updatedCompletions: HabitCompletion[]) => {
    try {
      // Get all completions from storage first
      const storedCompletions = localStorage.getItem(COMPLETIONS_STORAGE_KEY);
      let allCompletions: HabitCompletion[] = [];
      
      if (storedCompletions) {
        // Parse stored completions
        allCompletions = JSON.parse(storedCompletions) as HabitCompletion[];
        // Keep completions from other users
        allCompletions = allCompletions.filter(completion => completion.user_id !== user?.id);
      }
      
      // Add updated completions for current user
      allCompletions = [...allCompletions, ...updatedCompletions];
      
      // Save back to local storage
      localStorage.setItem(COMPLETIONS_STORAGE_KEY, JSON.stringify(allCompletions));
    } catch (error) {
      console.error('Error saving completions to local storage:', error);
    }
  };

  const handleHabitCreated = (newHabit: Habit) => {
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    saveHabitsToLocalStorage(updatedHabits);
    setShowForm(false);
    
    // Show celebration for new habit
    setCelebrationMessage('🌱 New habit planted in your garden!');
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const handleHabitUpdated = (updatedHabit: Habit) => {
    const updatedHabits = habits.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    );
    setHabits(updatedHabits);
    saveHabitsToLocalStorage(updatedHabits);
    setEditingHabit(null);
    setShowForm(false);
    toast.success('Habit updated successfully');
  };

  const handleHabitCompleted = (habitId: string) => {
    if (!user) return;
    
    const newCompletion: HabitCompletion = {
      id: uuidv4(),
      habit_id: habitId,
      user_id: user.id,
      completed_at: new Date().toISOString(),
    };
    
    const updatedCompletions = [...completions, newCompletion];
    setCompletions(updatedCompletions);
    saveCompletionsToLocalStorage(updatedCompletions);
    
    // Find the habit name
    const habit = habits.find(h => h.id === habitId);
    const habitName = habit ? habit.name : 'Habit';
    
    // Simple success message
    toast.success(`${habitName} completed! Your plant is growing.`);
    
    // Check for streaks and milestones
    checkForMilestones(habitId);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleArchiveHabit = (habitId: string) => {
    if (!user) return;
    
    const updatedHabits = habits.map(habit => 
      habit.id === habitId ? { ...habit, archived: true } : habit
    );
    
    setHabits(updatedHabits);
    saveHabitsToLocalStorage(updatedHabits);
    toast.success('Habit moved to dormant garden');
  };

  const handleRestoreHabit = (habitId: string) => {
    if (!user) return;
    
    const updatedHabits = habits.map(habit => 
      habit.id === habitId ? { ...habit, archived: false } : habit
    );
    
    setHabits(updatedHabits);
    saveHabitsToLocalStorage(updatedHabits);
    toast.success('Habit replanted in your active garden');
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

  // Get the growth stage icon based on completion count
  const getGrowthStageIcon = (habitId: string) => {
    const habitCompletions = completions.filter(c => c.habit_id === habitId).length;
    
    if (habitCompletions === 0) return <Sprout className="h-6 w-6" />;
    if (habitCompletions < 3) return <Sprout className="h-6 w-6" />;
    if (habitCompletions < 7) return <Leaf className="h-6 w-6" />;
    if (habitCompletions < 21) return <Leaf className="h-6 w-6" />;
    if (habitCompletions < 30) return <Trees className="h-6 w-6" />;
    return <Trees className="h-6 w-6" />;
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
            <CardTitle className="text-xl flex items-center gap-2 font-heading text-deep-ocean-600">
              <Trees className="h-5 w-5 text-sage-500" />
              Growth Garden
            </CardTitle>
            <CardDescription className="mt-1 text-deep-ocean-600/70">
              Plant, nurture, and watch your habits bloom
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              setEditingHabit(null);
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white shadow-md"
          >
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'Cancel' : 'Plant New Habit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Celebration overlay */}
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-sage-300 max-w-md text-center">
              <Sparkles className="h-12 w-12 text-gold-500 mx-auto mb-3 animate-pulse-glow" />
              <h3 className="text-xl font-medium text-deep-ocean-600 mb-2 font-heading">Achievement Unlocked!</h3>
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
            
            <TabsContent value="active" className="space-y-6">
              {activeHabits.length === 0 ? (
                <div className="text-center py-8 px-4 bg-sage-50 rounded-xl border border-sage-200">
                  <Leaf className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-deep-ocean-600 font-heading">Your Garden Awaits</h3>
                  <p className="text-deep-ocean-600/70 mb-6 max-w-md mx-auto">
                    Your garden is ready for planting! Start by adding your first habit and watch it grow with consistent care.
                  </p>
                  <Button 
                    onClick={() => {
                      setEditingHabit(null);
                      setShowForm(true);
                    }}
                    className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white shadow-md"
                  >
                    <Sprout className="mr-2 h-4 w-4" />
                    Plant Your First Habit
                  </Button>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-lg bg-sage-50 border border-sage-200 mb-6">
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-2 text-deep-ocean-600 font-heading">
                      <Trees className="h-5 w-5 text-sage-500" />
                      Your Growing Garden
                    </h3>
                    <p className="text-sm text-deep-ocean-600/70">
                      Nurture your habits daily to help them flourish. Each completion helps your habits grow stronger.
                    </p>
                  </div>
                  
                  <HabitList 
                    habits={activeHabits}
                    completions={completions}
                    onComplete={handleHabitCompleted}
                    onEdit={handleEditHabit}
                    onArchive={handleArchiveHabit}
                    getGrowthStageIcon={getGrowthStageIcon}
                  />
                  
                  <div className="mt-8 p-4 rounded-lg bg-deep-ocean-50 border border-deep-ocean-200">
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-3 text-deep-ocean-600 font-heading">
                      <Sprout className="h-5 w-5 text-deep-ocean-500" />
                      Habit Seeds to Plant
                    </h3>
                    <p className="text-sm text-deep-ocean-600/70 mb-4">
                      Consider adding these habits to your garden for a more balanced wellness routine.
                    </p>
                    <HabitSuggestions 
                      existingHabits={activeHabits}
                      onSelectSuggestion={(habit) => {
                        
                        setShowForm(true);
                      }}
                    />
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="p-4 rounded-lg bg-deep-ocean-50 border border-deep-ocean-200 mb-6">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-2 text-deep-ocean-600 font-heading">
                  <Award className="h-5 w-5 text-deep-ocean-500" />
                  Garden Growth Analytics
                </h3>
                <p className="text-sm text-deep-ocean-600/70">
                  Track how your habits are growing and flourishing over time.
                </p>
              </div>
              <HabitStats habits={habits} completions={completions} />
            </TabsContent>
            
            <TabsContent value="archived">
              <div className="p-4 rounded-lg bg-gold-50 border border-gold-200 mb-6">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-2 text-deep-ocean-600 font-heading">
                  <Leaf className="h-5 w-5 text-gold-500" />
                  Dormant Plants
                </h3>
                <p className="text-sm text-deep-ocean-600/70">
                  These habits are currently dormant. You can replant them in your active garden anytime.
                </p>
              </div>
              
              {archivedHabits.length === 0 ? (
                <div className="text-center py-8 bg-cream-100 rounded-lg border border-gold-100">
                  <Leaf className="h-10 w-10 text-gold-300 mx-auto mb-3" />
                  <p className="text-deep-ocean-600/60">Your dormant garden is empty.</p>
                </div>
              ) : (
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
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}