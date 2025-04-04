
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarCheck, BookOpen, Brain, BarChart } from "lucide-react";
import FeatureCard from "@/components/home/FeatureCard";
import MoodTracker from "@/components/mood/MoodTracker";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-24 wellness-gradient">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                Take control of your mental wellbeing
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Evidence-based tools to help you understand, track, and improve your mental health. Start your journey to a healthier mind today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link to="/onboarding">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/learn-more">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-full bg-wellness-blue/20 absolute top-0 left-0 animate-pulse" style={{ animationDuration: '7s' }}></div>
                <div className="w-48 h-48 rounded-full bg-wellness-green/30 absolute bottom-0 right-0 animate-pulse" style={{ animationDuration: '5s' }}></div>
                <div className="w-56 h-56 rounded-full bg-wellness-purple/20 absolute bottom-10 left-10 animate-pulse" style={{ animationDuration: '6s' }}></div>
                <img 
                  src="https://images.unsplash.com/photo-1600618528240-fb9fc964b853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                  alt="Person meditating peacefully" 
                  className="relative z-10 rounded-2xl shadow-lg w-80 h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Check-in */}
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight">How are you today?</h2>
            <p className="text-muted-foreground mt-2">Track your mood and identify patterns over time</p>
          </div>
          <div className="max-w-md mx-auto">
            <MoodTracker />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Explore Our Features</h2>
            <p className="text-muted-foreground mt-2">Tools designed to support your mental wellness journey</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<BarChart className="h-6 w-6 text-blue-600" />}
              title="Mood Tracking"
              description="Record and analyze your emotions to identify patterns and triggers."
              linkTo="/mood"
              color="bg-wellness-light-blue"
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6 text-purple-600" />}
              title="Guided Meditation"
              description="Reduce stress and improve focus with our guided meditation sessions."
              linkTo="/meditate"
              color="bg-wellness-light-purple"
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6 text-green-600" />}
              title="Journaling"
              description="Express your thoughts and feelings through guided journaling prompts."
              linkTo="/journal"
              color="bg-wellness-light-green"
            />
            <FeatureCard
              icon={<CalendarCheck className="h-6 w-6 text-amber-600" />}
              title="Resources"
              description="Access our library of mental health resources and educational content."
              linkTo="/resources"
              color="bg-amber-100"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
            <p className="text-muted-foreground mt-2">Real stories from people like you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="italic text-muted-foreground mb-4">
                "This app has been a game-changer for my anxiety. The daily check-ins and guided meditations have helped me become more aware of my feelings."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-wellness-blue"></div>
                <div>
                  <p className="font-medium">Alex M.</p>
                  <p className="text-sm text-muted-foreground">Marketing Manager</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="italic text-muted-foreground mb-4">
                "The journaling prompts have helped me process difficult emotions and gain clarity. I've noticed significant improvements in my overall wellbeing."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-wellness-green"></div>
                <div>
                  <p className="font-medium">Jamie K.</p>
                  <p className="text-sm text-muted-foreground">Graduate Student</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="italic text-muted-foreground mb-4">
                "As a therapist, I recommend this app to my clients as a supplement to our sessions. The evidence-based approach sets it apart from others."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-wellness-purple"></div>
                <div>
                  <p className="font-medium">Dr. Rivera</p>
                  <p className="text-sm text-muted-foreground">Clinical Psychologist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 wellness-gradient">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Start Your Mental Wellness Journey Today</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of others who are taking control of their mental health with our evidence-based tools and resources.
            </p>
            <div className="pt-4">
              <Button size="lg" asChild>
                <Link to="/onboarding">Get Started For Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
