import React from 'react';
import { Check, Star, Shield, Crown, X } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';

interface PricingPageProps {
  isPro: boolean;
  planTier: 'free' | 'pro' | 'ultimate';
  onUpgrade: (tier: 'pro' | 'ultimate') => void;
}

export function PricingPage({ isPro, planTier = 'free', onUpgrade }: PricingPageProps) {
  const { t, language } = useTranslation();

  return (
    <div className="flex-1 w-full mx-auto">
      <div className="p-4 md:p-10 pb-24 md:pb-10">
        <div className="max-w-4xl mx-auto text-center mb-12 mt-8">
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">{t('pricing_title')}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">{t('pricing_desc')}</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1 shadow-sm">
            <div className="mb-8">
              <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('plan_free_name')}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs h-10">{t('plan_free_desc')}</p>
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

            <button 
              disabled 
              className="w-full py-3.5 px-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl font-bold transition-transform opacity-75 cursor-not-allowed"
            >
              {planTier === 'free' ? t('plan_current') : t('plan_previous')}
            </button>
          </div>

          {/* Pro Plan ($3.00) */}
          <div className={`bg-white dark:bg-[#0f172a] border-2 rounded-2xl p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1 shadow-md ${
            planTier === 'pro' 
              ? 'border-blue-500 dark:border-blue-600' 
              : 'border-slate-200 dark:border-slate-800'
          }`}>
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
              {language === 'ar' ? 'الأكثر شعبية' : 'POPULAR'}
            </div>

            <div className="mb-8 relative z-10">
              <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                {t('plan_pro_name')}
                <Star className="w-4 h-4 fill-blue-500 text-blue-500 animate-pulse" />
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs h-10">{t('plan_pro_desc')}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-800 dark:text-white">{t('plan_pro_price')}</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">{t('plan_pro_period')}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1 relative z-10">
              <Feature text={t('feature_unlimited')} />
              <Feature text={t('feature_all_pages')} />
              <Feature text={t('feature_exports')} />
              <Feature text={t('feature_alerts')} />
              <Feature text={language === 'ar' ? "مستثنى منها إدارة الموظفين" : "Excludes Employee Management"} isExcluded />
            </div>

            <button 
              onClick={() => onUpgrade('pro')} 
              disabled={planTier === 'pro' || planTier === 'ultimate'} 
              className={`w-full py-3.5 px-4 rounded-xl font-extrabold transition-all relative z-10 cursor-pointer ${
                planTier === 'pro' 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                  : planTier === 'ultimate'
                  ? 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/15 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {planTier === 'pro' ? t('plan_active') : planTier === 'ultimate' ? (language === 'ar' ? 'الباقة السابقة' : 'Lower Plan') : t('plan_upgrade')}
            </button>
          </div>

          {/* Ultimate Plan ($5.50) */}
          <div className={`bg-gradient-to-b from-[#1e1b4b]/5 to-[#311042]/5 dark:from-[#17153a]/30 dark:to-[#220c2e]/30 border-2 rounded-2xl p-8 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1 shadow-xl ${
            planTier === 'ultimate' 
              ? 'border-amber-500 dark:border-amber-400' 
              : 'border-indigo-500/40 dark:border-indigo-500/20'
          }`}>
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
              <Crown className="w-2.5 h-2.5 fill-white text-white" />
              <span>{language === 'ar' ? 'القيمة الشاملة الكبرى' : 'ULTIMATE VALUE'}</span>
            </div>

            <div className="mb-8 relative z-10">
              <h4 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
                {t('plan_ultimate_name')}
                <Crown className="w-4 h-4 fill-indigo-500 text-indigo-500 animate-bounce" />
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs h-10">{t('plan_ultimate_desc')}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#111827] dark:text-white">{t('plan_ultimate_price')}</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">{t('plan_ultimate_period')}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1 relative z-10">
              <Feature text={t('feature_unlimited')} />
              <Feature text={language === 'ar' ? "الوصول لكامل مميزات الموقع الفائقة" : "Full access to all global core features"} highlight />
              <Feature text={language === 'ar' ? "إدارة الموظفين ومساحة عمل الفريق بالكامل" : "Full access to Employee Management & Team Workspace"} highlight />
              <Feature text={t('feature_exports')} />
              <Feature text={t('feature_alerts')} />
            </div>

            <button 
              onClick={() => onUpgrade('ultimate')} 
              disabled={planTier === 'ultimate'} 
              className={`w-full py-3.5 px-4 rounded-xl font-extrabold transition-all relative z-10 cursor-pointer ${
                planTier === 'ultimate' 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/15 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {planTier === 'ultimate' ? t('plan_active') : t('plan_upgrade')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ text, isExcluded = false, highlight = false }: { text: string; isExcluded?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      {isExcluded ? (
        <div className="w-5 h-5 rounded-full bg-rose-50 dark:bg-rose-950/35 flex items-center justify-center shrink-0 mt-0.5 border border-rose-100 dark:border-rose-900/10">
          <X className="w-3 h-3 text-rose-600 dark:text-rose-450" />
        </div>
      ) : (
        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
          highlight 
            ? 'bg-amber-50 dark:bg-amber-950/35 border-amber-200 dark:border-amber-900/30' 
            : 'bg-blue-50 dark:bg-blue-950/35 border-blue-100 dark:border-blue-900/10'
        }`}>
          <Check className={`w-3 h-3 ${highlight ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`} />
        </div>
      )}
      <span className={`text-sm font-medium ${
        isExcluded 
          ? 'text-slate-400 dark:text-slate-500 line-through' 
          : highlight 
          ? 'text-indigo-900 dark:text-indigo-300 font-extrabold' 
          : 'text-slate-650 dark:text-slate-300'
      }`}>
        {text}
      </span>
    </div>
  );
}
