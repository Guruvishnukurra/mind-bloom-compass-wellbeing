
import React from "react";
import Layout from "@/components/layout/Layout";
import ResourceCard from "@/components/resources/ResourceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

// Dummy data for resources
const educationalResources = [
  {
    id: 1,
    title: "Understanding Anxiety",
    description: "Learn about the science behind anxiety and evidence-based management strategies.",
    type: "Article",
    tags: ["Anxiety", "CBT", "Self-Help"],
    url: "#",
  },
  {
    id: 2,
    title: "The Science of Sleep",
    description: "How quality sleep impacts mental health and practical tips for better rest.",
    type: "Guide",
    tags: ["Sleep", "Habits", "Wellness"],
    url: "#",
  },
  {
    id: 3,
    title: "Mindfulness Fundamentals",
    description: "Core concepts of mindfulness practice and its benefits for mental health.",
    type: "Course",
    tags: ["Mindfulness", "Beginners", "Practice"],
    url: "#",
  },
];

const exercisesResources = [
  {
    id: 4,
    title: "5-4-3-2-1 Grounding Technique",
    description: "A simple exercise to manage anxiety and bring yourself back to the present moment.",
    type: "Exercise",
    tags: ["Anxiety", "Grounding", "Quick"],
    url: "#",
  },
  {
    id: 5,
    title: "Cognitive Restructuring Worksheet",
    description: "Identify and challenge negative thought patterns with this CBT-based exercise.",
    type: "Worksheet",
    tags: ["CBT", "Thoughts", "Depression"],
    url: "#",
  },
  {
    id: 6,
    title: "Progressive Muscle Relaxation",
    description: "Step-by-step guide to release physical tension and promote relaxation.",
    type: "Exercise",
    tags: ["Relaxation", "Stress", "Body"],
    url: "#",
  },
];

const crisisResources = [
  {
    id: 7,
    title: "National Suicide Prevention Lifeline",
    description: "24/7 support for people in distress. Call 988 or chat online.",
    type: "Hotline",
    tags: ["Crisis", "Suicide", "Immediate Help"],
    url: "#",
  },
  {
    id: 8,
    title: "Crisis Text Line",
    description: "Free 24/7 text support with a trained crisis counselor. Text HOME to 741741.",
    type: "Text Service",
    tags: ["Crisis", "Text", "Support"],
    url: "#",
  },
  {
    id: 9,
    title: "Finding a Therapist Guide",
    description: "Step-by-step guidance on finding professional mental health support.",
    type: "Guide",
    tags: ["Therapy", "Professional Help", "Resources"],
    url: "#",
  },
];

const ResourcesPage = () => {
  return (
    <Layout>
      <section className="py-8 wellness-gradient">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Resources Library</h1>
          <p className="text-muted-foreground">
            Evidence-based tools and information to support your mental wellness journey
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container px-4 md:px-6">
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="educational" className="w-full">
            <TabsList className="grid grid-cols-3 md:w-[400px] mb-8">
              <TabsTrigger value="educational">Educational</TabsTrigger>
              <TabsTrigger value="exercises">Exercises</TabsTrigger>
              <TabsTrigger value="crisis">Crisis Support</TabsTrigger>
            </TabsList>
            
            <TabsContent value="educational">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {educationalResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    title={resource.title}
                    description={resource.description}
                    type={resource.type}
                    tags={resource.tags}
                    url={resource.url}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="exercises">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {exercisesResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    title={resource.title}
                    description={resource.description}
                    type={resource.type}
                    tags={resource.tags}
                    url={resource.url}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="crisis">
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-medium text-red-800 mb-2">If you're in immediate danger</h3>
                <p className="text-red-800">
                  If you or someone you know is in immediate danger, please call emergency services (911 in the US) or go to your nearest emergency room.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {crisisResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    title={resource.title}
                    description={resource.description}
                    type={resource.type}
                    tags={resource.tags}
                    url={resource.url}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default ResourcesPage;
