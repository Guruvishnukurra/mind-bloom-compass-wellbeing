
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface ResourceCardProps {
  title: string;
  description: string;
  type: string;
  tags: string[];
  url: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  description,
  type,
  tags,
  url,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge>{type}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="p-4 pt-0 mt-auto">
        <Button 
          variant="secondary" 
          className="w-full flex items-center gap-2"
          asChild
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} />
            View Resource
          </a>
        </Button>
      </div>
    </Card>
  );
};

export default ResourceCard;
