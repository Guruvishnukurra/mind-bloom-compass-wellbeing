
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { getMoodEntries, getAnalyticsData } from '@/utils/storageUtils';

const generateInsight = () => {
  const analytics = getAnalyticsData();
  const averageMood = analytics.averageMood;
  
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
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    const moodEntries = getMoodEntries();
    if (moodEntries.length > 0) {
      setInsight(generateInsight());
    }
  }, [refreshKey]);
  
  // Refresh insights every 60 seconds if user stays on page
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 60000);
    
    return () => clearInterval(intervalId);
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
