
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

interface OnboardingCardProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
  onSkip?: () => void;
}

const OnboardingCard: React.FC<OnboardingCardProps> = ({
  step,
  title,
  description,
  icon,
  isActive,
  isCompleted,
  onClick,
  onSkip,
}) => {
  return (
    <Card
      className={`transition-all duration-300 ${
        isActive
          ? "border-primary shadow-md"
          : isCompleted
          ? "border-green-500"
          : "opacity-70"
      }`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isCompleted
                ? "bg-green-100 text-green-600"
                : isActive
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isCompleted ? <Check size={20} /> : icon}
          </div>

          <div>
            <div className="mb-4">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Step {step}
              </div>
              <h3 className="text-lg font-semibold mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={onClick}
                variant={isActive ? "default" : "outline"}
                disabled={!isActive && !isCompleted}
                className={isCompleted ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {isCompleted ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Completed
                  </>
                ) : (
                  <>
                    {isActive && <ArrowRight className="mr-2 h-4 w-4" />} 
                    {isActive ? "Continue" : "Start"}
                  </>
                )}
              </Button>

              {isActive && onSkip && (
                <Button variant="ghost" onClick={onSkip}>
                  Skip
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OnboardingCard;
