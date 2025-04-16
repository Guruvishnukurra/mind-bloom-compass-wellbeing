import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Resource {
  id: string;
  title: string;
  description: string;
  content_type: 'article' | 'video' | 'exercise' | 'tool';
  content_url: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ResourceCardProps {
  resource: Resource;
  isSaved: boolean;
  onSaveToggle: () => void;
}

export const ResourceCard = ({ resource, isSaved, onSaveToggle }: ResourceCardProps) => {
  const { user } = useAuth();

  const handleSaveToggle = async () => {
    if (!user) return;

    try {
      if (isSaved) {
        await supabase
          .from('saved_resources')
          .delete()
          .eq('user_id', user.id)
          .eq('resource_id', resource.id);
      } else {
        await supabase
          .from('saved_resources')
          .insert({
            user_id: user.id,
            resource_id: resource.id,
          });
      }
      onSaveToggle();
    } catch (error) {
      console.error('Error toggling resource save:', error);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg">{resource.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            {resource.content_type}
          </span>
          {resource.tags && resource.tags.map((tag, index) => (
            <span key={index} className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveToggle}
          className="flex items-center gap-2"
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Saved' : 'Save'}
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => window.open(resource.content_url, '_blank')}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          View
        </Button>
      </CardFooter>
    </Card>
  );
};
