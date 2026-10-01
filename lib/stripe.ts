// ============================================================
// STRIPE INTEGRATION — Payment processing for US market
// ============================================================

import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2026-08-26.dahlia',
}) : null;

export interface CreatePaymentIntentParams {
  amount: number; // in cents
  currency: string;
  metadata?: Record<string, string>;
  customer_email?: string;
}

export async function createPaymentIntent(params: CreatePaymentIntentParams) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      metadata: params.metadata || {},
      receipt_email: params.customer_email || undefined,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    // If email is invalid, retry without receipt_email
    if (error.code === 'email_invalid' && params.customer_email) {
      console.log('Retrying without receipt_email due to invalid email');
      return await stripe.paymentIntents.create({
        amount: params.amount,
        currency: params.currency,
        metadata: params.metadata || {},
        automatic_payment_methods: {
          enabled: true,
        },
      });
    }
    throw error;
  }
}

export async function confirmPaymentIntent(paymentIntentId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw error;
  }
}
