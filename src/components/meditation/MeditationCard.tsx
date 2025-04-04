
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MeditationCardProps {
  title: string;
  description: string;
  duration: number;
  category: string;
  image: string;
  onClick: () => void;
}

const MeditationCard: React.FC<MeditationCardProps> = ({
  title,
  description,
  duration,
  category,
  image,
  onClick,
}) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div 
        className="h-40 bg-cover bg-center relative" 
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-3">
          <Badge variant="secondary" className="bg-white/90 text-black">
            {duration} min
          </Badge>
        </div>
        <div className="absolute top-0 right-0 p-3">
          <Badge variant="outline" className="bg-white/90 text-black">
            {category}
          </Badge>
        </div>
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      </div>
      <div className="p-4 pt-0 mt-auto">
        <Button 
          onClick={onClick} 
          variant="default" 
          className="w-full flex items-center gap-2"
        >
          <Play size={16} />
          Start Session
        </Button>
      </div>
    </Card>
  );
};

export default MeditationCard;
