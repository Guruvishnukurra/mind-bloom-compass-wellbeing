import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { SUBSCRIPTION_PLANS, SUBSCRIPTION_PRICES, FEATURES, initializeRazorpay, createOrder, verifyPayment } from '@/lib/razorpay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createSubscription } from '@/lib/subscription-service';

export default function PricingPage() {
  const { user } = useAuth();
  const { currentPlan, refreshSubscription } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to subscribe to a plan.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    try {
      setIsLoading(plan);
      const price = SUBSCRIPTION_PRICES[plan][billingCycle];
      
      // Initialize Razorpay
      const Razorpay = await initializeRazorpay();
      
      // Create order
      const order = await createOrder(price.amount, price.currency);
      
      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'MindBloom',
        description: `${plan} Plan - ${billingCycle}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            await verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
            
            // Create subscription in database
            await createSubscription({
              userId: user.id,
              plan: plan as SubscriptionPlan,
              billingCycle,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            
            // Update subscription in context
            await refreshSubscription();
            
            toast({
              title: 'Success!',
              description: 'Your subscription has been activated.',
            });
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast({
              title: 'Error',
              description: 'Payment verification failed. Please contact support.',
              variant: 'destructive',
            });
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
        },
        theme: {
          color: '#10b981',
        },
      };

      // Open Razorpay payment modal
      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to start payment process. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground text-lg">
          Select the perfect plan for your wellness journey
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-muted p-1 rounded-lg inline-flex">
          <Button
            variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
            onClick={() => setBillingCycle('monthly')}
            className="rounded-md"
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
            onClick={() => setBillingCycle('yearly')}
            className="rounded-md"
          >
            Yearly
            <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </Button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <Card className="p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-muted-foreground mb-4">Perfect for getting started</p>
            <div className="text-3xl font-bold mb-2">₹0</div>
            <p className="text-sm text-muted-foreground">Forever free</p>
          </div>
          <ul className="space-y-3 mb-6 flex-grow">
            {FEATURES[SUBSCRIPTION_PLANS.FREE].map((feature) => (
              <li key={feature} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            variant={currentPlan === SUBSCRIPTION_PLANS.FREE ? 'default' : 'outline'}
            className="w-full"
            disabled={currentPlan === SUBSCRIPTION_PLANS.FREE}
          >
            {currentPlan === SUBSCRIPTION_PLANS.FREE ? 'Current Plan' : 'Get Started'}
          </Button>
        </Card>

        {/* Premium Plan */}
        <Card className="p-6 flex flex-col border-primary relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
              Most Popular
            </span>
          </div>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Premium</h3>
            <p className="text-muted-foreground mb-4">For serious wellness enthusiasts</p>
            <div className="text-3xl font-bold mb-2">
              ₹{SUBSCRIPTION_PRICES[SUBSCRIPTION_PLANS.PREMIUM][billingCycle].amount}
            </div>
            <p className="text-sm text-muted-foreground">
              per {billingCycle === 'monthly' ? 'month' : 'year'}
            </p>
          </div>
          <ul className="space-y-3 mb-6 flex-grow">
            {FEATURES[SUBSCRIPTION_PLANS.PREMIUM].map((feature) => (
              <li key={feature} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            variant={currentPlan === SUBSCRIPTION_PLANS.PREMIUM ? 'default' : 'default'}
            className="w-full"
            onClick={() => handleSubscribe(SUBSCRIPTION_PLANS.PREMIUM)}
            disabled={currentPlan === SUBSCRIPTION_PLANS.PREMIUM || isLoading === SUBSCRIPTION_PLANS.PREMIUM}
          >
            {isLoading === SUBSCRIPTION_PLANS.PREMIUM
              ? 'Loading...'
              : currentPlan === SUBSCRIPTION_PLANS.PREMIUM
              ? 'Current Plan'
              : 'Upgrade to Premium'}
          </Button>
        </Card>

        {/* Family Plan */}
        <Card className="p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Family</h3>
            <p className="text-muted-foreground mb-4">For the whole family</p>
            <div className="text-3xl font-bold mb-2">
              ₹{SUBSCRIPTION_PRICES[SUBSCRIPTION_PLANS.FAMILY][billingCycle].amount}
            </div>
            <p className="text-sm text-muted-foreground">
              per {billingCycle === 'monthly' ? 'month' : 'year'}
            </p>
          </div>
          <ul className="space-y-3 mb-6 flex-grow">
            {FEATURES[SUBSCRIPTION_PLANS.FAMILY].map((feature) => (
              <li key={feature} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            variant={currentPlan === SUBSCRIPTION_PLANS.FAMILY ? 'default' : 'outline'}
            className="w-full"
            onClick={() => handleSubscribe(SUBSCRIPTION_PLANS.FAMILY)}
            disabled={currentPlan === SUBSCRIPTION_PLANS.FAMILY || isLoading === SUBSCRIPTION_PLANS.FAMILY}
          >
            {isLoading === SUBSCRIPTION_PLANS.FAMILY
              ? 'Loading...'
              : currentPlan === SUBSCRIPTION_PLANS.FAMILY
              ? 'Current Plan'
              : 'Get Family Plan'}
          </Button>
        </Card>
      </div>
    </div>
  );
} 