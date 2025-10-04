import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Habit } from '@/lib/habit-service';

interface HabitFormProps {
  onHabitCreated: (habit: Omit<Habit, 'id'>) => void;
  onHabitUpdated: (habitId: string, updates: Partial<Habit>) => void;
  existingHabit?: Habit;
}

export function HabitForm({ onHabitCreated, onHabitUpdated, existingHabit }: HabitFormProps) {
  const [name, setName] = useState(existingHabit?.name || '');
  const [description, setDescription] = useState(existingHabit?.description || '');
  const [category, setCategory] = useState(existingHabit?.category || '');
  const [frequency, setFrequency] = useState(existingHabit?.frequency || 'daily');
  const [color, setColor] = useState(existingHabit?.color || '#4AD295');
  const [icon, setIcon] = useState(existingHabit?.icon || 'leaf');
  const [reminder, setReminder] = useState(existingHabit?.reminder || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const habitData = {
      name,
      description,
      category,
      frequency,
      color,
      icon,
      reminder,
      created_at: existingHabit?.created_at || new Date().toISOString(),
      archived: existingHabit?.archived || false,
      completed: existingHabit?.completed || false,
      streak: existingHabit?.streak || 0,
      lastCompleted: existingHabit?.lastCompleted || null,
      user_id: existingHabit?.user_id || '',
    };

    if (existingHabit) {
      onHabitUpdated(existingHabit.id, habitData);
    } else {
      onHabitCreated(habitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Habit Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What habit would you like to cultivate?"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your habit and its benefits..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="health">Health & Wellness</SelectItem>
            <SelectItem value="mindfulness">Mindfulness</SelectItem>
            <SelectItem value="productivity">Productivity</SelectItem>
            <SelectItem value="learning">Learning</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency</Label>
        <Select value={frequency} onValueChange={setFrequency}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon</Label>
        <Select value={icon} onValueChange={setIcon}>
          <SelectTrigger>
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="leaf">Leaf</SelectItem>
            <SelectItem value="flower">Flower</SelectItem>
            <SelectItem value="tree">Tree</SelectItem>
            <SelectItem value="sun">Sun</SelectItem>
            <SelectItem value="moon">Moon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="reminder"
          checked={reminder}
          onCheckedChange={setReminder}
        />
        <Label htmlFor="reminder">Enable Reminders</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setName('');
            setDescription('');
            setCategory('');
            setFrequency('daily');
            setColor('#4AD295');
            setIcon('leaf');
            setReminder(false);
          }}
        >
          Reset
        </Button>
        <Button type="submit">
          {existingHabit ? 'Update Habit' : 'Create Habit'}
        </Button>
      </div>
    </form>
  );
}