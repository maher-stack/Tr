import React from 'react';
import { Check, Star } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';

interface PricingPageProps {
  isPro: boolean;
  onUpgrade: () => void;
}

export function PricingPage({ isPro, onUpgrade }: PricingPageProps) {
  const { t, language } = useTranslation();

  return (
    <div className="flex-1 w-full mx-auto">
      <div className="p-4 md:p-10 pb-24 md:pb-10">
        <div className="max-w-4xl mx-auto text-center mb-12 mt-8">
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">{t('pricing_title')}</h3>
          <p className="text-slate-500 dark:text-slate-404 text-sm font-semibold">{t('pricing_desc')}</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1 shadow-sm">
            <div className="mb-8">
              <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('plan_free_name')}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm h-10">{t('plan_free_desc')}</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-slate-800 dark:text-white">{t('plan_free_price')}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              <Feature text={t('feature_limit', { limit: 3 })} />
              <Feature text={t('feature_dashboard')} />
              <Feature text={t('feature_calc')} />
              <Feature text={t('feature_categories')} />
            </div>

            <button disabled={!isPro} className="w-full py-3.5 px-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl font-bold transition-transform opacity-75 cursor-not-allowed">
              {isPro ? t('plan_previous') : t('plan_current')}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white dark:bg-[#0f172a] border-2 border-blue-500 dark:border-blue-600 rounded-2xl p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1 shadow-md">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-bl-xl shadow-sm">
              {t('best_value')}
            </div>

            <div className="mb-8 relative z-10">
              <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                {t('plan_pro_name')}
                <Star className="w-4 h-4 fill-blue-500 text-blue-500 animate-pulse" />
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm h-10">{t('plan_pro_desc')}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-800 dark:text-white">{t('plan_pro_price')}</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">{t('plan_pro_period')}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1 relative z-10">
              <Feature text={t('feature_unlimited')} />
              <Feature text={t('feature_all_pages')} />
              <Feature text={t('feature_exports')} />
              <Feature text={t('feature_team')} />
              <Feature text={t('feature_alerts')} />
            </div>

            <button 
              onClick={onUpgrade} 
              disabled={isPro} 
              className={`w-full py-3.5 px-4 rounded-xl font-extrabold transition-all relative z-10 cursor-pointer ${
                isPro 
                  ? 'bg-slate-50 dark:bg-slate-800 text-blue-500 dark:text-blue-400 border border-blue-500/20' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/15 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isPro ? t('plan_active') : t('plan_upgrade')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/35 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100 dark:border-blue-900/10">
        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
      </div>
      <span className="text-sm text-slate-650 dark:text-slate-300 font-medium">{text}</span>
    </div>
  );
}
