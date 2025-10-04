import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

interface FeatureGateProps {
  children: React.ReactNode;
  requiredPlan?: typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS];
  fallback?: React.ReactNode;
}

export function FeatureGate({
  children,
  requiredPlan = SUBSCRIPTION_PLANS.PREMIUM,
  fallback,
}: FeatureGateProps) {
  const { currentPlan, isLoading } = useSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const hasAccess = currentPlan === requiredPlan || currentPlan === SUBSCRIPTION_PLANS.FAMILY;

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <Lock className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
      <p className="text-muted-foreground mb-4">
        This feature is available with our {requiredPlan} plan.
      </p>
      <Button onClick={() => navigate('/pricing')}>Upgrade Now</Button>
    </div>
  );
} 