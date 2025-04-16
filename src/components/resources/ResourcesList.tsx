import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ResourceCard, Resource } from './ResourceCard';
import { Card } from '@/components/ui/card';
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

        if (error) throw error;
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
        const { data, error } = await supabase
          .from('saved_resources')
          .select('resource_id')
          .eq('user_id', user.id);

        if (error) throw error;
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
      if (savedResources.includes(resourceId)) {
        await supabase
          .from('saved_resources')
          .delete()
          .eq('user_id', user.id)
          .eq('resource_id', resourceId);
        setSavedResources(prev => prev.filter(id => id !== resourceId));
      } else {
        await supabase
          .from('saved_resources')
          .insert({
            user_id: user.id,
            resource_id: resourceId,
          });
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