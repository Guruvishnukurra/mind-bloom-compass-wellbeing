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
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

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
    toast.success('Habit created successfully');
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
        toast.success('Habit marked as complete');
        
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
        toast.success('Habit archived');
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
        toast.success('Habit restored');
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
    
    // Check for milestone achievements
    if (totalCompletions === 1) {
      toast.success('🎉 First completion! Keep going!');
    } else if (totalCompletions === 3) {
      toast.success('🔥 3 completions! You\'re building momentum!');
    } else if (totalCompletions === 7) {
      toast.success('🏆 7 completions! You\'re developing a solid habit!');
    } else if (totalCompletions === 21) {
      toast.success('🌟 21 completions! This habit is becoming part of your routine!');
    } else if (totalCompletions === 30) {
      toast.success('💎 30 completions! You\'ve reached habit mastery!');
    } else if (totalCompletions === 100) {
      toast.success('🚀 100 completions! You\'re unstoppable!');
    } else if (totalCompletions % 50 === 0) {
      toast.success(`🏅 ${totalCompletions} completions! Incredible consistency!`);
    }
    
    // Check for streaks
    const streak = calculateStreak(habitId);
    if (streak === 7) {
      toast.success('🔥 7-day streak! You\'re on fire!');
    } else if (streak === 30) {
      toast.success('⚡ 30-day streak! Amazing discipline!');
    } else if (streak === 100) {
      toast.success('👑 100-day streak! You\'re a habit master!');
    } else if (streak % 50 === 0 && streak > 0) {
      toast.success(`🌈 ${streak}-day streak! Phenomenal consistency!`);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeHabits = habits.filter(habit => !habit.archived);
  const archivedHabits = habits.filter(habit => habit.archived);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Habit Builder</CardTitle>
            <CardDescription>
              Create and track habits to improve your wellbeing
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              setEditingHabit(null);
              setShowForm(!showForm);
            }}
            className="bg-wellness-teal hover:bg-wellness-teal/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'Cancel' : 'New Habit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <HabitForm 
            onHabitCreated={handleHabitCreated} 
            onHabitUpdated={handleHabitUpdated}
            existingHabit={editingHabit}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="active">Active Habits</TabsTrigger>
              <TabsTrigger value="stats">Stats & Streaks</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4">
              {activeHabits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You don't have any active habits yet.</p>
                  <Button 
                    onClick={() => {
                      setEditingHabit(null);
                      setShowForm(true);
                    }}
                    className="bg-wellness-teal hover:bg-wellness-teal/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Habit
                  </Button>
                </div>
              ) : (
                <>
                  <HabitList 
                    habits={activeHabits}
                    completions={completions}
                    onComplete={handleHabitCompleted}
                    onEdit={handleEditHabit}
                    onArchive={handleArchiveHabit}
                  />
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
                </>
              )}
            </TabsContent>
            
            <TabsContent value="stats">
              <HabitStats habits={habits} completions={completions} />
            </TabsContent>
            
            <TabsContent value="archived">
              {archivedHabits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You don't have any archived habits.</p>
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
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}