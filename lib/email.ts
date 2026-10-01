// ============================================================
// EMAIL NOTIFICATIONS — Using Resend for transactional emails
// ============================================================

import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface OrderConfirmationEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export async function sendOrderConfirmationEmail(data: OrderConfirmationEmailData) {
  if (!resend) {
    console.error('Resend not configured');
    return;
  }

  try {
    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <p style="margin: 0; font-weight: 600; color: #1d1d1f;">${item.product_name}</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #6e6e73;">Qty: ${item.quantity} × $${item.price.toFixed(2)}</p>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #1d1d1f;">
          $${(item.quantity * item.price).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f7;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #0071e3 0%, #0055b3 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">Order Confirmed!</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Thank you for your purchase</p>
            </div>

            <!-- Order Number -->
            <div style="padding: 24px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 14px; color: #6e6e73;">Order Number</p>
              <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: 700; color: #1d1d1f;">${data.orderNumber}</p>
            </div>

            <!-- Customer Info -->
            <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #1d1d1f;">Shipping Details</h2>
              <p style="margin: 0; color: #1d1d1f; font-weight: 600;">${data.customerName}</p>
              <p style="margin: 4px 0 0 0; color: #6e6e73; font-size: 14px;">
                ${data.shippingAddress.line1}${data.shippingAddress.line2 ? ', ' + data.shippingAddress.line2 : ''}<br>
                ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postal_code}<br>
                ${data.shippingAddress.country}
              </p>
            </div>

            <!-- Order Items -->
            <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #1d1d1f;">Order Items</h2>
              <table style="width: 100%; border-collapse: collapse;">
                ${itemsHtml}
              </table>
            </div>

            <!-- Order Summary -->
            <div style="padding: 24px; background-color: #f9fafb;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6e6e73;">Subtotal</span>
                <span style="color: #1d1d1f; font-weight: 600;">$${data.subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6e6e73;">Shipping</span>
                <span style="color: #1d1d1f; font-weight: 600;">$${data.shippingCost.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6e6e73;">Tax</span>
                <span style="color: #1d1d1f; font-weight: 600;">$${data.taxAmount.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 2px solid #e5e7eb;">
                <span style="color: #1d1d1f; font-weight: 700; font-size: 18px;">Total</span>
                <span style="color: #0071e3; font-weight: 700; font-size: 18px;">$${data.total.toFixed(2)}</span>
              </div>
            </div>

            <!-- Footer -->
            <div style="padding: 24px; text-align: center; background-color: #f9fafb;">
              <p style="margin: 0; color: #6e6e73; font-size: 14px;">You'll receive another email when your order ships.</p>
              <p style="margin: 8px 0 0 0; color: #6e6e73; font-size: 12px;">Questions? Contact us at support@techstore.com</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // For testing without domain verification, use Resend's test email
    const testEmail = 'delivered@resend.dev';
    
    const result = await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_STORE_NAME || 'TechStore'} <onboarding@resend.dev>`,

      // Production
      // from: `${storeName} <orders@theirdomain.com>`,

      to: [testEmail], // Use test email for development
      subject: `Order Confirmation - ${data.orderNumber}`,
      html,
    });

    console.log('Order confirmation email sent to test address:', testEmail);
    console.log('Original customer email would be:', data.customerEmail);
    console.log('Email result:', result);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function sendShippingUpdateEmail(orderNumber: string, customerEmail: string, status: string, trackingNumber?: string) {
  if (!resend) {
    console.error('Resend not configured');
    return;
  }

  try {
    const statusMessages = {
      processing: 'Your order is being processed and will be shipped soon.',
      shipped: `Your order has been shipped!${trackingNumber ? ` Tracking number: ${trackingNumber}` : ''}`,
      delivered: 'Your order has been delivered. Thank you for shopping with us!',
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Update</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f7;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #0071e3 0%, #0055b3 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">Order Update</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">${orderNumber}</p>
            </div>
            <div style="padding: 32px; text-align: center;">
              <p style="margin: 0; color: #1d1d1f; font-size: 18px;">${statusMessages[status as keyof typeof statusMessages] || 'Your order status has been updated.'}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_STORE_NAME || 'TechStore'} <onboarding@resend.dev>`,

      // Production
      // from: `${storeName} <orders@theirdomain.com>`,

      to: [customerEmail],
      subject: `Order Update - ${orderNumber}`,
      html,
    });

    console.log('Shipping update email sent to:', customerEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
