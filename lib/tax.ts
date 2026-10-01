// ============================================================
// US TAX CALCULATION — State-by-state tax rates
// ============================================================

import { TaxRate } from '@/types';

// US State Tax Rates (simplified - in production, use a tax API like Avalara or TaxJar)
export const US_TAX_RATES: Record<string, TaxRate> = {
  'AL': { state: 'Alabama', rate: 4.0, shipping_taxable: true },
  'AK': { state: 'Alaska', rate: 0.0, shipping_taxable: false },
  'AZ': { state: 'Arizona', rate: 5.6, shipping_taxable: true },
  'AR': { state: 'Arkansas', rate: 6.5, shipping_taxable: true },
  'CA': { state: 'California', rate: 7.25, shipping_taxable: true },
  'CO': { state: 'Colorado', rate: 2.9, shipping_taxable: true },
  'CT': { state: 'Connecticut', rate: 6.35, shipping_taxable: true },
  'DE': { state: 'Delaware', rate: 0.0, shipping_taxable: false },
  'FL': { state: 'Florida', rate: 6.0, shipping_taxable: true },
  'GA': { state: 'Georgia', rate: 4.0, shipping_taxable: true },
  'HI': { state: 'Hawaii', rate: 4.0, shipping_taxable: true },
  'ID': { state: 'Idaho', rate: 6.0, shipping_taxable: true },
  'IL': { state: 'Illinois', rate: 6.25, shipping_taxable: true },
  'IN': { state: 'Indiana', rate: 7.0, shipping_taxable: true },
  'IA': { state: 'Iowa', rate: 6.0, shipping_taxable: true },
  'KS': { state: 'Kansas', rate: 6.5, shipping_taxable: true },
  'KY': { state: 'Kentucky', rate: 6.0, shipping_taxable: true },
  'LA': { state: 'Louisiana', rate: 4.45, shipping_taxable: true },
  'ME': { state: 'Maine', rate: 5.5, shipping_taxable: true },
  'MD': { state: 'Maryland', rate: 6.0, shipping_taxable: true },
  'MA': { state: 'Massachusetts', rate: 6.25, shipping_taxable: true },
  'MI': { state: 'Michigan', rate: 6.0, shipping_taxable: true },
  'MN': { state: 'Minnesota', rate: 6.875, shipping_taxable: true },
  'MS': { state: 'Mississippi', rate: 7.0, shipping_taxable: true },
  'MO': { state: 'Missouri', rate: 4.225, shipping_taxable: true },
  'MT': { state: 'Montana', rate: 0.0, shipping_taxable: false },
  'NE': { state: 'Nebraska', rate: 5.5, shipping_taxable: true },
  'NV': { state: 'Nevada', rate: 6.85, shipping_taxable: true },
  'NH': { state: 'New Hampshire', rate: 0.0, shipping_taxable: false },
  'NJ': { state: 'New Jersey', rate: 6.625, shipping_taxable: true },
  'NM': { state: 'New Mexico', rate: 5.125, shipping_taxable: true },
  'NY': { state: 'New York', rate: 8.0, shipping_taxable: true },
  'NC': { state: 'North Carolina', rate: 4.75, shipping_taxable: true },
  'ND': { state: 'North Dakota', rate: 5.0, shipping_taxable: true },
  'OH': { state: 'Ohio', rate: 5.75, shipping_taxable: true },
  'OK': { state: 'Oklahoma', rate: 4.5, shipping_taxable: true },
  'OR': { state: 'Oregon', rate: 0.0, shipping_taxable: false },
  'PA': { state: 'Pennsylvania', rate: 6.0, shipping_taxable: true },
  'RI': { state: 'Rhode Island', rate: 7.0, shipping_taxable: true },
  'SC': { state: 'South Carolina', rate: 6.0, shipping_taxable: true },
  'SD': { state: 'South Dakota', rate: 4.5, shipping_taxable: true },
  'TN': { state: 'Tennessee', rate: 7.0, shipping_taxable: true },
  'TX': { state: 'Texas', rate: 6.25, shipping_taxable: true },
  'UT': { state: 'Utah', rate: 6.1, shipping_taxable: true },
  'VT': { state: 'Vermont', rate: 6.0, shipping_taxable: true },
  'VA': { state: 'Virginia', rate: 5.3, shipping_taxable: true },
  'WA': { state: 'Washington', rate: 6.5, shipping_taxable: true },
  'WV': { state: 'West Virginia', rate: 6.0, shipping_taxable: true },
  'WI': { state: 'Wisconsin', rate: 5.0, shipping_taxable: true },
  'WY': { state: 'Wyoming', rate: 4.0, shipping_taxable: true },
  'DC': { state: 'District of Columbia', rate: 6.0, shipping_taxable: true },
};

export function calculateTax(subtotal: number, shippingCost: number, state: string): number {
  const taxRate = US_TAX_RATES[state.toUpperCase()];
  
  if (!taxRate) {
    // Default to NY tax if state not found
    return (subtotal + (taxRate?.shipping_taxable ? shippingCost : 0)) * 0.08;
  }

  const taxableAmount = subtotal + (taxRate.shipping_taxable ? shippingCost : 0);
  return taxableAmount * (taxRate.rate / 100);
}

export function getTaxRate(state: string): TaxRate | null {
  return US_TAX_RATES[state.toUpperCase()] || null;
}
