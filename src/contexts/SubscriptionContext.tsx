import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '@/lib/razorpay';

interface SubscriptionContextType {
  currentPlan: SubscriptionPlan;
  billingCycle: 'monthly' | 'yearly';
  isLoading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS.FREE);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    if (!user) {
      setCurrentPlan(SUBSCRIPTION_PLANS.FREE);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data && data.status === 'active') {
        setCurrentPlan(data.plan as SubscriptionPlan);
        setBillingCycle(data.billing_cycle as 'monthly' | 'yearly');
      } else {
        setCurrentPlan(SUBSCRIPTION_PLANS.FREE);
        setBillingCycle('monthly');
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('Failed to load subscription status');
      setCurrentPlan(SUBSCRIPTION_PLANS.FREE);
      setBillingCycle('monthly');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const refreshSubscription = async () => {
    setIsLoading(true);
    await fetchSubscription();
  };

  return (
    <SubscriptionContext.Provider
      value={{
        currentPlan,
        billingCycle,
        isLoading,
        error,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
} 