import { useState, useEffect } from 'react';
import { Subscription } from '../types';

export function useSubscriptions(userId: string | undefined) {
  const getStorageKey = () => userId ? `subscriptions_${userId}` : 'subscriptions';

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    if (!userId) return [];
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Default mock data for presentation
    return [
      {
        id: '1',
        name: 'نتفليكس',
        cost: 15,
        cycle: 'monthly',
        category: 'ترفيه',
        nextRenewal: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
        status: 'active',
        color: '#ec4899'
      },
      {
        id: '2',
        name: 'أدوبي كرياتف كلاود',
        cost: 50,
        cycle: 'monthly',
        category: 'برمجيات',
        nextRenewal: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
        status: 'active',
        color: '#3b82f6'
      },
      {
        id: '3',
        name: 'استضافة الويب',
        cost: 120,
        cycle: 'yearly',
        category: 'استضافة',
        nextRenewal: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(),
        status: 'active',
        color: '#f59e0b'
      }
    ];
  });

  useEffect(() => {
    if (!userId) {
       setSubscriptions([]);
       return;
    }
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      try {
        setSubscriptions(JSON.parse(saved));
      } catch (e) {
        setSubscriptions([]);
      }
    } else {
      // Load mock items if new user
      setSubscriptions([
        {
          id: '1',
          name: 'نتفليكس',
          cost: 15,
          cycle: 'monthly',
          category: 'ترفيه',
          nextRenewal: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
          status: 'active',
          color: '#ec4899'
        }
      ]);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(getStorageKey(), JSON.stringify(subscriptions));
    }
  }, [subscriptions, userId]);

  const addSubscription = (sub: Subscription) => {
    setSubscriptions(prev => [...prev, sub]);
  };

  const updateSubscription = (id: string, updatedSub: Partial<Subscription>) => {
    setSubscriptions(prev => prev.map(sub => sub.id === id ? { ...sub, ...updatedSub } : sub));
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  return {
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription
  };
}
