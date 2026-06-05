import { useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  isPro: boolean;
  renewalAlertDays?: number; // 1 for Free, 3 or 7 for Pro
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('site_tracko_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, name: string) => {
    const usersStr = localStorage.getItem('site_tracko_users');
    let users: Record<string, User> = usersStr ? JSON.parse(usersStr) : {};
    
    if (!users[email]) {
      users[email] = {
        id: email,
        email,
        name,
        isPro: false,
        renewalAlertDays: 1
      };
      localStorage.setItem('site_tracko_users', JSON.stringify(users));
    }

    const user = users[email];
    setCurrentUser(user);
    localStorage.setItem('site_tracko_current_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('site_tracko_current_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (currentUser) {
      const usersStr = localStorage.getItem('site_tracko_users');
      let users: Record<string, User> = usersStr ? JSON.parse(usersStr) : {};
      
      const updated = { ...currentUser, ...updates };
      users[updated.email] = updated;
      
      setCurrentUser(updated);
      localStorage.setItem('site_tracko_users', JSON.stringify(users));
      localStorage.setItem('site_tracko_current_user', JSON.stringify(updated));
    }
  };

  const upgradeToPro = () => {
    updateUser({ isPro: true, renewalAlertDays: 3 });
  };

  return { currentUser, login, logout, upgradeToPro, updateUser };
}
