-- Drop Stripe-specific columns
ALTER TABLE public.subscriptions
    DROP COLUMN IF EXISTS stripe_customer_id,
    DROP COLUMN IF EXISTS stripe_subscription_id;

-- Add Razorpay-specific columns
ALTER TABLE public.subscriptions
    ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
    ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
    ADD COLUMN IF NOT EXISTS razorpay_signature TEXT,
    ADD COLUMN IF NOT EXISTS billing_cycle TEXT NOT NULL DEFAULT 'monthly';

-- Update indexes
DROP INDEX IF EXISTS subscriptions_stripe_customer_id_idx;
DROP INDEX IF EXISTS subscriptions_stripe_subscription_id_idx;
CREATE INDEX IF NOT EXISTS subscriptions_razorpay_order_id_idx ON public.subscriptions(razorpay_order_id);
CREATE INDEX IF NOT EXISTS subscriptions_razorpay_payment_id_idx ON public.subscriptions(razorpay_payment_id);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;

CREATE POLICY "Users can view their own subscriptions"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
    ON public.subscriptions
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
    ON public.subscriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id); 