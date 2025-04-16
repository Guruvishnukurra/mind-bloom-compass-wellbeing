
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { ResourcesList } from "@/components/resources/ResourcesList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContentType, setSelectedContentType] = useState<'article' | 'video' | 'exercise' | 'tool' | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => {
            if (value === 'all') setSelectedContentType(null);
            else if (value === 'articles') setSelectedContentType('article');
            else if (value === 'videos') setSelectedContentType('video');
            else if (value === 'exercises') setSelectedContentType('exercise');
            else if (value === 'tools') setSelectedContentType('tool');
          }}>
            <TabsList className="grid grid-cols-5 md:w-[500px] mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="exercises">Exercises</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <ResourcesList searchQuery={searchQuery} contentType={null} />
            </TabsContent>
            
            <TabsContent value="articles">
              <ResourcesList searchQuery={searchQuery} contentType="article" />
            </TabsContent>
            
            <TabsContent value="videos">
              <ResourcesList searchQuery={searchQuery} contentType="video" />
            </TabsContent>
            
            <TabsContent value="exercises">
              <ResourcesList searchQuery={searchQuery} contentType="exercise" />
            </TabsContent>
            
            <TabsContent value="tools">
              <ResourcesList searchQuery={searchQuery} contentType="tool" />
            </TabsContent>
          </Tabs>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="text-lg font-medium text-amber-800 mb-2">Crisis Support</h3>
            <p className="text-amber-800 mb-4">
              If you or someone you know is in immediate danger, please call emergency services (911 in the US) or go to your nearest emergency room.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                className="bg-white hover:bg-amber-100"
                onClick={() => window.open('https://988lifeline.org/', '_blank')}
              >
                National Suicide Prevention Lifeline (988)
              </Button>
              <Button 
                variant="outline" 
                className="bg-white hover:bg-amber-100"
                onClick={() => window.open('https://www.crisistextline.org/', '_blank')}
              >
                Crisis Text Line (Text HOME to 741741)
              </Button>
              <Button 
                variant="outline" 
                className="bg-white hover:bg-amber-100"
                onClick={() => window.open('https://findtreatment.samhsa.gov/', '_blank')}
              >
                Find Treatment (SAMHSA)
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResourcesPage;
