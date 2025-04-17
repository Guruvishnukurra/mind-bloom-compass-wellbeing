import { useState } from 'react';
import { Habit } from './HabitTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Plus, Sparkles, Seedling, Leaf, Flower, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

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

  // Updated habit suggestions with new colors
  const habitSuggestions: HabitSuggestion[] = [
    {
      name: 'Morning Meditation',
      description: 'Start your day with 10 minutes of mindfulness meditation to reduce stress and improve focus.',
      category: 'mindfulness',
      frequency: 'daily',
      time_of_day: 'morning',
      icon: 'meditation',
      color: '#8B5CF6', // wellness-purple
      tags: ['mindfulness', 'morning', 'stress-reduction']
    },
    {
      name: 'Drink Water',
      description: 'Drink at least 8 glasses of water throughout the day to stay hydrated.',
      category: 'nutrition',
      frequency: 'daily',
      icon: 'water',
      color: '#4A90E2', // wellness-blue
      tags: ['hydration', 'health', 'nutrition']
    },
    {
      name: '10,000 Steps',
      description: 'Walk 10,000 steps daily to improve cardiovascular health and maintain fitness.',
      category: 'physical',
      frequency: 'daily',
      icon: 'exercise',
      color: '#FF8882', // wellness-coral
      tags: ['exercise', 'walking', 'fitness']
    },
    {
      name: 'Read for 30 Minutes',
      description: 'Read a book for at least 30 minutes to expand knowledge and reduce screen time.',
      category: 'learning',
      frequency: 'daily',
      time_of_day: 'evening',
      icon: 'reading',
      color: '#F9B44A', // wellness-amber
      tags: ['reading', 'learning', 'evening-routine']
    },
    {
      name: 'Journal Writing',
      description: 'Write in your journal to reflect on your day, express gratitude, and process emotions.',
      category: 'self_care',
      frequency: 'daily',
      time_of_day: 'evening',
      icon: 'journal',
      color: '#4AD295', // wellness-green
      tags: ['reflection', 'gratitude', 'evening-routine']
    },
    {
      name: 'Sleep by 10 PM',
      description: 'Go to bed by 10 PM to ensure adequate sleep and maintain a healthy sleep schedule.',
      category: 'sleep',
      frequency: 'daily',
      time_of_day: 'night',
      icon: 'sleep',
      color: '#3A7BD5', // wellness-deep-blue
      tags: ['sleep', 'night-routine', 'health']
    },
    {
      name: 'Meal Prep',
      description: 'Prepare healthy meals for the week to save time and maintain a nutritious diet.',
      category: 'nutrition',
      frequency: 'weekly',
      icon: 'nutrition',
      color: '#4AD295', // wellness-green
      tags: ['nutrition', 'meal-planning', 'health']
    },
    {
      name: 'Gratitude Practice',
      description: 'Write down three things you are grateful for to cultivate a positive mindset.',
      category: 'mindfulness',
      frequency: 'daily',
      icon: 'gratitude',
      color: '#A78BFA', // wellness-lavender
      tags: ['gratitude', 'positivity', 'mindfulness']
    },
    {
      name: 'Digital Detox',
      description: 'Take a break from screens for at least 2 hours before bedtime to improve sleep quality.',
      category: 'self_care',
      frequency: 'daily',
      time_of_day: 'evening',
      icon: 'sleep',
      color: '#3A7BD5', // wellness-deep-blue
      tags: ['digital-wellness', 'sleep', 'evening-routine']
    },
    {
      name: 'Connect with a Friend',
      description: 'Reach out to a friend or family member to maintain social connections.',
      category: 'social',
      frequency: 'weekly',
      icon: 'social',
      color: '#F8A97D', // wellness-orange
      tags: ['social', 'relationships', 'connection']
    },
    {
      name: 'Spend Time in Nature',
      description: 'Spend at least 30 minutes outdoors to boost mood and vitamin D levels.',
      category: 'self_care',
      frequency: 'daily',
      icon: 'nature',
      color: '#4AD295', // wellness-green
      tags: ['nature', 'outdoors', 'mood']
    },
    {
      name: 'Learn Something New',
      description: 'Dedicate time to learning a new skill or topic to keep your mind active.',
      category: 'learning',
      frequency: 'weekly',
      icon: 'learning',
      color: '#F9B44A', // wellness-amber
      tags: ['learning', 'growth', 'skills']
    },
    {
      name: 'Creative Expression',
      description: 'Engage in a creative activity like drawing, writing, or music to express yourself.',
      category: 'creativity',
      frequency: 'weekly',
      icon: 'creativity',
      color: '#A78BFA', // wellness-lavender
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
      color: '#FF8882', // wellness-coral
      tags: ['exercise', 'strength', 'fitness']
    },
    {
      name: 'Mindful Eating',
      description: 'Practice eating without distractions, focusing on the taste and texture of your food.',
      category: 'mindfulness',
      frequency: 'daily',
      icon: 'nutrition',
      color: '#4AD295', // wellness-green
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
  const getCategoryIcon = (category: string): JSX.Element => {
    const iconMap: Record<string, JSX.Element> = {
      'mindfulness': <span className="text-wellness-purple">🧘</span>,
      'physical': <span className="text-wellness-coral">💪</span>,
      'nutrition': <span className="text-wellness-green">🥗</span>,
      'sleep': <span className="text-wellness-deep-blue">😴</span>,
      'social': <span className="text-wellness-orange">👥</span>,
      'productivity': <span className="text-wellness-blue">📊</span>,
      'learning': <span className="text-wellness-amber">📚</span>,
      'creativity': <span className="text-wellness-lavender">🎨</span>,
      'self_care': <span className="text-wellness-mint">❤️</span>,
      'other': <span className="text-wellness-blue">✨</span>,
    };
    
    return iconMap[category] || <span className="text-wellness-blue">✨</span>;
  };

  // Get color for a category
  const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      'mindfulness': 'wellness-purple',
      'physical': 'wellness-coral',
      'nutrition': 'wellness-green',
      'sleep': 'wellness-deep-blue',
      'social': 'wellness-orange',
      'productivity': 'wellness-blue',
      'learning': 'wellness-amber',
      'creativity': 'wellness-lavender',
      'self_care': 'wellness-mint',
      'other': 'wellness-blue',
    };
    
    return colorMap[category] || 'wellness-blue';
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Seedling className="h-5 w-5 text-wellness-green" />
          Habit Seeds
        </h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="text-wellness-green hover:text-wellness-green/80 hover:bg-wellness-green/10">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="mt-4">
        <Card className="border-0 shadow-md overflow-hidden">
          <CardHeader className="pb-2 border-b border-neutral-mist/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-wellness-green/10 flex items-center justify-center">
                <Seedling className="h-4 w-4 text-wellness-green" />
              </div>
              <div>
                <CardTitle>Habit Seeds Collection</CardTitle>
                <CardDescription>
                  Plant these proven habits in your garden for better wellbeing
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-wellness-green hover:bg-wellness-green/90" : ""}
              >
                All Seeds
              </Button>
              
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? `bg-${getCategoryColor(category)} hover:bg-${getCategoryColor(category)}/90` : ""}
                >
                  <span className="mr-2">{getCategoryIcon(category)}</span>
                  {formatCategoryName(category)}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {filteredSuggestions.map((suggestion, index) => {
                const isAdded = isSuggestionAdded(suggestion);
        const categoryColor = getCategoryColor(suggestion.category);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className={`h-1.5 w-full bg-${categoryColor}`}></div>
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div 
                              className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 bg-${categoryColor}/20 text-${categoryColor}`}
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
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <Badge variant="outline" className={`mr-2 border-${categoryColor}/30 bg-${categoryColor}/10 text-xs font-normal`}>
                                  {formatCategoryName(suggestion.category)}
                                </Badge>
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
                            className={isAdded 
                              ? "opacity-50" 
                              : `bg-${categoryColor} hover:bg-${categoryColor}/90`
                            }
                          >
                            {isAdded ? (
                              'Planted'
                            ) : (
                              <>
                                <Seedling className="h-3 w-3 mr-1" />
                                Plant
                              </>
                            )}
                          </Button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-3">
                          {suggestion.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mt-3">
                          <Tag className="h-3 w-3 text-muted-foreground mr-1" />
                          {suggestion.tags.map((tag, tagIndex) => (
                            <span 
                              key={tagIndex}
                              className="text-xs bg-neutral-mist/20 px-2 py-0.5 rounded-full text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}