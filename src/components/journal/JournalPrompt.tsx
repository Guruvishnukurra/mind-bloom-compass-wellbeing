
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JournalPromptProps {
  onPromptChange?: () => void;
}

const promptsList = [
  "What am I grateful for today?",
  "What's something that challenged me today and how did I handle it?",
  "What's one thing I did today that I'm proud of?",
  "How am I feeling right now? Why might I be feeling this way?",
  "What's something I'm looking forward to tomorrow?",
  "When did I last feel truly calm? What was happening?",
  "What's one small step I can take today to improve my mental wellbeing?",
  "Who is someone that brings me joy? How can I connect with them soon?",
  "What's a thought pattern I want to change?",
  "What's a small victory I experienced today?"
];

const JournalPrompt: React.FC<JournalPromptProps> = ({ onPromptChange }) => {
  const [currentPrompt, setCurrentPrompt] = useState<string>(
    promptsList[Math.floor(Math.random() * promptsList.length)]
  );
  const [journalEntry, setJournalEntry] = useState<string>("");
  const { toast } = useToast();

  const changePrompt = () => {
    const newPrompt = promptsList[Math.floor(Math.random() * promptsList.length)];
    setCurrentPrompt(newPrompt);
    if (onPromptChange) {
      onPromptChange();
    }
  };

  const saveEntry = () => {
    if (journalEntry.trim().length === 0) {
      toast({
        title: "Entry is empty",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }

    // Here we would normally save to a database
    // For now, just show a success toast
    toast({
      title: "Journal entry saved",
      description: "Your thoughts have been recorded successfully.",
    });
    
    setJournalEntry("");
    changePrompt();
  };

  return (
    <Card className="wellness-card">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-medium">{currentPrompt}</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={changePrompt}
            aria-label="Change prompt"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <Textarea
          placeholder="Start writing here..."
          className="min-h-[200px] resize-none"
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
        />

        <Button 
          onClick={saveEntry}
          className="w-full flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Entry
        </Button>
      </div>
    </Card>
  );
};

export default JournalPrompt;
