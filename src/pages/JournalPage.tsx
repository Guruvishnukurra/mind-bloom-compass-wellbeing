
import React from "react";
import Layout from "@/components/layout/Layout";
import JournalPrompt from "@/components/journal/JournalPrompt";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, List, BookmarkPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Dummy data for past entries
const pastEntries = [
  {
    id: 1,
    date: "Apr 3, 2025",
    prompt: "What am I grateful for today?",
    content: "Today I'm grateful for the support of my friends. Had a difficult meeting at work, but talking it through with Sarah helped me gain perspective.",
    mood: "Good",
  },
  {
    id: 2,
    date: "Apr 1, 2025",
    prompt: "What's one thing I did today that I'm proud of?",
    content: "I finally started that project I've been putting off for weeks. It wasn't as overwhelming as I thought once I broke it down into smaller tasks.",
    mood: "Great",
  },
  {
    id: 3,
    date: "Mar 30, 2025",
    prompt: "How am I feeling right now? Why might I be feeling this way?",
    content: "Feeling anxious about the upcoming presentation. I think it's because I haven't prepared as thoroughly as I usually do. Going to set aside time tomorrow to practice.",
    mood: "Okay",
  },
];

// Dummy data for prompts library
const promptsLibrary = [
  {
    category: "Gratitude",
    prompts: [
      "List three things you're grateful for today and why.",
      "What's something small that brought you joy recently?",
      "Who has helped you recently that you're thankful for?",
    ],
  },
  {
    category: "Self-Reflection",
    prompts: [
      "What's a challenge you're currently facing? How might you overcome it?",
      "What are you learning about yourself right now?",
      "How have your priorities shifted over the past year?",
    ],
  },
  {
    category: "Emotional Awareness",
    prompts: [
      "What emotions have been most present for you today?",
      "When did you last feel truly at peace? What created that feeling?",
      "What's a difficult emotion you've been avoiding?",
    ],
  },
];

const JournalPage = () => {
  return (
    <Layout>
      <section className="py-8 wellness-gradient">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Journal</h1>
          <p className="text-muted-foreground">
            Express your thoughts and feelings through guided reflection
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="write" className="w-full">
            <TabsList className="grid grid-cols-3 md:w-[400px] mb-8">
              <TabsTrigger value="write" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Write</span>
              </TabsTrigger>
              <TabsTrigger value="entries" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span>Past Entries</span>
              </TabsTrigger>
              <TabsTrigger value="prompts" className="flex items-center gap-2">
                <BookmarkPlus className="h-4 w-4" />
                <span>Prompts</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="write">
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Today's Journal</h2>
                  <p className="text-sm text-muted-foreground">
                    Take a few minutes to reflect on the prompt below. There are no right or wrong answers.
                  </p>
                </div>
                
                <JournalPrompt />
                
                <div className="mt-8 p-6 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Journaling Tips</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-wellness-blue flex items-center justify-center text-white text-sm">1</div>
                      <div>
                        <p className="font-medium">Be honest with yourself</p>
                        <p className="text-sm text-muted-foreground">Your journal is private. Write what you truly feel.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-wellness-blue flex items-center justify-center text-white text-sm">2</div>
                      <div>
                        <p className="font-medium">Don't overthink it</p>
                        <p className="text-sm text-muted-foreground">Let your thoughts flow naturally without judgment.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-wellness-blue flex items-center justify-center text-white text-sm">3</div>
                      <div>
                        <p className="font-medium">Make it a habit</p>
                        <p className="text-sm text-muted-foreground">Regular journaling provides the most benefit for mental wellbeing.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="entries">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Journal Entries</h2>
                  <p className="text-sm text-muted-foreground">Total: {pastEntries.length} entries</p>
                </div>
                
                {pastEntries.map((entry) => (
                  <Card key={entry.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{entry.date}</p>
                        <h3 className="font-medium mt-1">{entry.prompt}</h3>
                      </div>
                      <Badge>{entry.mood}</Badge>
                    </div>
                    <p className="text-muted-foreground">{entry.content}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="prompts">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Journal Prompts Library</h2>
                  <p className="text-sm text-muted-foreground">
                    Browse our collection of prompts to inspire your journaling practice.
                  </p>
                </div>
                
                {promptsLibrary.map((category, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <div className="w-2 h-6 bg-wellness-blue rounded"></div>
                      {category.category} Prompts
                    </h3>
                    <div className="grid gap-4">
                      {category.prompts.map((prompt, i) => (
                        <Card key={i} className="p-4 hover:border-wellness-blue transition-colors cursor-pointer">
                          <p>{prompt}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default JournalPage;
