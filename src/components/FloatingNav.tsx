import React from 'react';
import { LayoutDashboard, Calculator, Settings, CreditCard, TrendingUp, Coins, Lock, LineChart, Users, History } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';

export type PageId = 'dashboard' | 'analytics' | 'team' | 'history' | 'investment' | 'math' | 'currency' | 'pricing' | 'settings';

interface FloatingNavProps {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
  isPro: boolean;
}

export function FloatingNav({ currentPage, onPageChange, isPro }: FloatingNavProps) {
  const { t, dir } = useTranslation();

  const navItems: Array<{ id: PageId; icon: any; pro?: boolean }> = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'analytics', icon: LineChart, pro: true },
    { id: 'team', icon: Users, pro: true },
    { id: 'history', icon: History, pro: true },
    { id: 'investment', icon: TrendingUp, pro: true },
    { id: 'math', icon: Calculator, pro: false },
    { id: 'currency', icon: Coins, pro: true },
    { id: 'pricing', icon: CreditCard },
    { id: 'settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full z-50 border-t border-[#1f1f1f] bg-[#0f0f0f]/95 backdrop-blur-xl" dir={dir}>
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none snap-x px-3 py-2 max-w-lg mx-auto md:pb-safe">
        {navItems.map(({ id, icon: Icon, pro }) => {
          const isActive = currentPage === id;
          const label = t(`nav_${id}`);
          return (
            <button
              key={id}
              onClick={() => onPageChange(id as PageId)}
              className={`relative flex flex-col items-center justify-center shrink-0 snap-center min-w-[56px] px-1 py-1.5 rounded-xl transition-all duration-300 outline-none ${
                isActive 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-[#141414]'
              }`}
            >
              <Icon className={`w-4 h-4 mb-1 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
              {pro && !isPro && <Lock className="w-2 h-2 absolute top-1 right-1 text-gray-500" />}
              <span className={`text-[9px] font-bold whitespace-nowrap transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

