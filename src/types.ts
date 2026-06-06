export interface Subscription {
  id: string;
  name: string;
  cost: number;
  cycle: 'monthly' | 'yearly';
  category: string;
  nextRenewal: string;
  status: 'active' | 'cancelled';
  color: string;
  currency?: string; // Support any currency string
}

export type Category = 'ترفيه' | 'برمجيات' | 'أدوات' | 'استضافة' | 'أخرى';

export const CATEGORY_COLORS: Record<string, string> = {
  'ترفيه': '#ec4899', // pink-500
  'برمجيات': '#3b82f6', // blue-500
  'أدوات': '#10b981', // emerald-500
  'استضافة': '#f59e0b', // amber-500
  'أخرى': '#6b7280', // gray-500
  'Entertainment': '#ec4899',
  'Software': '#3b82f6',
  'Utilities': '#10b981',
  'Hosting': '#f59e0b',
  'Other': '#6b7280',
};

export function translateCategory(cat: string, lang: 'ar' | 'en'): string {
  if (lang === 'ar') {
    if (cat === 'Entertainment') return 'ترفيه';
    if (cat === 'Software') return 'برمجيات';
    if (cat === 'Utilities') return 'أدوات';
    if (cat === 'Hosting') return 'استضافة';
    if (cat === 'Other') return 'أخرى';
    return cat;
  } else {
    if (cat === 'ترفيه') return 'Entertainment';
    if (cat === 'برمجيات') return 'Software';
    if (cat === 'أدوات') return 'Utilities';
    if (cat === 'استضافة') return 'Hosting';
    if (cat === 'أخرى') return 'Other';
    return cat;
  }
}

// Rates relative to 1 USD (1 USD = X currency units)
export const CURRENCY_RATES_TO_USD: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  SAR: 3.75,
  AED: 3.67,
  KWD: 0.31,
  QAR: 3.64,
  BHD: 0.38,
  OMR: 0.38,
  JOD: 0.71,
  EGP: 47.50,
  MAD: 10.02,
  TRY: 32.20,
  CAD: 1.37,
  AUD: 1.51,
  JPY: 155.0,
  CNY: 7.24,
  INR: 83.50,
  CHF: 0.90,
  BRL: 5.25,
  MXN: 17.50,
  RUB: 90.00,
  DZD: 134.50,
  IQD: 1310.00,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  SAR: 'SAR',
  AED: 'AED',
  KWD: 'KWD',
  QAR: 'QAR',
  BHD: 'BHD',
  OMR: 'OMR',
  JOD: 'JOD',
  EGP: 'EGP',
  MAD: 'MAD',
  TRY: '₺',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  CHF: 'CHF',
  BRL: 'R$',
  MXN: 'Mex$',
  RUB: '₽',
  DZD: 'DZD',
  IQD: 'IQD',
};

export const CURRENCY_SYMBOLS_AR: Record<string, string> = {
  SAR: 'ر.س',
  AED: 'د.إ',
  KWD: 'د.ك',
  QAR: 'ر.ق',
  BHD: 'د.ب',
  OMR: 'ر.ع',
  JOD: 'د.ا',
  EGP: 'ج.م',
  MAD: 'د.م.',
  DZD: 'د.ج',
  IQD: 'د.ع',
};

export function getCurrencySymbol(code: string, lang: 'ar' | 'en'): string {
  if (lang === 'ar' && CURRENCY_SYMBOLS_AR[code]) return CURRENCY_SYMBOLS_AR[code];
  return CURRENCY_SYMBOLS[code] || '$';
}

