/**
 * KFPL Centralized Currency Formatting Utility
 * Ensures consistent symbol + value output across all Dashboard components.
 */

const USD_TO_INR = 83; // Static exchange rate for demo purposes

/**
 * Format a numeric value as a currency string using the platform's selected currency.
 * Handles INR (en-IN locale, ₹ symbol) and USD (en-US locale, $ symbol).
 */
export const formatCurrency = (amount: number, currency: 'INR' | 'USD'): string => {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Convert a USD amount to INR using the static exchange rate.
 */
export const usdToInr = (usdAmount: number): number => usdAmount * USD_TO_INR;

/**
 * Convert an INR amount to USD using the static exchange rate.
 */
export const inrToUsd = (inrAmount: number): number => inrAmount / USD_TO_INR;

/**
 * Given a base value (in USD), format it in the currently selected currency.
 * Converts to INR if needed before formatting.
 */
export const formatCurrencyFromUSD = (usdAmount: number, currency: 'INR' | 'USD'): string => {
  const amount = currency === 'INR' ? usdToInr(usdAmount) : usdAmount;
  return formatCurrency(amount, currency);
};

/**
 * Format a plain number with commas (no symbol). Useful for counts.
 */
export const formatNumber = (value: number): string =>
  new Intl.NumberFormat('en-US').format(value);
