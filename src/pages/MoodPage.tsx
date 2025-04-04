
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import MoodTracker from "@/components/mood/MoodTracker";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart as BarChartIcon, 
  Calendar, 
  FileText, 
  List
} from "lucide-react";

// Dummy data for visualizations
const moodHistoryData = [
  { date: "Mon", mood: 3 },
  { date: "Tue", mood: 4 },
  { date: "Wed", mood: 2 },
  { date: "Thu", mood: 5 },
  { date: "Fri", mood: 4 },
  { date: "Sat", mood: 3 },
  { date: "Sun", mood: 4 },
];

const moodEntries = [
  {
    date: "Apr 4, 2025",
    mood: 4,
    notes: "Had a productive day at work. Managed stress well during the team meeting.",
  },
  {
    date: "Apr 3, 2025",
    mood: 3,
    notes: "Felt okay. Sleep was interrupted but managed to focus during the day.",
  },
  {
    date: "Apr 2, 2025",
    mood: 2,
    notes: "Difficult day with anxiety. Breathing exercises helped somewhat.",
  },
];

const MoodPage = () => {
  const [activeTab, setActiveTab] = useState("track");

  return (
    <Layout>
      <section className="py-8 wellness-gradient">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Mood Tracker</h1>
          <p className="text-muted-foreground">
            Monitor your emotional wellbeing and discover patterns over time
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="track" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="track" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Track</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span>History</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <BarChartIcon className="h-4 w-4" />
                <span>Insights</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="track">
              <div className="max-w-md mx-auto">
                <MoodTracker />
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Tips for Tracking</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-wellness-blue text-white flex items-center justify-center text-xs mt-0.5">1</div>
                      <p>Record your mood at the same time each day for consistency</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-wellness-blue text-white flex items-center justify-center text-xs mt-0.5">2</div>
                      <p>Note any factors that might be affecting your mood</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-wellness-blue text-white flex items-center justify-center text-xs mt-0.5">3</div>
                      <p>Be honest with yourself - there are no "wrong" feelings</p>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Your Recent Entries</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Last 7 days</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {moodEntries.map((entry, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">{entry.date}</p>
                          <p className="mt-2">{entry.notes}</p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-wellness-light-blue">
                          <span className="font-medium">{entry.mood}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="insights">
              <div className="space-y-8">
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-4">Weekly Mood Overview</h3>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {moodHistoryData.map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-12 bg-wellness-blue rounded-t"
                          style={{ 
                            height: `${day.mood * 20}%`,
                            opacity: day.mood * 0.15 + 0.4
                          }}
                        ></div>
                        <p className="mt-2 text-sm">{day.date}</p>
                      </div>
                    ))}
                  </div>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-medium mb-2">Average Mood</h3>
                    <div className="flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-wellness-light-blue flex items-center justify-center">
                        <span className="text-3xl font-bold">3.6</span>
                      </div>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      Your average mood is slightly above "Okay"
                    </p>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-medium mb-2">Mood Patterns</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Best mood on Thursdays</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Most challenging on Wednesdays</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Mood improves on weekends</span>
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default MoodPage;
