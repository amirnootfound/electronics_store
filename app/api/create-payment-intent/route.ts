// ============================================================
// STRIPE PAYMENT INTENT API — Server-side payment processing
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'usd', metadata, customer_email } = body;

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create payment intent with Stripe
    const paymentIntent = await createPaymentIntent({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: metadata || {},
      customer_email,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
