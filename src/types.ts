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
};

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
  SAR: 'ر.س',
  AED: 'د.إ',
  KWD: 'د.ك',
  QAR: 'ر.ق',
  BHD: 'د.ب',
  OMR: 'ر.ع',
  JOD: 'د.ا',
  EGP: 'ج.م',
  MAD: 'د.م.',
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
  DZD: 'د.ج',
  IQD: 'د.ع',
};

export const CURRENCY_LABELS: Record<string, string> = {
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
