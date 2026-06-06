import React from 'react';
import { Crown, Lock, ChevronRight, Check } from 'lucide-react';

interface PremiumOverlayProps {
  onUpgrade: () => void;
  title: string;
  description: string;
  benefits: string[];
}

export function PremiumOverlay({ onUpgrade, title, description, benefits }: PremiumOverlayProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-10 min-h-[80vh] w-full bg-[#090909]/60 backdrop-blur-md relative overflow-hidden" dir="rtl">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-600/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="bg-[#111111]/85 border border-[#1f1f1f] hover:border-emerald-500/30 transition-all duration-500 p-8 md:p-10 rounded-2xl text-center max-w-lg w-full relative z-10 shadow-2xl backdrop-blur-md">
        {/* Ring & Icon */}
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-emerald-500/20 to-amber-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-inner animate-pulse">
          <Crown className="w-8 h-8 text-emerald-400" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full mb-4 border border-emerald-500/20">
          <Lock className="w-3.5 h-3.5" />
          <span>ميزة احترافية PRO</span>
        </div>

        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
          {title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-md mx-auto">
          {description}
        </p>

        {/* Benefits List */}
        <div className="bg-[#161616] border border-[#222] rounded-xl p-5 mb-8 text-right space-y-3.5">
          <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">ما ستحصل عليه في الخطة الاحترافية:</p>
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span className="shrink-0 w-4.5 h-4.5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span className="text-xs text-gray-300 font-medium">
                {benefit}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onUpgrade}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-extrabold rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 md:text-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
        >
          <span>رقي حسابك الآن - فقط بـ $4.99/شهر</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </button>

        <p className="text-[10px] text-gray-600 mt-4 font-bold">إلغاء في أي وقت • دعم فوري دائم • تجربة خالية من المخاطر</p>
      </div>
    </div>
  );
}
