"use client";
// ============================================================
// CURRENCY & LOCALIZATION CONTEXT — Universal Electronics Store
// Supports dynamic currency switching with proper formatting
// ============================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Supported currency types
export type CurrencyCode = "USD" | "EUR" | "KGS" | "GBP" | "CAD" | "AUD" | "JPY" | "CNY";

// Currency configuration interface
export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  locale: string; // For proper number formatting
  rate: number; // Exchange rate relative to base currency (USD = 1)
}

// Available currency configurations
export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", locale: "en-US", rate: 1 },
  EUR: { code: "EUR", symbol: "€", locale: "de-DE", rate: 0.92 },
  KGS: { code: "KGS", symbol: "сом", locale: "ru-KG", rate: 89.5 },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB", rate: 0.79 },
  CAD: { code: "CAD", symbol: "C$", locale: "en-CA", rate: 1.36 },
  AUD: { code: "AUD", symbol: "A$", locale: "en-AU", rate: 1.53 },
  JPY: { code: "JPY", symbol: "¥", locale: "ja-JP", rate: 149.2 },
  CNY: { code: "CNY", symbol: "¥", locale: "zh-CN", rate: 7.18 },
};

// Context interface
interface CurrencyContextType {
  currentCurrency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (priceInUSD: number) => string;
  formatPriceWithCurrency: (priceInUSD: number, currencyCode?: CurrencyCode) => string;
  convertFromUSD: (priceInUSD: number) => number;
  convertToUSD: (priceInForeignCurrency: number, fromCurrency: CurrencyCode) => number;
  getCurrencySymbol: (currencyCode?: CurrencyCode) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currentCurrency, setCurrentCurrencyState] = useState<CurrencyCode>("USD");

  // Load saved currency preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("preferredCurrency") as CurrencyCode;
      if (saved && CURRENCY_CONFIGS[saved]) {
        setCurrentCurrencyState(saved);
      }
    } catch {/* ignore */}
  }, []);

  // Save currency preference to localStorage
  const setCurrency = (currency: CurrencyCode) => {
    setCurrentCurrencyState(currency);
    try {
      localStorage.setItem("preferredCurrency", currency);
    } catch {/* ignore */}
  };

  // Format price using current currency with proper locale formatting
  const formatPrice = (priceInUSD: number): string => {
    const config = CURRENCY_CONFIGS[currentCurrency];
    const convertedPrice = priceInUSD * config.rate;
    
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedPrice);
  };

  // Format price with specific currency (for admin or multi-currency display)
  const formatPriceWithCurrency = (priceInUSD: number, currencyCode?: CurrencyCode): string => {
    const targetCurrency = currencyCode || currentCurrency;
    const config = CURRENCY_CONFIGS[targetCurrency];
    const convertedPrice = priceInUSD * config.rate;
    
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedPrice);
  };

  // Convert USD price to current currency
  const convertFromUSD = (priceInUSD: number): number => {
    return priceInUSD * CURRENCY_CONFIGS[currentCurrency].rate;
  };

  // Convert foreign currency to USD
  const convertToUSD = (priceInForeignCurrency: number, fromCurrency: CurrencyCode): number => {
    return priceInForeignCurrency / CURRENCY_CONFIGS[fromCurrency].rate;
  };

  // Get currency symbol
  const getCurrencySymbol = (currencyCode?: CurrencyCode): string => {
    return CURRENCY_CONFIGS[currencyCode || currentCurrency].symbol;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrency,
        formatPrice,
        formatPriceWithCurrency,
        convertFromUSD,
        convertToUSD,
        getCurrencySymbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────
export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
