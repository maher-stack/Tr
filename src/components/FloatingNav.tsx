import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  Settings, 
  CreditCard, 
  TrendingUp, 
  Coins, 
  Lock, 
  LineChart, 
  Users, 
  History,
  Menu,
  X 
} from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';

export type PageId = 'dashboard' | 'analytics' | 'team' | 'history' | 'investment' | 'math' | 'currency' | 'pricing' | 'settings';

interface FloatingNavProps {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
  isPro: boolean;
}

export function FloatingNav({ currentPage, onPageChange, isPro }: FloatingNavProps) {
  const { t, dir } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems: Array<{ id: PageId; icon: any; pro?: boolean }> = [
    { id: 'analytics', icon: LineChart, pro: true },
    { id: 'team', icon: Users, pro: true },
    { id: 'history', icon: History, pro: true },
    { id: 'investment', icon: TrendingUp, pro: true },
    { id: 'math', icon: Calculator, pro: false },
    { id: 'currency', icon: Coins, pro: true },
    { id: 'pricing', icon: CreditCard },
    { id: 'settings', icon: Settings },
  ];

  const handlePageSelect = (pageId: PageId) => {
    onPageChange(pageId);
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full z-50" dir={dir}>
      {/* Background overlay back-drop to easily dismiss menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#000]/20 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Pop-up Overlay Menu */}
      {isMenuOpen && (
        <div className="absolute bottom-16 left-4 right-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-850 shadow-2xl p-4 rounded-xl mb-2 animate-in slide-in-from-bottom duration-300 z-50">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {dir === 'rtl' ? 'قائمة الصفحات والميزات' : 'Pages & Features'}
            </span>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Grid of other pages */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {menuItems.map(({ id, icon: Icon, pro }) => {
              const isActive = currentPage === id;
              const label = t(`nav_${id}`);
              return (
                <button
                  key={id}
                  onClick={() => handlePageSelect(id)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 outline-none hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <div className="relative mb-1">
                    <Icon className={`w-5 h-5 ${isActive ? 'opacity-100 text-blue-600 dark:text-blue-400' : 'opacity-70'}`} />
                    {pro && !isPro && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-amber-500" />}
                  </div>
                  <span className="text-[10px] font-bold text-center tracking-tight truncate w-full">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Bar Container */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-xl relative z-50">
        <div className="flex items-center justify-around px-6 py-2 max-w-lg mx-auto md:pb-safe">
          {/* Home button (dashboard) */}
          <button
            onClick={() => handlePageSelect('dashboard')}
            className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-lg transition-all duration-300 outline-none w-1/2 cursor-pointer ${
              currentPage === 'dashboard' && !isMenuOpen
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/35' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold">{t('nav_dashboard')}</span>
          </button>

          {/* Hamburger toggle button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-lg transition-all duration-300 outline-none w-1/2 cursor-pointer ${
              isMenuOpen 
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/35 animate-pulse' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold">
              {dir === 'rtl' ? 'القائمة' : 'Menu'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
