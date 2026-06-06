import React from 'react';
import { Crown, Lock, ChevronRight, Check } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';

interface PremiumOverlayProps {
  onUpgrade: () => void;
  title: string;
  description: string;
  benefits: string[];
}

export function PremiumOverlay({ onUpgrade, title, description, benefits }: PremiumOverlayProps) {
  const { t, dir } = useTranslation();

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-10 min-h-[80vh] w-full bg-slate-100/50 dark:bg-[#090909]/60 backdrop-blur-md relative overflow-hidden" dir={dir}>
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-600/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-8 md:p-10 rounded-2xl text-center max-w-lg w-full relative z-10 shadow-2xl backdrop-blur-md">
        {/* Ring & Icon */}
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500/20 to-indigo-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-inner animate-pulse">
          <Crown className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-55/65 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full mb-4 border border-blue-200 dark:border-blue-500/20">
          <Lock className="w-3.5 h-3.5" />
          <span>{t('proFeature')} PRO</span>
        </div>

        <h3 className="text-2xl font-black text-slate-850 dark:text-white mb-2 tracking-tight">
          {title}
        </h3>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed max-w-md mx-auto">
          {description}
        </p>

        {/* Benefits List */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-xl p-5 mb-8 text-right ltr:text-left space-y-3.5 shadow-inner">
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">{t('premium_benefits_title')}</p>
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span className="shrink-0 w-4.5 h-4.5 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/15">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span className="text-xs text-slate-650 dark:text-slate-350 font-medium">
                {benefit}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onUpgrade}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 md:text-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
        >
          <span>{t('upgradeNow')} • $4.99/{dir === 'rtl' ? 'شهر' : 'mo'}</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </button>
      </div>
    </div>
  );
}
