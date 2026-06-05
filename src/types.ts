export interface Subscription {
  id: string;
  name: string;
  cost: number;
  cycle: 'monthly' | 'yearly';
  category: string;
  nextRenewal: string;
  status: 'active' | 'cancelled';
  color: string;
}

export type Category = 'ترفيه' | 'برمجيات' | 'أدوات' | 'استضافة' | 'أخرى';

export const CATEGORY_COLORS: Record<string, string> = {
  'ترفيه': '#ec4899', // pink-500
  'برمجيات': '#3b82f6', // blue-500
  'أدوات': '#10b981', // emerald-500
  'استضافة': '#f59e0b', // amber-500
  'أخرى': '#6b7280', // gray-500
};
