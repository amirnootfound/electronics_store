// ============================================================
// STRIPE WEBHOOK HANDLER — Process payment events
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createServerSupabaseClient } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-08-26.dahlia',
});

export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint - POST only' });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') || '';

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Update order status in Supabase
      if (paymentIntent.metadata.order_number) {
        try {
          const supabase = createServerSupabaseClient();
          await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              status: 'processing',
            })
            .eq('order_number', paymentIntent.metadata.order_number);

          console.log(`Order ${paymentIntent.metadata.order_number} payment succeeded`);
        } catch (error) {
          console.error('Error updating order:', error);
        }
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Update order status in Supabase
      if (paymentIntent.metadata.order_number) {
        try {
          const supabase = createServerSupabaseClient();
          await supabase
            .from('orders')
            .update({
              payment_status: 'failed',
              status: 'cancelled',
            })
            .eq('order_number', paymentIntent.metadata.order_number);

          console.log(`Order ${paymentIntent.metadata.order_number} payment failed`);
        } catch (error) {
          console.error('Error updating order:', error);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
