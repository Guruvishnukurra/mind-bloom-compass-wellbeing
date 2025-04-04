
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Info } from 'lucide-react';

interface MoodEntry {
  date: string;
  mood: number;
  notes: string;
}

const generateInsight = (moodHistory: MoodEntry[]) => {
  const averageMood = moodHistory.reduce((sum, entry) => sum + entry.mood, 0) / moodHistory.length;
  const recentMoods = moodHistory.slice(-7).map(entry => entry.mood);
  const moodTrend = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;

  const insights = [
    {
      condition: averageMood < 2,
      text: "You seem to be experiencing some challenging emotions. Consider talking to a professional or reaching out to support networks."
    },
    {
      condition: averageMood >= 2 && averageMood < 3,
      text: "Your mood suggests you might benefit from some self-care and stress management techniques."
    },
    {
      condition: averageMood >= 3 && averageMood < 4,
      text: "You're maintaining a balanced emotional state. Keep practicing mindfulness and gratitude."
    },
    {
      condition: averageMood >= 4,
      text: "Great job maintaining a positive outlook! Continue nurturing the habits that support your mental wellbeing."
    }
  ];

  return insights.find(insight => insight.condition)?.text || "Keep tracking your mood to gain insights.";
};

const MoodInsightsWidget: React.FC = () => {
  const [insight, setInsight] = useState<string>("");

  useEffect(() => {
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    if (moodEntries.length > 0) {
      setInsight(generateInsight(moodEntries));
    }
  }, []);

  if (!insight) return null;

  return (
    <Card className="p-4 flex items-center gap-3">
      <Info className="text-wellness-blue" />
      <p className="text-sm text-muted-foreground">{insight}</p>
    </Card>
  );
};

export default MoodInsightsWidget;

