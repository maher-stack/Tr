import React from 'react';
import { Crown, Clock, ChevronRight, AlertCircle, Check } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';

interface TrialExpiredOverlayProps {
  onUpgrade: () => void;
  title?: string;
  description?: string;
}

export function TrialExpiredOverlay({ onUpgrade, title, description }: TrialExpiredOverlayProps) {
  const { t, dir } = useTranslation();

  const defaultTitle = dir === 'rtl' ? "انتهت فترتك التجريبية المجانية ⏳" : "Your free trial has expired! ⏳";
  const defaultDesc = dir === 'rtl' 
    ? "لقد استمتعت بـ 3 أيام من الوصول الاحترافي الكامل لجميع مميزات Site Tracko الذكية. انتهت المدة التجريبية المحددة تلقائياً الآن برمجياً بشكل آمن."
    : "You have enjoyed 3 days of unlimited premium access to all of Site Tracko's intelligent features. The scheduled test period has now expired automatically.";

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-10 min-h-[80vh] w-full bg-slate-100/50 dark:bg-[#090909]/80 backdrop-blur-md relative overflow-hidden" dir={dir} id="trial-expired-overlay">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-600/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-8 md:p-10 rounded-2xl text-center max-w-lg w-full relative z-10 shadow-2xl backdrop-blur-md">
        
        {/* Ring & Icon */}
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-amber-500/20 to-red-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-inner animate-bounce">
          <Clock className="w-8 h-8 text-amber-600 dark:text-amber-500" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 text-xs font-bold rounded-full mb-4 border border-amber-500/20">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{dir === 'rtl' ? 'تنبيه: انتهت الـ 72 ساعة التجريبية' : 'Notice: 72-Hour free trial finished'}</span>
        </div>

        <h3 className="text-2xl font-black text-slate-850 dark:text-white mb-2 tracking-tight">
          {title || defaultTitle}
        </h3>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed max-w-md mx-auto">
          {description || defaultDesc}
        </p>

        {/* Info Box */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-xl p-5 mb-8 text-right ltr:text-left space-y-3.5 shadow-inner">
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">{t('premium_benefits_title')}</p>
          
          <div className="flex items-start gap-2.5">
            <span className="shrink-0 w-4.5 h-4.5 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/15">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
            <span className="text-xs text-slate-650 dark:text-slate-350 font-medium">
              {dir === 'rtl' ? 'إنشاء وإدارة عدد غير محدود من الاشتراكات' : 'Create and manage unlimited subscriptions'} (FREE limit: 3)
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="shrink-0 w-4.5 h-4.5 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/15">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
            <span className="text-xs text-slate-650 dark:text-slate-350 font-medium">
              {dir === 'rtl' ? 'مستشار التحليلات المالية الذكي وحساب النفقات المستقبلية' : 'Smart Financial advisor and future spend forecasts'}
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="shrink-0 w-4.5 h-4.5 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/15">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
            <span className="text-xs text-slate-650 dark:text-slate-350 font-medium">
              {dir === 'rtl' ? 'تصدير البيانات بصيغة CSV وجداول إكسيل بمرونة فائقة' : 'Flexible data backups as JSON, or CSV spreadsheets'}
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="shrink-0 w-4.5 h-4.5 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/15">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
            <span className="text-xs text-slate-650 dark:text-slate-350 font-medium">
              {dir === 'rtl' ? 'تنبيهات فورية متطورة عبر WhatsApp و Telegram للاستذكار التلقائي' : 'Real-time automatic renewal alerts delivered directly on WhatsApp'}
            </span>
          </div>
        </div>

        {/* Upgrade Call to action */}
        <button
          onClick={onUpgrade}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow-lg transition-all duration-300 md:text-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
          id="btn-trial-upgrade"
        >
          <Crown className="w-4 h-4 text-white mr-1" />
          <span>{t('upgradeNow')} • $4.99/{dir === 'rtl' ? 'شهر' : 'mo'}</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 ltr:group-hover:translate-x-1" />
        </button>

        {/* Developer comment visualizer or note */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-right ltr:text-left">
          <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-relaxed font-sans font-mono whitespace-pre-line bg-slate-50 dark:bg-[#0c0c0c] p-2.5 rounded-lg border border-slate-200 dark:border-[#1f1f1f] shadow-inner">
            {dir === 'rtl' 
              ? "💡 تم ربط الكود بمحاذاة تامة مع قاعدة بيانات Supabase:\nللتأمين الكامل، يتم استخدام تاريخ البدء الفعلي المخزن بجدول (profiles) بقاعدة بيانات Supabase، بدلاً من الاعتماد الكلي على localStorage الذي يسهل حذفه أو التعديل عليه على المتصفح."
              : "💡 Full sync integrity with Supabase databases:\nTo securely verify billing dates, we fetch actual user profile milestones recorded in the profiles database on Supabase rather than solely trusting localStorage caches."
            }
          </p>
        </div>
      </div>
    </div>
  );
}
