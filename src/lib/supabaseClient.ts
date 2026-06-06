/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { Subscription } from '../types';

// Retrieve values dynamically from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * 🔒 Supabase Client Instance
 * This client is safe-guarded to prevent compilation or runtime crashes 
 * even if environment variables are not yet fully configured in your settings.
 */
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * 💡 Helper functions showing exactly how to perform CRUD on Supabase 
 * for both Subscriptions and Users/Profiles with Site Tracko specifications.
 */

// 1. Fetch all subscriptions of a specific user
export async function dbGetSubscriptions(userId: string): Promise<Subscription[]> {
  if (!supabase) {
    console.warn("⚠️ Supabase Client is offset/not configured. Returning mock/localStorage instead.");
    return [];
  }
  
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching subscriptions from Supabase:", error.message);
    throw error;
  }

  // Map database columns to matched front-end format
  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    cost: Number(row.cost),
    cycle: row.cycle,
    category: row.category,
    nextRenewal: row.next_renewal,
    status: row.status,
    color: row.color,
    currency: row.currency || 'USD'
  }));
}

// 2. Insert a new subscription to Supabase
export async function dbAddSubscription(userId: string, sub: Subscription): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('subscriptions')
    .insert({
      id: sub.id,
      user_id: userId,
      name: sub.name,
      cost: sub.cost,
      cycle: sub.cycle,
      category: sub.category,
      next_renewal: sub.nextRenewal,
      status: sub.status,
      color: sub.color,
      currency: sub.currency || 'USD'
    });

  if (error) {
    console.error("Error adding subscription to Supabase:", error.message);
    throw error;
  }
}

// 3. Update subscription in Supabase
export async function dbUpdateSubscription(subId: string, updatedFields: Partial<Subscription>): Promise<void> {
  if (!supabase) return;

  // Convert fields to snake_case format as defined in Supabase SQL editor schema
  const dbFields: Record<string, any> = {};
  if (updatedFields.name !== undefined) dbFields.name = updatedFields.name;
  if (updatedFields.cost !== undefined) dbFields.cost = updatedFields.cost;
  if (updatedFields.cycle !== undefined) dbFields.cycle = updatedFields.cycle;
  if (updatedFields.category !== undefined) dbFields.category = updatedFields.category;
  if (updatedFields.nextRenewal !== undefined) dbFields.next_renewal = updatedFields.nextRenewal;
  if (updatedFields.status !== undefined) dbFields.status = updatedFields.status;
  if (updatedFields.color !== undefined) dbFields.color = updatedFields.color;
  if (updatedFields.currency !== undefined) dbFields.currency = updatedFields.currency;

  const { error } = await supabase
    .from('subscriptions')
    .update(dbFields)
    .eq('id', subId);

  if (error) {
    console.error("Error updating subscription in Supabase:", error.message);
    throw error;
  }
}

// 4. Delete subscription from Supabase
export async function dbDeleteSubscription(subId: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', subId);

  if (error) {
    console.error("Error deleting subscription from Supabase:", error.message);
    throw error;
  }
}

// 5. Update user profile details (such as is_pro, country_code, phone etc)
export async function dbUpdateProfile(userId: string, fields: any): Promise<void> {
  if (!supabase) return;

  const dbFields: Record<string, any> = {};
  if (fields.isPro !== undefined) dbFields.is_pro = fields.isPro;
  if (fields.name !== undefined) dbFields.name = fields.name;
  if (fields.phone !== undefined) dbFields.phone = fields.phone;
  if (fields.countryCode !== undefined) dbFields.country_code = fields.countryCode;
  if (fields.renewalAlertDays !== undefined) dbFields.renewal_alert_days = fields.renewalAlertDays;
  if (fields.localCurrency !== undefined) dbFields.local_currency = fields.localCurrency;

  const { error } = await supabase
    .from('profiles')
    .update(dbFields)
    .eq('id', userId);

  if (error) {
    console.error("Error syncing profile to Supabase:", error.message);
    throw error;
  }
}
