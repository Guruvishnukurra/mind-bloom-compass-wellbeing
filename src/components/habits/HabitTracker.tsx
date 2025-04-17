import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
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
      fetchHabits();
      fetchCompletions();
    }
  }, [user]);

  const fetchHabits = async () => {
    if (!user) return;
    
    try {
      // Check if the habits table exists
      const { error: tableCheckError } = await supabase
        .from('habits')
        .select('id')
        .limit(1);
        
      if (tableCheckError) {
        console.warn('Habits table may not exist yet:', tableCheckError.message);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching habits:', error);
        toast.error('Failed to load habits');
      } else {
        setHabits(data || []);
      }
    } catch (error) {
      console.error('Exception fetching habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletions = async () => {
    if (!user) return;
    
    try {
      // Check if the habit_completions table exists
      const { error: tableCheckError } = await supabase
        .from('habit_completions')
        .select('id')
        .limit(1);
        
      if (tableCheckError) {
        console.warn('Habit completions table may not exist yet:', tableCheckError.message);
        return;
      }
      
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching habit completions:', error);
      } else {
        setCompletions(data || []);
      }
    } catch (error) {
      console.error('Exception fetching habit completions:', error);
    }
  };

  const handleHabitCreated = () => {
    fetchHabits();
    setShowForm(false);
    
    // Show celebration for new habit
    setCelebrationMessage('🌱 New habit planted in your garden!');
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const handleHabitUpdated = () => {
    fetchHabits();
    setEditingHabit(null);
    setShowForm(false);
    toast.success('Habit updated successfully');
  };

  const handleHabitCompleted = async (habitId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('habit_completions')
        .insert([
          {
            habit_id: habitId,
            user_id: user.id,
            completed_at: new Date().toISOString(),
          }
        ]);
        
      if (error) {
        console.error('Error completing habit:', error);
        toast.error('Failed to mark habit as complete');
      } else {
        fetchCompletions();
        
        // Find the habit name
        const habit = habits.find(h => h.id === habitId);
        const habitName = habit ? habit.name : 'Habit';
        
        // Simple success message
        toast.success(`${habitName} completed! Your plant is growing.`);
        
        // Check for streaks and milestones
        checkForMilestones(habitId);
      }
    } catch (error) {
      console.error('Exception completing habit:', error);
      toast.error('Failed to mark habit as complete');
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleArchiveHabit = async (habitId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('habits')
        .update({ archived: true })
        .eq('id', habitId)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error archiving habit:', error);
        toast.error('Failed to archive habit');
      } else {
        fetchHabits();
        toast.success('Habit moved to dormant garden');
      }
    } catch (error) {
      console.error('Exception archiving habit:', error);
      toast.error('Failed to archive habit');
    }
  };

  const handleRestoreHabit = async (habitId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('habits')
        .update({ archived: false })
        .eq('id', habitId)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error restoring habit:', error);
        toast.error('Failed to restore habit');
      } else {
        fetchHabits();
        toast.success('Habit replanted in your active garden');
      }
    } catch (error) {
      console.error('Exception restoring habit:', error);
      toast.error('Failed to restore habit');
    }
  };

  const checkForMilestones = async (habitId: string) => {
    // Get all completions for this habit
    const habitCompletions = completions.filter(c => c.habit_id === habitId);
    
    // Add the new completion
    const totalCompletions = habitCompletions.length + 1;
    
    // Find the habit name
    const habit = habits.find(h => h.id === habitId);
    const habitName = habit ? habit.name : 'Habit';
    
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
    
    // Hide celebration after 3 seconds
    if (showCelebration) {
      setTimeout(() => setShowCelebration(false), 3000);
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
        <Loader2 className="h-8 w-8 animate-spin text-wellness-blue" />
      </div>
    );
  }

  const activeHabits = habits.filter(habit => !habit.archived);
  const archivedHabits = habits.filter(habit => habit.archived);

  return (
    <Card className="w-full border-0 shadow-lg">
      <CardHeader className="border-b border-neutral-mist/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Trees className="h-5 w-5 text-wellness-green" />
              Growth Garden
            </CardTitle>
            <CardDescription className="mt-1">
              Plant, nurture, and watch your habits bloom
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              setEditingHabit(null);
              setShowForm(!showForm);
            }}
            className="mindbloom-button-primary"
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
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-wellness-green/30 max-w-md text-center">
              <Sparkles className="h-12 w-12 text-wellness-amber mx-auto mb-3 animate-pulse-glow" />
              <h3 className="text-xl font-medium text-wellness-green mb-2">Achievement Unlocked!</h3>
              <p className="text-lg">{celebrationMessage}</p>
            </div>
          </motion.div>
        )}
      
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4 p-4 rounded-lg bg-wellness-green/5 border border-wellness-green/20">
              <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                <Leaf className="h-5 w-5 text-wellness-green" />
                {editingHabit ? 'Tend to Your Habit' : 'Plant a New Habit'}
              </h3>
              <p className="text-sm text-muted-foreground">
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
              <TabsTrigger value="active" className="data-[state=active]:bg-wellness-green/10 data-[state=active]:text-wellness-green">
                Growing Garden
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-wellness-blue/10 data-[state=active]:text-wellness-blue">
                Garden Stats
              </TabsTrigger>
              <TabsTrigger value="archived" className="data-[state=active]:bg-wellness-amber/10 data-[state=active]:text-wellness-amber">
                Dormant Plants
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-6">
              {activeHabits.length === 0 ? (
                <div className="text-center py-8 px-4 bg-wellness-mint/10 rounded-xl border border-wellness-mint/20">
                  <Leaf className="h-12 w-12 text-wellness-green/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Your Garden Awaits</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Your garden is ready for planting! Start by adding your first habit and watch it grow with consistent care.
                  </p>
                  <Button 
                    onClick={() => {
                      setEditingHabit(null);
                      setShowForm(true);
                    }}
                    className="mindbloom-button-primary"
                  >
                    <Seedling className="mr-2 h-4 w-4" />
                    Plant Your First Habit
                  </Button>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-lg bg-wellness-mint/10 border border-wellness-mint/20 mb-6">
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                      <Trees className="h-5 w-5 text-wellness-green" />
                      Your Growing Garden
                    </h3>
                    <p className="text-sm text-muted-foreground">
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
                  
                  <div className="mt-8 p-4 rounded-lg bg-wellness-blue/5 border border-wellness-blue/20">
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                      <Seedling className="h-5 w-5 text-wellness-blue" />
                      Habit Seeds to Plant
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Consider adding these habits to your garden for a more balanced wellness routine.
                    </p>
                    <HabitSuggestions 
                      existingHabits={activeHabits}
                      onSelectSuggestion={(habit) => {
                        setEditingHabit({
                          ...habit,
                          id: '',
                          user_id: user?.id || '',
                          created_at: new Date().toISOString(),
                          archived: false
                        });
                        setShowForm(true);
                      }}
                    />
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="p-4 rounded-lg bg-wellness-blue/5 border border-wellness-blue/20 mb-6">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-wellness-blue" />
                  Garden Growth Analytics
                </h3>
                <p className="text-sm text-muted-foreground">
                  Track how your habits are growing and flourishing over time.
                </p>
              </div>
              <HabitStats habits={habits} completions={completions} />
            </TabsContent>
            
            <TabsContent value="archived">
              <div className="p-4 rounded-lg bg-wellness-amber/5 border border-wellness-amber/20 mb-6">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                  <Leaf className="h-5 w-5 text-wellness-amber" />
                  Dormant Plants
                </h3>
                <p className="text-sm text-muted-foreground">
                  These habits are currently dormant. You can replant them in your active garden anytime.
                </p>
              </div>
              
              {archivedHabits.length === 0 ? (
                <div className="text-center py-8 bg-neutral-mist/10 rounded-lg">
                  <Leaf className="h-10 w-10 text-neutral-mist mx-auto mb-3" />
                  <p className="text-muted-foreground">Your dormant garden is empty.</p>
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