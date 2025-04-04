
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  linkTo,
  color,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="p-6 flex-grow">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      </div>
      <div className="p-6 pt-0 mt-auto">
        <Button asChild variant="outline" className="w-full">
          <Link to={linkTo}>Explore</Link>
        </Button>
      </div>
    </Card>
  );
};

export default FeatureCard;
