import { loadScript } from '@/lib/utils';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PREMIUM: 'premium',
  FAMILY: 'family',
} as const;

export const SUBSCRIPTION_PRICES = {
  [SUBSCRIPTION_PLANS.PREMIUM]: {
    monthly: {
      amount: 999, // ₹999
      currency: 'INR',
    },
    yearly: {
      amount: 9999, // ₹9,999
      currency: 'INR',
    },
  },
  [SUBSCRIPTION_PLANS.FAMILY]: {
    monthly: {
      amount: 1999, // ₹1,999
      currency: 'INR',
    },
    yearly: {
      amount: 19999, // ₹19,999
      currency: 'INR',
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

export async function initializeRazorpay() {
  const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
  if (!res) {
    throw new Error('Razorpay SDK failed to load');
  }
  return window.Razorpay;
}

export async function createOrder(amount: number, currency: string) {
  try {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function verifyPayment(
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
) {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      }),
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
} 