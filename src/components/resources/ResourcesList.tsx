import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ResourceCard, Resource } from './ResourceCard';
import { Loader2 } from 'lucide-react';

interface ResourcesListProps {
  searchQuery?: string;
  contentType?: 'article' | 'video' | 'exercise' | 'tool' | null;
  limit?: number;
}

export const ResourcesList = ({ searchQuery = '', contentType = null, limit }: ResourcesListProps) => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        
        // Check if resources table exists
        const { error: tableCheckError } = await supabase
          .from('resources')
          .select('id')
          .limit(1);
          
        if (tableCheckError) {
          console.warn('Resources table may not be set up yet:', tableCheckError.message);
          // Set some dummy resources for development
          setResources([
            {
              id: '1',
              title: 'Understanding Anxiety',
              description: 'Learn about the science behind anxiety and evidence-based management strategies.',
              content_type: 'article',
              content_url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
              tags: ['anxiety', 'mental health', 'education'],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: '2',
              title: 'Guided Morning Meditation',
              description: 'Start your day with this calming 10-minute meditation practice.',
              content_type: 'video',
              content_url: 'https://www.youtube.com/watch?v=inpok4MKVLM',
              tags: ['meditation', 'mindfulness', 'morning routine'],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: '3',
              title: '5-4-3-2-1 Grounding Exercise',
              description: 'A simple but effective technique to manage anxiety and panic attacks using your senses.',
              content_type: 'exercise',
              content_url: 'https://www.urmc.rochester.edu/behavioral-health-partners/bhp-blog/april-2018/5-4-3-2-1-coping-technique-for-anxiety.aspx',
              tags: ['anxiety', 'grounding', 'coping'],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);
          setLoading(false);
          return;
        }
        
        let query = supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false });

        if (contentType) {
          query = query.eq('content_type', contentType);
        }

        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching resources:', error);
          setError('Failed to load resources');
          setLoading(false);
          return;
        }
        
        setResources(data || []);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedResources = async () => {
      if (!user) return;

      try {
        // Check if saved_resources table exists
        const { error: tableCheckError } = await supabase
          .from('saved_resources')
          .select('id')
          .limit(1);
          
        if (tableCheckError) {
          console.warn('Saved resources table may not be set up yet:', tableCheckError.message);
          return;
        }
        
        const { data, error } = await supabase
          .from('saved_resources')
          .select('resource_id')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching saved resources:', error);
          return;
        }
        
        setSavedResources(data.map(item => item.resource_id));
      } catch (err) {
        console.error('Error fetching saved resources:', err);
      }
    };

    fetchResources();
    fetchSavedResources();
  }, [searchQuery, contentType, user, limit]);

  const handleSaveToggle = async (resourceId: string) => {
    if (!user) return;

    try {
      // Check if saved_resources table exists
      const { error: tableCheckError } = await supabase
        .from('saved_resources')
        .select('id')
        .limit(1);
        
      if (tableCheckError) {
        console.warn('Saved resources table may not be set up yet:', tableCheckError.message);
        // Just toggle the state locally for development
        if (savedResources.includes(resourceId)) {
          setSavedResources(prev => prev.filter(id => id !== resourceId));
        } else {
          setSavedResources(prev => [...prev, resourceId]);
        }
        return;
      }
      
      if (savedResources.includes(resourceId)) {
        const { error } = await supabase
          .from('saved_resources')
          .delete()
          .eq('user_id', user.id)
          .eq('resource_id', resourceId);
          
        if (error) {
          console.error('Error removing saved resource:', error);
          return;
        }
        
        setSavedResources(prev => prev.filter(id => id !== resourceId));
      } else {
        const { error } = await supabase
          .from('saved_resources')
          .insert({
            user_id: user.id,
            resource_id: resourceId,
          });
          
        if (error) {
          console.error('Error saving resource:', error);
          return;
        }
        
        setSavedResources(prev => [...prev, resourceId]);
      }
    } catch (error) {
      console.error('Error toggling resource save:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading resources...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No resources found. Try adjusting your search or filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map(resource => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          isSaved={savedResources.includes(resource.id)}
          onSaveToggle={() => handleSaveToggle(resource.id)}
        />
      ))}
    </div>
  );
}; 