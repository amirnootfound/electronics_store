# Stripe Webhook Setup Guide

## 1. Get Webhook Secret

1. Go to your Stripe Dashboard: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/stripe-webhook`
4. Events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click "Add endpoint"
6. Copy the "Signing secret" (starts with `whsec_`)

## 2. Add to Environment Variables

Add to your `.env.local`:

## 3. Webhook Handler

The webhook handler is already implemented at `/app/api/stripe-webhook/route.ts`

It handles:
- Payment success events → Updates order status to "paid" and "processing"
- Payment failure events → Updates order status to "failed" and "cancelled"

## 4. Testing Webhooks Locally

To test webhooks locally during development:

1. Install Stripe CLI:
```bash
npm install -g @stripe/cli
```

2. Forward webhooks to your local server with specific events:
```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook --events payment_intent.succeeded,payment_intent.payment_failed
```

3. Your local server will receive webhook events from Stripe
4. The CLI will show a webhook signing secret (whsec_...) - add this to your `.env.local`

## 5. Production Webhook URL

When deploying:
- Use your production domain: `https://yourdomain.com/api/stripe-webhook`
- Update the webhook endpoint in Stripe Dashboard
- Make sure your server is accessible (no firewall blocking)

## 6. Security Notes

- Never commit webhook secrets to git
- Use HTTPS in production
- Verify webhook signatures (already implemented)
- Stripe retries failed webhooks automatically
