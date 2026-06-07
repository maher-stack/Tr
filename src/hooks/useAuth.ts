import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface User {
  id: string;
  email: string;
  name: string;
  isPro: boolean;
  renewalAlertDays?: number;
  localCurrency?: string;
  whatsappEnabled?: boolean;
  telegramEnabled?: boolean;
  emailEnabled?: boolean;
  phone?: string;
  countryCode?: string;
  trialStartDate?: string;
}

export function useAuth() {
  // Force a one-time clean of all local storage related to the app
  useEffect(() => {
    const CLEAN_KEY = 'site_tracko_forced_cleanup_v10';
    if (!localStorage.getItem(CLEAN_KEY)) {
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith('site_tracko_') || k.startsWith('subscriptions_') || k === 'subscriptions' || k === '_st_metric_tstamp') {
          localStorage.removeItem(k);
        }
      });
      localStorage.setItem(CLEAN_KEY, 'true');
    }
  }, []);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleUserSession(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        handleUserSession(session.user);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUserSession = async (user: any) => {
    setLoading(true);
    try {
      const { data: profile } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setCurrentUser({
          id: user.id,
          email: user.email || '',
          name: profile.name || user.user_metadata?.name || '',
          isPro: profile.is_pro || false,
          renewalAlertDays: profile.renewal_alert_days || 3,
          localCurrency: profile.local_currency || 'USD',
          phone: profile.phone || '',
          countryCode: profile.country_code || '+966',
          trialStartDate: profile.trial_start_date || user.created_at
        });
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string, 
    password?: string, 
    name?: string, 
    phone?: string, 
    countryCode?: string,
    isSignUp?: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: 'Supabase not configured' };
    
    setLoading(true);
    setAuthError(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password || '123456',
          options: {
            data: {
              name: name || email.split('@')[0],
              phone: phone || '',
              country_code: countryCode || '+966'
            }
          }
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: password || '123456'
        });
        if (error) throw error;
      }
      return { success: true };
    } catch (err: any) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (currentUser && supabase) {
      const dbFields: Record<string, any> = {};
      if (updates.isPro !== undefined) dbFields.is_pro = updates.isPro;
      if (updates.name !== undefined) dbFields.name = updates.name;
      if (updates.phone !== undefined) dbFields.phone = updates.phone;
      if (updates.countryCode !== undefined) dbFields.country_code = updates.countryCode;
      if (updates.renewalAlertDays !== undefined) dbFields.renewal_alert_days = updates.renewalAlertDays;
      if (updates.localCurrency !== undefined) dbFields.local_currency = updates.localCurrency;

      await supabase.from('profiles').update(dbFields).eq('id', currentUser.id);
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const isTrialActive = currentUser ? (new Date(currentUser.trialStartDate!).getTime() + (3 * 24 * 60 * 60 * 1000) > Date.now()) : false;
  const isTrialExpired = currentUser ? (new Date(currentUser.trialStartDate!).getTime() + (3 * 24 * 60 * 60 * 1000) <= Date.now()) : false;
  const daysLeft = currentUser ? Math.max(0, Math.ceil((new Date(currentUser.trialStartDate!).getTime() + (3 * 24 * 60 * 60 * 1000) - Date.now()) / (1000 * 60 * 60 * 24))) : 0;
  const isPremiumActive = currentUser ? (currentUser.isPro || isTrialActive) : false;

  return { 
    currentUser, 
    login, 
    logout, 
    updateUser, 
    loading,
    authError,
    supabaseConfigured: !!supabase,
    isTrialActive,
    isTrialExpired,
    daysLeft,
    isPremiumActive
  };
}