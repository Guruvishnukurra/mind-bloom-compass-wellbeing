import { useState } from 'react';
import { Habit } from './HabitTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Plus, Sparkles } from 'lucide-react';

interface HabitSuggestionsProps {
  existingHabits: Habit[];
  onSelectSuggestion: (habit: Partial<Habit>) => void;
}

interface HabitSuggestion {
  name: string;
  description: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  frequency_value?: number;
  frequency_unit?: 'day' | 'week' | 'month';
  time_of_day?: string;
  icon: string;
  color: string;
  tags: string[];
}

export function HabitSuggestions({ existingHabits, onSelectSuggestion }: HabitSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Predefined habit suggestions
  const habitSuggestions: HabitSuggestion[] = [
    {
      name: 'Morning Meditation',
      description: 'Start your day with 10 minutes of mindfulness meditation to reduce stress and improve focus.',
      category: 'mindfulness',
      frequency: 'daily',
      time_of_day: 'morning',
      icon: 'meditation',
      color: '#8b5cf6',
      tags: ['mindfulness', 'morning', 'stress-reduction']
    },
    {
      name: 'Drink Water',
      description: 'Drink at least 8 glasses of water throughout the day to stay hydrated.',
      category: 'nutrition',
      frequency: 'daily',
      icon: 'water',
      color: '#3b82f6',
      tags: ['hydration', 'health', 'nutrition']
    },
    {
      name: '10,000 Steps',
      description: 'Walk 10,000 steps daily to improve cardiovascular health and maintain fitness.',
      category: 'physical',
      frequency: 'daily',
      icon: 'exercise',
      color: '#ef4444',
      tags: ['exercise', 'walking', 'fitness']
    },
    {
      name: 'Read for 30 Minutes',
      description: 'Read a book for at least 30 minutes to expand knowledge and reduce screen time.',
      category: 'learning',
      frequency: 'daily',
      time_of_day: 'evening',
      icon: 'reading',
      color: '#f59e0b',
      tags: ['reading', 'learning', 'evening-routine']
    },
    {
      name: 'Journal Writing',
      description: 'Write in your journal to reflect on your day, express gratitude, and process emotions.',
      category: 'self_care',
      frequency: 'daily',
      time_of_day: 'evening',
      icon: 'journal',
      color: '#10b981',
      tags: ['reflection', 'gratitude', 'evening-routine']
    },
    {
      name: 'Sleep by 10 PM',
      description: 'Go to bed by 10 PM to ensure adequate sleep and maintain a healthy sleep schedule.',
      category: 'sleep',
      frequency: 'daily',
      time_of_day: 'night',
      icon: 'sleep',
      color: '#6366f1',
      tags: ['sleep', 'night-routine', 'health']
    },
    {
      name: 'Meal Prep',
      description: 'Prepare healthy meals for the week to save time and maintain a nutritious diet.',
      category: 'nutrition',
      frequency: 'weekly',
      icon: 'nutrition',
      color: '#10b981',
      tags: ['nutrition', 'meal-planning', 'health']
    },
    {
      name: 'Gratitude Practice',
      description: 'Write down three things you are grateful for to cultivate a positive mindset.',
      category: 'mindfulness',
      frequency: 'daily',
      icon: 'gratitude',
      color: '#ec4899',
      tags: ['gratitude', 'positivity', 'mindfulness']
    },
    {
      name: 'Digital Detox',
      description: 'Take a break from screens for at least 2 hours before bedtime to improve sleep quality.',
      category: 'self_care',
      frequency: 'daily',
      time_of_day: 'evening',
      icon: 'sleep',
      color: '#6366f1',
      tags: ['digital-wellness', 'sleep', 'evening-routine']
    },
    {
      name: 'Connect with a Friend',
      description: 'Reach out to a friend or family member to maintain social connections.',
      category: 'social',
      frequency: 'weekly',
      icon: 'social',
      color: '#f97316',
      tags: ['social', 'relationships', 'connection']
    },
    {
      name: 'Spend Time in Nature',
      description: 'Spend at least 30 minutes outdoors to boost mood and vitamin D levels.',
      category: 'self_care',
      frequency: 'daily',
      icon: 'nature',
      color: '#10b981',
      tags: ['nature', 'outdoors', 'mood']
    },
    {
      name: 'Learn Something New',
      description: 'Dedicate time to learning a new skill or topic to keep your mind active.',
      category: 'learning',
      frequency: 'weekly',
      icon: 'learning',
      color: '#f59e0b',
      tags: ['learning', 'growth', 'skills']
    },
    {
      name: 'Creative Expression',
      description: 'Engage in a creative activity like drawing, writing, or music to express yourself.',
      category: 'creativity',
      frequency: 'weekly',
      icon: 'creativity',
      color: '#ec4899',
      tags: ['creativity', 'expression', 'art']
    },
    {
      name: 'Strength Training',
      description: 'Do strength exercises to build muscle and improve overall fitness.',
      category: 'physical',
      frequency: 'custom',
      frequency_value: 3,
      frequency_unit: 'week',
      icon: 'exercise',
      color: '#ef4444',
      tags: ['exercise', 'strength', 'fitness']
    },
    {
      name: 'Mindful Eating',
      description: 'Practice eating without distractions, focusing on the taste and texture of your food.',
      category: 'mindfulness',
      frequency: 'daily',
      icon: 'nutrition',
      color: '#10b981',
      tags: ['mindfulness', 'nutrition', 'awareness']
    }
  ];

  // Get all unique categories
  const categories = Array.from(new Set(habitSuggestions.map(habit => habit.category)));

  // Filter suggestions based on selected category
  const filteredSuggestions = selectedCategory
    ? habitSuggestions.filter(habit => habit.category === selectedCategory)
    : habitSuggestions;

  // Check if a suggestion is already added as a habit
  const isSuggestionAdded = (suggestion: HabitSuggestion): boolean => {
    return existingHabits.some(habit => 
      habit.name.toLowerCase() === suggestion.name.toLowerCase()
    );
  };

  // Format category name for display
  const formatCategoryName = (category: string): string => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get icon for a category
  const getCategoryIcon = (category: string): string => {
    const iconMap: Record<string, string> = {
      'mindfulness': '🧘',
      'physical': '💪',
      'nutrition': '🥗',
      'sleep': '😴',
      'social': '👥',
      'productivity': '📊',
      'learning': '📚',
      'creativity': '🎨',
      'self_care': '❤️',
      'other': '✨',
    };
    
    return iconMap[category] || '✨';
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
          Habit Suggestions
        </h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="mt-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Habit Stacking Suggestions</CardTitle>
            <CardDescription>
              Add these proven habits to your routine for better wellbeing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="text-xs"
              >
                All
              </Button>
              
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  <span className="mr-1">{getCategoryIcon(category)}</span>
                  {formatCategoryName(category)}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {filteredSuggestions.map((suggestion, index) => {
                const isAdded = isSuggestionAdded(suggestion);
                
                return (
                  <Card key={index} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                            style={{ backgroundColor: `${suggestion.color}20` }}
                          >
                            <span className="text-xl">
                              {suggestion.icon === 'meditation' && '🧘'}
                              {suggestion.icon === 'water' && '💧'}
                              {suggestion.icon === 'exercise' && '🏃'}
                              {suggestion.icon === 'reading' && '📚'}
                              {suggestion.icon === 'journal' && '📝'}
                              {suggestion.icon === 'sleep' && '😴'}
                              {suggestion.icon === 'nutrition' && '🥗'}
                              {suggestion.icon === 'gratitude' && '🙏'}
                              {suggestion.icon === 'mindfulness' && '🧠'}
                              {suggestion.icon === 'social' && '👥'}
                              {suggestion.icon === 'nature' && '🌳'}
                              {suggestion.icon === 'creativity' && '🎨'}
                              {suggestion.icon === 'learning' && '🎓'}
                              {suggestion.icon === 'default' && '✨'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium">{suggestion.name}</h4>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span>{formatCategoryName(suggestion.category)}</span>
                              <span className="mx-1">•</span>
                              <span>
                                {suggestion.frequency === 'daily' && 'Daily'}
                                {suggestion.frequency === 'weekly' && 'Weekly'}
                                {suggestion.frequency === 'monthly' && 'Monthly'}
                                {suggestion.frequency === 'custom' && 
                                  `Every ${suggestion.frequency_value} ${suggestion.frequency_unit}${suggestion.frequency_value !== 1 ? 's' : ''}`
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant={isAdded ? "outline" : "default"}
                          size="sm"
                          disabled={isAdded}
                          onClick={() => onSelectSuggestion(suggestion)}
                          className={isAdded ? "opacity-50" : ""}
                        >
                          {isAdded ? (
                            'Added'
                          ) : (
                            <>
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-3">
                        {suggestion.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {suggestion.tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="text-xs bg-muted px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}