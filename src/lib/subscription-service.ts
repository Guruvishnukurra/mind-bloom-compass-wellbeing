import { supabase } from '@/lib/supabase';
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '@/lib/razorpay';

interface CreateSubscriptionParams {
  userId: string;
  plan: SubscriptionPlan;
  billingCycle: 'monthly' | 'yearly';
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export async function createSubscription({
  userId,
  plan,
  billingCycle,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: CreateSubscriptionParams) {
  const { data, error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      plan,
      status: 'active',
      billing_cycle: billingCycle,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(
        Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
      ).toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function cancelSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: true,
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
} 