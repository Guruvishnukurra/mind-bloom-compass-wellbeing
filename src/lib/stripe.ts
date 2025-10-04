import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PREMIUM: 'premium',
  FAMILY: 'family',
} as const;

export const SUBSCRIPTION_PRICES = {
  [SUBSCRIPTION_PLANS.PREMIUM]: {
    monthly: {
      priceId: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
      amount: 9.99,
      currency: 'USD',
    },
    yearly: {
      priceId: import.meta.env.VITE_STRIPE_PREMIUM_YEARLY_PRICE_ID,
      amount: 99.99,
      currency: 'USD',
    },
  },
  [SUBSCRIPTION_PLANS.FAMILY]: {
    monthly: {
      priceId: import.meta.env.VITE_STRIPE_FAMILY_MONTHLY_PRICE_ID,
      amount: 19.99,
      currency: 'USD',
    },
    yearly: {
      priceId: import.meta.env.VITE_STRIPE_FAMILY_YEARLY_PRICE_ID,
      amount: 199.99,
      currency: 'USD',
    },
  },
} as const;

export const FEATURES = {
  [SUBSCRIPTION_PLANS.FREE]: [
    'Basic meditation sessions',
    'Basic habit tracking',
    'Mood tracking',
    'Basic journaling',
  ],
  [SUBSCRIPTION_PLANS.PREMIUM]: [
    'All meditation sessions',
    'Advanced analytics',
    'Custom habit templates',
    'Ad-free experience',
    'Priority support',
    'Guided journaling',
    'Progress insights',
  ],
  [SUBSCRIPTION_PLANS.FAMILY]: [
    'Everything in Premium',
    'Up to 5 family members',
    'Family progress tracking',
    'Family goals',
    'Shared resources',
  ],
} as const;

export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS];
export type SubscriptionPrice = typeof SUBSCRIPTION_PRICES[keyof typeof SUBSCRIPTION_PRICES]; 