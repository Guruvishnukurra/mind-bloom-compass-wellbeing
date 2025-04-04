
import React from 'react';
import Layout from '@/components/layout/Layout';
import BreathingGame from '@/components/games/BreathingGame';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GamesPage = () => {
  return (
    <Layout>
      <section className="py-8 wellness-gradient">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Wellness Activities</h1>
          <p className="text-muted-foreground">
            Interactive exercises to help reduce stress and improve mental wellbeing
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="breathing" className="w-full">
            <TabsList className="grid grid-cols-3 md:w-[400px] mb-8">
              <TabsTrigger value="breathing">Breathing</TabsTrigger>
              <TabsTrigger value="focus">Focus</TabsTrigger>
              <TabsTrigger value="relaxation">Relaxation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="breathing">
              <div className="max-w-xl mx-auto">
                <BreathingGame />
              </div>
            </TabsContent>
            
            <TabsContent value="focus">
              <div className="max-w-xl mx-auto">
                <Card className="p-6 text-center">
                  <h3 className="text-lg font-medium mb-4">Focus Activities</h3>
                  <p className="text-muted-foreground">
                    Coming soon! Check back for focus-enhancing exercises.
                  </p>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="relaxation">
              <div className="max-w-xl mx-auto">
                <Card className="p-6 text-center">
                  <h3 className="text-lg font-medium mb-4">Relaxation Activities</h3>
                  <p className="text-muted-foreground">
                    Coming soon! Check back for relaxation exercises.
                  </p>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default GamesPage;
