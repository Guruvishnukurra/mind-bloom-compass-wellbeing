
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import MeditationCard from "@/components/meditation/MeditationCard";
import MeditationPlayer from "@/components/meditation/MeditationPlayer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dummy data for meditation sessions
const featuredMeditations = [
  {
    id: 1,
    title: "Morning Calm",
    description: "Start your day with clarity and purpose",
    duration: 5,
    category: "Morning",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 2,
    title: "Stress Relief",
    description: "Release tension and find your center",
    duration: 10,
    category: "Anxiety",
    image: "https://images.unsplash.com/photo-1474418397713-2f1091382ad5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2048&q=80",
  },
  {
    id: 3,
    title: "Deep Sleep",
    description: "Prepare your mind and body for restful sleep",
    duration: 15,
    category: "Sleep",
    image: "https://images.unsplash.com/photo-1455642305367-68834a9d8515?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
];

const beginnerMeditations = [
  {
    id: 4,
    title: "Meditation Basics",
    description: "Learn the fundamentals of mindfulness meditation",
    duration: 3,
    category: "Beginner",
    image: "https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 5,
    title: "Body Scan",
    description: "Develop awareness of physical sensations",
    duration: 5,
    category: "Beginner",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2220&q=80",
  },
  {
    id: 6,
    title: "Mindful Breathing",
    description: "Focus on your breath to anchor your attention",
    duration: 5,
    category: "Beginner",
    image: "https://images.unsplash.com/photo-1515023115689-589c33041d3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
  },
];

const anxietyMeditations = [
  {
    id: 7,
    title: "Calming Anxiety",
    description: "Techniques to reduce anxious thoughts and feelings",
    duration: 10,
    category: "Anxiety",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
  },
  {
    id: 8,
    title: "Grounding Exercise",
    description: "Connect with the present moment when feeling overwhelmed",
    duration: 7,
    category: "Anxiety",
    image: "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1942&q=80",
  },
  {
    id: 9,
    title: "Safe Place Visualization",
    description: "Create a mental sanctuary for comfort and security",
    duration: 12,
    category: "Anxiety",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
];

const MeditatePage = () => {
  const [playerOpen, setPlayerOpen] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState<any>(null);

  const handleMeditationSelect = (meditation: any) => {
    setSelectedMeditation(meditation);
    setPlayerOpen(true);
  };

  return (
    <Layout>
      <section className="py-8 wellness-gradient">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Meditation</h1>
          <p className="text-muted-foreground">
            Guided practices to reduce stress, improve focus, and enhance wellbeing
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="grid grid-cols-3 md:w-[400px] mb-8">
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="anxiety">Anxiety</TabsTrigger>
            </TabsList>
            
            <TabsContent value="featured">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredMeditations.map((meditation) => (
                  <MeditationCard
                    key={meditation.id}
                    title={meditation.title}
                    description={meditation.description}
                    duration={meditation.duration}
                    category={meditation.category}
                    image={meditation.image}
                    onClick={() => handleMeditationSelect(meditation)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="beginner">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {beginnerMeditations.map((meditation) => (
                  <MeditationCard
                    key={meditation.id}
                    title={meditation.title}
                    description={meditation.description}
                    duration={meditation.duration}
                    category={meditation.category}
                    image={meditation.image}
                    onClick={() => handleMeditationSelect(meditation)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="anxiety">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {anxietyMeditations.map((meditation) => (
                  <MeditationCard
                    key={meditation.id}
                    title={meditation.title}
                    description={meditation.description}
                    duration={meditation.duration}
                    category={meditation.category}
                    image={meditation.image}
                    onClick={() => handleMeditationSelect(meditation)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <MeditationPlayer
        isOpen={playerOpen}
        onClose={() => setPlayerOpen(false)}
        meditation={selectedMeditation}
      />
    </Layout>
  );
};

export default MeditatePage;
