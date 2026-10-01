// ============================================================
// SHIPPING RATES — US shipping options
// ============================================================

import { ShippingRate, ShippingMethod } from '@/types';

// Base shipping rates (in USD)
const BASE_RATES: Record<ShippingMethod, { base: number; perPound: number; days: string }> = {
  standard: { base: 5.99, perPound: 0.5, days: '3-5 business days' },
  express: { base: 12.99, perPound: 1.0, days: '1-2 business days' },
  overnight: { base: 24.99, perPound: 2.0, days: 'Next business day' },
  pickup: { base: 0, perPound: 0, days: 'Ready in 1 hour' },
};

// Estimated weight per product category (in pounds)
const CATEGORY_WEIGHTS: Record<string, number> = {
  'Laptops': 5,
  'Smartphones': 0.5,
  'Tablets': 1.5,
  'Audio': 1,
  'Accessories': 0.5,
  'Displays': 15,
  'TV & Home Theater': 25,
  'Gaming': 8,
};

export function calculateShipping(
  items: Array<{ category: string; quantity: number }>,
  method: ShippingMethod
): number {
  if (method === 'pickup') return 0;

  const rate = BASE_RATES[method];
  let totalWeight = 0;

  items.forEach(item => {
    const weight = CATEGORY_WEIGHTS[item.category] || 2; // default 2 lbs
    totalWeight += weight * item.quantity;
  });

  return rate.base + (rate.perPound * totalWeight);
}

export function getShippingRates(): ShippingRate[] {
  return [
    {
      method: 'standard',
      name: 'Standard Shipping',
      price: 5.99,
      estimated_days: '3-5 business days',
    },
    {
      method: 'express',
      name: 'Express Shipping',
      price: 12.99,
      estimated_days: '1-2 business days',
    },
    {
      method: 'overnight',
      name: 'Overnight Shipping',
      price: 24.99,
      estimated_days: 'Next business day',
    },
    {
      method: 'pickup',
      name: 'Store Pickup',
      price: 0,
      estimated_days: 'Ready in 1 hour',
    },
  ];
}

export function getShippingRate(method: ShippingMethod): ShippingRate | null {
  return getShippingRates().find(r => r.method === method) || null;
}
