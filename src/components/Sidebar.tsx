import React from 'react';
import { LayoutDashboard, Calculator, Settings, CreditCard, TrendingUp, Coins, Lock } from 'lucide-react';

export type PageId = 'dashboard' | 'investment' | 'math' | 'currency' | 'pricing' | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
  isPro: boolean;
}

export function Sidebar({ currentPage, onPageChange, isPro }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'الرئيسية' },
    { id: 'investment', icon: TrendingUp, label: 'استثمارات', pro: true },
    { id: 'math', icon: Calculator, label: 'الحاسبة' },
    { id: 'currency', icon: Coins, label: 'عملات', pro: true },
    { id: 'pricing', icon: CreditCard, label: 'الخطط' },
    { id: 'settings', icon: Settings, label: 'إعدادات' },
  ] as const;

  return (
    <aside className="w-64 bg-[#090909] border-l border-[#1f1f1f] flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-[#1f1f1f] shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Site Tracko
          </h1>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map(({ id, icon: Icon, label, pro }) => {
          const isActive = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => onPageChange(id as PageId)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 outline-none ${
                isActive 
                  ? 'bg-[#1a1a1a] text-white shadow-inner' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-[#141414]'
              }`}
            >
              <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'opacity-100 text-emerald-400' : 'opacity-70'}`} />
              <span className={`font-bold transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
              {pro && !isPro && <Lock className="w-3.5 h-3.5 mr-auto text-gray-500" />}
            </button>
          );
        })}
      </nav>
      
      {/* Optional space at bottom */}
      <div className="p-4 border-t border-[#1f1f1f]">
        <p className="text-[10px] text-center text-gray-600 font-medium uppercase tracking-wider">
          Site Tracko v1.0
        </p>
      </div>
    </aside>
  );
}
