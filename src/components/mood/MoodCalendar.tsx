import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoodEntry } from './MoodTracker';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MoodCalendarProps {
  entries: MoodEntry[];
}

export function MoodCalendar({ entries }: MoodCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(null);
    setSelectedEntry(null);
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(null);
    setSelectedEntry(null);
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Get mood entry for a specific date
  const getMoodEntryForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return entries.find(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate.toISOString().split('T')[0] === dateStr;
    });
  };

  // Get mood color based on score
  const getMoodColor = (score: number) => {
    if (score >= 4.5) return 'bg-green-500';
    if (score >= 3.5) return 'bg-green-400';
    if (score >= 2.5) return 'bg-yellow-400';
    if (score >= 1.5) return 'bg-orange-400';
    return 'bg-red-400';
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const entry = getMoodEntryForDate(date);
    setSelectedEntry(entry || null);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 md:h-14"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const entry = getMoodEntryForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div 
          key={day} 
          className={`relative h-10 md:h-14 border rounded-md flex flex-col items-center justify-center cursor-pointer transition-all
            ${isToday ? 'border-primary' : 'border-transparent hover:border-gray-200'}
            ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
          `}
          onClick={() => handleDateClick(date)}
        >
          <span className={`text-sm ${isToday ? 'font-bold' : ''}`}>{day}</span>
          {entry && (
            <div 
              className={`w-6 h-1 rounded-full mt-1 ${getMoodColor(entry.mood_score)}`}
              title={`Mood: ${entry.mood_score}/5`}
            ></div>
          )}
        </div>
      );
    }

    return days;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Mood Calendar</CardTitle>
            <CardDescription>
              View your mood history by day
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {generateCalendarDays()}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Mood Legend</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>The colored bars indicate your mood score for that day</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex space-x-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-400 mr-1"></div>
              <span className="text-xs">Very Bad</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-orange-400 mr-1"></div>
              <span className="text-xs">Bad</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-400 mr-1"></div>
              <span className="text-xs">Neutral</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-400 mr-1"></div>
              <span className="text-xs">Good</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs">Very Good</span>
            </div>
          </div>
        </div>

        {selectedEntry && (
          <Card className="mt-4 border-dashed">
            <CardHeader className="py-3">
              <CardTitle className="text-base">
                {selectedDate && formatDate(selectedDate)}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Mood:</span>
                  <div className={`w-4 h-4 rounded-full ${getMoodColor(selectedEntry.mood_score)} mr-2`}></div>
                  <span>{selectedEntry.mood_score}/5</span>
                </div>
                
                <div>
                  <span className="font-medium">Factors:</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {Object.entries(selectedEntry.factors).map(([factor, value]) => (
                      <div key={factor} className="flex items-center">
                        <span className="text-sm capitalize">{factor}:</span>
                        <span className="text-sm ml-1">{value}/5</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedEntry.notes && (
                  <div>
                    <span className="font-medium">Notes:</span>
                    <p className="text-sm mt-1">{selectedEntry.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}