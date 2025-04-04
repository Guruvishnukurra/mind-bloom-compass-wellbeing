import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Resource, ResourceCard } from './ResourceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RESOURCE_CATEGORIES = [
  'All',
  'Anxiety',
  'Depression',
  'Stress',
  'Sleep',
  'Relationships',
  'Self-Care',
];

export function ResourcesList() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'all' | 'saved'>('all');

  // Fetch resources and saved status
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        // Fetch all resources
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false });

        if (resourcesError) throw resourcesError;

        // Fetch user's saved resources
        const { data: savedData, error: savedError } = await supabase
          .from('saved_resources')
          .select('resource_id')
          .eq('user_id', user.id);

        if (savedError) throw savedError;

        setResources(resourcesData || []);
        setSavedResources(savedData?.map(item => item.resource_id) || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  // Filter resources based on search, category, and view mode
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      activeCategory === 'All' || 
      resource.tags.includes(activeCategory.toLowerCase());

    const matchesSaved = 
      viewMode === 'all' || 
      (viewMode === 'saved' && savedResources.includes(resource.id));

    return matchesSearch && matchesCategory && matchesSaved;
  });

  if (loading) {
    return <div>Loading resources...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'all' ? 'default' : 'outline'}
            onClick={() => setViewMode('all')}
          >
            All
          </Button>
          <Button
            variant={viewMode === 'saved' ? 'default' : 'outline'}
            onClick={() => setViewMode('saved')}
          >
            Saved
          </Button>
        </div>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="w-full flex-wrap">
          {RESOURCE_CATEGORIES.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map(resource => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            isSaved={savedResources.includes(resource.id)}
            onSaveToggle={() => {
              setSavedResources(prev =>
                prev.includes(resource.id)
                  ? prev.filter(id => id !== resource.id)
                  : [...prev, resource.id]
              );
            }}
          />
        ))}

        {filteredResources.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No resources found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
} 