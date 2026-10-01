// ============================================================
// ORDERS API — Fetch and manage orders
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { sendShippingUpdateEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const supabase = createServerSupabaseClient();
    
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders: data });
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, payment_status, tracking_number } = body;

    const supabase = createServerSupabaseClient();
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (payment_status) updateData.payment_status = payment_status;
    if (tracking_number !== undefined) updateData.tracking_number = tracking_number;

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    // Send shipping update email if status changed
    if (status && ['processing', 'shipped', 'delivered'].includes(status)) {
      try {
        await sendShippingUpdateEmail(
          data.order_number,
          data.email,
          status,
          tracking_number
        );
      } catch (emailError) {
        console.error('Failed to send shipping update email:', emailError);
        // Don't fail the order update if email fails
      }
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
