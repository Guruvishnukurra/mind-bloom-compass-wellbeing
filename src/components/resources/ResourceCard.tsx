import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, ExternalLinkIcon } from 'lucide-react';
import { toast } from 'sonner';

export interface Resource {
  id: string;
  title: string;
  description: string;
  content_type: 'article' | 'video' | 'exercise' | 'tool';
  content_url: string;
  tags: string[];
  created_at: string;
}

interface ResourceCardProps {
  resource: Resource;
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

export function ResourceCard({ resource, isSaved, onSaveToggle }: ResourceCardProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleSaveToggle = async () => {
    if (!user) return;

    setSaving(true);
    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_resources')
          .delete()
          .match({ user_id: user.id, resource_id: resource.id });

        if (error) throw error;
        toast.success('Resource removed from saved items');
      } else {
        const { error } = await supabase
          .from('saved_resources')
          .insert([{ user_id: user.id, resource_id: resource.id }]);

        if (error) throw error;
        toast.success('Resource saved successfully');
      }

      onSaveToggle?.();
    } catch (error) {
      toast.error('Failed to update saved status');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{resource.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSaveToggle}
            disabled={saving}
          >
            <BookmarkIcon
              className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{resource.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-primary/10 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm capitalize text-muted-foreground">
            {resource.content_type}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(resource.content_url, '_blank')}
          >
            Open Resource
            <ExternalLinkIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
