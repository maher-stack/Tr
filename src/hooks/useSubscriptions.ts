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
  const getStorageKey = () => userId ? `subscriptions_${userId}` : 'subscriptions';

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load subscriptions either from Supabase or localStorage fallback
  useEffect(() => {
    if (!userId) {
       setSubscriptions([]);
       return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);
      if (supabase) {
        try {
          const dbSubs = await dbGetSubscriptions(userId);
          setSubscriptions(dbSubs);
          localStorage.setItem(getStorageKey(), JSON.stringify(dbSubs));
        } catch (err: any) {
          console.error("Failed to load subscriptions from Supabase, falling back to cache:", err);
          setError("فشل جلب الاشتراكات من قاعدة البيانات سحابياً. تم تحميل النسخة المؤقتة.");
          // Fallback to local
          const saved = localStorage.getItem(getStorageKey());
          if (saved) {
            try { setSubscriptions(JSON.parse(saved)); } catch (e) { setSubscriptions([]); }
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Local simulation path
        const saved = localStorage.getItem(getStorageKey());
        if (saved) {
          try {
            setSubscriptions(JSON.parse(saved));
          } catch (e) {
            setSubscriptions([]);
          }
        } else {
          // Default mock items for presentation/new users
          const defaultMock = [
            {
              id: '1',
              name: 'نتفليكس',
              cost: 15,
              cycle: 'monthly',
              category: 'ترفيه',
              nextRenewal: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
              status: 'active',
              color: '#ec4899',
              currency: 'USD'
            }
          ];
          setSubscriptions(defaultMock);
          localStorage.setItem(getStorageKey(), JSON.stringify(defaultMock));
        }
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const addSubscription = async (sub: Subscription) => {
    // 1. Optimistic UI update
    setSubscriptions(prev => [...prev, sub]);
    
    // Save locally
    if (userId) {
      const currentLocal = localStorage.getItem(getStorageKey());
      const list = currentLocal ? JSON.parse(currentLocal) : [];
      localStorage.setItem(getStorageKey(), JSON.stringify([...list, sub]));
    }

    // 2. Database Sync
    if (supabase && userId) {
      try {
        await dbAddSubscription(userId, sub);
      } catch (err) {
        console.error("Error adding subscription to Supabase:", err);
        setError("تعذر حفظ الاشتراك في السحابة؛ تم الحفظ محلياً مؤقتاً.");
      }
    }
  };

  const updateSubscription = async (id: string, updatedSub: Partial<Subscription>) => {
    // 1. UI update
    setSubscriptions(prev => prev.map(sub => sub.id === id ? { ...sub, ...updatedSub } : sub));
    
    // Save locally
    if (userId) {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        const list: Subscription[] = JSON.parse(saved);
        const updatedList = list.map(sub => sub.id === id ? { ...sub, ...updatedSub } : sub);
        localStorage.setItem(getStorageKey(), JSON.stringify(updatedList));
      }
    }

    // 2. Database Sync
    if (supabase) {
      try {
        await dbUpdateSubscription(id, updatedSub);
      } catch (err) {
        console.error("Error updating subscription on Supabase:", err);
        setError("تعذر تحديث الاشتراك في السحابة؛ تم التعديل محلياً.");
      }
    }
  };

  const deleteSubscription = async (id: string) => {
    // 1. UI update
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    
    // Save locally
    if (userId) {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        const list: Subscription[] = JSON.parse(saved);
        const updatedList = list.filter(sub => sub.id !== id);
        localStorage.setItem(getStorageKey(), JSON.stringify(updatedList));
      }
    }

    // 2. Database Sync
    if (supabase) {
      try {
        await dbDeleteSubscription(id);
      } catch (err) {
        console.error("Error deleting subscription from Supabase:", err);
        setError("تعذر إزالة الاشتراك من السحابة؛ تم الحذف محلياً فقط.");
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