export const CURRENCY_LABELS_EN: Record<string, string> = {
  USD: '🇺🇸 US Dollar ($)',
  EUR: '🇪🇺 Euro (€)',
  GBP: '🇬🇧 British Pound (£)',
  SAR: '🇸🇦 Saudi Riyal (SAR)',
  AED: '🇦🇪 UAE Dirham (AED)',
  KWD: '🇰🇼 Kuwaiti Dinar (KWD)',
  QAR: '🇶🇦 Qatari Riyal (QAR)',
  BHD: '🇧🇭 Bahraini Dinar (BHD)',
  OMR: '🇴🇲 Omani Rial (OMR)',
  JOD: '🇯🇴 Jordanian Dinar (JOD)',
  EGP: '🇪🇬 Egyptian Pound (EGP)',
  MAD: '🇲🇦 Moroccan Dirham (MAD)',
  TRY: '🇹🇷 Turkish Lira (TRY - ₺)',
  CAD: '🇨🇦 Canadian Dollar (CAD)',
  AUD: '🇦🇺 Australian Dollar (AUD)',
  JPY: '🇯🇵 Japanese Yen (JPY)',
  CNY: '🇨🇳 Chinese Yuan (CNY)',
  INR: '🇮🇳 Indian Rupee (INR)',
  CHF: '🇨🇭 Swiss Franc (CHF)',
  BRL: '🇧🇷 Brazilian Real (BRL)',
  MXN: '🇲🇽 Mexican Peso (MXN)',
  RUB: '🇷🇺 Russian Ruble (RUB)',
  DZD: '🇩🇿 Algerian Dinar (DZD)',
  IQD: '🇮🇶 Iraqi Dinar (IQD)',
};

export const CURRENCY_LABELS_AR: Record<string, string> = {
  USD: '🇺🇸 دولار أمريكي ($)',
  EUR: '🇪🇺 يورو (€)',
  GBP: '🇬🇧 جنيه إسترليني (£)',
  SAR: '🇸🇦 ريال سعودي (SAR - ر.س)',
  AED: '🇦🇪 درهم إماراتي (AED - د.إ)',
  KWD: '🇰🇼 دينار كويتي (KWD - د.ك)',
  QAR: '🇶🇦 ريال قطري (QAR - ر.ق)',
  BHD: '🇧🇭 دينار بحريني (BHD - د.ب)',
  OMR: '🇴🇲 ريال عماني (OMR - ر.ع)',
  JOD: '🇯🇴 دينار أردني (JOD - د.ا)',
  EGP: '🇪🇬 جنيه مصري (EGP - ج.م)',
  MAD: '🇲🇦 درهم مغربي (MAD - د.م.)',
  TRY: '🇹🇷 ليرة تركية (TRY - ₺)',
  CAD: '🇨🇦 دولار كندي (CAD - C$)',
  AUD: '🇦🇺 دولار أسترالي (AUD - A$)',
  JPY: '🇯🇵 ين ياباني (JPY - ¥)',
  CNY: '🇨🇳 يوان صيني (CNY - ¥)',
  INR: '🇮🇳 روبية هندية (INR - ₹)',
  CHF: '🇨🇭 فرنك سويسري (CHF)',
  BRL: '🇧🇷 ريال برازيلي (BRL - R$)',
  MXN: '🇲🇽 بيزو مكسيكي (MXN - Mex$)',
  RUB: '🇷🇺 روبل روسي (RUB - ₽)',
  DZD: '🇩🇿 دينار جزائري (DZD - د.ج)',
  IQD: '🇮🇶 دينار عراقي (IQD - د.ع)',
};

export function getCurrencyLabel(code: string, lang: 'ar' | 'en'): string {
  if (lang === 'ar') return CURRENCY_LABELS_AR[code] || code;
  return CURRENCY_LABELS_EN[code] || code;
}

export function convertCurrency(amount: number, from: string = 'USD', to: string = 'USD'): number {
  const defaultFrom = from || 'USD';
  const defaultTo = to || 'USD';
  if (defaultFrom === defaultTo) return amount;
  
  const fromRate = CURRENCY_RATES_TO_USD[defaultFrom];
  const toRate = CURRENCY_RATES_TO_USD[defaultTo];
  
  // If we don't have rates for either, return the amount unchanged to avoid NaN
  if (fromRate === undefined || toRate === undefined) return amount;
  
  // Convert from source currency to USD base line:
  const amountInUSD = amount / fromRate;
  
  // Convert from USD base line to destination currency:
  return amountInUSD * toRate;
}
