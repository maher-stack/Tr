import React from 'react';
import { LayoutDashboard, Calculator, Settings, CreditCard, TrendingUp, Coins, Lock, LineChart, Users, History } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';

export type PageId = 'dashboard' | 'analytics' | 'team' | 'history' | 'investment' | 'math' | 'currency' | 'pricing' | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
  isPro: boolean;
}

export function Sidebar({ currentPage, onPageChange, isPro }: SidebarProps) {
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

  // Dynamic border based on direction
  const borderClass = dir === 'rtl' ? 'border-l border-[#1f1f1f]' : 'border-r border-[#1f1f1f]';

  return (
    <aside 
      className={`w-20 hover:w-64 bg-[#090909] ${borderClass} flex flex-col h-full shrink-0 z-30 group transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden shadow-2xl relative`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-[#1f1f1f] shrink-0 overflow-hidden">
        <div className="flex items-center gap-3.5 min-w-[200px]">
          <span className="w-3.5 h-3.5 bg-emerald-500 rounded-sm shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse"></span>
          <h1 className="text-xl font-black text-white tracking-tight opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-2 group-hover:translate-x-0 select-none">
            {t('appName')}
          </h1>
        </div>
      </div>
      
      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-2.5">
        {navItems.map(({ id, icon: Icon, pro }) => {
          const isActive = currentPage === id;
          const label = t(`nav_${id}`);
          
          return (
            <button
              key={id}
              onClick={() => onPageChange(id as PageId)}
              title={label}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 outline-none relative group/item ${
                isActive 
                  ? 'bg-[#141414] text-white shadow-inner border border-[#222]' 
                  : 'text-[#666] hover:text-gray-200 hover:bg-[#111]'
              }`}
            >
              {/* Icon wrapper to keep centering aligned */}
              <div className="shrink-0 flex items-center justify-center w-5 h-5">
                <Icon 
                  className={`w-5 h-5 transition-transform duration-300 group-hover/item:scale-110 ${
                    isActive ? 'opacity-100 text-emerald-400' : 'opacity-60'
                  }`} 
                />
              </div>

              {/* Text Label - nicely animated transition */}
              <span 
                className={`font-semibold text-xs whitespace-nowrap overflow-hidden transition-all duration-500 ${
                  isActive ? 'text-white opacity-100' : 'opacity-75'
                } opacity-0 group-hover:opacity-100 w-0 group-hover:w-40 transform translate-x-1 group-hover:translate-x-0`}
              >
                {label}
              </span>

              {/* PRO badge indicator */}
              {pro && !isPro && (
                <Lock 
                  className="w-3.5 h-3.5 ml-auto text-[#444] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                />
              )}

              {/* Native sleek tooltip fallback for collapsed state */}
              <div 
                className="absolute left-full ml-4 px-2.5 py-1.5 bg-[#141414] border border-[#222] text-white text-[11px] font-bold rounded-md opacity-0 group-hover:group-hover/item:opacity-0 pointer-events-none group-hover/item:opacity-100 max-lg:hidden transition-all duration-200 shadow-xl whitespace-nowrap z-50 transform scale-95 origin-left group-hover/item:scale-100"
                style={{ left: dir === 'rtl' ? 'auto' : '100%', right: dir === 'rtl' ? '100%' : 'auto', marginRight: dir === 'rtl' ? '16px' : '0' }}
              >
                {label} {pro && !isPro ? `(🔒 ${t('proFeature')})` : ''}
              </div>
            </button>
          );
        })}
      </nav>
      
      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[#1f1f1f] overflow-hidden whitespace-nowrap h-[53px] flex items-center justify-center shrink-0">
        <p className="text-[10px] text-center text-[#444] font-black uppercase tracking-wider group-hover:scale-105 transition-all duration-300">
          <span className="hidden group-hover:inline">{t('sidebarFooter')}</span>
          <span className="group-hover:hidden text-center text-[10px] text-emerald-400 font-extrabold">ST</span>
        </p>
      </div>
    </aside>
  );
}

