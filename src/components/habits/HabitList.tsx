import { useState } from 'react';
import { Habit, HabitCompletion } from './HabitTracker';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Check, 
  MoreVertical, 
  Edit, 
  Archive, 
  Undo, 
  Calendar, 
  Clock, 
  AlertCircle,
  Flame,
  Droplets,
  Sun,
  Leaf,
  Trees,
  Sprout
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface HabitListProps {
  habits: Habit[];
  completions: HabitCompletion[];
  onComplete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onArchive: (habitId: string) => void;
  onRestore?: (habitId: string) => void;
  isArchiveView?: boolean;
  getGrowthStageIcon?: (habitId: string) => JSX.Element;
}

export function HabitList({ 
  habits, 
  completions, 
  onComplete, 
  onEdit, 
  onArchive,
  onRestore,
  isArchiveView = false,
  getGrowthStageIcon
}: HabitListProps) {
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);

  const toggleExpand = (habitId: string) => {
    setExpandedHabitId(expandedHabitId === habitId ? null : habitId);
  };

  const isHabitCompletedToday = (habitId: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return completions.some(completion => {
      const completionDate = new Date(completion.completed_at);
      completionDate.setHours(0, 0, 0, 0);
      return completion.habit_id === habitId && completionDate.getTime() === today.getTime();
    });
  };

  const getHabitStreak = (habitId: string): number => {
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

  const getCompletionRate = (habitId: string): number => {
    const habitCompletions = completions.filter(c => c.habit_id === habitId);
    if (habitCompletions.length === 0) return 0;
    
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;
    
    const createdDate = new Date(habit.created_at);
    const today = new Date();
    
    // Calculate days since creation
    const daysSinceCreation = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Get unique completion dates
    const uniqueCompletionDates = new Set(
      habitCompletions.map(c => {
        const date = new Date(c.completed_at);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      })
    );
    
    return Math.min(100, Math.round((uniqueCompletionDates.size / daysSinceCreation) * 100));
  };

  const getTotalCompletions = (habitId: string): number => {
    return completions.filter(c => c.habit_id === habitId).length;
  };

  const getGrowthStage = (habitId: string): string => {
    const totalCompletions = getTotalCompletions(habitId);
    
    if (totalCompletions === 0) return 'seed';
    if (totalCompletions < 3) return 'sprout';
    if (totalCompletions < 7) return 'seedling';
    if (totalCompletions < 21) return 'growing';
    if (totalCompletions < 30) return 'blooming';
    return 'flourishing';
  };

  const getGrowthStageText = (stage: string): string => {
    switch (stage) {
      case 'seed': return 'Seed';
      case 'sprout': return 'Sprout';
      case 'seedling': return 'Seedling';
      case 'growing': return 'Growing';
      case 'blooming': return 'Blooming';
      case 'flourishing': return 'Flourishing';
      default: return 'Seed';
    }
  };

  const getDefaultGrowthStageIcon = (stage: string) => {
    switch (stage) {
      case 'seed': return <Seedling className="h-6 w-6" />;
      case 'sprout': return <Sprout className="h-6 w-6" />;
      case 'seedling': return <Leaf className="h-6 w-6" />;
      case 'growing': return <Seedling className="h-6 w-6" />;
      case 'blooming': return <Flower className="h-6 w-6" />;
      case 'flourishing': return <Flower className="h-6 w-6" />;
      default: return <Seedling className="h-6 w-6" />;
    }
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
    <div className="space-y-6">
      {habits.map((habit, index) => {
        const isCompleted = isHabitCompletedToday(habit.id);
        const streak = getHabitStreak(habit.id);
        const completionRate = getCompletionRate(habit.id);
        const lastCompletionDate = getLastCompletionDate(habit.id);
        const totalCompletions = getTotalCompletions(habit.id);
        const growthStage = getGrowthStage(habit.id);
        const habitColor = getColorForHabit(habit, isCompleted);
        
        return (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Collapsible
              open={expandedHabitId === habit.id}
              onOpenChange={() => toggleExpand(habit.id)}
              className="w-full"
            >
              <Card className={cn(
                "border-0 shadow-md overflow-hidden transition-all duration-200",
                isArchiveView ? "opacity-80 bg-neutral-mist/10" : "bg-white"
              )}>
                <CardContent className="p-0">
                  <div className={cn(
                    "h-1.5 w-full",
                    `bg-${habitColor}`
                  )}></div>
                  
                  <div className="flex items-center p-4">
                    <div className="flex-shrink-0 mr-4">
                      <div 
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          isCompleted 
                            ? "bg-wellness-green/20 text-wellness-green" 
                            : `bg-${habitColor}/20 text-${habitColor}`
                        )}
                      >
                        {getGrowthStageIcon 
                          ? getGrowthStageIcon(habit.id) 
                          : getDefaultGrowthStageIcon(growthStage)}
                      </div>
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{habit.name}</h3>
                        <div className="flex items-center ml-2">
                          {streak > 0 && (
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "mr-2 flex items-center gap-1 border-wellness-amber/30 bg-wellness-amber/10",
                                streak >= 7 ? "border-wellness-amber bg-wellness-amber/20" : ""
                              )}
                            >
                              <Flame className="h-3 w-3 text-wellness-amber" />
                              <span className={streak >= 7 ? "text-wellness-amber font-medium" : ""}>{streak}</span>
                            </Badge>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEdit(habit)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {isArchiveView ? 'Edit Plant' : 'Tend to Plant'}
                              </DropdownMenuItem>
                              {isArchiveView && onRestore ? (
                                <DropdownMenuItem onClick={() => onRestore(habit.id)}>
                                  <Seedling className="mr-2 h-4 w-4" />
                                  Replant
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => onArchive(habit.id)}>
                                  <Archive className="mr-2 h-4 w-4" />
                                  Move to Dormant
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Badge variant="outline" className="mr-2 text-xs font-normal border-neutral-mist/50 bg-neutral-mist/10">
                          {getGrowthStageText(growthStage)}
                        </Badge>
                        
                        <Calendar className="h-3 w-3 mr-1" />
                        <span className="mr-3">{getFrequencyText(habit)}</span>
                        
                        {habit.time_of_day && (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{habit.time_of_day}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {!isArchiveView && (
                      <div className="ml-4">
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={isCompleted}
                          onClick={() => {
                            if (!isCompleted) {
                              onComplete(habit.id);
                            }
                          }}
                          className={cn(
                            "h-10 w-10 rounded-full border-2",
                            isCompleted 
                              ? "bg-wellness-green/20 border-wellness-green text-wellness-green" 
                              : "border-neutral-mist hover:border-wellness-blue hover:text-wellness-blue"
                          )}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <Droplets className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 pt-2 border-t border-neutral-mist/30">
                      {habit.description && (
                        <p className="text-sm text-muted-foreground mb-4">{habit.description}</p>
                      )}
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Growth progress</span>
                            <span>{completionRate}%</span>
                          </div>
                          <Progress 
                            value={completionRate} 
                            className={`h-2 bg-neutral-mist/30 [&>div]:bg-${habitColor}`}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 text-sm">
                          <div className="bg-neutral-mist/10 p-3 rounded-lg">
                            <span className="text-muted-foreground block mb-1">Current streak:</span>
                            <div className="font-medium flex items-center">
                              <Flame className="h-4 w-4 text-wellness-amber mr-2" />
                              {streak} day{streak !== 1 ? 's' : ''}
                            </div>
                          </div>
                          
                          <div className="bg-neutral-mist/10 p-3 rounded-lg">
                            <span className="text-muted-foreground block mb-1">Total nurturing:</span>
                            <div className="font-medium flex items-center">
                              <Droplets className="h-4 w-4 text-wellness-blue mr-2" />
                              {totalCompletions} time{totalCompletions !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-neutral-mist/10 p-3 rounded-lg">
                          <span className="text-muted-foreground block mb-1">Last tended:</span>
                          <div className="font-medium flex items-center">
                            <Sun className="h-4 w-4 text-wellness-amber mr-2" />
                            {lastCompletionDate || 'Not yet nurtured'}
                          </div>
                        </div>
                        
                        {!isCompleted && !isArchiveView && (
                          <Button 
                            onClick={() => onComplete(habit.id)} 
                            className={`w-full mt-2 bg-${habitColor} hover:bg-${habitColor}/90 text-white`}
                          >
                            <Droplets className="mr-2 h-4 w-4" />
                            Nurture Today
                          </Button>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Card>
              
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full mt-1 text-xs text-muted-foreground">
                  {expandedHabitId === habit.id ? 'Show less' : 'Show details'}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </motion.div>
        );
      })}
    </div>
  );
}