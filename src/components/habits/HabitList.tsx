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
  Flame
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface HabitListProps {
  habits: Habit[];
  completions: HabitCompletion[];
  onComplete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onArchive: (habitId: string) => void;
  onRestore?: (habitId: string) => void;
  isArchiveView?: boolean;
}

export function HabitList({ 
  habits, 
  completions, 
  onComplete, 
  onEdit, 
  onArchive,
  onRestore,
  isArchiveView = false
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

  return (
    <div className="space-y-4">
      {habits.map(habit => {
        const isCompleted = isHabitCompletedToday(habit.id);
        const streak = getHabitStreak(habit.id);
        const completionRate = getCompletionRate(habit.id);
        const lastCompletionDate = getLastCompletionDate(habit.id);
        
        return (
          <Collapsible
            key={habit.id}
            open={expandedHabitId === habit.id}
            onOpenChange={() => toggleExpand(habit.id)}
            className="w-full"
          >
            <Card className={cn(
              "border-l-4 transition-all duration-200",
              isCompleted ? "border-l-green-500" : `border-l-[${habit.color}]`,
              isArchiveView ? "opacity-70" : ""
            )}>
              <CardContent className="p-0">
                <div className="flex items-center p-4">
                  <div className="flex-shrink-0 mr-4">
                    <div 
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        isCompleted ? "bg-green-100" : `bg-[${habit.color}]/10`
                      )}
                    >
                      {getHabitIcon(habit.icon)}
                    </div>
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{habit.name}</h3>
                      <div className="flex items-center ml-2">
                        {streak > 0 && (
                          <Badge variant="outline" className="mr-2 flex items-center gap-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            <span>{streak}</span>
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
                              Edit
                            </DropdownMenuItem>
                            {isArchiveView && onRestore ? (
                              <DropdownMenuItem onClick={() => onRestore(habit.id)}>
                                <Undo className="mr-2 h-4 w-4" />
                                Restore
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => onArchive(habit.id)}>
                                <Archive className="mr-2 h-4 w-4" />
                                Archive
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
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
                      <Checkbox 
                        checked={isCompleted}
                        onCheckedChange={() => {
                          if (!isCompleted) {
                            onComplete(habit.id);
                          }
                        }}
                        disabled={isCompleted}
                        className={cn(
                          "h-6 w-6 border-2",
                          isCompleted ? "bg-green-500 border-green-500" : "border-gray-300"
                        )}
                      />
                    </div>
                  )}
                </div>
                
                <CollapsibleContent>
                  <div className="px-4 pb-4 pt-0 border-t">
                    {habit.description && (
                      <p className="text-sm text-muted-foreground mb-3">{habit.description}</p>
                    )}
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completion rate</span>
                          <span>{completionRate}%</span>
                        </div>
                        <Progress value={completionRate} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Current streak:</span>
                          <div className="font-medium flex items-center">
                            <Flame className="h-4 w-4 text-orange-500 mr-1" />
                            {streak} day{streak !== 1 ? 's' : ''}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Last completed:</span>
                          <div className="font-medium">
                            {lastCompletionDate || 'Never'}
                          </div>
                        </div>
                      </div>
                      
                      {!isCompleted && !isArchiveView && (
                        <Button 
                          onClick={() => onComplete(habit.id)} 
                          className="w-full mt-2 bg-wellness-teal hover:bg-wellness-teal/90"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Mark as Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </CardContent>
            </Card>
            
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full mt-1 text-xs text-muted-foreground">
                {expandedHabitId === habit.id ? 'Show less' : 'Show more'}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        );
      })}
    </div>
  );
}