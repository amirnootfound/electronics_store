// ============================================================
// ORDER CREATION API — Save order to database
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { Order } from '@/types';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      email,
      phone,
      shipping_address,
      items,
      subtotal,
      shipping_cost,
      tax_amount,
      total,
      currency,
      shipping_method,
      payment_method,
      stripe_payment_intent_id,
      order_number,
    } = body;

    // Use provided order number or generate a new one
    const orderNumber = order_number || `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create order in Supabase
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name,
        email,
        phone,
        shipping_address,
        items,
        subtotal,
        shipping_cost,
        tax_amount,
        total,
        currency,
        shipping_method,
        payment_method,
        payment_status: 'paid',
        stripe_payment_intent_id,
        status: 'processing',
      })
      .select()
      .single();

    if (error) {
      console.error('Order creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail({
        orderNumber,
        customerName: customer_name,
        customerEmail: email,
        items,
        subtotal,
        shippingCost: shipping_cost,
        taxAmount: tax_amount,
        total,
        shippingAddress: shipping_address,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({
      order: data,
      orderNumber: orderNumber,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
