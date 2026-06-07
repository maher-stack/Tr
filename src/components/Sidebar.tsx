import React from 'react';
import { LayoutDashboard, Calculator, Settings, CreditCard, TrendingUp, Coins, Lock, LineChart, Users, History } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';

export type PageId = 'dashboard' | 'analytics' | 'team' | 'history' | 'tools' | 'pricing' | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
  isPro: boolean;
  planTier?: 'free' | 'pro' | 'ultimate';
}

export function Sidebar({ currentPage, onPageChange, isPro, planTier = 'free' }: SidebarProps) {
  const { t, dir } = useTranslation();

  const navItems: Array<{ id: PageId; icon: any; pro?: boolean }> = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'analytics', icon: LineChart, pro: true },
    { id: 'team', icon: Users, pro: true },
    { id: 'history', icon: History, pro: true },
    { id: 'tools', icon: Calculator, pro: false },
    { id: 'pricing', icon: CreditCard },
    { id: 'settings', icon: Settings },
  ];

  // Dynamic border based on direction
  const borderClass = dir === 'rtl' ? 'border-l border-slate-200 dark:border-slate-800' : 'border-r border-slate-200 dark:border-slate-800';

  return (
    <aside 
      className={`w-20 hover:w-64 bg-white dark:bg-[#0b0f19] ${borderClass} flex flex-col h-full shrink-0 z-30 group transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden shadow-md relative`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 shrink-0 overflow-hidden">
        <div className="flex items-center gap-3.5 min-w-[200px]">
          <span className="w-3.5 h-3.5 bg-blue-600 rounded-sm shrink-0 shadow-[0_0_12px_rgba(37,99,235,0.6)] animate-pulse"></span>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-200 tracking-tight opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-2 group-hover:translate-x-0 select-none">
            {t('appName')}
          </h1>
        </div>
      </div>
      
      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-2.5">
        {navItems.map(({ id, icon: Icon, pro }) => {
          const isActive = currentPage === id;
          const label = t(`nav_${id}`);
          
          const isItemLocked = pro && (
            id === 'team'
              ? (planTier !== 'ultimate' && planTier !== 'free' && isPro) || !isPro
              : !isPro
          );
          
          return (
            <button
              key={id}
              onClick={() => onPageChange(id as PageId)}
              title={label}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 outline-none relative group/item cursor-pointer ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40 border border-transparent'
              }`}
            >
              {/* Icon wrapper to keep centering aligned */}
              <div className="shrink-0 flex items-center justify-center w-5 h-5">
                <Icon 
                   className={`w-5 h-5 transition-transform duration-300 group-hover/item:scale-110 ${
                     isActive ? 'opacity-100 text-blue-600 dark:text-blue-400' : 'opacity-60'
                   }`} 
                />
              </div>

              {/* Text Label - nicely animated transition */}
              <span 
                className={`font-semibold text-xs whitespace-nowrap overflow-hidden transition-all duration-500 ${
                  isActive ? 'text-blue-600 dark:text-blue-400 opacity-100' : 'opacity-75'
                } opacity-0 group-hover:opacity-100 w-0 group-hover:w-40 transform translate-x-1 group-hover:translate-x-0`}
              >
                {label}
              </span>

              {/* PRO badge indicator */}
              {isItemLocked && (
                <Lock 
                  className="w-3.5 h-3.5 ml-auto text-slate-400 dark:text-slate-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                />
              )}

              {/* Native sleek tooltip fallback for collapsed state */}
              <div 
                className="absolute left-full ml-4 px-2.5 py-1.5 bg-[#141414] dark:bg-[#1a1a1a] border border-[#222] dark:border-[#333] text-white text-[11px] font-bold rounded-md opacity-0 group-hover:group-hover/item:opacity-0 pointer-events-none group-hover/item:opacity-100 max-lg:hidden transition-all duration-200 shadow-xl whitespace-nowrap z-50 transform scale-95 origin-left group-hover/item:scale-100"
                style={{ left: dir === 'rtl' ? 'auto' : '100%', right: dir === 'rtl' ? '100%' : 'auto', marginRight: dir === 'rtl' ? '16px' : '0' }}
              >
                {label} {isItemLocked ? `(🔒 ${t('proFeature')})` : ''}
              </div>
            </button>
          );
        })}
      </nav>
      
      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 overflow-hidden whitespace-nowrap h-[53px] flex items-center justify-center shrink-0">
        <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider group-hover:scale-105 transition-all duration-300">
          <span className="hidden group-hover:inline">{t('sidebarFooter')}</span>
          <span className="group-hover:hidden text-center text-[10px] text-blue-600 dark:text-blue-400 font-extrabold">ST</span>
        </p>
      </div>
    </aside>
  );
}

