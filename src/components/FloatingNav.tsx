import React from 'react';
import { LayoutDashboard, Calculator, Settings, CreditCard, TrendingUp, Coins, Lock } from 'lucide-react';

export type PageId = 'dashboard' | 'investment' | 'math' | 'currency' | 'pricing' | 'settings';

interface FloatingNavProps {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
  isPro: boolean;
}

export function FloatingNav({ currentPage, onPageChange, isPro }: FloatingNavProps) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'الرئيسية' },
    { id: 'investment', icon: TrendingUp, label: 'استثمارات', pro: true },
    { id: 'math', icon: Calculator, label: 'الحاسبة' },
    { id: 'currency', icon: Coins, label: 'عملات', pro: true },
    { id: 'pricing', icon: CreditCard, label: 'لخطط' },
    { id: 'settings', icon: Settings, label: 'إعدادات' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full z-50 border-t border-[#1f1f1f] bg-[#0f0f0f]/95 backdrop-blur-xl" dir="rtl">
      <div className="flex items-center justify-around w-full max-w-lg mx-auto px-1 py-1.5 sm:px-2 md:pb-safe">
        {navItems.map(({ id, icon: Icon, label, pro }) => {
          const isActive = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => onPageChange(id as PageId)}
              className={`relative flex flex-col items-center justify-center flex-1 px-0.5 py-1.5 sm:py-2 rounded-xl transition-all duration-300 outline-none ${
                isActive 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-[#141414]'
              }`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mb-1 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
              {pro && !isPro && <Lock className="w-2 h-2 sm:w-3 sm:h-3 absolute top-1 right-1 sm:right-2 text-gray-500" />}
              <span className={`text-[8px] sm:text-[10px] md:text-[11px] font-bold whitespace-nowrap transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
