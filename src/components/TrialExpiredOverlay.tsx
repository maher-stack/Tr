import React from 'react';
import { Crown, Clock, ChevronRight, AlertCircle, Check } from 'lucide-react';

interface TrialExpiredOverlayProps {
  onUpgrade: () => void;
  title?: string;
  description?: string;
}

export function TrialExpiredOverlay({ onUpgrade, title, description }: TrialExpiredOverlayProps) {
  const defaultTitle = "انتهت فترتك التجريبية المجانية ⏳";
  const defaultDesc = "لقد استمتعت بـ 3 أيام من الوصول الاحترافي الكامل لجميع مميزات Site Tracko الذكية. انتهت المدة التجريبية المحددة تلقائياً الآن برمجياً بشكل آمن.";

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-10 min-h-[80vh] w-full bg-[#090909]/80 backdrop-blur-md relative overflow-hidden" dir="rtl" id="trial-expired-overlay">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-amber-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-600/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="bg-[#111111]/90 border border-amber-500/20 hover:border-amber-500/30 transition-all duration-500 p-8 md:p-10 rounded-2xl text-center max-w-lg w-full relative z-10 shadow-2xl backdrop-blur-md">
        
        {/* Ring & Icon */}
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-amber-500/20 to-red-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-inner animate-bounce">
          <Clock className="w-8 h-8 text-amber-500" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full mb-4 border border-amber-500/20">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>تنبيه: انتهت الـ 72 ساعة التجريبية</span>
        </div>

        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
          {title || defaultTitle}
        </h3>
        
        <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-md mx-auto">
          {description || defaultDesc}
        </p>

        {/* Info Box */}
        <div className="bg-[#161616] border border-[#222] rounded-xl p-5 mb-8 text-right space-y-3.5">
          <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">الترقية توفر لك دوام الوصول لجميع هذه الميزات:</p>
          
          <div className="flex items-start gap-2.5">
            <span className="shrink-0 w-4.5 h-4.5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
            <span className="text-xs text-gray-300 font-medium">
              إنشاء وإدارة عدد <strong>غير محدود</strong> من الاشتراكات (الخطة المجانية تقتصر على 4)
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="shrink-0 w-4.5 h-4.5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
            <span className="text-xs text-gray-300 font-medium">
              مستشار التحليلات المالية الذكي وحساب النفقات المستقبلية
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="shrink-0 w-4.5 h-4.5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
            <span className="text-xs text-gray-300 font-medium">
              تصدير البيانات بصيغة CSV وجداول إكسيل بمرونة فائقة
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="shrink-0 w-4.5 h-4.5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
            <span className="text-xs text-gray-300 font-medium">
              تنبيهات فورية متطورة عبر WhatsApp و Telegram للاستذكار التلقائي
            </span>
          </div>
        </div>

        {/* Upgrade Call to action */}
        <button
          onClick={onUpgrade}
          className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-300 md:text-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
          id="btn-trial-upgrade"
        >
          <Crown className="w-4 h-4 text-black mr-1" />
          <span>الترقية إلى النسخة الاحترافية الآن • $4.99/شهر</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </button>

        <p className="text-[10px] text-gray-600 mt-4 font-bold">حافظ على استقرار حسابك وموازنتك وتجنب فوات المحاسبة الدورية</p>

        {/* Developer comment visualizer or note */}
        <div className="mt-6 pt-4 border-t border-[#1a1a1a] text-right">
          <p className="text-[9px] text-gray-500 leading-relaxed font-sans font-mono whitespace-pre-line bg-[#0c0c0c] p-2.5 rounded-lg border border-[#1f1f1f]">
            {"💡 مصلحة المطور الشاملة لربط الكود بقاعدة بيانات Supabase:\nللتأمين الكامل، يتم إرسال استعلام لجلب تاريخ البدء الفعلي المخزن بجدول (profiles) بقاعدة بيانات Supabase، بدلاً من الاعتماد الكلي على localStorage الذي يسهل الالتفاف عليه بمجرد حذفه أو التعديل عليه على المتصفح."}
          </p>
        </div>
      </div>
    </div>
  );
}
