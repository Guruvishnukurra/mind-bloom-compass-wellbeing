import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Archive, Trash2, RotateCcw } from 'lucide-react';
import { Habit, HabitCompletion } from '@/lib/habit-service';
import { motion } from 'framer-motion';

interface HabitListProps {
  habits: Habit[];
  completions: HabitCompletion[];
  onComplete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onArchive: (habitId: string) => void;
  onRestore?: (habitId: string) => void;
  isArchiveView?: boolean;
  getGrowthStageIcon: (habitId: string) => JSX.Element;
}

export function HabitList({
  habits,
  completions,
  onComplete,
  onEdit,
  onArchive,
  onRestore,
  isArchiveView = false,
  getGrowthStageIcon,
}: HabitListProps) {
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null);

  const isHabitCompletedToday = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return completions.some(
      completion => 
        completion.habit_id === habitId && 
        completion.completed_at.split('T')[0] === today
    );
  };

  const getHabitStreak = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    return habit?.streak || 0;
  };

  const getHabitIcon = (iconName: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'meditation': <span className="text-xl">🧘</span>,
      'water': <span className="text-xl">💧</span>,
      'exercise': <span className="text-xl">🏃</span>,
      'reading': <span className="text-xl">📚</span>,
      'journal': <span className="text-xl">📝</span>,
      'sleep': <span className="text-xl">😴</span>,
      'nutrition': <span className="text-xl">🥗</span>,
      'gratitude': <span className="text-xl">🙏</span>,
      'mindfulness': <span className="text-xl">🧠</span>,
      'social': <span className="text-xl">👥</span>,
      'nature': <span className="text-xl">🌳</span>,
      'creativity': <span className="text-xl">🎨</span>,
      'learning': <span className="text-xl">🎓</span>,
      'default': <span className="text-xl">✨</span>,
    };
    
    return iconMap[iconName] || iconMap.default;
  };

  const getFrequencyText = (habit: Habit): string => {
    switch (habit.frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'custom':
        return `Every ${habit.frequency_value} ${habit.frequency_unit}${habit.frequency_value !== 1 ? 's' : ''}`;
      default:
        return 'Custom';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getLastCompletionDate = (habitId: string): string | null => {
    const habitCompletions = completions
      .filter(c => c.habit_id === habitId)
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
    
    return habitCompletions.length > 0 ? formatDate(habitCompletions[0].completed_at) : null;
  };

  const getColorForHabit = (habit: Habit, isCompleted: boolean): string => {
    if (isCompleted) return 'wellness-green';
    
    // Map the color to our wellness color palette
    const colorMap: Record<string, string> = {
      '#10b981': 'wellness-green',
      '#3b82f6': 'wellness-blue',
      '#8b5cf6': 'wellness-purple',
      '#f59e0b': 'wellness-amber',
      '#ef4444': 'wellness-coral',
      '#06b6d4': 'wellness-teal',
      '#ec4899': 'wellness-lavender',
      '#4A90E2': 'wellness-blue',
      '#8B5CF6': 'wellness-purple',
      '#F9B44A': 'wellness-amber',
      '#4AD295': 'wellness-green',
      '#F87171': 'wellness-coral',
    };
    
    return colorMap[habit.color] || 'wellness-blue';
  };

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <motion.div
          key={habit.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="overflow-hidden border-sage-200">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isHabitCompletedToday(habit.id)}
                    onCheckedChange={() => onComplete(habit.id)}
                    className="h-5 w-5 border-sage-300 data-[state=checked]:bg-wellness-green data-[state=checked]:border-wellness-green"
                  />
                  <div>
                    <h3 className="font-medium text-deep-ocean-600">{habit.name}</h3>
                    {habit.description && (
                      <p className="text-sm text-deep-ocean-600/70">{habit.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getGrowthStageIcon(habit.id)}
                  <div className="text-sm text-deep-ocean-600/70">
                    {getHabitStreak(habit.id)} day streak
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setExpandedHabit(expandedHabit === habit.id ? null : habit.id)}
                  >
                    <Pencil className="h-4 w-4 text-deep-ocean-600/70" />
                  </Button>
                  {isArchiveView ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRestore?.(habit.id)}
                    >
                      <RotateCcw className="h-4 w-4 text-deep-ocean-600/70" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onArchive(habit.id)}
                    >
                      <Archive className="h-4 w-4 text-deep-ocean-600/70" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(habit)}
                  >
                    <Trash2 className="h-4 w-4 text-deep-ocean-600/70" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}