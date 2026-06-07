import { useState, useEffect } from 'react';
import { Subscription } from '../types';
import { 
  supabase, 
  dbGetSubscriptions, 
  dbAddSubscription, 
  dbUpdateSubscription, 
  dbDeleteSubscription 
} from '../lib/supabaseClient';

export function useSubscriptions(userId: string | undefined) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !supabase) {
       setSubscriptions([]);
       setLoading(false);
       return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const dbSubs = await dbGetSubscriptions(userId);
        setSubscriptions(dbSubs);
      } catch (err: any) {
        console.error("Failed to load subscriptions from Supabase:", err);
        setError("Failed to fetch subscriptions.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const addSubscription = async (sub: Subscription) => {
    if (!userId) return;
    
    // 1. Optimistic UI update
    setSubscriptions(prev => [...prev, sub]);
    
    // 2. Database Sync
    if (supabase) {
      try {
        await dbAddSubscription(userId, sub);
      } catch (err) {
        console.error("Error adding subscription to Supabase:", err);
        setError("Failed to save to cloud.");
        // Rollback
        setSubscriptions(prev => prev.filter(s => s.id !== sub.id));
      }
    }
  };

  const updateSubscription = async (id: string, updatedSub: Partial<Subscription>) => {
    // 1. UI update
    const previousState = [...subscriptions];
    setSubscriptions(prev => prev.map(sub => sub.id === id ? { ...sub, ...updatedSub } : sub));
    
    // 2. Database Sync
    if (supabase) {
      try {
        await dbUpdateSubscription(id, updatedSub);
      } catch (err) {
        console.error("Error updating subscription on Supabase:", err);
        setError("Failed to update in cloud.");
        // Rollback
        setSubscriptions(previousState);
      }
    }
  };

  const deleteSubscription = async (id: string) => {
    // 1. UI update
    const previousState = [...subscriptions];
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    
    // 2. Database Sync
    if (supabase) {
      try {
        await dbDeleteSubscription(id);
      } catch (err) {
        console.error("Error deleting subscription from Supabase:", err);
        setError("Failed to delete from cloud.");
        // Rollback
        setSubscriptions(previousState);
      }
    }
  };

  return {
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    loading,
    error
  };
}
