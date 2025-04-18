import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Habit } from './HabitTracker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface HabitFormProps {
  onHabitCreated: (habit: Habit) => void;
  onHabitUpdated: (habit: Habit) => void;
  existingHabit: Habit | null;
}

const habitCategories = [
  { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
  { value: 'physical', label: 'Physical Health', icon: '💪' },
  { value: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { value: 'sleep', label: 'Sleep', icon: '😴' },
  { value: 'social', label: 'Social', icon: '👥' },
  { value: 'productivity', label: 'Productivity', icon: '📊' },
  { value: 'learning', label: 'Learning', icon: '📚' },
  { value: 'creativity', label: 'Creativity', icon: '🎨' },
  { value: 'self_care', label: 'Self-Care', icon: '❤️' },
  { value: 'other', label: 'Other', icon: '✨' },
];

const habitIcons = [
  { value: 'meditation', label: 'Meditation', icon: '🧘' },
  { value: 'water', label: 'Water', icon: '💧' },
  { value: 'exercise', label: 'Exercise', icon: '🏃' },
  { value: 'reading', label: 'Reading', icon: '📚' },
  { value: 'journal', label: 'Journal', icon: '📝' },
  { value: 'sleep', label: 'Sleep', icon: '😴' },
  { value: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { value: 'gratitude', label: 'Gratitude', icon: '🙏' },
  { value: 'mindfulness', label: 'Mindfulness', icon: '🧠' },
  { value: 'social', label: 'Social', icon: '👥' },
  { value: 'nature', label: 'Nature', icon: '🌳' },
  { value: 'creativity', label: 'Creativity', icon: '🎨' },
  { value: 'learning', label: 'Learning', icon: '🎓' },
  { value: 'default', label: 'Default', icon: '✨' },
];

const habitColors = [
  { value: '#10b981', label: 'Green', class: 'bg-emerald-500' },
  { value: '#3b82f6', label: 'Blue', class: 'bg-blue-500' },
  { value: '#8b5cf6', label: 'Purple', class: 'bg-violet-500' },
  { value: '#ec4899', label: 'Pink', class: 'bg-pink-500' },
  { value: '#f97316', label: 'Orange', class: 'bg-orange-500' },
  { value: '#ef4444', label: 'Red', class: 'bg-red-500' },
  { value: '#f59e0b', label: 'Amber', class: 'bg-amber-500' },
  { value: '#06b6d4', label: 'Cyan', class: 'bg-cyan-500' },
  { value: '#14b8a6', label: 'Teal', class: 'bg-teal-500' },
  { value: '#6366f1', label: 'Indigo', class: 'bg-indigo-500' },
];

const formSchema = z.object({
  name: z.string().min(1, 'Habit name is required').max(100),
  description: z.string().max(500).optional(),
  category: z.string(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'custom']),
  frequency_value: z.number().min(1).max(365).optional(),
  frequency_unit: z.enum(['day', 'week', 'month']).optional(),
  time_of_day: z.string().optional(),
  reminder: z.boolean().default(false),
  reminder_time: z.string().optional(),
  color: z.string(),
  icon: z.string(),
});

export function HabitForm({ onHabitCreated, onHabitUpdated, existingHabit }: HabitFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingHabit?.name || '',
      description: existingHabit?.description || '',
      category: existingHabit?.category || 'mindfulness',
      frequency: existingHabit?.frequency || 'daily',
      frequency_value: existingHabit?.frequency_value || 1,
      frequency_unit: existingHabit?.frequency_unit || 'day',
      time_of_day: existingHabit?.time_of_day || '',
      reminder: existingHabit?.reminder || false,
      reminder_time: existingHabit?.reminder_time || '',
      color: existingHabit?.color || '#10b981',
      icon: existingHabit?.icon || 'default',
    },
  });
  
  const frequency = form.watch('frequency');
  const reminder = form.watch('reminder');
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      if (existingHabit) {
        // Update existing habit
        const updatedHabit: Habit = {
          ...existingHabit,
          name: values.name,
          description: values.description,
          category: values.category,
          frequency: values.frequency,
          frequency_value: values.frequency === 'custom' ? values.frequency_value : undefined,
          frequency_unit: values.frequency === 'custom' ? values.frequency_unit : undefined,
          time_of_day: values.time_of_day,
          reminder: values.reminder,
          reminder_time: values.reminder ? values.reminder_time : undefined,
          color: values.color,
          icon: values.icon,
        };
        
        onHabitUpdated(updatedHabit);
      } else {
        // Create new habit
        const newHabit: Habit = {
          id: uuidv4(),
          user_id: user.id,
          name: values.name,
          description: values.description,
          category: values.category,
          frequency: values.frequency,
          frequency_value: values.frequency === 'custom' ? values.frequency_value : undefined,
          frequency_unit: values.frequency === 'custom' ? values.frequency_unit : undefined,
          time_of_day: values.time_of_day,
          reminder: values.reminder,
          reminder_time: values.reminder ? values.reminder_time : undefined,
          color: values.color,
          icon: values.icon,
          created_at: new Date().toISOString(),
          archived: false,
        };
        
        onHabitCreated(newHabit);
      }
    } catch (error) {
      console.error('Error saving habit:', error);
      toast.error('Failed to save habit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Morning Meditation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Why is this habit important to you?" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {habitCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center">
                            <span className="mr-2">{category.icon}</span>
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Frequency</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="daily" />
                        </FormControl>
                        <FormLabel className="font-normal">Daily</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="weekly" />
                        </FormControl>
                        <FormLabel className="font-normal">Weekly</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="monthly" />
                        </FormControl>
                        <FormLabel className="font-normal">Monthly</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="custom" />
                        </FormControl>
                        <FormLabel className="font-normal">Custom</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {frequency === 'custom' && (
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="frequency_value"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Every</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={365} 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="frequency_unit"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="day">Day(s)</SelectItem>
                          <SelectItem value="week">Week(s)</SelectItem>
                          <SelectItem value="month">Month(s)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="time_of_day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time of Day (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                      <SelectItem value="anytime">Anytime</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    When do you plan to perform this habit?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reminder"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Reminder</FormLabel>
                    <FormDescription>
                      Receive notifications for this habit
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {reminder && (
              <FormField
                control={form.control}
                name="reminder_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reminder Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <div className="grid grid-cols-7 gap-2">
                    {habitIcons.map((icon) => (
                      <div
                        key={icon.value}
                        className={`
                          cursor-pointer rounded-md p-2 text-center
                          ${field.value === icon.value ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted'}
                        `}
                        onClick={() => form.setValue('icon', icon.value)}
                      >
                        <span className="text-xl">{icon.icon}</span>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className="grid grid-cols-5 gap-2">
                    {habitColors.map((color) => (
                      <div
                        key={color.value}
                        className={`
                          cursor-pointer rounded-md h-8
                          ${color.class}
                          ${field.value === color.value ? 'ring-2 ring-primary ring-offset-2' : ''}
                        `}
                        onClick={() => form.setValue('color', color.value)}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-wellness-teal hover:bg-wellness-teal/90"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {existingHabit ? 'Update Habit' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </Form>
  );
}