
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OnboardingCard from "@/components/onboarding/OnboardingCard";
import { 
  UserCheck, 
  Brain, 
  Target, 
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OnboardingPage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const handleStepComplete = (step: number) => {
    setCompletedSteps([...completedSteps, step]);
    setActiveStep(step + 1);

    if (step === 3) {
      setIsComplete(true);
      toast({
        title: "Onboarding complete!",
        description: "Welcome to MindBloom. Your journey to better mental wellness begins now.",
      });
    }
  };

  const handleSkip = (step: number) => {
    setActiveStep(step + 1);
    
    if (step === 3) {
      setIsComplete(true);
      toast({
        title: "Onboarding complete!",
        description: "Welcome to MindBloom. You can always update your preferences later.",
      });
    }
  };

  if (isComplete) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen wellness-gradient flex flex-col">
      <div className="container px-4 md:px-6 py-8 md:py-12 flex-grow flex flex-col">
        <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to MindBloom</h1>
            <p className="text-muted-foreground text-lg">
              Let's set up your personalized mental wellness journey
            </p>
          </div>

          <div className="space-y-6">
            <OnboardingCard
              step={1}
              title="Personal Profile"
              description="Tell us a bit about yourself so we can personalize your experience."
              icon={<UserCheck size={20} />}
              isActive={activeStep === 1}
              isCompleted={completedSteps.includes(1)}
              onClick={() => handleStepComplete(1)}
              onSkip={() => handleSkip(1)}
            />

            <OnboardingCard
              step={2}
              title="Wellness Assessment"
              description="A brief questionnaire to understand your current mental wellbeing."
              icon={<Brain size={20} />}
              isActive={activeStep === 2}
              isCompleted={completedSteps.includes(2)}
              onClick={() => handleStepComplete(2)}
              onSkip={() => handleSkip(2)}
            />

            <OnboardingCard
              step={3}
              title="Set Your Goals"
              description="Define what mental wellness means to you and set achievable goals."
              icon={<Target size={20} />}
              isActive={activeStep === 3}
              isCompleted={completedSteps.includes(3)}
              onClick={() => handleStepComplete(3)}
              onSkip={() => handleSkip(3)}
            />

            <OnboardingCard
              step={4}
              title="All Set!"
              description="You're ready to start your mental wellness journey with MindBloom."
              icon={<CheckCircle size={20} />}
              isActive={activeStep === 4}
              isCompleted={completedSteps.includes(4)}
              onClick={() => setIsComplete(true)}
              onSkip={() => setIsComplete(true)}
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => setIsComplete(true)}>
            Skip onboarding for now
          </Button>
        </div>
      </div>

      <div className="container px-4 py-4 flex justify-between text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} MindBloom</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:text-primary">Terms of Service</a>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
