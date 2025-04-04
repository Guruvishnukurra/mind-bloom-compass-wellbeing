
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { 
  SmilePlus, 
  Smile, 
  Meh, 
  Frown, 
  FrownPlus,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const moods = [
  { value: 1, icon: FrownPlus, label: "Very Bad", color: "text-red-500" },
  { value: 2, icon: Frown, label: "Bad", color: "text-orange-400" },
  { value: 3, icon: Meh, label: "Okay", color: "text-yellow-400" },
  { value: 4, icon: Smile, label: "Good", color: "text-green-400" },
  { value: 5, icon: SmilePlus, label: "Great", color: "text-green-500" },
];

const MoodTracker = () => {
  const [moodValue, setMoodValue] = useState<number>(3);
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();

  const handleSaveMood = () => {
    // Here we would normally save to a database
    // For now, just show a success toast
    toast({
      title: "Mood saved",
      description: "Your mood has been recorded successfully.",
    });
    setNotes("");
  };

  const currentMood = moods.find((mood) => mood.value === moodValue);
  const MoodIcon = currentMood?.icon || Meh;

  return (
    <Card className="wellness-card">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">How are you feeling today?</h3>
          <div className="flex justify-center mb-4">
            <MoodIcon className={`w-16 h-16 ${currentMood?.color}`} />
          </div>
          <p className="text-xl font-medium">{currentMood?.label}</p>
        </div>

        <div className="py-4">
          <Slider
            value={[moodValue]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => setMoodValue(value[0])}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {moods.map((mood) => (
              <div key={mood.value} className="flex flex-col items-center gap-1">
                <mood.icon className={`w-4 h-4 ${moodValue === mood.value ? mood.color : ''}`} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            What's on your mind? (optional)
          </label>
          <Textarea
            id="notes"
            placeholder="Write any thoughts or feelings here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full"
          />
        </div>

        <Button 
          className="w-full flex items-center gap-2" 
          onClick={handleSaveMood}
        >
          <Save size={16} />
          Save Mood
        </Button>
      </div>
    </Card>
  );
};

export default MoodTracker;
