"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { useCurrency } from "@/context/CurrencyContext";
import { CheckoutForm, ShippingMethod } from "@/types";
import { calculateTax, getTaxRate } from "@/lib/tax";
import { calculateShipping, getShippingRates } from "@/lib/shipping";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' },
];

function CheckoutFormContent() {
  const { cartItems, cartTotal, cartCount, clearCart } = useStore();
  const { formatPrice: formatCurrencyPrice } = useCurrency();
  const stripe = useStripe();
  const elements = useElements();
  
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "NY",
    postal_code: "",
    country: "US",
    paymentMethod: "card",
    shippingMethod: "standard",
  });
  
  const [processing, setProcessing] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [pendingOrderNumber, setPendingOrderNumber] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  
  // Calculate totals
  const subtotal = cartTotal;
  const shippingCost = calculateShipping(
    cartItems.map(item => ({ category: item.product.category, quantity: item.quantity })),
    form.shippingMethod as ShippingMethod
  );
  const taxAmount = calculateTax(subtotal, shippingCost, form.state);
  const total = subtotal + shippingCost + taxAmount;

  // Create payment intent when form is valid
  useEffect(() => {
    if (form.email && form.state && total > 0 && !clientSecret && !orderSubmitted) {
      createPaymentIntent();
    }
  }, [form.email, form.state, total]);

  const createPaymentIntent = async () => {
    try {
      // Generate order number ahead of time
      const tempOrderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setPendingOrderNumber(tempOrderNumber);
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'usd',
          customer_email: form.email,
          metadata: {
            customer_name: form.name,
            order_items: cartItems.length.toString(),
            order_number: tempOrderNumber,
          },
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.postal_code) {
      alert("Please fill in all required fields");
      return;
    }

    // Email validation - stricter validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address (e.g., user@example.com)");
      return;
    }

    if (!stripe || !elements) {
      alert("Stripe not loaded");
      return;
    }

    setProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: {
              line1: form.address,
              line2: form.address2,
              city: form.city,
              state: form.state,
              postal_code: form.postal_code,
              country: form.country,
            },
          },
        },
      });

      if (error) {
        console.error('Payment error:', error);
        const errorMessage = error.type === 'card_error' 
          ? error.message 
          : 'An unexpected error occurred. Please try again.';
        alert('Payment failed: ' + errorMessage);
        setProcessing(false);
      } else if (paymentIntent?.status === 'succeeded') {
        // Create order in database
        await createOrder(paymentIntent.id);
      } else if (paymentIntent?.status === 'requires_payment_method') {
        console.log('Payment requires additional payment method');
        alert('Payment failed. Please try a different payment method.');
        setProcessing(false);
      } else {
        console.log('Payment status:', paymentIntent?.status);
        alert(`Payment status: ${paymentIntent?.status}. Please try again.`);
        setProcessing(false);
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      const errorMessage = error?.message || 'Payment processing failed. Please try again.';
      alert(errorMessage);
      setProcessing(false);
    }
  };

  const createOrder = async (paymentIntentId: string) => {
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          email: form.email,
          phone: form.phone,
          shipping_address: {
            line1: form.address,
            line2: form.address2,
            city: form.city,
            state: form.state,
            postal_code: form.postal_code,
            country: form.country,
          },
          items: cartItems.map(item => ({
            product_id: item.product.id,
            product_name: item.product.name,
            quantity: item.quantity,
            price: item.product.price_kgs,
          })),
          subtotal,
          shipping_cost: shippingCost,
          tax_amount: taxAmount,
          total,
          currency: 'USD',
          shipping_method: form.shippingMethod,
          payment_method: form.paymentMethod,
          stripe_payment_intent_id: paymentIntentId,
          order_number: pendingOrderNumber,
        }),
      });

      const data = await response.json();
      if (data.orderNumber) {
        setOrderNumber(data.orderNumber);
        setOrderSubmitted(true);
        clearCart();
      }
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to create order');
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0 && !orderSubmitted) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="text-5xl mb-4">🛒</div>
      <h1 className="text-xl font-bold mb-4">Your cart is empty</h1>
      <Link href="/" className="px-6 py-2.5 bg-[#0071e3] text-white rounded-full font-semibold text-sm">Shop Now</Link>
    </div>
  );

  if (orderSubmitted) return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-6 fade-in">
      <div className="text-6xl mb-5">✅</div>
      <h1 className="text-2xl font-bold text-[#1d1d1f] mb-2">Order Placed Successfully!</h1>
      <p className="text-[#6e6e73] mb-3 text-sm">Order Number: {orderNumber}</p>
      <p className="text-[#6e6e73] mb-7 text-sm">You'll receive a confirmation email shortly.</p>
      <Link href="/" className="px-7 py-3 bg-[#0071e3] text-white rounded-full font-semibold hover:bg-[#0064cc] text-sm">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12 fade-in">
      <h1 className="text-2xl sm:text-3xl font-black text-[#1d1d1f] mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-5">
          <form onSubmit={handlePayment}>
            {/* Contact Information */}
            <div className="bg-white border border-[#e8e8ed] rounded-2xl p-5 sm:p-6">
              <h2 className="font-bold text-[#1d1d1f] mb-4 flex items-center gap-2 text-sm sm:text-base">
                <span className="w-6 h-6 bg-[#0071e3] text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                Contact Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-[#e8e8ed] rounded-2xl p-5 sm:p-6">
              <h2 className="font-bold text-[#1d1d1f] mb-4 flex items-center gap-2 text-sm sm:text-base">
                <span className="w-6 h-6 bg-[#0071e3] text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
                Shipping Address
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Address *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="123 Main St"
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Apartment, suite, etc. (optional)</label>
                  <input
                    type="text"
                    value={form.address2}
                    onChange={(e) => setForm({ ...form, address2: e.target.value })}
                    placeholder="Apt 4B"
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">City *</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="New York"
                      className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">State *</label>
                    <select
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm"
                      required
                    >
                      {US_STATES.map(state => (
                        <option key={state.code} value={state.code}>{state.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">ZIP Code *</label>
                  <input
                    type="text"
                    value={form.postal_code}
                    onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                    placeholder="10001"
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white border border-[#e8e8ed] rounded-2xl p-5 sm:p-6">
              <h2 className="font-bold text-[#1d1d1f] mb-4 flex items-center gap-2 text-sm sm:text-base">
                <span className="w-6 h-6 bg-[#0071e3] text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
                Shipping Method
              </h2>
              <div className="space-y-2">
                {getShippingRates().map((rate) => (
                  <label
                    key={rate.method}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.shippingMethod === rate.method
                        ? "border-[#0071e3] bg-blue-50"
                        : "border-[#e8e8ed] hover:border-[#c7c7cc]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={rate.method}
                        checked={form.shippingMethod === rate.method}
                        onChange={(e) => setForm({ ...form, shippingMethod: e.target.value })}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="text-sm font-bold text-[#1d1d1f]">{rate.name}</p>
                        <p className="text-xs text-[#6e6e73]">{rate.estimated_days}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-[#1d1d1f]">{formatCurrencyPrice(rate.price)}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-[#e8e8ed] rounded-2xl p-5 sm:p-6">
              <h2 className="font-bold text-[#1d1d1f] mb-4 flex items-center gap-2 text-sm sm:text-base">
                <span className="w-6 h-6 bg-[#0071e3] text-white rounded-full text-xs flex items-center justify-center font-bold">4</span>
                Payment Method
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border-2 border-[#e8e8ed]">
                  <p className="text-sm font-bold text-[#1d1d1f] mb-3">Credit/Debit Card</p>
                  <div className="p-3 bg-[#f5f5f7] rounded-lg">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#1d1d1f',
                            '::placeholder': {
                              color: '#6e6e73',
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-[#6e6e73] flex items-center gap-1">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing || !clientSecret || !stripe}
              className="w-full py-4 bg-[#0071e3] text-white rounded-full font-bold hover:bg-[#0064cc] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : `Pay ${formatCurrencyPrice(total)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-[#f5f5f7] rounded-3xl p-5 sm:p-6 sticky top-20">
            <h2 className="font-bold text-[#1d1d1f] mb-4 text-sm sm:text-base">Order Summary ({cartCount})</h2>
            <div className="space-y-3 mb-5">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex gap-2.5">
                  <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0">
                    <Image src={item.product.image} alt={item.product.name} width={48} height={48} className="w-full h-full object-contain p-1" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1d1d1f] line-clamp-1">{item.product.name}</p>
                    <p className="text-[10px] text-[#6e6e73]">×{item.quantity}</p>
                  </div>
                  <p className="text-xs font-bold text-[#1d1d1f] shrink-0">{formatCurrencyPrice(item.product.price_kgs * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#d2d2d7] pt-4 mb-5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#6e6e73]">Subtotal</span>
                <span className="font-medium">{formatCurrencyPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6e6e73]">Shipping</span>
                <span className="font-medium">{formatCurrencyPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6e6e73]">Tax ({getTaxRate(form.state)?.rate || 0}%)</span>
                <span className="font-medium">{formatCurrencyPrice(taxAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#d2d2d7]">
                <span>Total</span>
                <span className="text-lg text-[#1d1d1f]">{formatCurrencyPrice(total)}</span>
              </div>
            </div>
            <p className="text-[10px] text-[#6e6e73] text-center">
              By placing this order, you agree to our <Link href="/terms" className="text-[#0071e3] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#0071e3] hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormContent />
    </Elements>
  );
}
