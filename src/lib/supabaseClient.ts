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

// 6. Fetch payment history from Supabase
export async function dbGetPaymentHistory(userId: string): Promise<any[]> {
  if (!supabase) {
    console.warn("⚠️ Supabase Client is offset/not configured.");
    return [];
  }
  
  const { data, error } = await supabase
    .from('payment_history')
    .select(`
      id,
      subscription_id,
      subscription_name,
      amount,
      currency,
      payment_date,
      status,
      subscriptions (
        category,
        color,
        cycle
      )
    `)
    .eq('user_id', userId)
    .order('payment_date', { ascending: false });

  if (error) {
    console.error("Error fetching payment history:", error.message);
    throw error;
  }

  return data || [];
}

// 7. Insert payment history record
export async function dbAddPaymentHistory(userId: string, record: any): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('payment_history')
    .insert({
      user_id: userId,
      subscription_id: record.subscriptionId,
      subscription_name: record.subscriptionName,
      amount: record.amount,
      currency: record.currency || 'USD',
      payment_date: record.paymentDate || new Date().toISOString(),
      status: record.status || 'paid'
    });

  if (error) {
    console.error("Error adding payment history:", error.message);
    throw error;
  }
}

// 8. Fetch all departments of a specific user
export async function dbGetDepartments(userId: string): Promise<any[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error("Error fetching departments:", error.message);
    throw error;
  }
  return data || [];
}

// 9. Sync or save departments
export async function dbAddDepartment(userId: string, dept: any): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('departments')
    .insert({
      id: dept.id,
      user_id: userId,
      name_en: dept.name_en,
      name_ar: dept.name_ar,
      color: dept.color,
      description_en: dept.description_en,
      description_ar: dept.description_ar
    });
  if (error) {
    console.error("Error adding department:", error.message);
    throw error;
  }
}

export async function dbUpdateDepartment(deptId: string, fields: any): Promise<void> {
  if (!supabase) return;
  const dbFields: any = {};
  if (fields.name_en !== undefined) dbFields.name_en = fields.name_en;
  if (fields.name_ar !== undefined) dbFields.name_ar = fields.name_ar;
  if (fields.color !== undefined) dbFields.color = fields.color;
  if (fields.description_en !== undefined) dbFields.description_en = fields.description_en;
  if (fields.description_ar !== undefined) dbFields.description_ar = fields.description_ar;

  const { error } = await supabase
    .from('departments')
    .update(dbFields)
    .eq('id', deptId);
  if (error) {
    console.error("Error updating department:", error.message);
    throw error;
  }
}

export async function dbDeleteDepartment(deptId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', deptId);
  if (error) {
    console.error("Error deleting department:", error.message);
    throw error;
  }
}

// 10. Fetch all team members
export async function dbGetTeamMembers(userId: string): Promise<any[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error("Error fetching team members:", error.message);
    throw error;
  }
  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    department: row.department,
    rating: Number(row.rating),
    avatarColor: row.avatar_color,
    phone: row.phone,
    joinDate: row.join_date,
    performanceScore: row.performance_score,
    bio: row.bio,
    tasksCompleted: Number(row.tasks_completed)
  }));
}

// 11. Custom team members DB actions
export async function dbAddTeamMember(userId: string, member: any): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('team_members')
    .insert({
      id: member.id,
      user_id: userId,
      name: member.name,
      email: member.email,
      role: member.role,
      status: member.status,
      department: member.department,
      rating: member.rating,
      avatar_color: member.avatarColor,
      phone: member.phone,
      join_date: member.joinDate,
      performance_score: member.performanceScore,
      bio: member.bio,
      tasks_completed: member.tasksCompleted
    });
  if (error) {
    console.error("Error adding team member:", error.message);
    throw error;
  }
}

export async function dbUpdateTeamMember(memberId: string, fields: any): Promise<void> {
  if (!supabase) return;
  const dbFields: any = {};
  if (fields.name !== undefined) dbFields.name = fields.name;
  if (fields.email !== undefined) dbFields.email = fields.email;
  if (fields.role !== undefined) dbFields.role = fields.role;
  if (fields.status !== undefined) dbFields.status = fields.status;
  if (fields.department !== undefined) dbFields.department = fields.department;
  if (fields.rating !== undefined) dbFields.rating = fields.rating;
  if (fields.avatarColor !== undefined) dbFields.avatar_color = fields.avatarColor;
  if (fields.phone !== undefined) dbFields.phone = fields.phone;
  if (fields.joinDate !== undefined) dbFields.join_date = fields.joinDate;
  if (fields.performanceScore !== undefined) dbFields.performance_score = fields.performanceScore;
  if (fields.bio !== undefined) dbFields.bio = fields.bio;
  if (fields.tasksCompleted !== undefined) dbFields.tasks_completed = fields.tasksCompleted;

  const { error } = await supabase
    .from('team_members')
    .update(dbFields)
    .eq('id', memberId);
  if (error) {
    console.error("Error updating team member:", error.message);
    throw error;
  }
}

export async function dbDeleteTeamMember(memberId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', memberId);
  if (error) {
    console.error("Error deleting team member:", error.message);
    throw error;
  }
}

